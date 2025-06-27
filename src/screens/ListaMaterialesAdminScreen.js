import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getMateriales, deleteMaterial } from "../services/materialService";

const LIMIT_POR_PAGINA = 10;

export default function ListaMaterialesAdminScreen() {
  const [materiales, setMateriales] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigation = useNavigation();

  
  const cargarMateriales = (reset = false, termino) => {
  const terminoFinal = termino !== undefined ? termino : searchTerm;
  const nuevoOffset = reset ? 0 : offset;

  const nuevosMateriales = getMateriales(LIMIT_POR_PAGINA, nuevoOffset, terminoFinal.trim());

  if (reset) {
    setMateriales(nuevosMateriales);
    setOffset(LIMIT_POR_PAGINA);
  } else {
    setMateriales((prev) => [...prev, ...nuevosMateriales]);
    setOffset((prev) => prev + LIMIT_POR_PAGINA);
  }

  setHasMore(nuevosMateriales.length === LIMIT_POR_PAGINA);
};

  useFocusEffect(
    useCallback(() => {
      cargarMateriales(true);
    }, [searchTerm])
  );

  const confirmarEliminacion = (id, nombre) => {
    Alert.alert(
      "Eliminar material",
      `¿Seguro que desea eliminar "${nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const exito = await deleteMaterial(id);
            if (exito) {
              Alert.alert("Eliminado", "Material eliminado correctamente.");
              cargarMateriales(true);
            } else {
              Alert.alert("Error", "No se pudo eliminar el material.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSearchChange = (text) => {
    setSearchTerm(text);
    setOffset(0);
    setHasMore(true);
    const nuevos = getMateriales(LIMIT_POR_PAGINA, 0, text.trim());
    setMateriales(nuevos);
    setOffset(LIMIT_POR_PAGINA);
    setHasMore(nuevos.length === LIMIT_POR_PAGINA);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imagen }}
        style={styles.imagen}
        resizeMode="cover"
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.detalles}>Categoría: {item.categoria}</Text>
      </View>

      <View style={styles.botones}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MaterialScreen", { materialEdit: item })
          }
          style={styles.botonEditar}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => confirmarEliminacion(item.id, item.nombre)}
          style={styles.botonEliminar}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gestión de Materiales</Text>

      <TextInput
        style={styles.buscador}
        placeholder="Buscar material por nombre..."
        value={searchTerm}
        onChangeText={handleSearchChange}
      />

      <FlatList
        data={materiales}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.sinDatos}>No hay materiales para mostrar.</Text>
        }
        ListFooterComponent={
          hasMore && materiales.length > 0 ? (
            <TouchableOpacity
              style={styles.verMasBtn}
              onPress={() => cargarMateriales(false)}
            >
              <Text style={styles.verMasText}>Ver más</Text>
            </TouchableOpacity>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => navigation.navigate("MaterialScreen")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 15,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2E7D32",
    textAlign: "center",
  },
  buscador: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  imagen: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  detalles: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  sinDatos: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 16,
  },
  botones: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginLeft: 10,
  },
  botonEditar: {
    backgroundColor: "#1e88e5",
    padding: 8,
    borderRadius: 50,
    marginBottom: 5,
  },
  botonEliminar: {
    backgroundColor: "#d32f2f",
    padding: 8,
    borderRadius: 50,
  },
  botonAgregar: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#43a047",
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  verMasBtn: {
    backgroundColor: "#4CAF50",
    marginTop: 10,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  verMasText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
