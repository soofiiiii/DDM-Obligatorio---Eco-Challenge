import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { insertMaterial, updateMaterial } from '../../services/materialService';
import { getCategorias } from '../../services/categoriaService';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './styles';

export default function MaterialScreen() {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState(null);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();
  const materialEdit = route.params?.materialEdit ?? null;

  useEffect(() => {
    const cargar = async () => {
      const lista = await getCategorias();
      setCategoriasDisponibles(lista);
    };
    cargar();
  }, []);

   useEffect(() => {
    if (materialEdit) {
      setNombre(materialEdit.nombre);
      setCategoria(materialEdit.categoria);
      setImagen(materialEdit.imagen);
    }
  }, [materialEdit]);

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
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre del material es obligatorio.');
      return;
    }

    if (!categoria) {
      Alert.alert('Error', 'Debes seleccionar una categoría.');
      return;
    }

    if (!imagen) {
      Alert.alert('Error', 'Debes seleccionar una imagen de ejemplo.');
      return;
    }

    const material = {
      nombre: nombre.trim(),
      categoria,
      imagen
    };

    let exito = false;

     if (materialEdit) {
      material.id = materialEdit.id;
      exito = await updateMaterial(material);
    } else {
      exito = await insertMaterial(material);
    }

     if (exito) {
      Alert.alert(
        'Éxito',
        materialEdit ? 'Material actualizado.' : 'Material registrado.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Error', 'No se pudo guardar el material.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> {materialEdit ? 'Editar Material' : 'Alta de Material Reciclable'}</Text>

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
         <Button
          title={materialEdit ? 'Actualizar material' : 'Guardar material'}
          onPress={guardarMaterial}
          color={materialEdit ? "#f39c12" : "#28a745"}
        />
      </View>
    </View>
  );
}
