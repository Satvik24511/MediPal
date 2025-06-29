import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientButton } from '../../components/GradientButton';
import { useAppContext } from '../../AppContext';
import { getInteractionsOverviewFromLLM } from '../../api/llmService';


const htmlEscape = (str : string ) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export default function ConnectScreen() {
  const { showModal } = useAppContext();
  const [prescriptionText, setPrescriptionText] = useState('');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const footerSlides = [
    {
      id: '1',
      image: require('../../assets/medilab1.png'),
      text: 'Upload. Analyze. Relax.',
    },
    {
      id: '2',
      image: require('../../assets/medilab2.png'),
      text: 'Upload your medical prescriptions or type them in manually.',
    },
    {
      id: '3',
      image: require('../../assets/medilab3.png'),
      text: 'Your Health Data is Secure.',
    },
  ];

  const handleAddImagePrescription = () => {
    showModal('Image upload and OCR functionality would be implemented here.', 'info');
    console.log("Add images of prescription (OCR functionality)");
  };

  const handleUploadAndAnalyze = async () => {
    if (isLoading) {
      return;
    }
    if (!prescriptionText.trim()) {
      showModal('Please type your prescription or add an image before analyzing.', 'error');
      return;
    }
    
    setIsLoading(true);
    showModal('Analyzing your input...', 'info');
    console.log("Upload and Analyze prescription:", prescriptionText);

    try {
      console.log("Calling LLM API with prescription text:", prescriptionText);
      const result = await getInteractionsOverviewFromLLM([prescriptionText]);
      console.log("LLM API raw result:", result);

      if (Array.isArray(result) && result.length > 0) {
        setReportData(result);
        setReportGenerated(true);
        showModal('Report generated successfully!', 'success');
      } else if (Array.isArray(result) && result.length === 0) {
        setReportData([]);
        setReportGenerated(true);
        showModal('Analysis complete! No significant interactions found.', 'success');
      } else {
        setReportData([]);
        setReportGenerated(false);
        showModal('Error during analysis. Unexpected response from the server.', 'error');
      }
    } catch (error) {
      console.error("Error during LLM analysis:", error);
      setReportData([]);
      setReportGenerated(false);
      showModal('An error occurred during analysis. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };


  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width;
    const newIndex = Math.round(contentOffsetX / layoutWidth);
    setActiveSlideIndex(newIndex);
  };

  const screenWidth = Dimensions.get('window').width;

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
          disabled={isLoading}
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
            editable={!isLoading}
          />
          <TouchableOpacity style={connectScreenStyles.micIcon} disabled={isLoading}>
            <MaterialCommunityIcons name="microphone" size={24} color={isLoading ? '#ccc' : '#666'} />
          </TouchableOpacity>
        </View>

        <GradientButton
          title={isLoading ? 'Analyzing...' : 'Upload and Analyze'}
          onPress={handleUploadAndAnalyze}
          colors={['#007bff', '#66ccff']}
          buttonStyle={connectScreenStyles.uploadButton}
          textStyle={connectScreenStyles.uploadButtonText}
          disabled={isLoading}
        />
        {isLoading && (
          <ActivityIndicator size="small" color="#007bff" style={connectScreenStyles.loadingIndicator} />
        )}
      </View>

      {reportGenerated && (
        <View style={connectScreenStyles.reportCard}>
          <Text style={connectScreenStyles.reportTitle}>Result</Text>
          {reportData.length > 0 ? (
            <View>
              <Text style={connectScreenStyles.reportSectionTitle}>Potential Drug-Drug Interactions:</Text>
              {reportData.map((interaction, index) => (
                <View key={index} style={connectScreenStyles.interactionItem}>
                  <Text style={connectScreenStyles.interactionHeader}>Input: <Text style={connectScreenStyles.boldText}>{interaction.drug1} + {interaction.drug2}</Text></Text>
                  <Text style={connectScreenStyles.interactionText}>Interaction Type: <Text style={connectScreenStyles.boldText}>{interaction.interactionType || 'Not Provided'}</Text></Text>
                  <Text style={connectScreenStyles.interactionText}>Effect: {interaction.effect || 'Not Provided'}</Text>
                  <Text style={connectScreenStyles.interactionText}>Risk Level: <Text style={connectScreenStyles.boldText}>{interaction.riskLevel || 'Not Provided'}</Text></Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={connectScreenStyles.reportContent}>No significant drug-drug interactions found.</Text>
          )}

        </View>
      )}

      <LinearGradient
        colors={['#FF6F61', '#8A2BE2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={connectScreenStyles.footerGradient}
      >
        <ScrollView
          horizontal
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {footerSlides.map((slide, index) => (
            <View key={slide.id} style={[connectScreenStyles.footerSlideItem, { width: screenWidth }]}>
              <Image
                source={slide.image}
                style={connectScreenStyles.bottomImage}
                resizeMode="contain"
              />
              <Text style={connectScreenStyles.bottomImageCardText}>{slide.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={connectScreenStyles.paginationDots}>
          {footerSlides.map((_, index) => (
            <View
              key={index}
              style={[
                connectScreenStyles.dot,
                index === activeSlideIndex && connectScreenStyles.dotActive,
              ]}
            />
          ))}
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
    marginTop: 20,
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
    marginTop: 30,
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
    textAlign: 'center',
  },
  downloadPdfButton: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
  },
  downloadPdfButtonText: {
    fontSize: 16,
  },
  footerSlideItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
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
    textAlign: 'center',
  },
  paginationDots: {
    flexDirection: 'row',
    marginTop: 10,
    position: 'absolute',
    bottom: 20,
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
  loadingIndicator: {
    marginTop: 10,
  },
  interactionItem: {
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  interactionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  interactionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 2,
  },
  reportSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'left',
  },
  boldText: {
    fontWeight: 'bold',
  },
  prescriptionTextInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  }
});