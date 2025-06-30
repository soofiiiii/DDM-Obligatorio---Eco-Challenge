import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';

import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

import { obtenerMarcosUsuario, adquirirMarco } from '../../services/marcoService';
import { updateUserPuntos } from '../../services/userService';
import { MARCOS_DISPONIBLES } from '../../utils/marcos';

import GridMarcos from './GridMarcos/GridMarcos';
import ModalCanjeMarco from './ModalCanjeMarco/ModalCanjeMarco';
import { crearTiendaStyles } from './styles';

export default function TiendaScreen() {
  const { usuario, recargarDatosPerfil } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const styles = crearTiendaStyles(theme);

  const [marcosComprados, setMarcosComprados] = useState([]);
  const [marcoSeleccionado, setMarcoSeleccionado] = useState(null);

  useEffect(() => {
    if (usuario?.email) {
      const adquiridos = obtenerMarcosUsuario(usuario.email);
      setMarcosComprados(adquiridos);
    }
  }, [usuario]);

  const manejarCompra = async (idMarco) => {
    const marco = MARCOS_DISPONIBLES.find((m) => m.id === idMarco);
    if (!marco || marcosComprados.includes(idMarco)) return;

    if (usuario.puntos < marco.precio) {
      alert('No tienes puntos suficientes');
      return;
    }

    try {
      const nuevosPuntos = usuario.puntos - marco.precio;
      const puntosActualizados = await updateUserPuntos(usuario.email, nuevosPuntos);
      if (puntosActualizados) {
        const adquirido = adquirirMarco(usuario.email, idMarco);
        if (adquirido) {
          setMarcosComprados((prev) => [...prev, idMarco]);
          recargarDatosPerfil();
        }
      }
    } catch (err) {
      console.error('Error al comprar marco:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Canjea Marcos</Text>
      <Text style={styles.puntosUsuario}>
        Tus puntos: {usuario?.puntos ?? '...'}
      </Text>

      <GridMarcos
        marcos={MARCOS_DISPONIBLES}
        marcosAdquiridos={marcosComprados}
        onSeleccionar={setMarcoSeleccionado}
      />

      <ModalCanjeMarco
        visible={!!marcoSeleccionado}
        marco={marcoSeleccionado}
        onCancelar={() => setMarcoSeleccionado(null)}
        onCanjear={() => {
          manejarCompra(marcoSeleccionado.id);
          setMarcoSeleccionado(null);
        }}
        yaAdquirido={marcosComprados.includes(marcoSeleccionado?.id)}
      />
    </View>
  );
}
