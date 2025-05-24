import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../constants';
import { formatName, getInitials } from '../../utils/format';

export const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { colors } = useTheme();

  const profileOptions = [
    { icon: 'person-outline', title: 'Editar Perfil', action: () => console.log('Editar perfil') },
    { icon: 'shield-checkmark-outline', title: 'Seguridad', action: () => console.log('Seguridad') },
    { icon: 'notifications-outline', title: 'Notificaciones', action: () => console.log('Notificaciones') },
    { icon: 'help-circle-outline', title: 'Ayuda', action: () => console.log('Ayuda') },
    { icon: 'information-circle-outline', title: 'Acerca de', action: () => console.log('Acerca de') },
  ];

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: () => signOut()
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.current.background,
    },
    scrollContent: {
      paddingBottom: SPACING.xxl,
    },
    header: {
      alignItems: 'center',
      paddingVertical: SPACING.xxl,
      paddingHorizontal: SPACING.xl,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.lg,
      ...SHADOWS.medium,
    },
    avatarText: {
      fontSize: FONTS.sizes.xxxl,
      fontWeight: FONTS.weights.bold,
      color: colors.white,
    },
    userName: {
      fontSize: FONTS.sizes.xxl,
      fontWeight: FONTS.weights.bold,
      color: colors.current.text,
      marginBottom: SPACING.xs,
      textAlign: 'center',
    },
    userEmail: {
      fontSize: FONTS.sizes.md,
      color: colors.current.textSecondary,
      textAlign: 'center',
    },
    section: {
      paddingHorizontal: SPACING.xl,
      marginBottom: SPACING.lg,
    },
    optionsList: {
      gap: SPACING.xs,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.current.card,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      borderRadius: BORDER_RADIUS.md,
      ...SHADOWS.small,
    },
    optionIcon: {
      marginRight: SPACING.md,
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: FONTS.sizes.md,
      fontWeight: FONTS.weights.medium,
      color: colors.current.text,
    },
    chevron: {
      marginLeft: SPACING.sm,
    },
    signOutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.error,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      borderRadius: BORDER_RADIUS.md,
      marginHorizontal: SPACING.xl,
      marginTop: SPACING.lg,
      ...SHADOWS.small,
    },
    signOutText: {
      fontSize: FONTS.sizes.md,
      fontWeight: FONTS.weights.semibold,
      color: colors.white,
      marginLeft: SPACING.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(user?.displayName || user?.email || 'U')}
            </Text>
          </View>
          
          <Text style={styles.userName}>
            {formatName(user?.displayName || 'Usuario')}
          </Text>
          
          <Text style={styles.userEmail}>
            {user?.email}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.optionsList}>
            {profileOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionItem}
                onPress={option.action}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={colors.current.textSecondary}
                  style={styles.optionIcon}
                />
                
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                </View>
                
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.current.textSecondary}
                  style={styles.chevron}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out" size={20} color={colors.white} />
          <Text style={styles.signOutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};