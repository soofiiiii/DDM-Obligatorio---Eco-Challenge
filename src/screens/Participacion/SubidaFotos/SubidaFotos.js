import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../../../context/ThemeContext';
import { crearSubidaFotosStyles } from './styles';

export default function SubidaFotos({ fotos, setFotos, onAbrirModal }) {
  const { theme } = useContext(ThemeContext);
  const styles = crearSubidaFotosStyles(theme);

  const eliminarFoto = (uri) => {
    Alert.alert(
      'Eliminar foto',
      '¿Estás seguro de que quieres eliminar esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () =>
            setFotos((prev) => prev.filter((fotoUri) => fotoUri !== uri)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadButton} onPress={onAbrirModal}>
        <Icon name="upload" size={18} color={theme.white} />
        <Text style={styles.uploadButtonText}>Subir foto(s)</Text>
      </TouchableOpacity>

      {fotos.length > 0 && (
        <Text style={styles.photoCountText}>
          <Icon name="image" size={16} color={theme.text} /> {fotos.length} foto(s) seleccionada(s)
        </Text>
      )}

      {fotos.length > 0 && (
        <FlatList
          data={fotos}
          keyExtractor={(uri) => uri}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => eliminarFoto(item)}
              style={styles.thumbnailContainer}
            >
              <Image source={{ uri: item }} style={styles.thumbnail} />
              <View style={styles.deleteIconOverlay}>
                <Icon name="times-circle" size={20} color="white" />
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.thumbnailsList}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
}
