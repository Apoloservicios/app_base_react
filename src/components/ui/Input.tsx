import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { InputProps } from '../../types';
import { SPACING, FONTS, BORDER_RADIUS } from '../../constants';

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  icon,
  style,
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = !!error;
  const isPasswordField = secureTextEntry;

  const getContainerStyle = () => ({
    borderWidth: 2,
    borderColor: hasError 
      ? colors.error 
      : isFocused 
        ? colors.primary 
        : colors.current.border,
    backgroundColor: disabled 
      ? colors.current.surface 
      : colors.current.card,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: multiline ? SPACING.md : SPACING.sm,
    minHeight: multiline ? numberOfLines * 24 + SPACING.lg : 48,
    opacity: disabled ? 0.6 : 1,
  });

  const getInputStyle = () => ({
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: colors.current.text,
    paddingVertical: 0,
    textAlignVertical: multiline ? 'top' as const : 'center' as const,
  });

  const getLabelStyle = () => ({
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: hasError 
      ? colors.error 
      : isFocused 
        ? colors.primary 
        : colors.current.textSecondary,
    marginBottom: SPACING.xs,
  });

  const getErrorStyle = () => ({
    fontSize: FONTS.sizes.sm,
    color: colors.error,
    marginTop: SPACING.xs,
  });

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Text style={getLabelStyle()}>{label}</Text>
      )}
      
      <View style={[styles.container, getContainerStyle()]}>
        {icon && (
          <Ionicons
            name={icon as any}
            size={20}
            color={colors.current.textSecondary}
            style={styles.icon}
          />
        )}
        
        <TextInput
          style={getInputStyle()}
          placeholder={placeholder}
          placeholderTextColor={colors.current.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPasswordField && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCorrect={false}
          spellCheck={false}
        />
        
        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={colors.current.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {hasError && (
        <Text style={getErrorStyle()}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: SPACING.sm,
  },
  passwordToggle: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
});