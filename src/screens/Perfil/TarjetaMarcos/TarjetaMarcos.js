import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../../../context/ThemeContext';
import { crearStylesTarjetaMarcos } from './styles';

export default function TarjetaMarcos({ marcos, marcoSeleccionado, onSeleccionar, onIrTienda }) {
  const { theme } = useContext(ThemeContext);
  const styles = crearStylesTarjetaMarcos(theme);

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Tus Marcos Adquiridos</Text>

      {marcos.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listaMarcosContent}
          style={styles.listaMarcos}
        >
          {marcos.map((marco) => (
            <TouchableOpacity
              key={marco.id}
              onPress={() => onSeleccionar(marco.id)}
              style={styles.marcoMiniaturaWrapper}
            >
              <Image
                source={marco.archivo}
                style={[
                  styles.marcoMiniatura,
                  marcoSeleccionado === marco.archivo && styles.marcoMiniaturaSeleccionado,
                ]}
              />
              {marcoSeleccionado === marco.archivo && (
                <View style={styles.selectedOverlay}>
                  <Icon name="check-circle" size={28} color={theme.card} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noMarcosContainer}>
          <Icon name="frown-o" size={30} color={theme.textSecondary || '#999'} style={styles.noMarcosIcon} />
          <Text style={styles.noMarcosText}>¡Aún no tienes marcos!</Text>
          <Text style={styles.noMarcosSubText}>Completa retos para desbloquear diseños únicos.</Text>
        </View>
      )}

      <TouchableOpacity style={styles.botonTienda} onPress={onIrTienda}>
        <Icon name="shopping-bag" size={18} color={theme.card} style={styles.botonTiendaIcon} />
        <Text style={styles.botonTiendaTexto}>Explorar Tienda de Marcos</Text>
      </TouchableOpacity>
    </View>
  );
}
