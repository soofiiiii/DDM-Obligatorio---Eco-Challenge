import React, { useContext } from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../../../context/ThemeContext';
import { crearModalFuenteImagenStyles } from './styles';

export default function ModalFuenteImagen({
  visible,
  onCerrar,
  onCamara,
  onGaleria,
}) {
  const { theme } = useContext(ThemeContext);
  const styles = crearModalFuenteImagenStyles(theme);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCerrar}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={onCerrar}
      >
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>
            <Icon name="camera" size={20} color={theme.text} /> Seleccionar fuente de imagen
          </Text>

          <TouchableOpacity style={styles.option} onPress={onCamara}>
            <Icon name="camera" size={22} color={theme.accent} />
            <Text style={styles.optionText}>Tomar foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={onGaleria}>
            <Icon name="image" size={22} color={theme.accent} />
            <Text style={styles.optionText}>Elegir de galería</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, styles.cancelOption]}
            onPress={onCerrar}
          >
            <Icon name="times-circle" size={22} color={theme.white} />
            <Text style={[styles.optionText, styles.cancelText]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
