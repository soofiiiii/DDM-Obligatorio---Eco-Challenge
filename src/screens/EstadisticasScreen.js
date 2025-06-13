import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EstadisticasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Estadísticas</Text>
      <Text>Acá se mostrarán ños datos en forma de gráficos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  text: {
    fontSize: 20, fontWeight: 'bold', marginBottom: 10
  }
});
