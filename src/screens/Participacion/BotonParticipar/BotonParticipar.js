import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../../../context/ThemeContext';
import { crearBotonParticiparStyles } from './styles';

export default function BotonParticipar({ onPress, isDisabled, isLoading }) {
  const { theme } = useContext(ThemeContext);
  const styles = crearBotonParticiparStyles(theme);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={onPress}
        disabled={isDisabled}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={theme.white} />
        ) : (
          <>
            <Icon name="paper-plane" size={18} color={theme.white} />
            <Text style={styles.buttonText}>Enviar participación</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
