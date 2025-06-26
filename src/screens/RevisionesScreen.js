import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getRetos } from '../services/retoService';

export default function RevisionesScreen({ navigation }) {
  const [retos, setRetos] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const lista = await getRetos();
      setRetos(lista);
    };
    cargar();
  }, []);

  const irAReto = (id) => navigation.navigate('RevisarReto', { retoId: id });

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Revisión de Retos</Text>
      <FlatList
        data={retos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => irAReto(item.id)}>
            <Text>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  item: {
    backgroundColor: '#e0f2f1',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
});
