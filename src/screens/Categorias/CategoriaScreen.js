import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  FlatList,
  StyleSheet
} from 'react-native';
import {
  getCategorias,
  insertCategoria,
  updateCategoria
} from '../../services/categoriaService';
import { useNavigation, useRoute } from '@react-navigation/native';

import styles from './styles';

export default function CategoriaScreen() {
  const [nombre, setNombre] = useState('');
  const [categorias, setCategorias] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const categoriaEdit = route.params?.categoriaEdit ?? null;

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (categoriaEdit) {
      setNombre(categoriaEdit.nombre);
    }
  }, [categoriaEdit]);

  const cargarCategorias = async () => {
    const lista = await getCategorias();
    setCategorias(lista);
  };

  const guardarCategoria = async () => {
    const nombreFormateado = nombre.trim();
    if (!nombreFormateado) {
      Alert.alert('Error', 'Debes escribir un nombre.');
      return;
    }

     let exito = false;
    if (categoriaEdit) {
      exito = await updateCategoria(categoriaEdit.id, nombreFormateado);
    } else {
      exito = await insertCategoria(nombreFormateado);
    }

    if (exito) {
      Alert.alert(
        'Éxito',
        categoriaEdit ? 'Categoría actualizada.' : 'Categoría agregada.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (categoriaEdit) {
                navigation.goBack();
              } else {
                setNombre('');
                cargarCategorias();
              }
            }
          }
        ]
      );
    } else {
      Alert.alert('Ya existe', 'Esa categoría ya está registrada.');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoriaEdit ? 'Editar Categoría' : 'Alta de Categoría Reciclable'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nueva categoría (ej. Metal)"
        value={nombre}
        onChangeText={(text) => setNombre(text.trimStart())}
      />

      <Button
        title={categoriaEdit ? 'Actualizar categoría' : 'Agregar categoría'}
        onPress={guardarCategoria}
        disabled={!nombre.trim()}
        color={categoriaEdit ? '#f39c12' : '#28a745'}
      />
    </View>
  );
}

