import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { loginUsuario, 
 
} from "../services/userService";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/FontAwesome";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { iniciarSesion } = useContext(AuthContext);

  const validarEmail = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const handleLogin = async () => {
    const correo = email.trim();
    const password = contrasena.trim();

    if (!correo || !password) {
      Alert.alert("Error", "Ingresá tu correo y contraseña.");
      return;
    }

    if (!validarEmail(correo)) {
      Alert.alert("Error", "Formato de correo inválido.");
      return;
    }

    try {
     const usuario = loginUsuario(correo, password); 
      if (usuario) {
        await iniciarSesion(usuario);
        
        Alert.alert("Bienvenido", `Hola, ${usuario.nombre}`);
        setEmail("");
        setContrasena("");
      } else {
        Alert.alert("Error", "Correo o contraseña incorrectos.");
      }
    } catch (error) {
      console.error("Error en handleLogin:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al intentar iniciar sesión. Por favor, intentá de nuevo más tarde."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={contrasena}
          onChangeText={setContrasena}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Icon
            name={showPassword ? "eye" : "eye-slash"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Ingresar" onPress={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  eyeIcon: {
    padding: 10,
  },
});