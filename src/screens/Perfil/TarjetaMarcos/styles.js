import { StyleSheet } from 'react-native';

export const crearStylesTarjetaMarcos = (theme) => StyleSheet.create({
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
  },
  listaMarcos: {
    marginBottom: 15,
  },
  listaMarcosContent: {
    paddingHorizontal: 5,
  },
  marcoMiniaturaWrapper: {
    marginHorizontal: 6,
    position: 'relative',
  },
  marcoMiniatura: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.inputBackground || theme.lightGray,
    resizeMode: 'contain',
    borderWidth: 2,
    borderColor: theme.border || theme.lightGray,
  },
  marcoMiniaturaSeleccionado: {
    borderColor: theme.accent,
    borderWidth: 3,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  botonTienda: {
    backgroundColor: theme.accent,
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonTiendaTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.card,
    marginLeft: 8,
  },
  botonTiendaIcon: {
    marginRight: 4,
  },
  noMarcosContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  noMarcosIcon: {
    marginBottom: 5,
  },
  noMarcosText: {
    fontSize: 15,
    color: theme.textSecondary || '#999',
    fontStyle: 'italic',
  },
  noMarcosSubText: {
    fontSize: 14,
    color: theme.textSecondary || '#999',
  },
});
