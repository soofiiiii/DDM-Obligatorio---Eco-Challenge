import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AdminPanelScreen from "../screens/Admin/AdminPanelScreen";
import RetoScreen from "../screens/Retos/RetoScreen";
import MaterialScreen from "../screens/Materiales/MaterialScreen";
import CategoriaScreen from "../screens/Categorias/CategoriaScreen";
import RevisionesScreen from "../screens/Revisiones/RevisionesScreen";
import RevisarRetoScreen from "../screens/Revisiones/RevisarRetoScreen";
import ListaRetosAdminScreen from "../screens/Retos/ListaRetosAdminScreen";
import ListaMaterialesAdminScreen from "../screens/Materiales/ListaMaterialesAdminScreen";
import ListaCategoriasAdminScreen from "../screens/Categorias/ListaCategoriasAdminScreen";
import EstadisticasZonaScreen from "../screens/Estadisticas/EstadisticasZonaScreen";

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
        component={ListaMaterialesAdminScreen}
        options={{ title: "Materiales" }}
      />
      <Stack.Screen
        name="MaterialScreen"
        component={MaterialScreen}
        options={{ title: "Materiales" }}
      />
      <Stack.Screen
        name="ABMCategorias"
        component={ListaCategoriasAdminScreen}
        options={{ title: "Categorías" }}
      />
      <Stack.Screen
        name="CategoriaScreen"
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
      <Stack.Screen
        name="EstadisticasZona"
        component={EstadisticasZonaScreen}
        options={{ title: "Estadísticas por Zona" }}
      />
    </Stack.Navigator>
  );
}
