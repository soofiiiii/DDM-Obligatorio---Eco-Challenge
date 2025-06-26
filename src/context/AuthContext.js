import React, { createContext, useState, useEffect, useCallback } from "react";
import { Alert, View, Text, Platform } from "react-native";
import * as Notifications from "expo-notifications";

import * as userService from "../services/userService";
import {
  getCantidadRetosAprobadosPorUsuario,
  initParticipaciones,
  resetParticipaciones,
} from "../services/participacionService";
import {
  obtenerMarcosUsuario,
  obtenerMarcoSeleccionado,
  initMarcos,
} from "../services/marcoService";
import {
  initCategorias,
  preloadCategorias,
  resetCategorias,
} from "../services/categoriaService";
import { initRetos, preloadRetos, resetRetos } from "../services/retoService";

import { MARCOS_DISPONIBLES } from "../utils/marcos";

export const AuthContext = createContext();

async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    Alert.alert(
      "Permiso de notificaciones",
      "No se pudieron obtener los permisos de notificaciones. No recibirás recordatorios."
    );
    return false;
  }
  /*if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'EcoChallenge Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }*/
  console.log("Permisos de notificaciones concedidos.");
  return true;
}

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [retosCompletadosGlobal, setRetosCompletadosGlobal] = useState(0);
  const [puntosGlobal, setPuntosGlobal] = useState(0);
  const [marcosUsuarioGlobal, setMarcosUsuarioGlobal] = useState([]);
  const [marcoSeleccionadoGlobal, setMarcoSeleccionadoGlobal] = useState(null);

  const recargarDatosPerfil = useCallback(async () => {
    console.log("Recargando datos de perfil...");

    if (!usuario?.email) {
      setRetosCompletadosGlobal(0);
      setPuntosGlobal(0);
      setMarcosUsuarioGlobal([]);
      setMarcoSeleccionadoGlobal(null);
      return;
    }

    try {
      const db = userService.getDatabase();
      const updatedUserFromDB = db.getFirstSync(
        "SELECT * FROM usuarios WHERE email = ?;",
        [usuario.email]
      );

      if (!updatedUserFromDB) {
        console.warn(
          "Usuario no encontrado en DB al recargar perfil:",
          usuario.email
        );
        cerrarSesion();
        return;
      }

      // ACTUALIZAR CONTEXTO Y SESIÓN
      setUsuario(updatedUserFromDB);
      await userService.guardarSesion(updatedUserFromDB);
      setPuntosGlobal(updatedUserFromDB.puntos || 0);

      // usar updatedUserFromDB.email en todo lo que sigue
      const emailActualizado = updatedUserFromDB.email;

      const cantidad = getCantidadRetosAprobadosPorUsuario(emailActualizado);
      setRetosCompletadosGlobal(cantidad);

      const adquiridos = obtenerMarcosUsuario(emailActualizado);
      setMarcosUsuarioGlobal(adquiridos);

      const idMarcoSeleccionado = obtenerMarcoSeleccionado(emailActualizado);
      if (idMarcoSeleccionado !== null) {
        const marcoInfo = MARCOS_DISPONIBLES.find(
          (m) => m.id === idMarcoSeleccionado
        );
        setMarcoSeleccionadoGlobal(marcoInfo?.archivo || null);
      } else {
        setMarcoSeleccionadoGlobal(null);
      }

      console.log("Datos de perfil recargados con éxito.");
    } catch (error) {
      console.error(
        "Error al recargar datos del perfil en AuthContext:",
        error
      );
    }
  }, [usuario?.email, cerrarSesion]);

  useEffect(() => {
    const initializeAndLoadSession = async () => {
      console.log("Iniciando carga de sesión y bases de datos...");
      try {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }),
        });
        console.log("Manejador de notificaciones establecido.");

        userService.initDB(); // Usuarios y Sesión (independientes)
        initCategorias();
        preloadCategorias([
          "Plástico",
          "Papel",
          "Vidrio",
          "Electrónicos",
          "Orgánico",
        ]); // Precarga categorías
        initRetos();
        preloadRetos(); // Precarga retos (después de categorías)
        initMarcos(); // Marcos (independientes para su tabla, pero podrían depender de usuarios para datos)
        initParticipaciones(); // Participaciones (depende de retos y usuarios)
        console.log(
          "Todas las bases de datos inicializadas y precargadas correctamente."
        );

        await requestNotificationPermissions();

        // Bloque temporal para añadir puntos (prueba)
        try {
          const targetEmail = "lauta@gmail.com";
          const pointsToAdd = 500;
          const dbInstance = userService.getDatabase();
          const userRecord = dbInstance.getFirstSync(
            "SELECT puntos FROM usuarios WHERE email = ? LIMIT 1;",
            [targetEmail]
          );
          let currentPoints = 0;
          if (
            userRecord &&
            userRecord.puntos !== undefined &&
            userRecord.puntos !== null
          ) {
            currentPoints = userRecord.puntos;
          }
          if (currentPoints < pointsToAdd) {
            const newTotalPoints = currentPoints + pointsToAdd;
            const updated = await userService.updateUserPuntos(
              targetEmail,
              newTotalPoints
            );
            if (updated) {
              console.log(
                `¡Éxito! ${pointsToAdd} puntos añadidos a ${targetEmail}. Total: ${newTotalPoints}`
              );
            } else {
              console.warn(
                `Fallo al añadir puntos a ${targetEmail}. Puede que el usuario no exista o no se pudo actualizar.`
              );
            }
          } else {
            console.log(
              `Usuario ${targetEmail} ya tiene ${currentPoints} puntos, no se añaden más.`
            );
          }
        } catch (pointsError) {
          console.error(
            "Error al intentar añadir puntos de prueba en AuthContext:",
            pointsError
          );
        }

        const sesion = await userService.obtenerSesion();
        if (sesion) {
          setUsuario(sesion);
          console.log("Sesión cargada:", sesion.email);
        } else {
          console.log("No hay sesión guardada.");
        }
      } catch (error) {
        console.error(
          "Error durante la inicialización o carga de sesión:",
          error
        );
        Alert.alert(
          "Error Crítico",
          "No se pudo inicializar la aplicación. Por favor, reinicia la aplicación."
        );
      } finally {
        setCargando(false);
        console.log("Fin del useEffect de carga inicial.");
      }
    };

    initializeAndLoadSession();
  }, []);

  useEffect(() => {
    if (usuario?.email) {
      recargarDatosPerfil();
    }
  }, [usuario?.email, recargarDatosPerfil]);

  const iniciarSesion = async (usuarioData) => {
    try {
      await userService.guardarSesion(usuarioData);
      setUsuario(usuarioData);
      console.log("Sesión iniciada y guardada correctamente.");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Alert.alert(
        "Error al Iniciar Sesión",
        "No se pudo guardar la sesión. Inténtalo de nuevo."
      );
    }
  };

  const cerrarSesion = async () => {
    try {
      await userService.cerrarSesion();
      setUsuario(null);
      console.log("Sesión cerrada correctamente.");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert(
        "Error al Cerrar Sesión",
        "No se pudo cerrar la sesión. Es posible que tengas que reiniciar la aplicación."
      );
    }
  };

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando sesión...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        iniciarSesion,
        cerrarSesion,
        cargando,
        retosCompletados: retosCompletadosGlobal,
        puntos: puntosGlobal,
        marcosUsuario: marcosUsuarioGlobal,
        marco: marcoSeleccionadoGlobal,
        recargarDatosPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
