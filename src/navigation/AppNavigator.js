import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";

import HomeScreen from "../screens/Home/HomeScreen";
import PerfilScreen from "../screens/Perfil/PerfilScreen";
import ParticipacionScreen from "../screens/Participacion/ParticipacionScreen";
import TiendaScreen from "../screens/Tienda/TiendaScreen";
import AdminStack from "./AdminStack";
import { AuthContext } from "../context/AuthContext";

import { ThemeContext } from "../context/ThemeContext";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { usuario } = useContext(AuthContext);

  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Perfil") {
            iconName = focused ? "user-circle" : "user-circle-o";
          } else if (route.name === "Tienda") {
            iconName = focused ? "shopping-bag" : "shopping-bag";
          } else if (route.name === "Participar") {
            iconName = focused ? "camera-retro" : "camera";
          } else if (route.name === "Admin") {
            iconName = focused ? "cogs" : "cog";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.disabled,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTitleStyle: {
          color: theme.text,
          fontWeight: "bold",
        },
        headerTintColor: theme.primary,
      })}
    >
      {usuario?.rol === "admin" ? (
        <Tab.Screen
          name="Admin"
          component={AdminStack}
          options={{ title: "Administración", headerShown: false }}
        />
      ) : (
        <>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Inicio" }}
          />
          <Tab.Screen
            name="Perfil"
            component={PerfilScreen}
            options={{ title: "Mi Perfil" }}
          />
          <Tab.Screen
            name="Tienda"
            component={TiendaScreen}
            options={{ title: "Tienda" }}
          />
          <Tab.Screen
            name="Participar"
            component={ParticipacionScreen}
            options={{ title: "Participar" }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}
