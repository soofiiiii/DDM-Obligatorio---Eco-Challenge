import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { ThemeContext } from '../../../context/ThemeContext';
import { crearStylesTarjetaEstadisticas } from './styles';

export default function TarjetaEstadisticas({ puntos = 0, retos = 0 }) {
  const { theme } = useContext(ThemeContext);
  const styles = crearStylesTarjetaEstadisticas(theme);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.label}>Puntos</Text>
        <Text style={styles.valor}>{puntos}</Text>
      </View>
      <View style={styles.box}>
        <Text style={styles.label}>Retos</Text>
        <Text style={styles.valor}>{retos}</Text>
      </View>
    </View>
  );
}
