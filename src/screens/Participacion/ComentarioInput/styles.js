import { StyleSheet } from 'react-native';

export const crearComentarioInputStyles = (theme) =>
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
    input: {
      borderRadius: 10,
      padding: 12,
      fontSize: 14,
      borderWidth: 1,
      borderColor: theme.mediumGray,
      backgroundColor: theme.inputBackground,
      color: theme.text,
      textAlignVertical: 'top',
    },
  });
