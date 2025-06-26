import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { lightTheme, darkTheme } from "../styles/theme";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const cargarTemaGuardado = async () => {
      const valor = await SecureStore.getItemAsync("modo_oscuro");
      setIsDarkMode(valor === "true");
      setThemeLoaded(true);
    };
    cargarTemaGuardado();
  }, []);

  const toggleTheme = async () => {
    const nuevoModo = !isDarkMode;
    setIsDarkMode(nuevoModo);
    await SecureStore.setItemAsync("modo_oscuro", nuevoModo.toString());
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  if (!themeLoaded) return null; // Evita parpadeo de temas

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
