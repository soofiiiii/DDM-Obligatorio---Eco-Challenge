import { StyleSheet } from "react-native";

const FOTO_SIZE = 140;
const MARCO_CONTAINER_SIZE = FOTO_SIZE + 60;

export default function crearStyles(theme) {
  return StyleSheet.create({
    container: {
      alignItems: "center",
      marginBottom: 25,
      marginTop: 25,
      backgroundColor: theme.background,
    },
    fotoMarcoContainer: {
      width: 140,
      height: 140,
      borderRadius: 70,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      marginBottom: 10,
    },
    marcoContainer: {
      position: "absolute",
      width: MARCO_CONTAINER_SIZE,
      height: MARCO_CONTAINER_SIZE,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2,
    },
    fotoPerfil: {
      width: FOTO_SIZE,
      height: FOTO_SIZE,
      borderRadius: FOTO_SIZE / 2,
      resizeMode: "cover",
      zIndex: 1,
    },
    marcoPerfil: {
      position: "absolute",
      width: "100%",
      height: "100%",
      resizeMode: "contain",
      zIndex: 2,
    },
    changePhotoOverlay: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderRadius: 70,
    },
    placeholderFoto: {
      alignItems: "center",
      justifyContent: "center",
    },
    noFotoText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 5,
    },
    iconColor: {
      color: theme.text,
    },
    nombreUsuario: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.text,
      marginTop: 20,
      marginBottom: 5,
    },
    nivelTexto: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 5,
    },
    valorNivel: {
      fontWeight: "bold",
      color: theme.primary,
    },
    progressBarFondo: {
      height: 10,
      width: "80%",
      backgroundColor: theme.border,
      borderRadius: 5,
      overflow: "hidden",
    },
    progressBarRelleno: {
      height: "100%",
      backgroundColor: theme.primary,
      borderRadius: 5,
    },
    porcentajeTexto: {
      marginTop: 5,
      fontSize: 13,
      color: theme.text,
    },
  });
}
