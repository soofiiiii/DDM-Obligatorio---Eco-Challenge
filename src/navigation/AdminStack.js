import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AdminPanelScreen from "../screens/AdminPanelScreen";
import RetoScreen from "../screens/RetoScreen";
import MaterialScreen from "../screens/MaterialScreen";
import CategoriaScreen from "../screens/CategoriaScreen";
import RevisionesScreen from "../screens/RevisionesScreen";
import RevisarRetoScreen from "../screens/RevisarRetoScreen";
import ListaRetosAdminScreen from "../screens/ListaRetosAdminScreen";

const Stack = createStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PanelAdmin"
        component={AdminPanelScreen}
        options={{ title: "Panel de Administración" }}
      />
      <Stack.Screen
        name="ABMRetos"
        component={ListaRetosAdminScreen}
        options={{ title: "Gestión de Retos" }}
      />
      <Stack.Screen
        name="RetoScreen"
        component={RetoScreen}
        options={{ title: "Formulario de Reto" }}
      />
      <Stack.Screen
        name="ABMMateriales"
        component={MaterialScreen}
        options={{ title: "Materiales" }}
      />
      <Stack.Screen
        name="ABMCategorias"
        component={CategoriaScreen}
        options={{ title: "Categorías" }}
      />
      <Stack.Screen
        name="Revisiones"
        component={RevisionesScreen}
        options={{ title: "Revisar Participaciones" }}
      />
      <Stack.Screen
        name="RevisarReto"
        component={RevisarRetoScreen}
        options={{ title: "Participaciones del Reto" }}
      />
    </Stack.Navigator>
  );
}
