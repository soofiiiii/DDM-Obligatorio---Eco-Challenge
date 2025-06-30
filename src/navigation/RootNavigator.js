import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";
import MainStack from "./MainStack";
import AuthTabs from "./AuthTabs";


const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { usuario, cargando } = useContext(AuthContext);

  if (cargando) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {usuario ? (
        <Stack.Screen name="Main" component={MainStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthTabs} />
      )}
    </Stack.Navigator>
  );
}
