import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { actualizarUsuario, eliminarUsuario } from "../../services/userService";

import { crearEditarPerfilStyles } from "./styles";

export default function EditarPerfilScreen() {
  const { usuario, cerrarSesion } = useContext(AuthContext);
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const styles = crearEditarPerfilStyles(theme);

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [barrio, setBarrio] = useState("");
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    if (!usuario) {
      navigation.navigate("Login");
    } else {
      setNombre(usuario.nombre);
      setEdad(usuario.edad.toString());
      setBarrio(usuario.barrio);
      setFoto(usuario.foto);
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
    Alert.alert("Eliminar cuenta", "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.", [
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
          }
        },
      },
    ]);
  };

  const confirmarCerrarSesion = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas cerrar tu sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: cerrarSesion },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.scrollContent}
    >
      <TouchableOpacity onPress={elegirFoto} style={styles.fotoContainer}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.foto} />
        ) : (
          <View style={styles.fotoPlaceholder}>
            <Text style={styles.fotoPlaceholderText}>Foto</Text>
          </View>
        )}
        <Text style={styles.cambiarFoto}>Cambiar foto</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Nombre"
        placeholderTextColor={theme.mediumGray}
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Edad"
        keyboardType="numeric"
        placeholderTextColor={theme.mediumGray}
        value={edad}
        onChangeText={setEdad}
        style={styles.input}
      />
      <TextInput
        placeholder="Barrio"
        placeholderTextColor={theme.mediumGray}
        value={barrio}
        onChangeText={setBarrio}
        style={styles.input}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Modo oscuro</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: theme.mediumGray, true: theme.primary }}
        />
      </View>

      <TouchableOpacity onPress={guardarCambios} style={styles.botonGuardar}>
        <Text style={styles.textoBotonGuardar}>Guardar</Text>
      </TouchableOpacity>

      <View style={styles.linksInferiores}>
        <Text onPress={confirmarCerrarSesion} style={styles.cerrarSesion}>
          Cerrar sesión
        </Text>
        <Text onPress={confirmarEliminacion} style={styles.eliminarCuenta}>
          Eliminar cuenta
        </Text>
      </View>
    </ScrollView>
  );
}
