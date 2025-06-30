import React, { useContext } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { ThemeContext } from "../../../context/ThemeContext";
import crearStyles from "./styles";

export default function EncabezadoPerfil({
  nombre,
  foto,
  marco,
  nivel,
  progreso,
}) {
  const { theme } = useContext(ThemeContext);
  const styles = crearStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.fotoMarcoContainer}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.fotoPerfil} />
        ) : (
          <View style={styles.placeholderFoto}>
            <Icon name="user-circle" size={100} color={theme.textSecondary} />
            <Text style={styles.noFotoText}>Sin foto</Text>
          </View>
        )}
        {marco && (
          <Image
            source={marco.archivo}
            style={[
              styles.marcoPerfil,
              { transform: [{ scale: marco.escala || 1 }] },
            ]}
          />
        )}
      </View>

      <Text style={styles.nombreUsuario}>
        {nombre ?? "Nombre no disponible"}
      </Text>

      <Text style={styles.nivelTexto}>
        Nivel: <Text style={styles.valorNivel}>{nivel}</Text>
      </Text>
      <View style={styles.progressBarFondo}>
        <View
          style={[
            styles.progressBarRelleno,
            { width: `${(progreso ?? 0) * 100}%` },
          ]}
        />
      </View>
      {nivel < 5 && (
        <Text style={styles.porcentajeTexto}>{`${Math.round(
          (progreso ?? 0) * 100
        )}% al siguiente nivel`}</Text>
      )}
    </View>
  );
}
