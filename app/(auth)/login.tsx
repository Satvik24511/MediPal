import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomTextInput } from '../../components/CustomTextInput';
import { GradientButton } from '../../components/GradientButton';
import { useAppContext } from '../../AppContext';
import { router } from 'expo-router';

export default function LoginScreen() {
  const { showModal } = useAppContext();
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');

  const handleGetOtp = () => {
    showModal('OTP sent to your mobile number! (Simulation)', 'info');
    console.log('Sending OTP to:', mobileNumber);
  };

  const handleSignUp = async () => {
    if (!mobileNumber || !otp || !password) {
        showModal('Please fill all signup fields.', 'error');
        return;
    }
    showModal('Signup successful! Please complete your medical history.', 'success');
    router.replace({ pathname: '/(auth)/signup-form', params: { viaABHA: 'false' } });
  };

  const handleContinueWithABHA = () => {
    showModal('Connecting with ABHA... (Feature not implemented)', 'info');
    router.replace({
      pathname: '/(auth)/signup-form',
      params: { viaABHA: 'true', abhaName: 'John Doe', abhaDob: '01/01/1990' }
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/medilab_bg.png')}
      style={loginStyles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['#FF6F61', '#8A2BE2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={loginStyles.headerGradient}
      >
        <Text style={loginStyles.appTitle}>Medilab</Text>
        <Text style={loginStyles.appSubtitle}>Your Prescription, Analyzed by AI. Trusted by You.</Text>
      </LinearGradient>

      <View style={loginStyles.card}>
        <Text style={loginStyles.cardTitle}>Sign Up</Text>

        <View style={loginStyles.inputGroup}>
          <CustomTextInput
            placeholder="+91 XXXXX XXXXX"
            keyboardType="phone-pad"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            style={loginStyles.textInput}
          />
          <TouchableOpacity style={loginStyles.getOtpButton} onPress={handleGetOtp}>
            <Text style={loginStyles.getOtpButtonText}>Get OTP</Text>
          </TouchableOpacity>
        </View>

        <CustomTextInput
          placeholder="Verify OTP"
          keyboardType="number-pad"
          maxLength={4}
          value={otp}
          onChangeText={setOtp}
          style={loginStyles.textInputFullWidth}
        />
        <CustomTextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={loginStyles.textInputFullWidth}
        />

        <GradientButton title="Sign Up" onPress={handleSignUp} />

        <Text style={loginStyles.orText}>OR</Text>

        <GradientButton
          title="Continue with ABHA"
          onPress={handleContinueWithABHA}
          colors={['#8A2BE2', '#FF6F61']}
        />
      </View>
    </ImageBackground>
  );
};

const loginStyles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerGradient: {
    width: '100%',
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: Platform.OS === 'android' ? 50 : 0,
  },
  appTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    width: '90%',
    padding: 25,
    alignItems: 'center',
    marginTop: -80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6F61',
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  textInput: {
    flex: 1,
    marginRight: 10,
  },
  textInputFullWidth: {
    width: '100%',
  },
  getOtpButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
  },
  getOtpButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  orText: {
    marginVertical: 15,
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
});
