import React, { useContext } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { ThemeContext } from "../../../context/ThemeContext";
import { crearSelectorRetosStyles } from "./styles";

export default function SelectorRetos({
  retosDisponibles,
  retoSeleccionado,
  setRetoSeleccionado,
}) {
  const { theme } = useContext(ThemeContext);
  const styles = crearSelectorRetosStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        <Icon name="trophy" size={18} color={theme.text} /> Selecciona un reto:
      </Text>

      {retoSeleccionado ? (
        <View style={styles.selectedRetoContainer}>
          <Icon
            name="check-circle"
            size={20}
            color={theme.white}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.selectedRetoText}>Reto actual:</Text>
          <Text style={styles.selectedRetoName}>{retoSeleccionado.nombre}</Text>
        </View>
      ) : (
        <Text style={styles.noRetosAvailable}>
          <Icon name="info-circle" size={16} color={theme.mediumGray} /> No hay
          un reto seleccionado o activo.
        </Text>
      )}

      {retosDisponibles.length === 0 ? (
        <Text style={styles.noRetosAvailable}>
          <Icon name="exclamation-circle" size={16} color={theme.mediumGray} />{" "}
          No hay retos activos disponibles para participar.
        </Text>
      ) : (
        <FlatList
          data={retosDisponibles}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const seleccionado = retoSeleccionado?.id === item.id;
            return (
              <TouchableOpacity
                onPress={() => setRetoSeleccionado(item)}
                style={[styles.reto, seleccionado && styles.retoActivo]}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.retoText,
                    seleccionado && styles.retoTextActivo,
                  ]}
                >
                  {item.nombre}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.retoList}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
}
