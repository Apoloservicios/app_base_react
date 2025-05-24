// Formatear fecha
export const formatDate = (date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Fecha inválida';
  }
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Argentina/Buenos_Aires',
  };
  
  switch (format) {
    case 'short':
      options.day = '2-digit';
      options.month = '2-digit';
      options.year = 'numeric';
      break;
    case 'long':
      options.day = 'numeric';
      options.month = 'long';
      options.year = 'numeric';
      break;
    case 'time':
      options.hour = '2-digit';
      options.minute = '2-digit';
      break;
  }
  
  return dateObj.toLocaleDateString('es-AR', options);
};

// Formatear tiempo relativo (hace X tiempo)
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInSeconds < 60) {
    return 'Ahora';
  } else if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} min`;
  } else if (diffInHours < 24) {
    return `Hace ${diffInHours} h`;
  } else if (diffInDays < 7) {
    return `Hace ${diffInDays} d`;
  } else {
    return formatDate(dateObj, 'short');
  }
};

// Formatear nombre (capitalizar primera letra)
export const formatName = (name: string): string => {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Formatear email (convertir a minúsculas)
export const formatEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

// Formatear teléfono
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remover todos los caracteres no numéricos excepto +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Si es un número argentino (comienza con +54 o 54)
  if (cleaned.startsWith('+54') || cleaned.startsWith('54')) {
    const number = cleaned.replace('+54', '').replace('54', '');
    if (number.length === 10) {
      // Formato: +54 11 1234-5678
      return `+54 ${number.slice(0, 2)} ${number.slice(2, 6)}-${number.slice(6)}`;
    }
  }
  
  return cleaned;
};

// Truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength - 3) + '...';
};

// Generar iniciales del nombre
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

// Formatear tamaño de archivo
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validar y formatear URL
export const formatUrl = (url: string): string => {
  if (!url) return '';
  
  // Si no tiene protocolo, agregar https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  
  return url;
};

// Capitalizar primera letra de cada palabra
export const capitalizeWords = (text: string): string => {
  if (!text) return '';
  
  return text.replace(/\b\w/g, char => char.toUpperCase());
};

// Remover acentos y caracteres especiales
export const removeAccents = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, '');
};