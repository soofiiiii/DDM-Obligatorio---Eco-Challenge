import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, ScrollView, Alert, Platform, Text } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

import { getRetos, isRetoActivo } from "../../services/retoService";
import { getMateriales } from "../../services/materialService";
import { insertParticipacion } from "../../services/participacionService";

import { calcularDistanciaEnMetros } from "../../utils/gps";

import SelectorRetos from "./SelectorRetos/SelectorRetos";
import ComentarioInput from "./ComentarioInput/ComentarioInput";
import SelectorMateriales from "./SelectorMateriales/SelectorMateriales";
import SubidaFotos from "./SubidaFotos/SubidaFotos";
import ModalFuenteImagen from "./ModalFuenteImagen/ModalFuenteImagen";
import BotonParticipar from "./BotonParticipar/BotonParticipar";

import { crearParticipacionStyles } from "./Styles";

export default function ParticipacionScreen() {
  const { usuario } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const styles = crearParticipacionStyles(theme);

  const route = useRoute();
  const { selectedReto: retoInicial } = route.params || {};

  const [retosDisponibles, setRetosDisponibles] = useState([]);
  const [retoSeleccionado, setRetoSeleccionado] = useState(retoInicial);
  const [comentario, setComentario] = useState("");
  const [fotos, setFotos] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      const listaRetos = await getRetos();
      const activos = listaRetos.filter((r) => isRetoActivo(r));
      setRetosDisponibles(activos);

      if (retoInicial && isRetoActivo(retoInicial)) {
        setRetoSeleccionado(retoInicial);
      } else if (!retoSeleccionado && activos.length > 0) {
        setRetoSeleccionado(activos[0]);
      } else if (activos.length === 0) {
        setRetoSeleccionado(null);
      }

      const listaMateriales = await getMateriales();
      setMateriales(listaMateriales);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      Alert.alert("Error", "No se pudieron cargar los retos o materiales.");
    }
  }, [retoInicial, retoSeleccionado]);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  useEffect(() => {
    if (Platform.OS !== "web") {
      ImagePicker.requestCameraPermissionsAsync();
    }
  }, []);

  const pickImageFromGallery = async () => {
    setShowImageSourceModal(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled) {
      const nuevas = result.assets.map((a) => a.uri);
      setFotos((prev) => [...prev, ...nuevas]);
    }
  };

  const takePhotoFromCamera = async () => {
    setShowImageSourceModal(false);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso de cámara", "Se requiere acceso a la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      base64: false,
    });

    if (!result.canceled) {
      setFotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const participar = async () => {
    if (!retoSeleccionado || fotos.length === 0) {
      Alert.alert(
        "Error",
        "Debes seleccionar un reto y subir al menos una foto."
      );
      return;
    }

    setIsLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso de ubicación", "No se pudo obtener tu ubicación.");
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const latitud = location.coords.latitude;
      const longitud = location.coords.longitude;

      const { latitud: latReto, longitud: lonReto, radio } = retoSeleccionado;
      const dentroDelRadio =
        latReto == null || lonReto == null || radio == null
          ? true
          : calcularDistanciaEnMetros(latReto, lonReto, latitud, longitud) <=
            radio;

      if (!dentroDelRadio) {
        Alert.alert(
          "Advertencia",
          "Estás fuera del área permitida para este reto. ¿Deseas continuar?",
          [
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => setIsLoading(false),
            },
            {
              text: "Sí, continuar",
              onPress: () => registrarParticipacion(latitud, longitud),
            },
          ]
        );
      } else {
        registrarParticipacion(latitud, longitud);
      }
    } catch (error) {
      console.error("Error de GPS:", error);
      Alert.alert("Error", "Ocurrió un problema al obtener tu ubicación.");
      setIsLoading(false);
    }
  };

  const registrarParticipacion = async (lat, lon) => {
    const participacion = {
      idReto: retoSeleccionado.id,
      emailUsuario: usuario?.email,
      fotos,
      latitud: lat,
      longitud: lon,
      comentario,
      estado: "Pendiente",
      materiales: materialesSeleccionados,
    };

    try {
      const exito = await insertParticipacion(participacion);
      if (exito) {
        Alert.alert("Éxito", "Participación registrada.");
        setComentario("");
        setFotos([]);
        setRetoSeleccionado(null);
        setMaterialesSeleccionados([]);
      } else {
        Alert.alert("Error", "No se pudo registrar la participación.");
      }
    } catch (e) {
      console.error("Error al guardar participación:", e);
      Alert.alert("Error", "Ocurrió un problema al guardar la participación.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.tituloPantalla}>
        ¿En qué reto estás participando?
      </Text>

      <View style={styles.tarjeta}>
        <SelectorRetos
          retosDisponibles={retosDisponibles}
          retoSeleccionado={retoSeleccionado}
          setRetoSeleccionado={setRetoSeleccionado}
        />
      </View>

      <View style={styles.tarjeta}>
        <SelectorMateriales
          materiales={materiales}
          materialesSeleccionados={materialesSeleccionados}
          setMaterialesSeleccionados={setMaterialesSeleccionados}
        />
      </View>

      <View style={styles.tarjeta}>
        <SubidaFotos
          fotos={fotos}
          setFotos={setFotos}
          onAbrirModal={() => setShowImageSourceModal(true)}
        />
      </View>

      <View style={styles.tarjeta}>
        <ComentarioInput
          comentario={comentario}
          setComentario={setComentario}
          isLoading={isLoading}
        />
      </View>

      <View style={styles.botonParticiparContainer}>
        <BotonParticipar
          onPress={participar}
          isDisabled={!retoSeleccionado || fotos.length === 0 || isLoading}
          isLoading={isLoading}
        />
      </View>

      <ModalFuenteImagen
        visible={showImageSourceModal}
        onCerrar={() => setShowImageSourceModal(false)}
        onGaleria={pickImageFromGallery}
        onCamara={takePhotoFromCamera}
      />
    </ScrollView>
  );
}
