import { StyleSheet } from "react-native";

export const crearSelectorRetosStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
      color: theme.text,
    },
    selectedRetoContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      padding: 12,
      marginBottom: 10,
      backgroundColor: theme.accent, // color más agradable
    },
    selectedRetoText: {
      fontWeight: "bold",
      marginRight: 6,
      color: theme.white,
    },
    selectedRetoName: {
      fontStyle: "italic",
      color: theme.white,
      maxWidth: 180,
    },
    noRetosAvailable: {
      fontSize: 14,
      fontStyle: "italic",
      marginBottom: 10,
      color: theme.mediumGray,
    },
    reto: {
      backgroundColor: theme.card,
      borderRadius: 999,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginRight: 8,
      maxWidth: 180, // evita que el texto ocupe toda la pantalla
      alignItems: "center",
      justifyContent: "center",
    },
    retoActivo: {
      backgroundColor: theme.primaryMuted ?? theme.primary,
    },
    retoText: {
      fontSize: 14,
      color: theme.text,
      flexShrink: 1,
      maxWidth: 160,
      textAlign: "center",
    },
    retoTextActivo: {
      color: theme.white,
    },
    retoList: {
      paddingRight: 10,
    },
  });
