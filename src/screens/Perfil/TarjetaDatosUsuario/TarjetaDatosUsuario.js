import React, { useContext } from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { ThemeContext } from "../../../context/ThemeContext";
import { crearStylesTarjetaDatos } from "./styles";

export default function TarjetaDatosUsuario({
  edad = "-",
  barrio = "-",
  email = "-",
}) {
  const { theme } = useContext(ThemeContext);
  const styles = crearStylesTarjetaDatos(theme);

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Datos Personales</Text>

      <View style={styles.row}>
        <Icon name="birthday-cake" size={20} style={styles.icono} color={theme.icon} />
        <Text style={styles.label}>Edad:</Text>
        <Text style={styles.valor}>{edad}</Text>
      </View>

      <View style={styles.row}>
        <Icon name="home" size={20} style={styles.icono} color={theme.icon}/>
        <Text style={styles.label}>Barrio:</Text>
        <Text style={styles.valor}>{barrio}</Text>
      </View>

      <View style={styles.row}>
        <Icon name="at" size={20} style={styles.icono} color={theme.icon}/>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.valor}>{email}</Text>
      </View>
    </View>
  );
}
