import { StyleSheet } from 'react-native';

export const crearTiendaStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 16,
      paddingTop: 24,
    },
    titulo: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    puntosUsuario: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.primary,
      textAlign: 'center',
      marginBottom: 24,
    },
  });
