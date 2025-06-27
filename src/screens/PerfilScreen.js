import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Button, 
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Platform,
  FlatList,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import * as ImagePicker from "expo-image-picker";
import { establecerMarcoSeleccionado } from "../services/marcoService";
import { MARCOS_DISPONIBLES } from "../utils/marcos";
import { getDatabase } from "../database/db";

import {
  getParticipacionesPendientesPorUsuario,
  updateParticipacion,
  deleteParticipacion,
} from "../services/participacionService";

import Icon from "react-native-vector-icons/FontAwesome";

import crearPerfilStyles from "./PerfilStyles"; 

export default function PerfilScreen() {
  const {
    usuario,
    // cerrarSesion, 
    retosCompletados,
    puntos,
    marcosUsuario: marcosUsuarioGlobal,
    marco: marcoSeleccionadoGlobal,
    recargarDatosPerfil,
    cargando,
  } = useContext(AuthContext);

  // const [foto, setFoto] = useState(usuario?.foto || ""); 
  const [participacionesPendientes, setParticipacionesPendientes] = useState(
    []
  );
  const [isEditing, setIsEditing] = useState(false);
  const [currentParticipation, setCurrentParticipation] = useState(null);
  const [editedComentario, setEditedComentario] = useState("");
  const [editedFotos, setEditedFotos] = useState([]);

  const [showImageSourceModal, setShowImageSourceModal] = useState(false);
  // const [showProfileImageSourceModal, setShowProfileImageSourceModal] = useState(false); 

  const { theme } = useContext(ThemeContext);
  const styles = crearPerfilStyles(theme);

  const calcularNivel = (puntosActuales) => {
    if (puntosActuales < 100) return 1;
    if (puntosActuales < 300) return 2;
    if (puntosActuales < 600) return 3;
    if (puntosActuales < 1000) return 4;
    return 5;
  };

  const progresoAlSiguienteNivel = (puntosActuales) => {
    let siguienteNivelPuntos = 0;
    if (puntosActuales < 100) siguienteNivelPuntos = 100;
    else if (puntosActuales < 300) siguienteNivelPuntos = 300;
    else if (puntosActuales < 600) siguienteNivelPuntos = 600;
    else if (puntosActuales < 1000) siguienteNivelPuntos = 1000;
    else return 1;

    const puntosNivelActual =
      calcularNivel(puntosActuales) === 1
        ? 0
        : calcularNivel(puntosActuales) === 2
        ? 100
        : calcularNivel(puntosActuales) === 3
        ? 300
        : calcularNivel(puntosActuales) === 4
        ? 600
        : 1000;

    return (
      (puntosActuales - puntosNivelActual) /
      (siguienteNivelPuntos - puntosNivelActual)
    );
  };

  const cargarParticipacionesPendientes = useCallback(() => {
    if (!usuario?.email) {
      setParticipacionesPendientes([]);
      return;
    }
    try {
      const pendientes = getParticipacionesPendientesPorUsuario(usuario.email);
      setParticipacionesPendientes(pendientes);
      console.log("Participaciones pendientes cargadas:", pendientes.length);
      console.log(
        "Primera participación pendiente (para depuración):",
        pendientes[0]
      );
    } catch (error) {
      console.error("Error al cargar participaciones pendientes:", error);
      Alert.alert(
        "Error",
        "No se pudieron cargar tus participaciones pendientes."
      );
    }
  }, [usuario?.email]);

  useFocusEffect(
    useCallback(() => {
      recargarDatosPerfil();
      cargarParticipacionesPendientes();
    }, [])
  );

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 20, marginRight: 15 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("BandejaNotificaciones")}
          >
            <Icon name="bell" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("EditarPerfil")}>
            <Icon name="cog" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status: cameraStatus } =
          await ImagePicker.requestCameraPermissionsAsync();
        const { status: galleryStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cameraStatus !== "granted") {
          console.warn("Permiso de cámara no otorgado.");
        }
        if (galleryStatus !== "granted") {
          console.warn("Permiso de galería no otorgado.");
        }
      }
    })();
  }, []);

  // Funciones de cambio de foto de perfil 
  // const handleChangeProfilePicture = () => { /* ... */ };
  // const pickProfileImageFromGallery = async () => { /* ... */ };
  // const takeProfilePhotoFromCamera = async () => { /* ... */ };
  // const updateProfilePhotoInDb = async (newUri) => { /* ... */ };

  const seleccionarMarco = (idMarco) => {
    try {
      if (!usuario?.email) {
        Alert.alert("Error", "Usuario no identificado para seleccionar marco.");
        return;
      }
      establecerMarcoSeleccionado(usuario.email, idMarco);
      recargarDatosPerfil();
      Alert.alert("Marco seleccionado", "Tu nuevo marco ha sido aplicado.");
    } catch (error) {
      console.error("Error al seleccionar marco:", error);
      Alert.alert("Error", `No se pudo seleccionar el marco: ${error.message}`);
    }
  };

  const handleEdit = (participation) => {
    setCurrentParticipation(participation);
    setEditedComentario(participation.comentario);
    setEditedFotos(
      Array.isArray(participation.fotos)
        ? [...participation.fotos]
        : participation.foto
        ? [participation.foto]
        : []
    );
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!currentParticipation) return;

    if (editedFotos.length === 0) {
      Alert.alert(
        "Error",
        "Debes subir al menos una foto para la participación."
      );
      return;
    }

    try {
      const updates = {
        comentario: editedComentario,
        fotos: editedFotos,
      };

      const success = updateParticipacion(currentParticipation.id, updates);

      if (success) {
        Alert.alert("Éxito", "Participación actualizada correctamente.");
        cargarParticipacionesPendientes();
        setIsEditing(false);
        setCurrentParticipation(null);
        setEditedComentario("");
        setEditedFotos([]);
      } else {
        Alert.alert("Error", "No se pudo actualizar la participación.");
      }
    } catch (error) {
      console.error("Error al guardar edición:", error);
      Alert.alert("Error", "Ocurrió un error al intentar guardar los cambios.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentParticipation(null);
    setEditedComentario("");
    setEditedFotos([]);
  };

  const handleAddOrChangePhotoForEdit = () => {
    setShowImageSourceModal(true);
  };

  const pickImageFromGalleryForEdit = async () => {
    setShowImageSourceModal(false);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - editedFotos.length,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setEditedFotos((prevFotos) => [...prevFotos, ...newUris]);
    }
  };

  const takePhotoFromCameraForEdit = async () => {
    setShowImageSourceModal(false);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso de Cámara",
        "Necesitamos acceso a tu cámara para tomar fotos."
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled) {
      setEditedFotos((prevFotos) => [...prevFotos, result.assets[0].uri]);
    }
  };

  const removeEditedPhoto = (uriToRemove) => {
    Alert.alert(
      "Eliminar foto",
      "¿Estás seguro de que quieres eliminar esta foto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () =>
            setEditedFotos((prevFotos) =>
              prevFotos.filter((uri) => uri !== uriToRemove)
            ),
        },
      ]
    );
  };

  const handleDelete = (idParticipacion) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar esta participación? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            try {
              const success = deleteParticipacion(idParticipacion);
              if (success) {
                Alert.alert(
                  "Eliminada",
                  "Participación eliminada correctamente."
                );
                cargarParticipacionesPendientes();
              } else {
                Alert.alert("Error", "No se pudo eliminar la participación.");
              }
            } catch (error) {
              console.error("Error al eliminar participación:", error);
              Alert.alert(
                "Error",
                "Ocurrió un error al intentar eliminar la participación."
              );
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    if (usuario && usuario.email === "lauta@gmail.com") {
      try {
        const db = getDatabase();

        const existingApproved = db.getFirstSync(
          `SELECT COUNT(*) AS total FROM participaciones WHERE emailUsuario = ? AND estado = 'Aprobado';`,
          [usuario.email]
        );

        if ((existingApproved?.total || 0) < 2) {
          db.runSync(
            `INSERT OR IGNORE INTO participaciones (idReto, emailUsuario, foto, latitud, longitud, comentario, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [
              1,
              usuario.email,
              JSON.stringify([
                "https://placehold.co/150x150/00FF00/000000?text=Aprobada1",
              ]),
              0,
              0,
              "Cumplido correctamente (Test Aprobado 1)",
              "Aprobado",
            ]
          );
          db.runSync(
            `INSERT OR IGNORE INTO participaciones (idReto, emailUsuario, foto, latitud, longitud, comentario, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [
              2,
              usuario.email,
              JSON.stringify([
                "https://placehold.co/150x150/00FF00/000000?text=Aprobada2",
                "https://placehold.co/150x150/FF0000/FFFFFF?text=ExtraFoto",
              ]),
              0,
              0,
              "Otra participación exitosa (Test Aprobado 2)",
              "Aprobado",
            ]
          );
          recargarDatosPerfil();
        }

        if (!marcosUsuarioGlobal.includes(1)) {
          db.runSync(
            `INSERT OR IGNORE INTO marcos_usuario (emailUsuario, idMarco) VALUES (?, ?);`,
            [usuario.email, 1]
          );
          recargarDatosPerfil();
        }
      } catch (error) {
        console.error(
          "Error en la configuración de participaciones/marcos de prueba:",
          error
        );
      }
    }
  }, [usuario, recargarDatosPerfil, marcosUsuarioGlobal]);

  const nivel = calcularNivel(puntos);
  const progreso = progresoAlSiguienteNivel(puntos);

  if (cargando || !usuario) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        {/* Contenedor de la foto de perfil y el marco */}
        <View style={styles.contenedorMarco}>
          {usuario?.foto ? ( 
            <Image source={{ uri: usuario.foto }} style={styles.foto} />
          ) : (
            <Text style={styles.noFotoText}>No hay foto disponible</Text>
          )}
          {marcoSeleccionadoGlobal && (
            <Image source={marcoSeleccionadoGlobal} style={styles.marco} />
          )}
        </View>

        {/* Botón para cambiar foto de perfil*/}
        {/* <Button
          title="Cambiar foto de perfil"
          onPress={handleChangeProfilePicture}
        /> */}

        <Text style={styles.labelMarcos}>Tus marcos adquiridos:</Text>
        {marcosUsuarioGlobal.length > 0 ? (
          <ScrollView
            horizontal
            style={styles.listaMarcos}
            contentContainerStyle={styles.listaMarcosContent}
          >
            {MARCOS_DISPONIBLES.filter((m) =>
              marcosUsuarioGlobal.includes(m.id)
            ).map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => seleccionarMarco(m.id)}
              >
                <Image
                  source={m.archivo}
                  style={[
                    styles.marcoMiniatura,
                    marcoSeleccionadoGlobal === m.archivo
                      ? styles.marcoSeleccionado
                      : null,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noMarcosText}>
            No has adquirido ningún marco aún.
          </Text>
        )}

        <Text style={styles.nombre}>
          {usuario?.nombre ?? "Nombre no disponible"}
        </Text>

        <Text style={styles.label}>
          Nivel: <Text style={styles.valor}>{nivel ?? "—"}</Text>
        </Text>

        <View style={styles.barraContainer}>
          <View
            style={[
              styles.barraProgreso,
              { width: `${(progreso ?? 0) * 100}%` },
            ]}
          />
        </View>

        <Text style={styles.label}>
          Puntos acumulados:{" "}
          <Text style={styles.valor}>{puntos?.toString() ?? "0"}</Text>
        </Text>

        <Text style={styles.label}>
          Retos completados:{" "}
          <Text style={styles.valor}>
            {retosCompletados?.toString() ?? "0"}
          </Text>
        </Text>

        <Text style={styles.label}>
          Edad:{" "}
          <Text style={styles.edad}>{usuario?.edad?.toString() ?? "—"}</Text>
        </Text>

        <Text style={styles.label}>
          Barrio: <Text style={styles.valor}>{usuario?.barrio ?? "—"}</Text>
        </Text>

        <Text style={styles.label}>
          Email: <Text style={styles.valor}>{usuario?.email ?? "—"}</Text>
        </Text>

        <Text style={styles.labelParticipaciones}>
          Tus participaciones pendientes:
        </Text>
        {participacionesPendientes.length > 0 ? (
          <View style={styles.participacionesList}>
            {participacionesPendientes.map((participacion) => (
              <View key={participacion.id} style={styles.participacionItem}>
                {/* Muestra la primera foto del array o una por defecto */}
                {participacion.fotos && participacion.fotos.length > 0 ? (
                  <Image
                    source={{ uri: participacion.fotos[0] }}
                    style={styles.participacionFoto}
                  />
                ) : (
                  <View style={styles.participacionFotoPlaceholder}>
                    <Icon name="image" size={30} color="#ccc" />
                  </View>
                )}
                <View style={styles.participacionDetails}>
                  {/* MOSTRAR NOMBRE DEL RETO */}
                  <Text style={styles.participacionRetoNombre}>
                    Reto: {participacion.nombreReto ?? "Desconocido"}
                  </Text>
                  <Text style={styles.participacionComentario}>
                    {participacion.comentario}
                  </Text>
                  <Text style={styles.participacionEstado}>
                    Estado: {participacion.estado}
                  </Text>
                </View>
                <View style={styles.participacionActions}>
                  <TouchableOpacity
                    onPress={() => handleEdit(participacion)}
                    style={styles.actionButton}
                  >
                    <Icon name="edit" size={20} color="#2196F3" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(participacion.id)}
                    style={styles.actionButton}
                  >
                    <Icon name="trash" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noParticipacionesText}>
            No tienes participaciones pendientes.
          </Text>
        )}

        {/* Modal de Edición de Participación */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isEditing}
          onRequestClose={handleCancelEdit}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Editar Participación</Text>

              {/* Contenedor de fotos editadas */}
              {editedFotos.length > 0 && (
                <FlatList
                  horizontal
                  data={editedFotos}
                  keyExtractor={(uri) => uri}
                  renderItem={({ item: uri }) => (
                    <TouchableOpacity
                      onPress={() => removeEditedPhoto(uri)}
                      style={styles.modalThumbnailContainer}
                    >
                      <Image source={{ uri }} style={styles.modalThumbnail} />
                      <View style={styles.modalDeleteIconOverlay}>
                        <Icon name="times-circle" size={24} color="white" />
                      </View>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.modalThumbnailsList}
                />
              )}

              <Button
                title="Agregar Foto(s)"
                onPress={handleAddOrChangePhotoForEdit}
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Comentario"
                multiline
                value={editedComentario}
                onChangeText={setEditedComentario}
              />

              <View style={styles.modalButtons}>
                <Button
                  title="Cancelar"
                  onPress={handleCancelEdit}
                  color="#F44336"
                />
                <Button
                  title="Guardar Cambios"
                  onPress={handleSaveEdit}
                  color="#4CAF50"
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de selección de origen de imagen (para la edición de participación) */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showImageSourceModal}
          onRequestClose={() => setShowImageSourceModal(false)}
        >
          <TouchableOpacity
            style={styles.imageSourceOverlay}
            activeOpacity={1}
            onPressOut={() => setShowImageSourceModal(false)}
          >
            <View
              style={styles.imageSourceContent}
              onStartShouldSetResponder={() => true}
            >
              <Text style={styles.imageSourceTitle}>
                Seleccionar fuente de imagen
              </Text>
              <TouchableOpacity
                style={styles.imageSourceOption}
                onPress={takePhotoFromCameraForEdit}
              >
                <Icon
                  name="camera"
                  size={24}
                  color="#333"
                  style={styles.imageSourceIcon}
                />
                <Text style={styles.imageSourceOptionText}>Tomar foto</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imageSourceOption}
                onPress={pickImageFromGalleryForEdit}
              >
                <Icon
                  name="image"
                  size={24}
                  color="#333"
                  style={styles.imageSourceIcon}
                />
                <Text style={styles.imageSourceOptionText}>
                  Elegir de la galería
                </Text>
              </TouchableOpacity>
              <Button
                title="Cancelar"
                onPress={() => setShowImageSourceModal(false)}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </ScrollView>
  );
}
