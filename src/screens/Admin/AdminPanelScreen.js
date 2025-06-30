import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import styles from "./styles";


export default function AdminPanelScreen() {
  const { cerrarSesion, usuario } = useContext(AuthContext);
  const navigation = useNavigation();

  if (usuario?.rol !== "admin") {
    return (
      <View style={styles.container}>
        <Text style={styles.textoError}>Acceso no autorizado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Centro de gestión EcoChallenge</Text>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => navigation.navigate("ABMRetos")}
      >
        <Text style={styles.botonTexto}>Gestionar Retos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => navigation.navigate("ABMMateriales")}
      >
        <Text style={styles.botonTexto}>Gestionar Materiales</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => navigation.navigate("ABMCategorias")}
      >
        <Text style={styles.botonTexto}>Gestionar Categorías</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => navigation.navigate("Revisiones")}
      >
        <Text style={styles.botonTexto}>Revisar Participaciones</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("EstadisticasZona")}
        style={styles.boton}
      >
        <Text style={styles.botonTexto}>Ver estadísticas por zona</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.boton, { backgroundColor: "#B00020", marginTop: 40 }]}
        onPress={() => {
          Alert.alert("Confirmar", "¿Deseas cerrar sesión?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Cerrar sesión", onPress: cerrarSesion },
          ]);
        }}
      >
        <Text style={styles.botonTexto}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
