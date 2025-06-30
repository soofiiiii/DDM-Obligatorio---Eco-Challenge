import { StyleSheet } from 'react-native';

export const crearStylesTarjetaEstadisticas = (theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    width: '100%',
  },
  box: {
    backgroundColor: theme.card,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '45%',
    shadowColor: theme.shadowColor || '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 4,
  },
  valor: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.primary,
  },
});
