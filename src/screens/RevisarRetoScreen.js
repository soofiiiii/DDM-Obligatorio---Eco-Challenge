import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import {
  getParticipacionesPorReto,
  actualizarEstadoParticipacion,
  enviarNotificacionParticipacion,
} from "../services/participacionService";

export default function RevisarRetoScreen({ route }) {
  const { retoId } = route.params;
  const [participaciones, setParticipaciones] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const lista = await getParticipacionesPorReto(retoId, "Pendiente");
      setParticipaciones(lista);
      console.log('Participaciones pendientes para revisar:', lista); // Para depuración
    };
    cargar();
  }, [retoId]);

  const actualizar = async (id, estado) => {
    const ok = await actualizarEstadoParticipacion(id, estado);
    if (ok) {
      await enviarNotificacionParticipacion(estado); // Aquí se lanza la notificación
      // Filtra la participación actualizada para que desaparezca de la lista
      setParticipaciones((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <ScrollView style={styles.container}>
      {participaciones.length === 0 ? (
        <Text style={styles.vacio}>No hay participaciones pendientes para revisar.</Text>
      ) : (
        participaciones.map((p) => (
          <View key={p.id} style={styles.card}>
            <Text style={styles.cardTitle}>Participación #{p.id}</Text> 
            <Text>Comentario: {p.comentario || 'Sin comentario'}</Text>
            <Text>Ubicación: {p.latitud ? p.latitud.toFixed(4) : 'N/A'}, {p.longitud ? p.longitud.toFixed(4) : 'N/A'}</Text>
            
           {p.fotos && p.fotos.length > 0 ? (
              <FlatList
                horizontal
                data={p.fotos}
                keyExtractor={(item, index) => item + index} // Usar item + index para asegurar unicidad
                renderItem={({ item: uri }) => (
                  <Image source={{ uri }} style={styles.imagenThumbnail} />
                )}
                contentContainerStyle={styles.imagenesContainer}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.noImagenText}>No hay imágenes para esta participación.</Text>
            )}

            <View style={styles.botones}>
              <Button
                title="Aprobar"
                onPress={() => actualizar(p.id, "Aprobado")}
                color="#4CAF50" // Color verde para aprobar
              />
              <Button
                title="Rechazar"
                color="#F44336" // Color rojo para rechazar
                onPress={() => actualizar(p.id, "Rechazado")}
              />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  //  Estilos para el contenedor de imágenes múltiples
  imagenesContainer: {
    marginVertical: 10,
    alignItems: 'center', // Para centrar las imágenes si hay pocas
  },
  imagenThumbnail: { 
    width: 150, // Tamaño fijo para las miniaturas
    height: 150,
    borderRadius: 8,
    marginHorizontal: 5, // Espacio entre imágenes
    resizeMode: 'cover',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  noImagenText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#888',
  },
  botones: { 
    flexDirection: "row", 
    justifyContent: "space-around",
    marginTop: 10, // Espacio entre las imágenes y los botones
  },
  vacio: { textAlign: "center", marginTop: 40, fontSize: 16, color: '#666' },
});