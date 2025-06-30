import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  Animated,
  Easing,
  ActivityIndicator,
  Modal,
  Pressable
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Notifications from 'expo-notifications';

// Importar estilos y colores
import styles from './HomeStyles';
import { COLORS } from '../../styles/GlobalStyles';

// Importar servicios de retos y categorías
import { getRetos, getRetosCount, isRetoActivo } from '../../services/retoService';
import { getCategorias } from '../../services/categoriaService';
// Importar el servicio de interesados
import { initInteresados, marcarComoInteresado, estaMarcado } from '../../services/interesadoService';

// Datos de Misiones Especiales de ejemplo
const MISIONES_ESPECIALES = [
  { id: 'm1', nombre: 'Limpieza de Parque Vecinal', descripcion: 'Organiza o participa en una limpieza de tu parque local.', icono: 'tree' },
  { id: 'm2', nombre: 'Reciclaje Creativo', descripcion: 'Crea una pieza de arte u objeto útil con materiales reciclados.', icono: 'lightbulb-o' },
  { id: 'm3', nombre: 'Día Sin Plástico', descripcion: 'Pasa un día entero evitando el uso de plásticos de un solo uso.', icono: 'ban' },
  { id: 'm4', nombre: 'Reporte de Fuga de Agua', descripcion: 'Reporta una fuga de agua en tu barrio y sigue su reparación.', icono: 'tint' },
  { id: 'm5', nombre: 'Planta un Árbol', descripcion: 'Participa en una jornada de reforestación o planta un árbol en casa.', icono: 'pagelines' },
  { id: 'm6', nombre: 'Usa Transporte Alternativo', descripcion: 'Usa bicicleta o transporte público en lugar del coche por un día.', icono: 'bicycle' },
];

const ITEMS_PER_PAGE = 5; // Cantidad de retos a cargar por "Ver más"

