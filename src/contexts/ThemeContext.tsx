import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContextType, ThemeType } from '../types';
import { COLORS, APP_CONFIG } from '../constants';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [isLoading, setIsLoading] = useState(true);

  // Determinar si el tema actual es oscuro
  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');

  // Obtener colores según el tema actual
  const colors = isDark ? COLORS.dark : COLORS.light;

  // Cargar tema guardado al iniciar
  useEffect(() => {
    loadSavedTheme();
  }, []);

  // Guardar tema cuando cambie
  useEffect(() => {
    if (!isLoading) {
      saveTheme(theme);
    }
  }, [theme, isLoading]);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(APP_CONFIG.themeKey);
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
        setThemeState(savedTheme as ThemeType);
      }
    } catch (error) {
      console.log('Error cargando tema:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem(APP_CONFIG.themeKey, newTheme);
    } catch (error) {
      console.log('Error guardando tema:', error);
    }
  };

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    isDark,
    setTheme,
    colors: {
      ...COLORS,
      current: colors
    }
  };

  // No renderizar hasta que se cargue el tema
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};