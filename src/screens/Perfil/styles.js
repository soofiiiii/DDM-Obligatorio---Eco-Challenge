import { StyleSheet } from 'react-native';

export const crearPerfilStyles = (theme) => StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: theme.background,
  },
  contenidoScroll: {
    padding: 20,
    paddingBottom: 30,
  },
  cargandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  cargandoTexto: {
    marginTop: 10,
    color: theme.text,
  },
});
