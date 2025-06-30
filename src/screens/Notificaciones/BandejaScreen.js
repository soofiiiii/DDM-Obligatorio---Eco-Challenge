import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { getParticipacionesNotificablesPorUsuario } from "../../services/participacionService";
import { getNotificaciones } from "../../services/notificacionService";

import { crearEstilos } from "./styles";

export default function BandejaScreen() {
  const { usuario } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const styles = crearEstilos(theme);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    if (usuario?.email) {
      const participaciones = getParticipacionesNotificablesPorUsuario(
        usuario.email
      );
      const locales = getNotificaciones();

      // Unificamos ambas listas con un campo "tipo"
      const todas = [
        ...participaciones.map((p) => ({ tipo: "participacion", ...p })),
        ...locales.map((n) => ({ tipo: "local", ...n })),
      ].sort(
        (a, b) =>
          new Date(b.fecha || b.fechaParticipacion) -
          new Date(a.fecha || a.fechaParticipacion)
      ); // ordenado descendente

      setNotificaciones(todas);
    }
  }, [usuario]);

  const renderItem = ({ item }) => {
    if (item.tipo === "participacion") {
      return (
        <View style={styles.item}>
          <View style={styles.textoContainer}>
            <Text style={styles.titulo}>{item.nombreReto}</Text>
            <Text
              style={[
                styles.estado,
                item.estado === "Aprobado" ? styles.aprobado : styles.rechazado,
              ]}
            >
              {item.estado === "Aprobado" ? "✅ Aprobado" : "❌ Rechazado"}
            </Text>
            <Text style={styles.comentario}>{item.comentario}</Text>
            {item.fechaParticipacion && (
              <Text style={styles.fecha}>
                {new Date(item.fechaParticipacion).toLocaleString()}
              </Text>
            )}
          </View>
        </View>
      );
    } else if (item.tipo === "local") {
      return (
        <View style={styles.item}>
          <View style={styles.textoContainer}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.comentario}>{item.mensaje}</Text>
            <Text style={styles.fecha}>
              {new Date(item.fecha).toLocaleString()}
            </Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {notificaciones.length === 0 ? (
        <Text style={styles.vacio}>
          No tienes participaciones con resultado.
        </Text>
      ) : (
        <FlatList
          data={notificaciones}
          keyExtractor={(item, index) => `${item.tipo}-${item.id}-${index}`}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
