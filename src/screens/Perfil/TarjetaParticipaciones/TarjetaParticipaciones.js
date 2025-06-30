import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../../../context/ThemeContext';
import { crearStylesTarjetaParticipaciones } from './styles';

export default function TarjetaParticipaciones({ participaciones = [], onEditar, onEliminar }) {
  const { theme } = useContext(ThemeContext);
  const styles = crearStylesTarjetaParticipaciones(theme);

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>
        Tus participaciones pendientes:
      </Text>

      {participaciones.length > 0 ? (
        participaciones.map((p) => (
          <View key={p.id} style={styles.item}>
            {p.fotos?.length > 0 ? (
              <Image source={{ uri: p.fotos[0] }} style={styles.foto} />
            ) : (
              <View style={styles.fotoPlaceholder}>
                <Icon name="image" size={30} color="#ccc" />
              </View>
            )}

            <View style={styles.info}>
              <Text style={styles.nombreReto}>Reto: {p.nombreReto ?? 'Desconocido'}</Text>
              <Text style={styles.comentario}>{p.comentario}</Text>
              <Text style={styles.estado}>Estado: <Text style={styles.estadoValor}>{p.estado}</Text></Text>
            </View>

            <View style={styles.acciones}>
              <TouchableOpacity onPress={() => onEditar(p)} style={styles.botonAccion}>
                <Icon name="edit" size={18} color={theme.accent} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onEliminar(p.id)} style={styles.botonAccion}>
                <Icon name="trash" size={18} color={theme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noParticipaciones}>
          <Icon name="check-circle" size={14} color={theme.textSecondary || '#999'} style={styles.iconoTitulo} />
          No tienes participaciones pendientes.
        </Text>
      )}
    </View>
  );
}
