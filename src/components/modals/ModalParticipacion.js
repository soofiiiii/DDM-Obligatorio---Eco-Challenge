import React, { useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../../context/ThemeContext';
import styles from './styles';

export default function ModalParticipacion({
  visible,
  participacion,
  comentario,
  setComentario,
  fotos = [], 
  setFotos,
  onAgregarFoto,
  onGuardar,
  onCancelar,
  onEliminarFoto,
}) {
  const { theme } = useContext(ThemeContext);

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onCancelar}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: theme.card }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Editar Participación</Text>

          {Array.isArray(fotos) && fotos.length > 0 && (
            <FlatList
              horizontal
              data={fotos}
              keyExtractor={(uri, index) => uri + index} 
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => onEliminarFoto(item)}
                  style={styles.thumbnailWrapper}
                >
                  <Image source={{ uri: item }} style={styles.thumbnail} />
                  <View style={styles.overlayIcon}>
                    <Icon name="times-circle" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailList}
            />
          )}

          <TouchableOpacity style={styles.addPhotoButton} onPress={onAgregarFoto}>
            <Icon name="camera" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.addPhotoButtonText}>Agregar Foto(s)</Text>
          </TouchableOpacity>

          <TextInput
            style={[
              styles.textInput,
              {
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="Comentario"
            placeholderTextColor={theme.textSecondary}
            multiline
            value={comentario}
            onChangeText={setComentario}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancelar}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={onGuardar}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
