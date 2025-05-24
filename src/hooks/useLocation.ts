import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { LocationData } from '../types';

interface UseLocation {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<LocationData | null>;
  watchLocation: () => Promise<void>;
  stopWatching: () => void;
  openMaps: (latitude: number, longitude: number) => void;
}

export const useLocation = (): UseLocation => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);

  // Solicitar permisos de ubicación
  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        Alert.alert(
          'Permisos Necesarios',
          'Necesitamos acceso a tu ubicación para esta funcionalidad.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.log('Error solicitando permisos de ubicación:', error);
      return false;
    }
  };

  // Obtener ubicación actual
  const getCurrentLocation = async (): Promise<LocationData | null> => {
    try {
      setLoading(true);
      setError(null);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return null;

      console.log('📍 Obteniendo ubicación actual...');

      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData: LocationData = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
        accuracy: locationResult.coords.accuracy || undefined,
        altitude: locationResult.coords.altitude || undefined,
        heading: locationResult.coords.heading || undefined,
        speed: locationResult.coords.speed || undefined,
        timestamp: locationResult.timestamp,
      };

      setLocation(locationData);
      console.log('✅ Ubicación obtenida:', locationData);
      
      return locationData;
    } catch (error: any) {
      console.log('❌ Error obteniendo ubicación:', error);
      const errorMessage = 'No se pudo obtener la ubicación. Verifica que el GPS esté activado.';
      setError(errorMessage);
      Alert.alert('Error de Ubicación', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obtener dirección a partir de coordenadas
  const getAddressFromCoords = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResponse.length > 0) {
        const address = addressResponse[0];
        const addressParts = [
          address.street,
          address.city,
          address.region,
          address.country,
        ].filter(Boolean);
        
        return addressParts.join(', ');
      }
      
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      console.log('Error obteniendo dirección:', error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  };

  // Observar cambios de ubicación en tiempo real
  const watchLocation = async (): Promise<void> => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      console.log('👀 Iniciando seguimiento de ubicación...');

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Actualizar cada 5 segundos
          distanceInterval: 10, // O cuando se mueva 10 metros
        },
        (locationResult) => {
          const locationData: LocationData = {
            latitude: locationResult.coords.latitude,
            longitude: locationResult.coords.longitude,
            accuracy: locationResult.coords.accuracy || undefined,
            altitude: locationResult.coords.altitude || undefined,
            heading: locationResult.coords.heading || undefined,
            speed: locationResult.coords.speed || undefined,
            timestamp: locationResult.timestamp,
          };

          setLocation(locationData);
          console.log('📍 Ubicación actualizada:', locationData);
        }
      );

      setLocationSubscription(subscription);
    } catch (error) {
      console.log('Error iniciando seguimiento:', error);
      Alert.alert('Error', 'No se pudo iniciar el seguimiento de ubicación');
    }
  };

  // Detener seguimiento de ubicación
  const stopWatching = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
      console.log('🛑 Seguimiento de ubicación detenido');
    }
  };

  // Abrir en aplicación de mapas
  const openMaps = (latitude: number, longitude: number) => {
    const url = `https://maps.google.com/?q=${latitude},${longitude}`;
    console.log('🗺️ Abriendo mapas:', url);
    // En una app real, usarías Linking.openURL(url)
    Alert.alert(
      'Abrir Mapas', 
      `¿Abrir ubicación en Google Maps?\n${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir', onPress: () => console.log('Abriendo mapas...') }
      ]
    );
  };

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    watchLocation,
    stopWatching,
    openMaps,
  };
};