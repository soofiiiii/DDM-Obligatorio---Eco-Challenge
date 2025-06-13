import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import EstadisticasScreen from '../screens/EstadisticasScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import MaterialScreen from '../screens/MaterialScreen';
import RetoScreen from '../screens/RetoScreen';
import ParticipacionScreen from '../screens/ParticipacionScreen';

import { AuthContext } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { usuario, cargando } = useContext(AuthContext);
  if (cargando) return null;

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      {usuario ? (
        <>
          <Tab.Screen name="Perfil" component={PerfilScreen} />
          <Tab.Screen name="Estadísticas" component={EstadisticasScreen} />
          <Tab.Screen name="Materiales" component={MaterialScreen} />
          <Tab.Screen name="Retos" component={RetoScreen} />
          <Tab.Screen name="Participar" component={ParticipacionScreen} />
        </>
      ) : (
        <>
          <Tab.Screen name="Login" component={LoginScreen} />
          <Tab.Screen name="Registro" component={RegisterScreen} />
        </>
      )}
    </Tab.Navigator>
  );
}
