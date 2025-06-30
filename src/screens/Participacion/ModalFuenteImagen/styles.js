import { StyleSheet } from 'react-native';

export const crearModalFuenteImagenStyles = (theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
      padding: 20,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      backgroundColor: theme.card,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.text,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 12,
    },
    optionText: {
      fontSize: 16,
      color: theme.accent,
    },
    cancelOption: {
      backgroundColor: theme.mediumGray,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 12,
    },
    cancelText: {
      color: theme.white,
    },
  });
