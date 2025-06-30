import { StyleSheet } from 'react-native';

export const crearGridMarcosStyles = (theme) =>
  StyleSheet.create({
    contenido: {
      paddingHorizontal: 12,
      paddingBottom: 24,
      gap: 12,
    },
    fila: {
      justifyContent: 'space-between',
      marginBottom: 16,
    },
  });
