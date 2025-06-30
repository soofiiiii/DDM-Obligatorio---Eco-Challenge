import { StyleSheet } from "react-native";

export const crearEstilos = (theme) =>
  StyleSheet.create({
    container: {
      padding: 20,
      flex: 1,
      backgroundColor: theme.background,
    },
    encabezado: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.text,
    },
    item: {
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      marginBottom: 12,
      backgroundColor: theme.card, // uso del color de tarjeta según tema
      borderColor: theme.text,
    },
    imagen: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 10,
    },
    textoContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    titulo: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      color: theme.text,
    },
    comentario: {
      fontSize: 14,
      color: theme.text,
    },
    estado: {
      fontSize: 14,
      marginTop: 4,
    },
    aprobado: {
      color: 'green',
    },
    rechazado: {
      color: 'red',
    },
    vacio: {
      textAlign: 'center',
      marginTop: 30,
      color: theme.text,
    },
  });
