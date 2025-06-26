import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  reto: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#f0f0f0', // Color por defecto para retos no seleccionados o inactivos
    alignItems: 'center', // Centrar texto horizontalmente
    justifyContent: 'center', // Centrar texto verticalmente
    minWidth: 120, // Ancho mínimo para cada tarjeta de reto
    height: 60, // Altura fija para la tarjeta
  },
  retoActivo: {
    backgroundColor: '#e0ffe0', // Fondo para reto seleccionado/activo
    borderColor: '#4CAF50', // Borde para reto seleccionado/activo
    borderWidth: 2,
  },
  retoInactivo: { // Nuevo estilo para retos que no se pueden participar
    backgroundColor: '#E0E0E0', // Gris claro
    borderColor: '#BDBDBD', // Borde gris
    opacity: 0.7, // Menos opaco
  },
  retoText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center', // Centrar el texto del nombre del reto
  },
  photoUploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  photoCountText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  thumbnailsList: {
    paddingVertical: 5,
    paddingHorizontal: 0,
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: 10,
    marginTop: 5,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  deleteIconOverlay: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 2,
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  activityIndicator: {},
  imageSourceOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  imageSourceContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  imageSourceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageSourceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imageSourceIcon: {
    marginRight: 15,
  },
  imageSourceOptionText: {
    fontSize: 16,
  },
  selectedRetoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0ffe0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#c0ffc0',
  },
  selectedRetoText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  selectedRetoName: {
    fontSize: 16,
    color: '#008000',
    flexShrink: 1,
  },
  noRetosAvailable: { // estilo para el mensaje cuando no hay retos activos
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  }
});

export default styles;
