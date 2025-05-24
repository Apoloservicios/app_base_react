import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { ButtonProps } from '../../types';
import { SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../constants';

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const { colors } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.lg,
    };

    // Tamaños
    const sizeStyles = {
      small: {
        paddingVertical: SPACING.sm,
        minHeight: 40,
      },
      medium: {
        paddingVertical: SPACING.md,
        minHeight: 48,
      },
      large: {
        paddingVertical: SPACING.lg,
        minHeight: 56,
      },
    };

    // Variantes
    const variantStyles = {
      primary: {
        backgroundColor: disabled ? colors.gray : colors.primary,
        ...SHADOWS.medium,
      },
      secondary: {
        backgroundColor: disabled ? colors.lightGray : colors.secondary,
        ...SHADOWS.small,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: disabled ? colors.gray : colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    return [baseStyle, sizeStyles[size], variantStyles[variant]];
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontWeight: FONTS.weights.semibold,
      textAlign: 'center' as const,
    };

    // Tamaños de texto
    const sizeStyles = {
      small: { fontSize: FONTS.sizes.sm },
      medium: { fontSize: FONTS.sizes.md },
      large: { fontSize: FONTS.sizes.lg },
    };

    // Colores según variante
    const variantStyles = {
      primary: {
        color: disabled ? colors.current.textSecondary : colors.white,
      },
      secondary: {
        color: disabled ? colors.current.textSecondary : colors.white,
      },
      outline: {
        color: disabled ? colors.gray : colors.primary,
      },
      ghost: {
        color: disabled ? colors.gray : colors.primary,
      },
    };

    return [baseStyle, sizeStyles[size], variantStyles[variant]];
  };

  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  const iconColor = 
    variant === 'primary' || variant === 'secondary' 
      ? colors.white 
      : disabled 
        ? colors.gray 
        : colors.primary;

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size={iconSize} 
          color={iconColor} 
        />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons
              name={icon as any}
              size={iconSize}
              color={iconColor}
              style={styles.icon}
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: SPACING.sm,
  },
});