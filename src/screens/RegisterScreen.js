import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";

import {
  insertUser,
  emailExists,
  loginUsuario,
} from "../services/userService";
import { AuthContext } from "../context/AuthContext";
import styles from "./RegisterStyles";

export default function RegisterScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [repeatContrasena, setRepeatContrasena] = useState("");
  const [barrio, setBarrio] = useState("");
  const [foto, setFoto] = useState(null);
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const { iniciarSesion } = useContext(AuthContext);

  const [showImageSourceModal, setShowImageSourceModal] = useState(false);

  // Efecto para solicitar permisos de la cámara y galería al cargar la pantalla
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        console.log("Solicitando permisos de cámara y galería al iniciar la pantalla.");
        const { status: cameraStatus } =
          await ImagePicker.requestCameraPermissionsAsync();
        const { status: galleryStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        console.log("Estado de permiso de cámara (al iniciar):", cameraStatus);
        console.log("Estado de permiso de galería (al iniciar):", galleryStatus);

        if (cameraStatus !== "granted") {
          Alert.alert(
            "Permiso de Cámara",
            "Necesitamos acceso a tu cámara para tomar fotos. Por favor, otórguelo en la configuración de la aplicación."
          );
        }
        if (galleryStatus !== "granted") {
          Alert.alert(
            "Permiso de Galería",
            "Necesitamos acceso a tu galería para elegir fotos. Por favor, otórguelo en la configuración de la aplicación."
          );
        }
      }
    })();
  }, []);

  const handleChoosePhoto = () => {
    setShowImageSourceModal(true);
  };

  const pickImageFromGallery = async () => {
    setShowImageSourceModal(false);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        base64: false,
        quality: 0.8,
      });
      if (!result.canceled) {
        setFoto(result.assets[0].uri);
      } else {
        console.log("Selección de galería cancelada.");
      }
    } catch (error) {
      console.error("Error al seleccionar imagen de la galería:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen de la galería.");
    }
  };

  const takePhotoFromCamera = async () => {
    setShowImageSourceModal(false);

    console.log("Intentando abrir la cámara...");
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    console.log("Estado de permiso de cámara (al intentar tomar foto):", status);

    if (status !== "granted") {
      Alert.alert(
        "Permiso de Cámara",
        "Necesitamos acceso a tu cámara para tomar fotos. Por favor, otórguelo en la configuración de la aplicación."
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        base64: false,
        quality: 0.8,
      });
      if (!result.canceled) {
        setFoto(result.assets[0].uri);
        console.log("Foto tomada exitosamente:", result.assets[0].uri);
      } else {
        console.log("Toma de foto cancelada.");
      }
    } catch (error) {
      console.error("Error al lanzar la cámara:", error);
      Alert.alert("Error", "No se pudo abrir la cámara.");
    }
  };

  const validarEmail = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const calcularEdad = (fecha) => {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    const errors = [];

    if (password.length >= 8) strength++; else errors.push("Debe tener al menos 8 caracteres.");
    if (/[A-Z]/.test(password)) strength++; else errors.push("Debe contener una mayúscula.");
    if (/[a-z]/.test(password)) strength++; else errors.push("Debe contener una minúscula.");
    if (/[0-9]/.test(password)) strength++; else errors.push("Debe contener un número.");
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++; else errors.push("Debe tener un carácter especial.");

    setPasswordStrength(strength);
    setPasswordErrors(errors);
  };

  const getStrengthBarColor = () => {
    switch (passwordStrength) {
      case 1: return '#FF0000';
      case 2: return '#FF8C00';
      case 3: return '#FFD700';
      case 4: return '#ADFF2F';
      case 5: return '#4CAF50';
      default: return '#E0E0E0';
    }
  };

  const getStrengthBarWidth = () => `${(passwordStrength / 5) * 100}%`;

  const validarYRegistrar = async () => {
    if (!nombre.trim() || !email.trim() || !barrio.trim() || !fechaNacimiento) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    if (!validarEmail(email.trim())) {
      Alert.alert("Error", "Correo electrónico inválido.");
      return;
    }

    const edadCalculada = calcularEdad(fechaNacimiento);
    if (edadCalculada < 13 || edadCalculada > 100) {
      Alert.alert("Error", "Lo sentimos, esta app está pensada para mayores de 13 años.");
      return;
    }

    if (!foto) {
      Alert.alert("Error", "Debes seleccionar una foto de perfil.");
      return;
    }

    if (emailExists(email.trim())) {
      Alert.alert("Error", "Ese correo ya está registrado.");
      return;
    }

    if (contrasena.trim() === "") {
      Alert.alert("Error", "La contraseña no puede estar vacía.");
      return;
    }

    if (passwordErrors.length > 0) {
      Alert.alert("Error", "La contraseña tiene errores:\n" + passwordErrors.join("\n"));
      return;
    }

    if (contrasena !== repeatContrasena) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    const nuevoUsuario = {
      nombre: nombre.trim(),
      email: email.trim(),
      edad: edadCalculada,
      barrio: barrio.trim(),
      foto,
      contrasena: contrasena.trim(),
    };

    const exito = insertUser(nuevoUsuario);

    if (exito) {
      const usuarioLogueado = loginUsuario(nuevoUsuario.email, nuevoUsuario.contrasena);
      if (usuarioLogueado) {
        await iniciarSesion(usuarioLogueado);
        Alert.alert("Bienvenido", `Registrado como ${usuarioLogueado.nombre}`);
      } else {
        Alert.alert("Registro exitoso", "No se pudo iniciar sesión automáticamente.");
      }
    } else {
      Alert.alert("Error", "No se pudo registrar el usuario.");
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
        placeholderTextColor={styles.input.borderColor}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={styles.input.borderColor}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={contrasena}
          onChangeText={(text) => {
            setContrasena(text);
            checkPasswordStrength(text);
          }}
          placeholderTextColor={styles.input.borderColor}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordStrengthBarContainer}>
        <View style={[styles.passwordStrengthBar, {
          width: getStrengthBarWidth(),
          backgroundColor: getStrengthBarColor(),
        }]} />
      </View>

      {passwordErrors.map((error, index) => (
        <Text key={index} style={styles.passwordErrorText}>{error}</Text>
      ))}

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Repetir Contraseña"
          secureTextEntry={!showPassword}
          value={repeatContrasena}
          onChangeText={setRepeatContrasena}
          placeholderTextColor={styles.input.borderColor}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {contrasena !== repeatContrasena && repeatContrasena !== "" && (
        <Text style={styles.passwordErrorText}>Las contraseñas no coinciden.</Text>
      )}

      <TouchableOpacity style={styles.datePickerButton} onPress={() => setMostrarDatePicker(true)}>
        <Text style={styles.datePickerText}>
          {fechaNacimiento
            ? new Date(fechaNacimiento).toLocaleDateString()
            : "Seleccionar fecha de nacimiento"}
        </Text>
      </TouchableOpacity>

      {mostrarDatePicker && (
        <DateTimePicker
          value={fechaNacimiento ? new Date(fechaNacimiento) : new Date()}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setMostrarDatePicker(false);
            if (selectedDate) {
              setFechaNacimiento(selectedDate.toISOString());
            }
          }}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Barrio"
        value={barrio}
        onChangeText={setBarrio}
        placeholderTextColor={styles.input.borderColor}
      />

      <TouchableOpacity style={styles.photoPickerButton} onPress={handleChoosePhoto}>
        <Text style={styles.photoPickerButtonText}>Elegir foto de perfil</Text>
      </TouchableOpacity>

      {foto && <Image source={{ uri: foto }} style={styles.foto} />}

      <View style={styles.registerButtonContainer}>
        <TouchableOpacity style={styles.registerButton} onPress={validarYRegistrar}>
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de selección de origen de imagen */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showImageSourceModal}
        onRequestClose={() => setShowImageSourceModal(false)}
      >
        <TouchableOpacity
          style={styles.imageSourceOverlay}
          activeOpacity={1}
          onPressOut={() => setShowImageSourceModal(false)}
        >
          <View
            style={styles.imageSourceContent}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.imageSourceTitle}>
              Seleccionar fuente de imagen
            </Text>
            <TouchableOpacity
              style={styles.imageSourceOption}
              onPress={takePhotoFromCamera} // Aquí se llama a la función para tomar foto
            >
              <Icon
                name="camera"
                size={24}
                color="#333"
                style={styles.imageSourceIcon}
              />
              <Text style={styles.imageSourceOptionText}>Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageSourceOption}
              onPress={pickImageFromGallery} // Aquí se llama a la función para elegir de galería
            >
              <Icon
                name="image"
                size={24}
                color="#333"
                style={styles.imageSourceIcon}
              />
              <Text style={styles.imageSourceOptionText}>
                Elegir de la galería
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowImageSourceModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
