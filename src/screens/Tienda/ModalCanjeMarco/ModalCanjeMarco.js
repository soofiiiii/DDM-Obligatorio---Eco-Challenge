import React, { useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { ThemeContext } from '../../../context/ThemeContext';
import { crearModalCanjeMarcoStyles } from './styles';

export default function ModalCanjeMarco({
  visible,
  marco,
  onCancelar,
  onCanjear,
  yaAdquirido,
}) {
  const { theme } = useContext(ThemeContext);
  const styles = crearModalCanjeMarcoStyles(theme);

  if (!marco) return null;

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancelar}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Image source={marco.archivo} style={styles.imagen} resizeMode="contain" />

          <Text style={styles.nombre}>{marco.nombre}</Text>

          {!yaAdquirido && (
            <Text style={styles.precio}>{`Precio: ${marco.precio} puntos`}</Text>
          )}

          {yaAdquirido && (
            <Text style={styles.yaAdquirido}>Ya tienes este marco</Text>
          )}

          <View style={styles.botones}>
            {!yaAdquirido && (
              <TouchableOpacity style={styles.btnCanjear} onPress={onCanjear}>
                <Text style={styles.textoBtnCanjear}>Canjear</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.btnCancelar} onPress={onCancelar}>
              <Text style={styles.textoBtnCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
