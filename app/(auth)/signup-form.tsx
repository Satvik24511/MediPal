import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomCheckbox } from '../../components/CustomCheckbox';
import { GradientButton } from '../../components/GradientButton';
import { useAppContext } from '../../AppContext';
import { router, useLocalSearchParams } from 'expo-router';

const medicalHistoryOptions = [
  'Hypertension', 'Diabetes', 'Chronic Kidney Disease', 'Heart Disease / Heart Failure',
  'Liver Disease / Hepatitis', 'Asthma or COPD', 'Thyroid Problems (Hypo/Hyper)', 'Cancer',
  'Stroke / Epilepsy', 'Depression / Mental Illness', 'Anxiety / PTSD', 'Bleeding or Clotting Disorders',
  'Autoimmune Conditions', 'Osteoporosis', 'Other (specify)'
];

export default function SignupFormScreen() {
  const { showModal } = useAppContext();
  const params = useLocalSearchParams();
  const viaABHA = params.viaABHA === 'true';
  const abhaName = params.abhaName as string || '';
  const abhaDob = params.abhaDob as string || '';

  const [fullName, setFullName] = useState<string>(abhaName);
  const [dateOfBirth, setDateOfBirth] = useState<string>(abhaDob);
  const [gender, setGender] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState<string[]>([]);
  const [otherMedicalHistory, setOtherMedicalHistory] = useState<string>('');
  const [postSurgeries, setPostSurgeries] = useState<string>('');
  const [allergies, setAllergies] = useState<string>('');
  const [currentMedications, setCurrentMedications] = useState<string>('');
  const [recentMedicalEvents, setRecentMedicalEvents] = useState<string>('');
  const [lifestyleFactors, setLifestyleFactors] = useState<{ [key: string]: boolean }>({
    'Alcohol Consumption': false,
    'Recreational Drug Use': false,
    'Pregnancy': false,
    'Breastfeeding': false,
    'Smoking': false,
  });

  const toggleMedicalHistory = (option: string) => {
    setSelectedMedicalHistory(prev =>
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const toggleLifestyleFactor = (factor: string) => {
    setLifestyleFactors(prev => ({ ...prev, [factor]: !prev[factor] }));
  };

  const handleSubmit = async () => {
    if (!fullName || !dateOfBirth || !weight || !height) {
        showModal('Please fill in all required fields (marked with *).', 'error');
        return;
    }

    const userData = {
      fullName,
      dateOfBirth,
      gender,
      weight,
      height,
      medicalHistory: selectedMedicalHistory,
      otherMedicalHistory: selectedMedicalHistory.includes('Other (specify)') ? otherMedicalHistory : '',
      postSurgeries,
      allergies,
      currentMedications,
      recentMedicalEvents,
      lifestyleFactors,
      timestamp: new Date(),
    };

    try {
      showModal('Medical history saved successfully!', 'success');
    } catch (error: any) {
      console.error("Error saving medical history:", error);
      showModal(`Failed to save medical history: ${error.message}`, 'error');
    }
  };

  return (
    <ScrollView style={signupFormStyles.container}>
      <LinearGradient
        colors={['#FF6F61', '#8A2BE2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={signupFormStyles.headerGradient}
      >
        <Text style={signupFormStyles.headerTitle}>Medical History Form</Text>
      </LinearGradient>

      <View style={signupFormStyles.formCard}>
        <Text style={signupFormStyles.sectionTitle}>Patient Information</Text>
        <CustomTextInput
          label="Full Name*"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
        />
        <CustomTextInput
          label="Date of Birth*"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="DD/MM/YYYY"
          keyboardType="numbers-and-punctuation"
        />
        <CustomTextInput
          label="Gender"
          value={gender}
          onChangeText={setGender}
          placeholder="Male/Female/Other"
        />
        <CustomTextInput
          label="Weight (kg)*"
          value={weight}
          onChangeText={setWeight}
          placeholder="e.g., 70"
          keyboardType="numeric"
        />
        <CustomTextInput
          label="Height (cm)*"
          value={height}
          onChangeText={setHeight}
          placeholder="e.g., 175"
          keyboardType="numeric"
        />

        <Text style={signupFormStyles.sectionTitle}>Medical History</Text>
        <Text style={signupFormStyles.sectionSubtitle}>
          Have you ever been diagnosed with or treated for any of the following? (Select all that apply)
        </Text>
        {medicalHistoryOptions.map((option) => (
          <CustomCheckbox
            key={option}
            label={option}
            checked={selectedMedicalHistory.includes(option)}
            onPress={() => toggleMedicalHistory(option)}
          />
        ))}
        {selectedMedicalHistory.includes('Other (specify)') && (
          <CustomTextInput
            placeholder="Please specify other medical conditions"
            value={otherMedicalHistory}
            onChangeText={setOtherMedicalHistory}
            style={{ marginTop: 10 }}
          />
        )}

        <Text style={signupFormStyles.sectionTitle}>Post Surgeries</Text>
        <CustomTextInput
          placeholder="List any major surgeries you've had, with dates if possible."
          multiline
          numberOfLines={3}
          value={postSurgeries}
          onChangeText={setPostSurgeries}
        />

        <Text style={signupFormStyles.sectionTitle}>Allergies</Text>
        <CustomTextInput
          placeholder="Do you have any known allergies (e.g., medications, food, pollen)?"
          multiline
          numberOfLines={2}
          value={allergies}
          onChangeText={setAllergies}
        />

        <Text style={signupFormStyles.sectionTitle}>Current Medications</Text>
        <CustomTextInput
          placeholder="Please list any medications you are currently taking."
          multiline
          numberOfLines={3}
          value={currentMedications}
          onChangeText={setCurrentMedications}
        />

        <Text style={signupFormStyles.sectionTitle}>Recent Medical Events (Past 6 months)</Text>
        <CustomTextInput
          placeholder="Have you recently had any of the following? (e.g., hospital admission, new diagnosis)"
          multiline
          numberOfLines={3}
          value={recentMedicalEvents}
          onChangeText={setRecentMedicalEvents}
        />

        <Text style={signupFormStyles.sectionTitle}>Lifestyle and Social Factors</Text>
        {Object.keys(lifestyleFactors).map((factor) => (
          <CustomCheckbox
            key={factor}
            label={factor}
            checked={lifestyleFactors[factor]}
            onPress={() => toggleLifestyleFactor(factor)}
          />
        ))}

        <GradientButton title="Submit Medical History" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const signupFormStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  headerGradient: {
    width: '100%',
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: Platform.OS === 'android' ? 50 : 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    width: '90%',
    alignSelf: 'center',
    padding: 25,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
});
