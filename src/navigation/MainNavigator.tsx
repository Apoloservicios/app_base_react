import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { MainTabParamList } from '../types';
import { STRINGS } from '../constants';

// Pantallas
import { HomeScreen } from '../screens/main/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { NotificationsScreen } from '../screens/main/NotificationsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
  const { colors, isDark } = useTheme();

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
      fontSize: 20,
      fontWeight: '700' as const,
    },
    headerTintColor: colors.primary,
    tabBarStyle: {
      backgroundColor: colors.current.tabBar,
      borderTopColor: colors.current.border,
      borderTopWidth: 1,
      elevation: 8,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      height: 60,
      paddingBottom: 8,
      paddingTop: 8,
    },
    tabBarActiveTintColor: colors.current.tabBarActive,
    tabBarInactiveTintColor: colors.current.tabBarInactive,
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '600' as const,
      marginTop: 4,
    },
  };

  const getTabBarIcon = (routeName: string, focused: boolean, color: string, size: number) => {
    let iconName: keyof typeof Ionicons.glyphMap;

    switch (routeName) {
      case 'Home':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Notifications':
        iconName = focused ? 'notifications' : 'notifications-outline';
        break;
      case 'Profile':
        iconName = focused ? 'person' : 'person-outline';
        break;
      case 'Settings':
        iconName = focused ? 'settings' : 'settings-outline';
        break;
      default:
        iconName = 'help-outline';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...screenOptions,
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route.name, focused, color, size),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: STRINGS.navigation.home,
          tabBarLabel: STRINGS.navigation.home,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: STRINGS.navigation.notifications,
          tabBarLabel: STRINGS.navigation.notifications,
          tabBarBadge: undefined, // Aquí puedes agregar número de notificaciones
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: STRINGS.navigation.profile,
          tabBarLabel: STRINGS.navigation.profile,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: STRINGS.navigation.settings,
          tabBarLabel: STRINGS.navigation.settings,
        }}
      />
    </Tab.Navigator>
  );
};