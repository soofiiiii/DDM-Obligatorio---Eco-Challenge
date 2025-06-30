import { StyleSheet } from 'react-native';

export const crearStylesTarjetaDatos = (theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 25, 
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: theme.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icono: {
    marginRight: 10,
  },
  label: {
    fontWeight: '600',
    color: theme.text,
    marginRight: 4,
  },
  valor: {
    color: theme.text,
    flexShrink: 1,
  },
});
