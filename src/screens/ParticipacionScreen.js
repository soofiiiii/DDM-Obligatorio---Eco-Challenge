import React, { useState, useEffect, useContext } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { insertParticipacion } from '../services/participacionService';
import { getRetos, isRetoActivo } from '../services/retoService'; 
import { AuthContext } from '../context/AuthContext';
import * as Location from 'expo-location';
import { calcularDistanciaEnMetros } from '../utils/gps';
import Icon from "react-native-vector-icons/FontAwesome";

import styles from './ParticipacionStyles'; 


export default function ParticipacionScreen() {
  const route = useRoute();
  const { selectedReto: retoInicial } = route.params || {};

  const [retosDisponibles, setRetosDisponibles] = useState([]); 
  const [retoSeleccionado, setRetoSeleccionado] = useState(retoInicial);
  const [comentario, setComentario] = useState('');
  const [fotos, setFotos] = useState([]);
  const { usuario } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [showImageSourceModal, setShowImageSourceModal] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const cargarRetosActivos = async () => {
        try {
          const todosLosRetos = await getRetos();
          // Filtra solo los retos que están activos utilizando la función isRetoActivo
          const retosFiltrados = todosLosRetos.filter(reto => isRetoActivo(reto));
          setRetosDisponibles(retosFiltrados);
          console.log('Retos activos cargados para ParticipacionScreen:', retosFiltrados);

          // Si viene un reto inicial y es activo, o si no hay inicial pero sí activos, selecciona el primero
          if (retoInicial && isRetoActivo(retoInicial)) {
            setRetoSeleccionado(retoInicial);
          } else if (!retoSeleccionado && retosFiltrados.length > 0) {
            setRetoSeleccionado(retosFiltrados[0]);
          } else if (!retoInicial && !retoSeleccionado && retosFiltrados.length === 0) {
            setRetoSeleccionado(null); // No hay retos activos para seleccionar
          }
        } catch (error) {
          console.error('Error al cargar retos en ParticipacionScreen:', error);
          Alert.alert('Error', 'No se pudieron cargar los retos disponibles.');
        }
      };

      cargarRetosActivos();
    }, [retoInicial, retoSeleccionado])
  );

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permiso de cámara no otorgado.');
        }
      }
    })();
  }, []);

  const pickImageFromGallery = async () => {
    setShowImageSourceModal(false);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled) {
      const newUris = result.assets.map(asset => asset.uri);
      setFotos(prevFotos => [...prevFotos, ...newUris]);
    }
  };

  const takePhotoFromCamera = async () => {
    setShowImageSourceModal(false);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso de Cámara', 'Necesitamos acceso a tu cámara para tomar fotos de tu participación.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled) {
      setFotos(prevFotos => [...prevFotos, result.assets[0].uri]);
    }
  };

  const removePhoto = (uriToRemove) => {
    Alert.alert(
      "Eliminar foto",
      "¿Estás seguro de que quieres eliminar esta foto?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => setFotos(prevFotos => prevFotos.filter(uri => uri !== uriToRemove)) }
      ]
    );
  };

  const participar = async () => {
    if (!retoSeleccionado || fotos.length === 0) {
      Alert.alert('Error', 'Debes seleccionar un reto y subir al menos una foto.');
      return;
    }

    setIsLoading(true);

    let latitud = null;
    let longitud = null;

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación para registrar tu participación.');
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      latitud = location.coords.latitude;
      longitud = location.coords.longitude;
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      Alert.alert('Error', 'No se pudo obtener tu ubicación. Intenta nuevamente.');
      setIsLoading(false);
      return;
    }

    let dentroDelRadio = true;
    const { latitud: latReto, longitud: lonReto, radio } = retoSeleccionado;

    if (latReto !== null && lonReto !== null && radio !== null) {
      const distancia = calcularDistanciaEnMetros(latReto, lonReto, latitud, longitud);
      dentroDelRadio = distancia <= radio;
    }

    if (!dentroDelRadio) {
      Alert.alert(
        'Advertencia',
        'Estás fuera del área permitida para este reto. ¿Deseás continuar de todos modos?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => setIsLoading(false)
          },
          {
            text: 'Sí, continuar',
            onPress: () => registrarParticipacion()
          }
        ]
      );
      return;
    }

    registrarParticipacion();

    async function registrarParticipacion() {
      const participacion = {
        idReto: retoSeleccionado.id,
        emailUsuario: usuario?.email,
        fotos: fotos,
        latitud,
        longitud,
        comentario,
        estado: 'Pendiente'
      };

      try {
        const exito = await insertParticipacion(participacion);
        if (exito) {
          Alert.alert('Éxito', 'Participación registrada.');
          setComentario('');
          setFotos([]);
          setRetoSeleccionado(null); // Limpiar la selección de reto
        } else {
          Alert.alert('Error', 'No se pudo guardar la participación. Verifica que el reto esté activo.');
        }
      } catch (error) {
        console.error('Error al guardar participación:', error);
        Alert.alert('Error', 'Ocurrió un error al guardar tu participación.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Participar en un reto</Text>
      <Text style={styles.label}>Selecciona un reto:</Text>

      {/* Vista del reto seleccionado actualmente */}
      {retoSeleccionado ? (
        <View style={styles.selectedRetoContainer}>
          <Text style={styles.selectedRetoText}>Reto actual: </Text>
          <Text style={styles.selectedRetoName}>{retoSeleccionado.nombre}</Text>
        </View>
      ) : (
        <Text style={styles.noRetosAvailable}>No hay un reto seleccionado o activo.</Text>
      )}

      {/* Lista de retos activos para seleccionar */}
      {retosDisponibles.length === 0 ? (
        <Text style={styles.noRetosAvailable}>No hay retos activos disponibles para participar.</Text>
      ) : (
        <FlatList
          data={retosDisponibles}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setRetoSeleccionado(item)}
              style={[
                styles.reto,
                retoSeleccionado?.id === item.id ? styles.retoActivo : null
              ]}
            >
              <Text style={styles.retoText}>{item.nombre}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Comentario (opcional)"
        value={comentario}
        onChangeText={setComentario}
        editable={!isLoading}
      />

      <View style={styles.photoUploadContainer}>
        <Button title="Subir foto(s)" onPress={() => setShowImageSourceModal(true)} disabled={isLoading} />
        {fotos.length > 0 && (
          <Text style={styles.photoCountText}>{fotos.length} foto(s) seleccionada(s)</Text>
        )}
      </View>

      {fotos.length > 0 && (
        <FlatList
          horizontal
          data={fotos}
          keyExtractor={(uri) => uri}
          renderItem={({ item: uri }) => (
            <TouchableOpacity onPress={() => removePhoto(uri)} style={styles.thumbnailContainer}>
              <Image source={{ uri }} style={styles.thumbnail} />
              <View style={styles.deleteIconOverlay}>
                <Icon name="times-circle" size={24} color="white" />
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.thumbnailsList}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title="Enviar participación"
          onPress={participar}
          disabled={!retoSeleccionado || fotos.length === 0 || isLoading}
        />
      </View>

      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
        onRequestClose={() => {}}
      >
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#888" style={styles.activityIndicator} />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showImageSourceModal}
        onRequestClose={() => setShowImageSourceModal(false)}
      >
        <TouchableOpacity style={styles.imageSourceOverlay} activeOpacity={1} onPressOut={() => setShowImageSourceModal(false)}>
          <View style={styles.imageSourceContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.imageSourceTitle}>Seleccionar fuente de imagen</Text>
            <TouchableOpacity style={styles.imageSourceOption} onPress={takePhotoFromCamera}>
              <Icon name="camera" size={24} color="#333" style={styles.imageSourceIcon} />
              <Text style={styles.imageSourceOptionText}>Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageSourceOption} onPress={pickImageFromGallery}>
              <Icon name="image" size={24} color="#333" style={styles.imageSourceIcon} />
              <Text style={styles.imageSourceOptionText}>Elegir de la galería</Text>
            </TouchableOpacity>
            <Button title="Cancelar" onPress={() => setShowImageSourceModal(false)} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
