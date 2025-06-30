import React, { useContext } from 'react';
import { View, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../../../context/ThemeContext';
import { crearComentarioInputStyles } from './styles';

export default function ComentarioInput({ comentario, setComentario, isLoading }) {
  const { theme } = useContext(ThemeContext);
  const styles = crearComentarioInputStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        <Icon name="comment" size={18} color={theme.text} /> Comentario (opcional):
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Escribe algo sobre tu participación..."
        placeholderTextColor={theme.mode === 'dark' ? theme.white : theme.mediumGray}
        value={comentario}
        onChangeText={setComentario}
        editable={!isLoading}
        multiline
        numberOfLines={4}
      />
    </View>
  );
}
