import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { initCategorias } from './src/services/categoriaService'; // 👈 IMPORTANTE

export default function App() {
  useEffect(() => {
  console.log('App.js montado');

  const iniciarBD = async () => {
    try {
      await initCategorias(); 
      console.log('Tabla categorias inicializada correctamente');
    } catch (error) {
      console.error('Error al inicializar tabla categorias:', error);
    }
  };

  iniciarBD();
}, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
