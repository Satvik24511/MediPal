import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ModalMessageProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const ModalMessage: React.FC<ModalMessageProps> = ({ visible, message, type, onClose }) => {
  let iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  let iconColor: string;
  let backgroundColor: string;

  switch (type) {
    case 'success':
      iconName = 'check-circle';
      iconColor = '#28a745';
      backgroundColor = '#d4edda';
      break;
    case 'error':
      iconName = 'alert-circle';
      iconColor = '#dc3545';
      backgroundColor = '#f8d7da';
      break;
    case 'info':
    default:
      iconName = 'information';
      iconColor = '#007bff';
      backgroundColor = '#d1ecf1';
      break;
  }

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={modalMessageStyles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[modalMessageStyles.modalContainer, { backgroundColor }]}>
          <MaterialCommunityIcons name={iconName} size={40} color={iconColor} style={modalMessageStyles.icon} />
          <Text style={modalMessageStyles.messageText}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={modalMessageStyles.closeButton}>
            <Text style={modalMessageStyles.closeButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const modalMessageStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginBottom: 15,
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
