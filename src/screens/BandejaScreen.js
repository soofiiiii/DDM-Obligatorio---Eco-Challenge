import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext'; 
import { getParticipacionesNotificablesPorUsuario } from '../services/participacionService';

export default function BandejaScreen() {
  const { usuario } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); 
  const styles = crearEstilos(theme); 
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    if (usuario?.email) {
      const lista = getParticipacionesNotificablesPorUsuario(usuario.email);
      setNotificaciones(lista);
    }
  }, [usuario]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      {item.fotos?.[0] && (
        <Image source={{ uri: item.fotos[0] }} style={styles.imagen} />
      )}
      <View style={styles.textoContainer}>
        <Text style={styles.titulo}>{item.nombreReto}</Text>
        <Text style={[styles.estado, item.estado === 'Aprobado' ? styles.aprobado : styles.rechazado]}>
          {item.estado === 'Aprobado' ? '✅ Aprobado' : '❌ Rechazado'}
        </Text>
        <Text style={styles.comentario}>{item.comentario}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.encabezado}>Bandeja de Participaciones</Text>
      {notificaciones.length === 0 ? (
        <Text style={styles.vacio}>No tienes participaciones con resultado.</Text>
      ) : (
        <FlatList
          data={notificaciones}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const crearEstilos = (theme) =>
  StyleSheet.create({
    container: {
      padding: 20,
      flex: 1,
      backgroundColor: theme.background,
    },
    encabezado: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.text,
    },
    item: {
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      marginBottom: 12,
      backgroundColor: theme.card, // uso del color de tarjeta según tema
      borderColor: theme.text,
    },
    imagen: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 10,
    },
    textoContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    titulo: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      color: theme.text,
    },
    comentario: {
      fontSize: 14,
      color: theme.text,
    },
    estado: {
      fontSize: 14,
      marginTop: 4,
    },
    aprobado: {
      color: 'green',
    },
    rechazado: {
      color: 'red',
    },
    vacio: {
      textAlign: 'center',
      marginTop: 30,
      color: theme.text,
    },
  });
