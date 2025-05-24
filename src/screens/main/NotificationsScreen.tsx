import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../constants';
import { formatRelativeTime } from '../../utils/format';

export const NotificationsScreen: React.FC = () => {
  const { colors } = useTheme();

  // Datos de ejemplo - en una app real vendrían de la API
  const notifications = [
    {
      id: '1',
      title: 'Bienvenido a la aplicación',
      body: 'Gracias por registrarte. Explora todas las funcionalidades disponibles.',
      type: 'info' as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // hace 2 horas
      read: false,
    },
    {
      id: '2',
      title: 'Perfil actualizado',
      body: 'Tu información de perfil se ha actualizado correctamente.',
      type: 'success' as const,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // hace 1 día
      read: true,
    },
    {
      id: '3',
      title: 'Configuración de seguridad',
      body: 'Se recomienda activar la autenticación biométrica para mayor seguridad.',
      type: 'warning' as const,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // hace 3 días
      read: true,
    },
    {
      id: '4',
      title: 'Nueva funcionalidad',
      body: 'Ahora puedes cambiar entre tema claro y oscuro en configuración.',
      type: 'info' as const,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // hace 1 semana
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'alert-circle';
      default:
        return 'information-circle';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      default:
        return colors.info;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.current.background,
    },
    scrollContent: {
      paddingHorizontal: SPACING.xl,
      paddingBottom: SPACING.xxl,
    },
    header: {
      paddingVertical: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.current.border,
      marginHorizontal: SPACING.xl,
      marginBottom: SPACING.lg,
    },
    headerTitle: {
      fontSize: FONTS.sizes.xxl,
      fontWeight: FONTS.weights.bold,
      color: colors.current.text,
    },
    headerSubtitle: {
      fontSize: FONTS.sizes.md,
      color: colors.current.textSecondary,
      marginTop: SPACING.xs,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xxl * 2,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.current.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    emptyTitle: {
      fontSize: FONTS.sizes.lg,
      fontWeight: FONTS.weights.semibold,
      color: colors.current.text,
      marginBottom: SPACING.sm,
    },
    emptyText: {
      fontSize: FONTS.sizes.md,
      color: colors.current.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    notificationsList: {
      gap: SPACING.sm,
    },
    notificationItem: {
      flexDirection: 'row',
      backgroundColor: colors.current.card,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      ...SHADOWS.small,
    },
    notificationItemUnread: {
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    notificationIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },
    notificationContent: {
      flex: 1,
    },
    notificationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: SPACING.xs,
    },
    notificationTitle: {
      flex: 1,
      fontSize: FONTS.sizes.md,
      fontWeight: FONTS.weights.semibold,
      color: colors.current.text,
      marginRight: SPACING.sm,
    },
    notificationTime: {
      fontSize: FONTS.sizes.xs,
      color: colors.current.textSecondary,
    },
    notificationBody: {
      fontSize: FONTS.sizes.sm,
      color: colors.current.textSecondary,
      lineHeight: 18,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginLeft: SPACING.xs,
      marginTop: 2,
    },
    clearAllButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.md,
      marginTop: SPACING.lg,
    },
    clearAllText: {
      fontSize: FONTS.sizes.md,
      color: colors.primary,
      fontWeight: FONTS.weights.medium,
    },
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          <Text style={styles.headerSubtitle}>No hay notificaciones</Text>
        </View>
        
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons 
              name="notifications-outline" 
              size={40} 
              color={colors.current.textSecondary} 
            />
          </View>
          <Text style={styles.emptyTitle}>Sin notificaciones</Text>
          <Text style={styles.emptyText}>
            Cuando tengas notificaciones,{'\n'}aparecerán aquí.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <Text style={styles.headerSubtitle}>
          {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.notificationsList}>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.read && styles.notificationItemUnread,
              ]}
              activeOpacity={0.8}
              onPress={() => console.log('Notificación seleccionada:', notification.id)}
            >
              <View style={[
                styles.notificationIcon,
                { backgroundColor: `${getNotificationColor(notification.type)}15` }
              ]}>
                <Ionicons
                  name={getNotificationIcon(notification.type) as any}
                  size={20}
                  color={getNotificationColor(notification.type)}
                />
              </View>
              
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.notificationTime}>
                      {formatRelativeTime(notification.timestamp)}
                    </Text>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </View>
                </View>
                
                <Text style={styles.notificationBody}>
                  {notification.body}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {notifications.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={() => console.log('Marcar todas como leídas')}
          >
            <Text style={styles.clearAllText}>
              Marcar todas como leídas
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};