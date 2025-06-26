import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { MARCOS_DISPONIBLES } from '../utils/marcos';
import { adquirirMarco, obtenerMarcosUsuario } from '../services/marcoService';
import { AuthContext } from '../context/AuthContext';
import { updateUserPuntos } from '../services/userService'; 

export default function TiendaScreen() {
  const { usuario, recargarDatosPerfil } = useContext(AuthContext);
  const [marcosComprados, setMarcosComprados] = useState([]);

  useEffect(() => {
    cargarMarcos();
  }, [usuario]); // 'usuario' como dependencia para recargar si los datos del usuario cambian

  const cargarMarcos = () => {
    if (usuario && usuario.email) {
      const adquiridos = obtenerMarcosUsuario(usuario.email);
      setMarcosComprados(adquiridos);
    }
  };

  const manejarCompra = async (idMarco) => { // Hacer la función asíncrona
    // Asegurarse de que tenemos un usuario logueado
    if (!usuario || !usuario.email) {
      Alert.alert('Error', 'Debes iniciar sesión para adquirir marcos.');
      return;
    }

    // Encontrar el marco por su ID para obtener su precio
    const marcoAComprar = MARCOS_DISPONIBLES.find(marco => marco.id === idMarco);

    if (!marcoAComprar) {
      Alert.alert('Error', 'Marco no encontrado.');
      return;
    }

    // Verificar si el usuario ya tiene el marco
    if (marcosComprados.includes(idMarco)) {
      Alert.alert('Ya adquirido', 'Este marco ya lo tenías.');
      return;
    }

    // Verificar si el usuario tiene suficientes puntos
    if (usuario.puntos < marcoAComprar.precio) {
      Alert.alert(
        'Puntos Insuficientes',
        `Necesitas ${marcoAComprar.precio} puntos para adquirir este marco. Tienes ${usuario.puntos} puntos.`
      );
      return;
    }

    try {
      // Deducir puntos al usuario antes de adquirir el marco
      const nuevosPuntos = usuario.puntos - marcoAComprar.precio;
      const puntosActualizadosConExito = await updateUserPuntos(usuario.email, nuevosPuntos);

      if (puntosActualizadosConExito) {
        // Si los puntos se dedujeron con éxito, proceder a adquirir el marco
        const resultadoAdquisicion = adquirirMarco(usuario.email, idMarco); // Esto es síncrono

        if (resultadoAdquisicion) {
          cargarMarcos(); // Actualiza la lista local de marcos comprados
          await recargarDatosPerfil(); // Actualiza los datos del perfil en el contexto (incluyendo los puntos)
          Alert.alert('¡Éxito!', `Has adquirido el marco "${marcoAComprar.nombre}" por ${marcoAComprar.precio} puntos. Tus puntos restantes: ${nuevosPuntos}.`);
        } else {
          // Si la adquisición del marco falla, revertir los puntos para evitar inconsistencias
          Alert.alert('Error', 'No se pudo registrar la adquisición del marco. Se han devuelto tus puntos.');
          await updateUserPuntos(usuario.email, usuario.puntos); // Revertir los puntos
          await recargarDatosPerfil(); // Recargar datos para reflejar la reversión
        }
      } else {
        Alert.alert('Error', 'No se pudieron actualizar tus puntos. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error al manejar la compra del marco:', error);
      Alert.alert('Error', 'Ocurrió un problema al procesar la compra del marco.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tienda de Marcos</Text>
      {/* Mostrar los puntos del usuario */}
      <Text style={styles.puntosUsuario}>Tus puntos: {usuario ? usuario.puntos : 'Cargando...'}</Text>
      <FlatList
        data={MARCOS_DISPONIBLES}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.marco}>
            <Image source={item.archivo} style={styles.imagen} />
            <Text style={styles.nombreMarco}>{item.nombre}</Text>
            <Text style={styles.precioMarco}>Precio: {item.precio} puntos</Text>
            <Button
              title={marcosComprados.includes(item.id) ? "Adquirido" : `Adquirir (${item.precio} Pts)`}
              onPress={() => manejarCompra(item.id)}
              disabled={marcosComprados.includes(item.id) || (usuario && usuario.puntos < item.precio)} // Deshabilitar si no hay puntos suficientes
              color={marcosComprados.includes(item.id) ? '#888' : '#007bff'} // Color del botón
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Asegura que el contenedor ocupe todo el espacio
    padding: 10,
    backgroundColor: '#f8f8f8', // Un color de fondo suave
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  puntosUsuario: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
    fontWeight: '600',
  },
  marco: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Para Android
  },
  imagen: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 60, // Para un aspecto más redondeado o circular
    borderWidth: 2,
    borderColor: '#eee',
  },
  nombreMarco: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  precioMarco: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
});
