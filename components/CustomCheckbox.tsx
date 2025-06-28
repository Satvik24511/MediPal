import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, checked, onPress }) => {
  return (
    <TouchableOpacity style={customCheckboxStyles.checkboxContainer} onPress={onPress}>
      <View style={[customCheckboxStyles.checkbox, checked && customCheckboxStyles.checked]}>
        {checked && <MaterialCommunityIcons name="check" size={16} color="#fff" />}
      </View>
      <Text style={customCheckboxStyles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const customCheckboxStyles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  checked: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  label: {
    fontSize: 18,
    color: '#333',
  },
});
