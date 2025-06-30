import { StyleSheet } from 'react-native';

export const crearSelectorMaterialesStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.text,
    },
    materialesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    materialChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.primary,
      backgroundColor: theme.card,
      marginBottom: 8,
    },
    materialChipSelected: {
      backgroundColor: theme.primary,
    },
    materialChipText: {
      fontSize: 14,
      color: theme.text,
    },
    materialChipTextSelected: {
      color: theme.white,
    },
  });
