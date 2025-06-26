import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../context/AuthContext";
import {
  actualizarUsuario,
  eliminarUsuario,
} from "../services/userService";

import { ThemeContext } from "../context/ThemeContext"; 

export default function EditarPerfilScreen({ navigation }) {
  const { usuario, cerrarSesion } = useContext(AuthContext);
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext); 

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [barrio, setBarrio] = useState("");
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre);
      setEdad(usuario.edad.toString());
      setBarrio(usuario.barrio);
      setFoto(usuario.foto);
    }
  }, [usuario]);

  useEffect(() => {
    if (!usuario) {
      navigation.navigate("Login");
    }
  }, [usuario]);

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

  const guardarCambios = () => {
    if (!nombre || !edad || !barrio) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const actualizado = {
      nombre,
      edad: parseInt(edad),
      barrio,
      foto,
      email: usuario.email,
    };

    if (actualizarUsuario(actualizado)) {
      Alert.alert("Éxito", "Perfil actualizado");
      navigation.goBack();
    } else {
      Alert.alert("Error", "No se pudo actualizar el perfil.");
    }
  };

  const confirmarEliminacion = () => {
    Alert.alert(
      "Eliminar cuenta",
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eliminarUsuario(usuario.email);
              await cerrarSesion();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la cuenta correctamente.");
              console.error("Error al eliminar cuenta:", error);
            }
          },
        },
      ]
    );
  };

  const confirmarCerrarSesion = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar tu sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: cerrarSesion,
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.titulo, { color: theme.text }]}>Editar Perfil</Text>
      <TextInput
        placeholder="Nombre"
        placeholderTextColor={theme.text}
        value={nombre}
        onChangeText={setNombre}
        style={[styles.input, { borderColor: theme.text, color: theme.text }]}
      />
      <TextInput
        placeholder="Edad"
        keyboardType="numeric"
        placeholderTextColor={theme.text}
        value={edad}
        onChangeText={setEdad}
        style={[styles.input, { borderColor: theme.text, color: theme.text }]}
      />
      <TextInput
        placeholder="Barrio"
        placeholderTextColor={theme.text}
        value={barrio}
        onChangeText={setBarrio}
        style={[styles.input, { borderColor: theme.text, color: theme.text }]}
      />
      <Button title="Cambiar foto" onPress={elegirFoto} color={theme.primary} />
      {foto && <Image source={{ uri: foto }} style={styles.foto} />}
      <View style={{ height: 10 }} />
      <Button title="Guardar cambios" onPress={guardarCambios} color={theme.primary} />
      <View style={{ height: 16 }} />
      <Button
        title="Cerrar sesión"
        onPress={confirmarCerrarSesion}
        color="#d32f2f"
      />
      <View style={{ height: 16 }} />
      <Button
        title="Eliminar cuenta"
        onPress={confirmarEliminacion}
        color="red"
      />
      <View style={{ height: 24 }} />
      <Button
        title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        onPress={toggleTheme}
        color={theme.accent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
  },
  foto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
});
