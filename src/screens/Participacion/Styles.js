import { StyleSheet } from 'react-native';

export const crearParticipacionStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
      gap: 16, // separación uniforme
    },

    // Secciones con forma de tarjeta redondeada
    tarjeta: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 1,
    },

    tituloPantalla: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 10,
    },

    botonParticiparContainer: {
      marginTop: 12,
      alignItems: 'center',
    },
  });
