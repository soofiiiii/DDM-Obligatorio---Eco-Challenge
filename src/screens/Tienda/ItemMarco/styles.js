import { StyleSheet } from 'react-native';

export const crearItemMarcoStyles = (theme) =>
  StyleSheet.create({
    container: {
      width: 100,
      height: 100,
      backgroundColor: theme.card,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 4,
      position: 'relative',
      overflow: 'hidden',
    },
    imagen: {
      width: 72,
      height: 72,
    },
    containerAdquirido: {
      borderColor: theme.primary,
      borderWidth: 2,
    },
    overlayAdquirido: {
      position: 'absolute',
      backgroundColor: theme.primary,
      opacity: 0.15,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 16,
    },
  });
