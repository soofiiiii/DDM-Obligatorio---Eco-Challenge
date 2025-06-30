import { StyleSheet } from "react-native";

export const crearEditarPerfilStyles = (theme) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      backgroundColor: theme.background,
    },
    fotoContainer: {
      alignItems: "center",
      marginBottom: 16,
    },
    foto: {
      width: 130,
      height: 130,
      borderRadius: 65,
      borderWidth: 3,
      borderColor: theme.primary,
      marginBottom: 8,
    },
    fotoPlaceholder: {
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: theme.mediumGray,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    fotoPlaceholderText: {
      color: theme.white,
      fontSize: 14,
    },
    cambiarFoto: {
      color: theme.accent,
      fontSize: 14,
      marginBottom: 20,
    },
    input: {
      width: "100%",
      borderWidth: 1,
      borderColor: theme.mediumGray,
      borderRadius: 10,
      padding: 12,
      marginBottom: 14,
      color: theme.text,
      backgroundColor: theme.inputBackground,
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 30,
    },
    switchLabel: {
      fontSize: 14,
      color: theme.text,
    },
    botonGuardar: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginBottom: 30,
    },
    textoBotonGuardar: {
      color: theme.white,
      fontWeight: "bold",
      fontSize: 16,
      textAlign: "center",
    },
    linksInferiores: {
      marginTop: 40,
      alignItems: "center",
    },
    cerrarSesion: {
      color: theme.primary,
      marginBottom: 12,
      fontSize: 15,
    },
    eliminarCuenta: {
      color: theme.accent,
      fontSize: 15,
    },
  });
