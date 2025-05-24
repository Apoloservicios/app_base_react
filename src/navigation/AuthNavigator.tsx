import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { AuthStackParamList } from '../types';

// Pantallas
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  const { colors } = useTheme();

  const screenOptions = {
    headerStyle: {
      backgroundColor: colors.current.background,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 1,
      borderBottomColor: colors.current.border,
    },
    headerTitleStyle: {
      color: colors.current.text,
      fontSize: 18,
      fontWeight: '600' as const,
    },
    headerBackTitleVisible: false,
    headerTintColor: colors.primary,
    cardStyle: {
      backgroundColor: colors.current.background,
    },
  };

  return (
    <Stack.Navigator 
      initialRouteName="Welcome"
      screenOptions={screenOptions}
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ 
          title: 'Iniciar Sesión',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ 
          title: 'Crear Cuenta',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ 
          title: 'Recuperar Contraseña',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};