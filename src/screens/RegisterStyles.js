import { StyleSheet, Dimensions } from 'react-native';

// Colores de la aplicación
const COLORS = {
  primaryGreen: '#4CAF50',
  lightGreen: '#8BC34A',
  darkGreen: '#2E7D32',
  accentBlue: '#00BCD4',
  lightGray: '#F5F5F5',
  mediumGray: '#BDBDBD',
  darkText: '#212121',
  white: '#FFFFFF',
  gold: '#FFEB3B',
  darkOverlay: 'rgba(0,0,0,0.6)',
  // Asegúrate de que este color esté definido si no lo tienes:
  red: '#F44336', // Usado para el botón "Cancelar" en el modal de imagen
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    backgroundColor: COLORS.lightGray, // Fondo claro para el formulario
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.darkGreen, // Título en verde oscuro
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 55,
    borderColor: COLORS.mediumGray, // Borde gris claro
    borderWidth: 1,
    borderRadius: 12, // Bordes redondeados suaves
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: COLORS.white, // Fondo blanco para inputs
    color: COLORS.darkText,
    shadowColor: '#000', // Sombra sutil para profundidad
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.mediumGray,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    height: 55,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.darkText,
  },
  eyeIcon: {
    padding: 15,
  },
  passwordStrengthBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0', // Fondo de la barra gris claro
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
    width: '100%',
  },
  passwordStrengthBar: {
    height: '100%',
    borderRadius: 4,
  },
  passwordErrorText: {
    color: '#D32F2F', // Rojo para errores
    fontSize: 13,
    marginBottom: 5,
    alignSelf: 'flex-start', // Alinear errores a la izquierda
    paddingLeft: 5,
  },
  photoPickerButton: {
    backgroundColor: COLORS.accentBlue, // Botón de elegir foto en azul
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  photoPickerButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  foto: {
    width: 120,
    height: 120,
    borderRadius: 60, // Totalmente redondo
    marginTop: -5, // Para acercar la imagen al botón
    marginBottom: 25,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: COLORS.primaryGreen, // Borde verde para la foto
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  registerButtonContainer: {
    marginTop: 20,
    width: '100%',
  },
  registerButton: {
    backgroundColor: COLORS.primaryGreen, // Botón de registro en verde primario
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  datePickerButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.mediumGray,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  datePickerText: {
    color: COLORS.darkText,
    fontSize: 16,
  },

  // === NUEVOS ESTILOS PARA EL MODAL DE SELECCIÓN DE IMAGEN ===
  imageSourceOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Alinea el contenido en la parte inferior
    backgroundColor: COLORS.darkOverlay, // Fondo semi-transparente oscuro
  },
  imageSourceContent: {
    backgroundColor: COLORS.white, // Fondo blanco para el contenido del modal
    padding: 25,
    borderTopLeftRadius: 25, // Bordes redondeados en la parte superior
    borderTopRightRadius: 25,
    alignItems: 'center',
    // Sombras para darle un efecto elevado
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 }, // Sombra hacia arriba
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  imageSourceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    color: COLORS.darkText,
  },
  imageSourceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // Ocupa todo el ancho disponible
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray, // Separador sutil
  },
  imageSourceIcon: {
    marginRight: 20,
    color: COLORS.darkText,
  },
  imageSourceOptionText: {
    fontSize: 18,
    color: COLORS.darkText,
  },
  // Estilo para el botón de cancelar dentro del modal
  cancelButton: {
    marginTop: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    backgroundColor: COLORS.red, // Rojo para cancelar, o algún color de "error" de tu tema
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  cancelButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
