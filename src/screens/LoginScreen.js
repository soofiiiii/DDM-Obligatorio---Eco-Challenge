import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getAllUsers } from '../services/userService';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const { iniciarSesion } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email) {
      Alert.alert('Error', 'Ingresá tu correo.');
      return;
    }

    const usuarios = await getAllUsers();
    const usuario = usuarios.find(u => u.email === email);

    if (usuario) {
      await iniciarSesion(usuario);
      Alert.alert('Bienvenido', `Hola, ${usuario.nombre}`);
    } else {
      Alert.alert('Error', 'El correo no está registrado.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <View style={{ marginTop: 20 }}>
        <Button title="Ingresar" onPress={handleLogin} />
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
  }
});
