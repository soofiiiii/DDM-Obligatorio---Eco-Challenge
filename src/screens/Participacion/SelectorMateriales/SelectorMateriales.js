import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../../../context/ThemeContext';
import { crearSelectorMaterialesStyles } from './styles';

export default function SelectorMateriales({
  materiales,
  materialesSeleccionados,
  setMaterialesSeleccionados,
}) {
  const { theme } = useContext(ThemeContext);
  const styles = crearSelectorMaterialesStyles(theme);

  const toggleMaterial = (id) => {
    setMaterialesSeleccionados((prev) =>
      prev.includes(id)
        ? prev.filter((matId) => matId !== id)
        : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        <Icon name="recycle" size={18} color={theme.text} /> Materiales reciclados:
      </Text>

      <View style={styles.materialesContainer}>
        {materiales.map((mat) => {
          const isSelected = materialesSeleccionados.includes(mat.id);
          return (
            <TouchableOpacity
              key={mat.id}
              onPress={() => toggleMaterial(mat.id)}
              style={[
                styles.materialChip,
                isSelected && styles.materialChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.materialChipText,
                  isSelected && styles.materialChipTextSelected,
                ]}
              >
                {mat.nombre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
