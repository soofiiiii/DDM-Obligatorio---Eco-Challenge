import { StyleSheet } from 'react-native';

export const crearBotonParticiparStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginTop: 20,
      alignItems: 'center',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 12,
      borderRadius: 10,
      justifyContent: 'center',
      minWidth: 220,
      backgroundColor: theme.primary,
    },
    buttonDisabled: {
      backgroundColor: theme.disabled,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.white,
    },
  });
