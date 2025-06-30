import { StyleSheet } from 'react-native';

export const crearStylesTarjetaGrafico = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: 15,
      padding: 20,
      marginBottom: 25,
      width: '100%',
      elevation: 4,
      alignItems: 'center',
    },
    header: {
      width: '100%',
      marginBottom: 15,
    },
    titulo: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 10,
    },
    filtros: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: 10,
    },
    filtroBoton: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor: theme.lightGray,
    },
    filtroActivo: {
      backgroundColor: theme.primary,
    },
    textoFiltro: {
      fontSize: 14,
      color: theme.text,
    },
    textoActivo: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.card,
    },
    grafico: {
      borderRadius: 12,
      marginTop: 10,
    },
  });
