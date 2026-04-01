import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface TextInputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
}

const TextInputField = React.forwardRef<TextInput, TextInputFieldProps>(
  ({ label, error, helperText, placeholderTextColor, ...props }, ref) => {
    return (
      <View className="gap-2">
        <Text className="text-sm font-sans-semibold text-primary">{label}</Text>
        <TextInput
          ref={ref}
          className="rounded-lg border border-border bg-card px-4 py-3 font-sans-regular text-base text-primary placeholder:text-muted-foreground"
          placeholderTextColor={placeholderTextColor || '#999'}
          {...props}
        />
        {error && (
          <Text className="text-xs font-sans-regular text-destructive">{error}</Text>
        )}
        {helperText && !error && (
          <Text className="text-xs font-sans-regular text-muted-foreground">{helperText}</Text>
        )}
      </View>
    );
  }
);

TextInputField.displayName = 'TextInputField';

export default TextInputField;
