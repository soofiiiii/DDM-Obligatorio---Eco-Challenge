import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function PerfilScreen() {
  const { usuario, cerrarSesion } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Perfil de {usuario?.nombre}</Text>
      <Text>Edad: {usuario?.edad}</Text>
      <Text>Barrio: {usuario?.barrio}</Text>
      <Text>Email: {usuario?.email}</Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Cerrar sesión" onPress={cerrarSesion} />
      </View>
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
