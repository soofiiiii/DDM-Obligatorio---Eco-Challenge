import React, { createContext, useState, useEffect, useCallback } from "react";
import { Alert, View, Text, Platform } from "react-native";
import * as Notifications from "expo-notifications";

import { getDatabase } from "../database/db";
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
 
  resetCategorias,
} from "../services/categoriaService";
import { initRetos, resetRetos } from "../services/retoService";
import { initMateriales } from "../services/materialService";
import { MARCOS_DISPONIBLES } from "../utils/marcos";

import { insertarDatosPrueba } from "../services/datosPruebaService";

import { initNotificaciones } from "../services/notificacionService";

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

    if (!usuario?.email) {
      setRetosCompletadosGlobal(0);
      setPuntosGlobal(0);
      setMarcosUsuarioGlobal([]);
      setMarcoSeleccionadoGlobal(null);
      return;
    }

    try {
      const db = getDatabase();
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

    } catch (error) {
      console.error(
        "Error al recargar datos del perfil en AuthContext:",
        error
      );
    }
  }, [usuario?.email, cerrarSesion]);

  useEffect(() => {
    const initializeAndLoadSession = async () => {
     try {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }),
        });
        userService.initDB(); // Usuarios y Sesión (independientes)
        initCategorias();
        initMateriales();
        initRetos();
        initMarcos(); // Marcos (independientes para su tabla, pero podrían depender de usuarios para datos)
        initParticipaciones(); // Participaciones (depende de retos y usuarios)
        initNotificaciones();
       

        await requestNotificationPermissions();

       await insertarDatosPrueba();

        const sesion = await userService.obtenerSesion();
        if (sesion) {
          setUsuario(sesion);
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
