import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { insertParticipacion } from '../services/participacionService';
import { getRetos } from '../services/retoService'; // Asegúrate que esta ruta es correcta
import { AuthContext } from '../context/AuthContext';



export default function ParticipacionScreen() {
  const [retos, setRetos] = useState([]);
  const [retoSeleccionado, setRetoSeleccionado] = useState(null);
  const [comentario, setComentario] = useState('');
  const [foto, setFoto] = useState(null);
  const { usuario } = useContext(AuthContext);

  useEffect(() => {
    const cargarRetosAsync = async () => {
      try {
        const r = await getRetos();
        setRetos(r);
        console.log('Retos cargados en ParticipacionScreen:', r); // Para depuración
      } catch (error) {
        console.error('Error al cargar retos en ParticipacionScreen:', error);
        Alert.alert('Error', 'No se pudieron cargar los retos. Intenta de nuevo más tarde.');
      }
    };
    cargarRetosAsync();
  }, []);

  const elegirFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      base64: false
    });
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const participar = async () => {
    if (!retoSeleccionado || !foto) {
      Alert.alert('Error', 'Debes seleccionar un reto y subir una foto.');
      return;
    }

    // TODO: Integrar GPS aquí usando expo-location
    // Ejemplo de cómo obtener la ubicación (requiere permisos y manejo de errores)
    // import * as Location from 'expo-location';
    let latitud = null;
    let longitud = null;

    /*
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso de ubicación denegado', 'Necesitamos acceso a tu ubicación para registrar la participación.');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      latitud = location.coords.latitude;
      longitud = location.coords.longitude;
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      Alert.alert('Error de ubicación', 'No se pudo obtener tu ubicación. Intenta de nuevo.');
      return;
    }
    */

    const participacion = {
      idReto: retoSeleccionado.id,
      emailUsuario: usuario?.email,
      foto,
      latitud, // Usará null si no se implementa el GPS
      longitud, // Usará null si no se implementa el GPS
      comentario,
      estado: 'Pendiente'
    };

    try {
      const exito = await insertParticipacion(participacion);
      if (exito) {
        Alert.alert('Éxito', 'Participación registrada.');
        // Limpiar formulario
        setComentario('');
        setFoto(null);
        setRetoSeleccionado(null);
      } else {
        Alert.alert('Error', 'No se pudo guardar la participación. Verifica los datos.');
      }
    } catch (error) {
      console.error('Error al intentar guardar participación:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado al guardar la participación.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Participar en un reto</Text>
      <Text style={styles.label}>Seleccioná un reto:</Text>

      {/* Condición para mostrar un mensaje si no hay retos */}
      {retos.length === 0 ? (
        <Text style={{ textAlign: 'center', marginVertical: 20 }}>No hay retos disponibles. ¡Crea algunos!</Text>
      ) : (
        <FlatList
          data={retos}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setRetoSeleccionado(item)}
              style={[
                styles.reto,
                retoSeleccionado?.id === item.id && styles.retoActivo
              ]}
            >
              <Text>{item.nombre}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Comentario (opcional)"
        value={comentario}
        onChangeText={setComentario}
      />

      <Button title="Elegir foto" onPress={elegirFoto} />
      {foto && <Image source={{ uri: foto }} style={styles.foto} />}

      <View style={{ marginTop: 20 }}>
        <Button title="Enviar participación" onPress={participar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  label: { fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
  reto: { padding: 10, borderWidth: 1, borderColor: '#999', borderRadius: 5, marginRight: 10 },
  retoActivo: { backgroundColor: '#acf', borderColor: '#00f' },
  foto: { width: 100, height: 100, borderRadius: 10, marginTop: 10, alignSelf: 'center' }
});