import { StyleSheet } from 'react-native';

export const crearStylesTarjetaParticipaciones = (theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    width: '100%',
    elevation: 4,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 15,
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.inputBackground || theme.lightGray,
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  foto: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: theme.border || theme.lightGray,
  },
  fotoPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: theme.border || theme.lightGray,
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  nombreReto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  comentario: {
    fontSize: 14,
    color: theme.textSecondary || '#888',
    marginBottom: 4,
  },
  estado: {
    fontSize: 13,
    color: theme.text,
  },
  estadoValor: {
    fontWeight: 'bold',
    color: theme.primary,
  },
  acciones: {
    flexDirection: 'row',
    gap: 10,
  },
  botonAccion: {
    padding: 6,
  },
  noParticipaciones: {
    fontSize: 15,
    color: theme.textSecondary || '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
});
