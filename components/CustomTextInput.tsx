import React from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps, TextStyle, ViewStyle } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const CustomTextInput: React.FC<CustomTextInputProps> = ({ label, error, style, ...props }) => {
  return (
    <View style={customTextInputStyles.container}>
      {label && <Text style={customTextInputStyles.label}>{label}</Text>}
      <TextInput
        style={[customTextInputStyles.input, style, error ? customTextInputStyles.inputError : null]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text style={customTextInputStyles.errorText}>{error}</Text>}
    </View>
  );
};

const customTextInputStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
    flexShrink: 1,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    minHeight: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexShrink: 1,
  },
  inputError: {
    borderColor: '#ff6161',
    borderWidth: 2,
  },
  errorText: {
    color: '#ff6161',
    fontSize: 12,
    marginTop: 5,
  },
});
