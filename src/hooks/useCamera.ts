import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

interface UseCamera {
  loading: boolean;
  takePhoto: () => Promise<string | null>;
  pickFromGallery: () => Promise<string | null>;
  showImageOptions: () => Promise<string | null>;
}

export const useCamera = (): UseCamera => {
  const [loading, setLoading] = useState(false);

  // Verificar y solicitar permisos de cámara
  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos Necesarios',
          'Necesitamos acceso a la cámara para tomar fotos.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.log('Error solicitando permisos de cámara:', error);
      return false;
    }
  };

  // Verificar y solicitar permisos de galería
  const requestGalleryPermission = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos Necesarios',
          'Necesitamos acceso a la galería para seleccionar fotos.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.log('Error solicitando permisos de galería:', error);
      return false;
    }
  };

  // Tomar foto con la cámara
  const takePhoto = async (): Promise<string | null> => {
    try {
      setLoading(true);
      
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('📷 Foto tomada:', result.assets[0].uri);
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.log('Error tomando foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar desde galería
  const pickFromGallery = async (): Promise<string | null> => {
    try {
      setLoading(true);
      
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('🖼️ Imagen seleccionada:', result.assets[0].uri);
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.log('Error seleccionando imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Mostrar opciones de imagen
  const showImageOptions = (): Promise<string | null> => {
    return new Promise((resolve) => {
      Alert.alert(
        'Seleccionar Imagen',
        'Elige una opción',
        [
          {
            text: 'Cámara',
            onPress: async () => {
              const result = await takePhoto();
              resolve(result);
            },
          },
          {
            text: 'Galería',
            onPress: async () => {
              const result = await pickFromGallery();
              resolve(result);
            },
          },
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => resolve(null),
          },
        ]
      );
    });
  };

  return {
    loading,
    takePhoto,
    pickFromGallery,
    showImageOptions,
  };
};