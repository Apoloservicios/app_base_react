import { useState, useCallback } from 'react';

interface UseFormProps<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void> | void;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: () => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: () => void;
  isValid: boolean;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormProps<T>): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validar todos los campos
  const validateForm = useCallback((formValues: T): Partial<Record<keyof T, string>> => {
    if (!validate) return {};
    return validate(formValues);
  }, [validate]);

  // Verificar si el formulario es válido
  const isValid = Object.keys(validateForm(values)).length === 0;

  // Manejar cambio de valor en un campo
  const handleChange = useCallback((field: keyof T) => (value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);

  // Manejar cuando un campo pierde el foco
  const handleBlur = useCallback((field: keyof T) => () => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // Validar solo este campo
    if (validate) {
      const fieldErrors = validate(values);
      if (fieldErrors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: fieldErrors[field]
        }));
      }
    }
  }, [values, validate]);

  // Establecer valor de un campo específico
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Establecer error de un campo específico
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);

      // Marcar todos los campos como tocados
      const allTouched = Object.keys(values).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {});
      setTouched(allTouched);

      // Validar formulario completo
      const formErrors = validateForm(values);
      
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      // Limpiar errores y enviar
      setErrors({});
      await onSubmit(values);
    } catch (error: any) {
      console.log('Error en handleSubmit:', error);
      
      // Si el error contiene información sobre campos específicos
      if (error.fieldErrors) {
        setErrors(error.fieldErrors);
      } else {
        // Error general
        throw error;
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    isValid,
  };
};