import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { GradientButton } from '../../components/GradientButton'; 
import { useAppContext } from '../../AppContext'; 

export default function ConnectScreen() {
  const { showModal } = useAppContext();
  const [prescriptionText, setPrescriptionText] = useState('');
  const [reportGenerated, setReportGenerated] = useState(false); 
  const [reportContent, setReportContent] = useState(''); 

  const handleAddImagePrescription = () => {
    showModal('Image upload and OCR functionality would be implemented here.', 'info');
    console.log("Add images of prescription (OCR functionality)");
  };

  const handleUploadAndAnalyze = () => {
    if (!prescriptionText.trim()) {
        showModal('Please type your prescription or add an image before analyzing.', 'error');
        return;
    }
    showModal('Analyzing your input... (ML model integration placeholder)', 'info');
    console.log("Upload and Analyze prescription:", prescriptionText);

    setTimeout(() => {
      const dummyReport = `
        **Medilab Health Report**

        **Patient ID:** ${Math.floor(Math.random() * 1000) + 1}
        **Date of Report:** ${new Date().toLocaleDateString()}

        **Based on your input:**
        - **Prescription:** ${prescriptionText || 'No manual text provided.'}
        - **Analysis:** This is a simulated analysis. In a real scenario, an ML model would interpret your prescription/health data, identify drug interactions, suggest potential side effects, or highlight conditions based on your medical history.

        **Recommendations (Simulated):**
        1. Ensure consistent medication adherence as per your doctor's advice.
        2. Follow up with your doctor regarding [specific simulated finding, e.g., 'the dosage of Drug X'].
        3. Maintain a balanced diet, stay hydrated, and engage in regular physical activity.

        **Disclaimer:** This is a preliminary, AI-generated report for informational purposes only and does not substitute professional medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment.
      `;
      setReportContent(dummyReport); 
      setReportGenerated(true); 
      showModal('Report generated successfully!', 'success');
    }, 2000);
  };

  const handleDownloadPdf = () => {
    showModal('PDF generation and download functionality would be implemented here.', 'info');
    console.log("Download report as PDF");
  };

  return (
    <ScrollView style={connectScreenStyles.container}>
      <LinearGradient
        colors={['#FF6F61', '#8A2BE2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={connectScreenStyles.headerGradient}
      >
        <View style={connectScreenStyles.profileIconContainer}>
          <MaterialCommunityIcons name="account-circle" size={30} color="#fff" />
        </View>
        <Text style={connectScreenStyles.appTitle}>Medilab</Text>
      </LinearGradient>

      <View style={connectScreenStyles.contentCard}>
        <Text style={connectScreenStyles.cardTitle}>Do a quick check up</Text>

        <GradientButton
          title="Add images of prescription +"
          onPress={handleAddImagePrescription}
          colors={['#fd7e14', '#f8d7da']}
          buttonStyle={connectScreenStyles.prescriptionButton}
          textStyle={connectScreenStyles.prescriptionButtonText}
        />

        <Text style={connectScreenStyles.orText}>or</Text>

        <View style={connectScreenStyles.textInputContainer}>
          <TextInput
            style={connectScreenStyles.prescriptionTextInput}
            placeholder="Type your prescription here..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={prescriptionText}
            onChangeText={setPrescriptionText}
          />
          <TouchableOpacity style={connectScreenStyles.micIcon}>
            <MaterialCommunityIcons name="microphone" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <GradientButton
          title="Upload and Analyze"
          onPress={handleUploadAndAnalyze}
          colors={['#007bff', '#66ccff']}
          buttonStyle={connectScreenStyles.uploadButton}
          textStyle={connectScreenStyles.uploadButtonText}
        />
      </View>

      {reportGenerated && (
        <View style={connectScreenStyles.reportCard}>
          <Text style={connectScreenStyles.reportTitle}>Result</Text>
          <Text style={connectScreenStyles.reportContent}>{reportContent}</Text>
          <GradientButton
            title="Convert to PDF & Download"
            onPress={handleDownloadPdf}
            colors={['#28a745', '#82E0AA']}
            buttonStyle={connectScreenStyles.downloadPdfButton}
            textStyle={connectScreenStyles.downloadPdfButtonText}
          />
        </View>
      )}

      <LinearGradient
        colors={['#FF6F61', '#8A2BE2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={connectScreenStyles.footerGradient}
      >
            <Image
            source={require('../../assets/medilab_bg.jpg')} 
            style={connectScreenStyles.bottomImage}
            resizeMode="contain"
            />
            <Text style={connectScreenStyles.bottomImageCardText}>Upload. Analyze. Relax.</Text>
            <View style={connectScreenStyles.paginationDots}>
            <View style={connectScreenStyles.dotActive} />
            <View style={connectScreenStyles.dot} />
            <View style={connectScreenStyles.dot} />
            </View>
    </LinearGradient>
    </ScrollView>
  );
};

const connectScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  headerGradient: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: Platform.OS === 'android' ? 50 : 0,
    position: 'relative',
  },
  footerGradient: {
    width: '100%',
    height: 360,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: Platform.OS === 'android' ? 50 : 0,
    position: 'relative',
  },
  profileIconContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 60 : 50,
    left: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  contentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    width: '90%',
    alignSelf: 'center',
    padding: 25,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  prescriptionButton: {
    width: '80%',
    alignSelf: 'center',
  },
  prescriptionButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  orText: {
    marginVertical: 15,
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  prescriptionTextInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  micIcon: {
    padding: 10,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  uploadButton: {
    width: '80%',
    alignSelf: 'center',
  },
  uploadButtonText: {
    fontSize: 18,
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    width: '90%',
    alignSelf: 'center',
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  reportTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6F61',
    marginBottom: 15,
    textAlign: 'center',
  },
  reportContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 20,
  },
  downloadPdfButton: {
    width: '80%',
    alignSelf: 'center',
  },
  downloadPdfButtonText: {
    fontSize: 16,
  },
  bottomImageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    width: '90%',
    alignSelf: 'center',
    padding: 25,
    alignItems: 'center',
    marginBottom: -30, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomImage: {
    width: 150,
    height: 150,
    marginBottom: 15,
  },
  bottomImageCardText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  paginationDots: {
    flexDirection: 'row',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6F61',
    marginHorizontal: 4,
  },
});