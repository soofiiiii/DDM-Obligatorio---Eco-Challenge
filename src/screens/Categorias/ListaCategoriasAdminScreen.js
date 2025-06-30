import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getCategorias, deleteCategoria } from "../../services/categoriaService";

const LIMIT_POR_PAGINA = 10;

export default function ListaCategoriasAdminScreen() {
  const [categorias, setCategorias] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigation = useNavigation();

  const cargarCategorias = (reset = false, termino) => {
    const terminoFinal = termino !== undefined ? termino : searchTerm;
    const nuevoOffset = reset ? 0 : offset;

    const nuevasCategorias = getCategorias(LIMIT_POR_PAGINA, nuevoOffset, terminoFinal.trim());

    if (reset) {
      setCategorias(nuevasCategorias);
      setOffset(LIMIT_POR_PAGINA);
    } else {
      setCategorias((prev) => [...prev, ...nuevasCategorias]);
      setOffset((prev) => prev + LIMIT_POR_PAGINA);
    }

    setHasMore(nuevasCategorias.length === LIMIT_POR_PAGINA);
  };

  useFocusEffect(
    useCallback(() => {
      cargarCategorias(true);
    }, [])
  );

  const confirmarEliminacion = (id, nombre) => {
    Alert.alert(
      "Eliminar categoría",
      `¿Seguro que desea eliminar "${nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const exito = await deleteCategoria(id);
            if (exito) {
              Alert.alert("Eliminado", "Categoría eliminada correctamente.");
              cargarCategorias(true);
            } else {
              Alert.alert("Error", "No se pudo eliminar la categoría.");
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
    const nuevas = getCategorias(LIMIT_POR_PAGINA, 0, text.trim());
    setCategorias(nuevas);
    setOffset(LIMIT_POR_PAGINA);
    setHasMore(nuevas.length === LIMIT_POR_PAGINA);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nombre}>{item.nombre}</Text>
      </View>

      <View style={styles.botones}>
        <TouchableOpacity
          onPress={() => navigation.navigate("CategoriaScreen", { categoriaEdit: item })}
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
      <Text style={styles.titulo}>Gestión de Categorías</Text>

      <TextInput
        style={styles.buscador}
        placeholder="Buscar categoría por nombre..."
        value={searchTerm}
        onChangeText={handleSearchChange}
      />

      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.sinDatos}>No hay categorías para mostrar.</Text>
        }
        ListFooterComponent={
          hasMore && categorias.length > 0 ? (
            <TouchableOpacity
              style={styles.verMasBtn}
              onPress={() => cargarCategorias(false)}
            >
              <Text style={styles.verMasText}>Ver más</Text>
            </TouchableOpacity>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => navigation.navigate("CategoriaScreen")}
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
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  sinDatos: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 16,
  },
  botones: {
    flexDirection: "row",
    gap: 10,
  },
  botonEditar: {
    backgroundColor: "#1e88e5",
    padding: 8,
    borderRadius: 50,
    marginRight: 5,
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