export default function HomeScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [misionesCompletadas, setMisionesCompletadas] = useState([]);

  const [retos, setRetos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreRetos, setHasMoreRetos] = useState(true);
  const [loadingRetos, setLoadingRetos] = useState(false);

  const [interesadosIds, setInteresadosIds] = useState(new Set());
  const currentUserEmail = "usuario_demo@ecochallenge.com"; // Considera obtener esto de un contexto de autenticación

  // ESTADOS PARA LOS FILTROS ADICIONALES
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterByDate, setFilterByDate] = useState(null);
  const [filterByPoints, setFilterByPoints] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permiso de Notificaciones',
        'Necesitamos el permiso de notificaciones para avisarte sobre tus retos interesados.'
      );
      return false;
    }
    return true;
  };

  const loadRetos = useCallback(async (page, initialLoad = false, currentSearchText, currentSelectedCategory, currentFilterByDate, currentFilterByPoints) => {
    if (loadingRetos) return;
    setLoadingRetos(true);

    const offset = (page - 1) * ITEMS_PER_PAGE;

    try {
      const newRetos = getRetos(
        ITEMS_PER_PAGE,
        offset,
        currentSearchText,
        currentSelectedCategory,
        currentFilterByDate,
        currentFilterByPoints
      );

      const currentInteresados = new Set();
      for (const reto of newRetos) {
        if (estaMarcado(currentUserEmail, reto.id)) {
          currentInteresados.add(reto.id);
        }
      }
      setInteresadosIds(prev => new Set([...prev, ...currentInteresados]));

      if (initialLoad) {
        setRetos(newRetos);
      } else {
        setRetos(prevRetos => [...prevRetos, ...newRetos]);
      }

      const totalRetos = getRetosCount(
        currentSearchText,
        currentSelectedCategory,
        currentFilterByDate,
        currentFilterByPoints
      );
      setHasMoreRetos(retos.length + newRetos.length < totalRetos);

    } catch (error) {
      console.error("Error al cargar retos:", error);
      Alert.alert("Error", "No se pudieron cargar los retos.");
    } finally {
      setLoadingRetos(false);
    }
  }, [loadingRetos, currentUserEmail]);

  useEffect(() => {
    initInteresados();
    requestNotificationPermissions();

    try {
      const allCategories = getCategorias();
      setCategories([{ id: null, nombre: 'Todas' }, ...allCategories]);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      Alert.alert("Error", "No se pudieron cargar las categorías.");
    }

    setCurrentPage(1);
    setRetos([]);
    setInteresadosIds(new Set());
    loadRetos(1, true, searchText, selectedCategory, filterByDate, filterByPoints);
  }, [searchText, selectedCategory, filterByDate, filterByPoints]);

  useEffect(() => {
    if (currentPage > 1) {
      loadRetos(currentPage, false, searchText, selectedCategory, filterByDate, filterByPoints);
    }
  }, [currentPage]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const handleMeInteresa = async (reto) => {
    // Verificar si el reto ya finalizó antes de intentar marcar como interesado
    const now = new Date();
    const fechaLimite = new Date(reto.fechaLimite);

    if (now > fechaLimite) {
      Alert.alert("Reto Finalizado", "No puedes interesarte en retos que ya han terminado.");
      return;
    }

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      const marcado = await marcarComoInteresado(currentUserEmail, reto);
      if (marcado) {
        setInteresadosIds(prev => new Set(prev.add(reto.id)));
        Alert.alert("¡Éxito!", `¡Te has interesado en el reto "${reto.nombre}"! Te avisaremos de las fechas.`);
      } else {
        Alert.alert("Información", `Ya estás interesado en el reto "${reto.nombre}".`);
      }
    } catch (error) {
      console.error("Error al marcar como interesado:", error);
      Alert.alert("Error", "No se pudo marcar el reto como interesado.");
    }
  };

  const handleParticiparReto = (reto) => {
    // Reutilizar la función isRetoActivo para validar
    if (!isRetoActivo(reto)) {
      const currentDate = new Date();
      const startDate = new Date(reto.fechaInicio);
      const endDate = new Date(reto.fechaLimite);

      if (currentDate < startDate) {
        Alert.alert(
          "Reto aún no iniciado",
          `El reto "${reto.nombre}" comenzará el ${formatDate(reto.fechaInicio)}. ¡Vuelve más tarde!`
        );
      } else if (currentDate > endDate) {
        Alert.alert(
          "Reto finalizado",
          `El reto "${reto.nombre}" ha finalizado el ${formatDate(reto.fechaLimite)}. ¡Busca un nuevo reto!`
        );
      }
      return; // No navegar si el reto no está activo
    }

    navigation.navigate("Participar", { selectedReto: reto });
  };

  const handleMisionParticipar = (mision) => { /* ... */ };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSetFilterByDate = (value) => {
    setFilterByDate(value);
  };

  const handleSetFilterByPoints = (value) => {
    setFilterByPoints(value);
  };

  const renderRetoItem = ({ item }) => {
    const isInteresado = interesadosIds.has(item.id);
    const fechaInicioFormatted = formatDate(item.fechaInicio);
    const fechaLimiteFormatted = formatDate(item.fechaLimite);
    
    // Determinar si el reto está activo para participar
    const canParticipate = isRetoActivo(item);

    // Determinar si el reto está disponible para interesarse (fecha limite no ha pasado)
    const now = new Date();
    const retoFechaLimite = new Date(item.fechaLimite);
    const canBeInterested = now <= retoFechaLimite; // Solo se puede interesar si la fecha límite es en el futuro o hoy

    return (
      <View style={styles.retoCard}>
        <View style={styles.retoContent}>
          <Text style={styles.retoCategory}>{item.categoriaNombre}</Text>
          <Text style={styles.retoTitle}>{item.nombre}</Text>
          <Text style={styles.retoDescription}>{item.descripcion}</Text>
          {(item.fechaInicio || item.fechaLimite) && (
            <Text style={styles.retoDates}>
              <Icon name="calendar" size={14} color={COLORS.darkText} />{' '}
              {fechaInicioFormatted} - {fechaLimiteFormatted}
            </Text>
          )}
          <View style={styles.retoFooter}>
            <Text style={styles.retoPuntaje}>Puntos: {item.puntaje}</Text>
            <TouchableOpacity
              style={[
                styles.retoButton,
                isInteresado && styles.retoButtonInteresado,
                !canBeInterested && styles.retoButtonMeInteresaDisabled // Aplica el estilo de deshabilitado
              ]}
              onPress={() => handleMeInteresa(item)}
              disabled={isInteresado || !canBeInterested} // Deshabilita si ya está interesado O si el reto finalizó
            >
              <Text style={styles.retoButtonText}>
                {isInteresado ? 'Interesado' : 'Me Interesa'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              // Estilo condicional: si no se puede participar, aplica estilo de deshabilitado
              style={[
                styles.retoButtonParticipar,
                !canParticipate && styles.retoButtonParticiparDisabled // estilo para deshabilitado
              ]}
              onPress={() => handleParticiparReto(item)}
              disabled={!canParticipate} // Deshabilitar el botón si no se puede participar
            >
              <Text style={styles.retoButtonText}>Participar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingRetos && !hasMoreRetos) return null;
    return (
      <View style={styles.footerLoader}>
        {loadingRetos ? (
          <ActivityIndicator size="large" color={COLORS.primaryGreen} />
        ) : (
          hasMoreRetos && (
            <TouchableOpacity style={styles.loadMoreButton} onPress={() => setCurrentPage(prevPage => prevPage + 1)}>
              <Text style={styles.loadMoreButtonText}>Ver más retos</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    );
  };


  return (
    <LinearGradient
      colors={[COLORS.lightGreen, COLORS.primaryGreen, COLORS.darkGreen]}
      locations={[0, 0.5, 1]}
      style={styles.backgroundGradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View style={[styles.welcomeSection, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Icon name="globe" size={100} color={COLORS.white} style={styles.appLogoIcon} />
          <Text style={styles.appTitle}>EcoChallenge</Text>
          <Text style={styles.appSubtitle}>¡Tu impacto ambiental, en tus manos!</Text>
        </Animated.View>

        {/* Barra de Búsqueda y Botón de Filtros */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchBarContainer}>
            <Icon name="search" size={20} color={COLORS.mediumGray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar retos por nombre..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={COLORS.mediumGray}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
            <Icon name="filter" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Sección de Acciones Rápidas */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Participar")}>
            <Icon name="recycle" size={30} color={COLORS.white} style={styles.actionIcon} />
            <Text style={styles.actionButtonText}>Participar en Retos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Tienda")}>
            <Icon name="shopping-basket" size={30} color={COLORS.white} style={styles.actionIcon} />
            <Text style={styles.actionButtonText}>Explorar Recompensas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Perfil")}>
            <Icon name="user-circle-o" size={30} color={COLORS.white} style={styles.actionIcon} />
            <Text style={styles.actionButtonText}>Mi Comunidad</Text>
          </TouchableOpacity>

         

        </View>

        {/* SECCIÓN DE FILTROS POR CATEGORÍA */}
        <Text style={styles.sectionTitle}>Explora por Categoría</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryFilterContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id === null ? 'all' : cat.id}
              style={[
                styles.categoryButton,
                selectedCategory === cat.id && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === cat.id && styles.selectedCategoryButtonText
              ]}>
                {cat.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SECCIÓN DE LISTADO DE RETOS */}
        <Text style={styles.sectionTitle}>Retos Disponibles</Text>
        {retos.length > 0 ? (
          <FlatList
            data={retos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRetoItem}
            scrollEnabled={false}
            contentContainerStyle={styles.retosListContainer}
            ListFooterComponent={renderFooter}
          />
        ) : (
          !loadingRetos && <Text style={styles.noRetosText}>No se encontraron retos con estos filtros.</Text>
        )}
        {loadingRetos && retos.length === 0 && (
          <ActivityIndicator size="large" color={COLORS.white} style={{ marginTop: 20 }} />
        )}

        {/* Sección de Misiones Especiales */}
        <Text style={styles.sectionTitle}>Misiones Especiales para Todos</Text>
        <FlatList
          data={MISIONES_ESPECIALES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.misionCard}>
              <Icon name={item.icono} size={35} color={COLORS.primaryGreen} style={styles.misionIcon} />
              <View style={styles.misionContent}>
                <Text style={styles.misionTitle}>{item.nombre}</Text>
                <Text style={styles.misionDescription}>{item.descripcion}</Text>
              </View>
              <TouchableOpacity
                style={misionesCompletadas.includes(item.id) ? styles.misionButtonCompleted : styles.misionButton}
                onPress={() => handleMisionParticipar(item)}
                disabled={misionesCompletadas.includes(item.id)}
              >
                <Text style={styles.misionButtonText}>
                  {misionesCompletadas.includes(item.id) ? 'Interesado' : 'Me Interesa'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.misionesListContainer}
        />

        {/* Mensaje motivacional */}
        <Text style={styles.sloganText}>
          ¡Únete a la comunidad de EcoHéroes y transforma tu entorno!
        </Text>
      </ScrollView>

      {/* MODAL DE FILTROS */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowFilterModal(false)}>
          <View style={styles.filterModalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Filtrar Retos</Text>

            {/* Filtro por Fechas */}
            <Text style={styles.filterLabel}>Ordenar por Fecha:</Text>
            <View style={styles.filterOptionContainer}>
              <TouchableOpacity
                style={[styles.filterOptionButton, filterByDate === 'asc' && styles.filterOptionSelected]}
                onPress={() => handleSetFilterByDate('asc')}
              >
                <Text style={styles.filterOptionText}>Más Antiguos Primero</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOptionButton, filterByDate === 'desc' && styles.filterOptionSelected]}
                onPress={() => handleSetFilterByDate('desc')}
              >
                <Text style={styles.filterOptionText}>Más Recientes Primero</Text>
              </TouchableOpacity>
              {filterByDate && (
                <TouchableOpacity onPress={() => handleSetFilterByDate(null)} style={styles.clearFilterButton}>
                  <Icon name="times-circle" size={20} color={COLORS.mediumGray} />
                </TouchableOpacity>
              )}
            </View>

            {/* Filtro por Puntos */}
            <Text style={styles.filterLabel}>Ordenar por Puntos:</Text>
            <View style={styles.filterOptionContainer}>
              <TouchableOpacity
                style={[styles.filterOptionButton, filterByPoints === 'asc' && styles.filterOptionSelected]}
                onPress={() => handleSetFilterByPoints('asc')}
              >
                <Text style={styles.filterOptionText}>Menos Puntos Primero</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOptionButton, filterByPoints === 'desc' && styles.filterOptionSelected]}
                onPress={() => handleSetFilterByPoints('desc')}
              >
                <Text style={styles.filterOptionText}>Más Puntos Primero</Text>
              </TouchableOpacity>
              {filterByPoints && (
                <TouchableOpacity onPress={() => handleSetFilterByPoints(null)} style={styles.clearFilterButton}>
                  <Icon name="times-circle" size={20} color={COLORS.mediumGray} />
                </TouchableOpacity>
              )}
            </View>


            <TouchableOpacity style={styles.applyFiltersButton} onPress={() => setShowFilterModal(false)}>
              <Text style={styles.applyFiltersButtonText}>Listo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowFilterModal(false)}>
              <Text style={styles.closeModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

    </LinearGradient>
  );
}
