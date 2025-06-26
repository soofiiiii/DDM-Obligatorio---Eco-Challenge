import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

export default function DetalleParticipacionScreen({ route }) {
  const { participacion, aprobar, rechazar } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Detalle de Participación</Text>
      <Text>Comentario: {participacion.comentario}</Text>
      <Text>Ubicación: {participacion.latitud}, {participacion.longitud}</Text>
      <Image source={{ uri: participacion.foto }} style={styles.imagen} />
      <View style={styles.botones}>
        <Button title="Aprobar" onPress={() => aprobar(participacion.id)} />
        <Button title="Rechazar" color="red" onPress={() => rechazar(participacion.id)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  imagen: { width: '100%', height: 250, borderRadius: 10, marginVertical: 15 },
  botones: { flexDirection: 'row', justifyContent: 'space-around' },
});
