import React, { useContext } from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import { ThemeContext } from '../../../context/ThemeContext';
import { crearItemMarcoStyles } from './styles';

export default function ItemMarco({ marco, adquirido, onPress }) {
  const { theme } = useContext(ThemeContext);
  const styles = crearItemMarcoStyles(theme);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        adquirido ? styles.containerAdquirido : null,
      ]}
      activeOpacity={0.7}
    >
      <Image source={marco.archivo} style={styles.imagen} resizeMode="contain" />
      {adquirido && <View style={styles.overlayAdquirido} />}
    </TouchableOpacity>
  );
}
