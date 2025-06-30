import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import { ScrollView, View, ActivityIndicator, Alert, Text } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import {
  getParticipacionesPendientesPorUsuario,
  updateParticipacion,
  deleteParticipacion,
} from "../../services/participacionService";
import { establecerMarcoSeleccionado } from "../../services/marcoService";
import { MARCOS_DISPONIBLES } from "../../utils/marcos";
import { getDatabase } from "../../database/db";

import EncabezadoPerfil from "./EncabezadoPerfil/EncabezadoPerfil";
import TarjetaEstadisticas from "./TarjetaEstadisticas/TarjetaEstadisticas";
import TarjetaDatosUsuario from "./TarjetaDatosUsuario/TarjetaDatosUsuario";
import TarjetaMarcos from "./TarjetaMarcos/TarjetaMarcos";
import TarjetaParticipaciones from "./TarjetaParticipaciones/TarjetaParticipaciones";
import TarjetaGrafico from "./TarjetaGrafico/TarjetaGrafico";
import ModalParticipacion from "../../components/modals/ModalParticipacion";

import * as ImagePicker from "expo-image-picker";

import { crearPerfilStyles } from "./styles";

export default function PerfilScreen() {
  const {
    usuario,
    puntos,
    retosCompletados,
    marcosUsuario,
    marco,
    recargarDatosPerfil,
    cargando,
  } = useContext(AuthContext);

  const { theme } = useContext(ThemeContext);
  const styles = crearPerfilStyles(theme);
  const navigation = useNavigation();

  const [participacionesPendientes, setParticipacionesPendientes] = useState(
    []
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [participacionEditando, setParticipacionEditando] = useState(null);
  const [comentario, setComentario] = useState("");
  const [fotos, setFotos] = useState([]);

  const calcularNivel = (p) => {
    if (p < 100) return 1;
    if (p < 300) return 2;
    if (p < 600) return 3;
    if (p < 1000) return 4;
    return 5;
  };

  const progresoNivel = (p) => {
    const nivel = calcularNivel(p);
    const base = [0, 100, 300, 600, 1000];
    const max = [100, 300, 600, 1000, 1000];
    const actual = p - base[nivel - 1];
    const total = max[nivel - 1] - base[nivel - 1];
    return nivel >= 5 ? 1 : actual / total;
  };

  const nivel = calcularNivel(puntos);
  const progreso = progresoNivel(puntos);

  const cargarParticipaciones = useCallback(() => {
    if (!usuario?.email) return;
    try {
      const pendientes = getParticipacionesPendientesPorUsuario(usuario.email);
      setParticipacionesPendientes(pendientes);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudieron cargar las participaciones.");
    }
  }, [usuario?.email]);

  useFocusEffect(
    useCallback(() => {
      recargarDatosPerfil();
      cargarParticipaciones();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Mi Perfil",
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 12, marginRight: 12 }}>
          <Icon
            name="bell"
            size={22}
            color={theme.text}
            onPress={() => navigation.navigate("Notificaciones")}
          />
          <Icon
            name="cog"
            size={22}
            color={theme.text}
            onPress={() => navigation.navigate("Ajustes")}
          />
        </View>
      ),
    });
  }, [navigation, theme]);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: galleryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || galleryStatus !== "granted") {
        Alert.alert(
          "Permisos requeridos",
          "Se necesitan permisos para usar la cámara y galería."
        );
      }
    })();
  }, []);


  const seleccionarMarco = (idMarco) => {
    if (!usuario?.email) return;
    try {
      establecerMarcoSeleccionado(usuario.email, idMarco);
      recargarDatosPerfil();
    } catch (e) {
      Alert.alert("Error", "No se pudo seleccionar el marco");
    }
  };

  const editarParticipacion = (participacion) => {
    setParticipacionEditando(participacion);
    setComentario(participacion.comentario || "");
    try {
      const fotosParseadas = JSON.parse(participacion.foto ?? "[]");
      setFotos(Array.isArray(fotosParseadas) ? fotosParseadas : []);
    } catch {
      setFotos([]);
    }
    setModalVisible(true);
  };

  const guardarParticipacionEditada = async (comentario, fotos) => {
    if (!participacionAEditar || !usuario?.email) return;

    try {
      await updateParticipacion({
        ...participacionAEditar,
        comentario,
        foto: JSON.stringify(fotos),
      });
      setModalVisible(false);
      cargarParticipaciones();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la participación.");
    }
  };

  const eliminarParticipacion = (id) => {
    Alert.alert("Eliminar", "¿Deseas eliminar esta participación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          try {
            deleteParticipacion(id);
            cargarParticipaciones();
          } catch {
            Alert.alert("Error", "No se pudo eliminar");
          }
        },
      },
    ]);
  };

  if (cargando || !usuario) {
    return (
      <View style={styles.cargandoContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.cargandoTexto}>Cargando perfil...</Text>
      </View>
    );
  }

  const cambiarFotoPerfil = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const nuevaFotoUri = result.assets[0].uri;

      try {
        const db = getDatabase();
        db.runSync(`UPDATE usuarios SET foto = ? WHERE email = ?;`, [
          nuevaFotoUri,
          usuario.email,
        ]);
        recargarDatosPerfil();
        Alert.alert(
          "Foto actualizada",
          "Tu nueva foto de perfil se ha guardado."
        );
      } catch (error) {
        console.error("Error al actualizar foto:", error);
        Alert.alert("Error", "No se pudo actualizar tu foto de perfil.");
      }
    }
  };

  return (
    <ScrollView
      style={styles.contenedorPrincipal}
      contentContainerStyle={styles.contenidoScroll}
    >
      <EncabezadoPerfil
        nombre={usuario.nombre}
        foto={usuario.foto}
        marco={
          MARCOS_DISPONIBLES.find((m) => m.archivo === marco) ?? {
            archivo: marco,
            escala: 1,
          }
        }
        nivel={nivel}
        progreso={progreso}
      />

      <TarjetaEstadisticas puntos={puntos} retos={retosCompletados} />
      <TarjetaDatosUsuario
        edad={usuario.edad}
        barrio={usuario.barrio}
        email={usuario.email}
      />

      <TarjetaMarcos
        marcos={MARCOS_DISPONIBLES.filter((m) => marcosUsuario.includes(m.id))}
        marcoSeleccionado={marco}
        onSeleccionar={seleccionarMarco}
        onIrTienda={() => navigation.navigate("Tienda")}
      />

      <TarjetaParticipaciones
        participaciones={participacionesPendientes}
        onEditar={editarParticipacion}
        onEliminar={eliminarParticipacion}
      />

      <TarjetaGrafico />

      <ModalParticipacion
        visible={modalVisible}
        participacion={participacionEditando}
        comentario={comentario}
        setComentario={setComentario}
        fotos={fotos}
        setFotos={setFotos}
        onAgregarFoto={async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.Images,
            allowsMultipleSelection: true,
            quality: 0.7,
          });
          if (!result.canceled) {
            const nuevas = result.assets.map((a) => a.uri);
            setFotos([...fotos, ...nuevas]);
          }
        }}
        onGuardar={() => {
          try {
            updateParticipacion(participacionEditando.id, {
              comentario,
              foto: JSON.stringify(fotos),
            });
            setModalVisible(false);
            cargarParticipaciones();
          } catch {
            Alert.alert("Error", "No se pudo guardar la participación.");
          }
        }}
        onCancelar={() => setModalVisible(false)}
        onEliminarFoto={(uri) => {
          setFotos(fotos.filter((f) => f !== uri));
        }}
      />
    </ScrollView>
  );
}
