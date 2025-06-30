import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";

import LoginScreen from "../screens/Login/LoginScreen";
import RegisterScreen from "../screens/Registro/RegisterScreen";

const Tab = createBottomTabNavigator();

export default function AuthTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Login") {
            iconName = focused ? "sign-in" : "sign-in";
          } else if (route.name === "Registro") {
            iconName = focused ? "user-plus" : "user-plus";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { display: "flex" },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Login" component={LoginScreen} options={{ title: "Iniciar Sesión" }} />
      <Tab.Screen name="Registro" component={RegisterScreen} options={{ title: "Registrarse" }} />
    </Tab.Navigator>
  );
}
