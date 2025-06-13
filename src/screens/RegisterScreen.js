import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { insertUser, emailExists } from '../services/userService';

export default function RegisterScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');
  const [barrio, setBarrio] = useState('');
  const [foto, setFoto] = useState(null);

  const elegirFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      base64: false,
    });
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const validarYRegistrar = async () => {
    if (!nombre || !email || !edad || !barrio) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const existe = await emailExists(email);
    if (existe) {
      Alert.alert('Error', 'El correo ya está registrado.');
      return;
    }

    const nuevoUsuario = {
      nombre,
      email,
      edad: parseInt(edad),
      barrio,
      foto: foto ?? ''
    };

    const exito = await insertUser(nuevoUsuario);
    if (exito) {
      Alert.alert('Éxito', 'Usuario registrado con éxito.');
      // Limpiar los campos luego del registro
      setNombre('');
      setEmail('');
      setEdad('');
      setBarrio('');
      setFoto(null);
    } else {
      Alert.alert('Error', 'No se pudo guardar el usuario.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        keyboardType="numeric"
        value={edad}
        onChangeText={setEdad}
      />
      <TextInput
        style={styles.input}
        placeholder="Barrio"
        value={barrio}
        onChangeText={setBarrio}
      />

      <Button title="Elegir foto de perfil" onPress={elegirFoto} />
      {foto && <Image source={{ uri: foto }} style={styles.foto} />}

      <View style={{ marginTop: 20 }}>
        <Button title="Registrarse" onPress={validarYRegistrar} />
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
  foto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    alignSelf: 'center'
  }
});
