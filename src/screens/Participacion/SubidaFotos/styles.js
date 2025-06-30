import { StyleSheet } from "react-native";

export const crearSubidaFotosStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    uploadButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 14,
      backgroundColor: theme.success ?? theme.primary,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    uploadButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.white,
    },

    photoCountText: {
      marginTop: 8,
      fontStyle: "italic",
      color: theme.text,
    },
    thumbnailContainer: {
      marginRight: 10,
      position: "relative",
    },
    thumbnail: {
      width: 80,
      height: 80,
      borderRadius: 8,
    },
    deleteIconOverlay: {
      position: "absolute",
      top: -6,
      right: -6,
      backgroundColor: "rgba(0,0,0,0.6)",
      borderRadius: 12,
      padding: 2,
    },
    thumbnailsList: {
      marginTop: 10,
    },
  });
