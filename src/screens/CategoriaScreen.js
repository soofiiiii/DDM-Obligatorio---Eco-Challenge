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
  insertCategoria
} from '../services/categoriaService';

export default function CategoriaScreen() {
  const [nombre, setNombre] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarCategorias();
  }, []);

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

    const exito = await insertCategoria(nombreFormateado);
    if (exito) {
      Alert.alert('Éxito', 'Categoría agregada.');
      setNombre('');
      cargarCategorias();
    } else {
      Alert.alert('Ya existe', 'Esa categoría ya está registrada.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorías reciclables</Text>

      <TextInput
        style={styles.input}
        placeholder="Nueva categoría (ej. Metal)"
        value={nombre}
        onChangeText={(text) => setNombre(text.trimStart())}
      />

      <Button
        title="Agregar categoría"
        onPress={guardarCategoria}
        disabled={!nombre.trim()}
      />

      <Text style={styles.subtitulo}>Categorías registradas:</Text>
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  subtitulo: { marginTop: 20, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }
});
