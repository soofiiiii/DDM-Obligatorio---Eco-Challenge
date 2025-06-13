import React, { createContext, useState, useEffect } from 'react';
import { Alert, View, Text } from 'react-native'; // Asegúrate de importar Alert
import {
  obtenerSesion,
  guardarSesion,
  cerrarSesion as cerrarSesionStorage,
  initDB
} from '../services/userService'; // Asegúrate de que esta ruta sea correcta

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarSesion = async () => {
      console.log('Iniciando base de datos...');
      try {
        // initDB es síncrona, así que se llama directamente dentro de try-catch
        initDB();
        console.log('initDB ejecutado correctamente');
      } catch (e) {
        console.error('Error crítico al inicializar la base de datos:', e);
        Alert.alert(
          'Error Crítico',
          'No se pudo inicializar la base de datos. La aplicación podría no funcionar correctamente.'
        );
        setCargando(false);
        return; // Detener la carga si la DB falla al iniciar
      }

      try {
        console.log('Llamando a obtenerSesion...');
        // obtenerSesion es asíncrona, así que se usa await
        const sesion = await obtenerSesion();
        console.log('Resultado de obtenerSesion:', sesion);

        if (sesion) {
          setUsuario(sesion);
        }
      } catch (error) {
        console.error('Error al obtener la sesión:', error);
        Alert.alert(
          'Error de Sesión',
          'No se pudo recuperar la sesión anterior. Por favor, inicia sesión de nuevo.'
        );
      } finally {
        setCargando(false);
        console.log('Fin del useEffect, cargando = false');
      }
    };

    console.log('Ejecutando cargarSesion...');
    cargarSesion();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  const iniciarSesion = async (usuarioData) => {
    try {
      await guardarSesion(usuarioData);
      setUsuario(usuarioData);
      console.log('Sesión iniciada y guardada correctamente.');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert(
        'Error al Iniciar Sesión',
        'No se pudo guardar la sesión. Inténtalo de nuevo.'
      );
      // Aquí podrías decidir qué hacer si la sesión no se guarda (ej. no establecer usuario)
    }
  };

  const cerrarSesion = async () => {
    try {
      await cerrarSesionStorage();
      setUsuario(null);
      console.log('Sesión cerrada correctamente.');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert(
        'Error al Cerrar Sesión',
        'No se pudo cerrar la sesión. Es posible que tengas que reiniciar la aplicación.'
      );
      // Aquí podrías decidir si el usuario debería permanecer logueado a pesar del error
    }
  };

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando sesión...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};