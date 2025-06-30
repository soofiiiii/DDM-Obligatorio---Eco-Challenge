import React, { useContext } from "react";
import { FlatList, View } from "react-native";
import { ThemeContext } from "../../../context/ThemeContext";
import { crearGridMarcosStyles } from "./styles";
import ItemMarco from "../ItemMarco/ItemMarco";

export default function GridMarcos({
  marcos,
  marcosAdquiridos,
  onSeleccionar,
}) {
  const { theme } = useContext(ThemeContext);
  const styles = crearGridMarcosStyles(theme);

  return (
    <FlatList
      data={marcos}
      keyExtractor={(item) => item.id.toString()}
      numColumns={3} 
      columnWrapperStyle={styles.fila}
      contentContainerStyle={styles.contenido}
      renderItem={({ item }) => (
        <ItemMarco
          marco={item}
          adquirido={marcosAdquiridos.includes(item.id)}
          onPress={() => onSeleccionar(item)}
        />
      )}
    />
  );
}
