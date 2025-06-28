import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientButtonProps {
  onPress: () => void;
  title: string;
  colors?: [string, string, ...string[]];
  textStyle?: TextStyle;
  buttonStyle?: ViewStyle;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  onPress,
  title,
  colors = ['#FF6F61', '#8A2BE2'] as [string, string],
  textStyle,
  buttonStyle,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[gradientButtonStyles.touchable, buttonStyle]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={gradientButtonStyles.gradient}
      >
        <Text style={[gradientButtonStyles.buttonText, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const gradientButtonStyles = StyleSheet.create({
  touchable: {
    borderRadius: 25,
    overflow: 'hidden',
    marginVertical: 10,
    width: '100%',
    alignSelf: 'center',
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
