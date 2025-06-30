import { StyleSheet } from 'react-native';

export const crearModalCanjeMarcoStyles = (theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      width: '80%',
    },
    imagen: {
      width: 100,
      height: 100,
      marginBottom: 16,
    },
    nombre: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    precio: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 16,
    },
    yaAdquirido: {
      fontSize: 16,
      color: theme.mediumGray,
      marginBottom: 16,
      fontStyle: 'italic',
    },
    botones: {
      flexDirection: 'row',
      gap: 12,
    },
    btnCanjear: {
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
    },
    textoBtnCanjear: {
      color: theme.white,
      fontWeight: 'bold',
    },
    btnCancelar: {
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
    },
    textoBtnCancelar: {
      color: theme.white,
      fontWeight: 'bold',
    },
  });
