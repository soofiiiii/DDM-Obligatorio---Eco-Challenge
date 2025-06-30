import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from "./AppNavigator";
import EditarPerfilScreen from "../screens/EditarPerfil/EditarPerfilScreen";
import BandejaNotificacionesScreen from "../screens/Notificaciones/BandejaScreen";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Stack = createNativeStackNavigator();

export default function MainStack() {
  const { theme } = useContext(ThemeContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTitleStyle: {
          color: theme.text,
        },
        headerTintColor: theme.primary,
      }}
    >
      <Stack.Screen
        name="AppTabs"
        component={AppNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Ajustes" component={EditarPerfilScreen} />
      <Stack.Screen
        name="Notificaciones"
        component={BandejaNotificacionesScreen}
      />
    </Stack.Navigator>
  );
}
