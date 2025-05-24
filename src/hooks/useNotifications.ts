import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';
import { NotificationData } from '../types';

// Configurar comportamiento de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface UseNotifications {
  expoPushToken: string | null;
  notifications: NotificationData[];
  loading: boolean;
  sendLocalNotification: (title: string, body: string, data?: any) => Promise<void>;
  scheduleNotification: (title: string, body: string, seconds: number, data?: any) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  requestPermissions: () => Promise<boolean>;
}

export const useNotifications = (): UseNotifications => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
  const responseListener = useRef<Notifications.Subscription | undefined>(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token ?? null);
    });

    // Listener para notificaciones recibidas
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notificación recibida:', notification);
      setNotification(notification);
      
      // Agregar a la lista local
      const newNotification: NotificationData = {
        id: notification.request.identifier,
        title: notification.request.content.title || '',
        body: notification.request.content.body || '',
        data: notification.request.content.data,
        timestamp: new Date(),
        read: false,
        type: 'info',
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    });

    // Listener para respuestas a notificaciones
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notificación presionada:', response);
      
      // Marcar como leída
      const notificationId = response.notification.request.identifier;
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Registrar para notificaciones push
  const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('❌ Permisos de notificación denegados');
      return;
    }

    try {
      const projectId = ''; // Dejar vacío para desarrollo
      token = (await Notifications.getExpoPushTokenAsync({ 
        projectId 
      })).data;
      console.log('📱 Token de push:', token);
    } catch (error) {
      console.log('Error obteniendo token:', error);
    }

    return token;
  };

  // Solicitar permisos explícitamente
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos Necesarios',
          'Necesitamos permisos para enviarte notificaciones importantes.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.log('Error solicitando permisos de notificación:', error);
      return false;
    }
  };

  // Enviar notificación local inmediata
  const sendLocalNotification = async (title: string, body: string, data?: any): Promise<void> => {
    try {
      setLoading(true);
      
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: null, // Inmediata
      });

      console.log('✅ Notificación local enviada');
    } catch (error) {
      console.log('❌ Error enviando notificación:', error);
      Alert.alert('Error', 'No se pudo enviar la notificación');
    } finally {
      setLoading(false);
    }
  };

  // Programar notificación para más tarde
  const scheduleNotification = async (title: string, body: string, seconds: number, data?: any): Promise<void> => {
    try {
      setLoading(true);
      
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: { seconds } as any, // Forzar tipo para evitar conflictos de versión
      });

      console.log(`⏰ Notificación programada para ${seconds} segundos con ID: ${identifier}`);
      Alert.alert(
        'Notificación Programada',
        `La notificación se enviará en ${seconds} segundos`
      );
    } catch (error) {
      console.log('❌ Error programando notificación:', error);
      Alert.alert('Error', 'No se pudo programar la notificación');
    } finally {
      setLoading(false);
    }
  };

  // Cancelar todas las notificaciones pendientes
  const cancelAllNotifications = async (): Promise<void> => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('🚫 Todas las notificaciones canceladas');
      Alert.alert('Notificaciones Canceladas', 'Se cancelaron todas las notificaciones pendientes');
    } catch (error) {
      console.log('❌ Error cancelando notificaciones:', error);
    }
  };

  return {
    expoPushToken,
    notifications,
    loading,
    sendLocalNotification,
    scheduleNotification,
    cancelAllNotifications,
    requestPermissions,
  };
};