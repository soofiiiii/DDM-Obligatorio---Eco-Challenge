import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from "./AppNavigator";
import EditarPerfilScreen from "../screens/EditarPerfilScreen";
import BandejaNotificacionesScreen from "../screens/BandejaScreen";

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AppTabs" component={AppNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
      <Stack.Screen name="BandejaNotificaciones" component={BandejaNotificacionesScreen} />
    </Stack.Navigator>
  );
}
