import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { insertMaterial } from '../services/materialService';
import { getCategorias } from '../services/categoriaService';

export default function MaterialScreen() {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState(null);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const lista = await getCategorias();
      setCategoriasDisponibles(lista);
    };
    cargar();
  }, []);

  const elegirImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      base64: false
    });
    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const guardarMaterial = async () => {
    if (!nombre || !categoria) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const material = {
      nombre,
      categoria,
      imagen: imagen ?? ''
    };

    const exito = await insertMaterial(material);
    if (exito) {
      Alert.alert('Éxito', 'Material registrado.');
      setNombre('');
      setCategoria('');
      setImagen(null);
    } else {
      Alert.alert('Error', 'No se pudo guardar.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alta de Material Reciclable</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del material"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Seleccionar categoría:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoria}
          onValueChange={(itemValue) => setCategoria(itemValue)}
        >
          <Picker.Item label="Seleccioná una categoría..." value="" />
          {categoriasDisponibles.map((item) => (
            <Picker.Item key={item.id} label={item.nombre} value={item.nombre} />
          ))}
        </Picker>
      </View>

      <Button title="Elegir imagen" onPress={elegirImagen} />
      {imagen && <Image source={{ uri: imagen }} style={styles.imagen} />}

      <View style={{ marginTop: 20 }}>
        <Button title="Guardar material" onPress={guardarMaterial} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10
  },
  imagen: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center'
  }
});
