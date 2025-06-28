import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';

interface MedicalHistoryData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  weight: string;
  height: string;
  medicalHistory: string[];
  otherMedicalHistory: string;
  postSurgeries: string;
  allergies: string;
  currentMedications: string;
  recentMedicalEvents: string;
  lifestyleFactors: { [key: string]: boolean };
  timestamp: Date;
}

export const saveMedicalHistory = async (firestoreDb: Firestore, currentAppId: string, currentUserId: string, data: MedicalHistoryData) => {
  if (!firestoreDb || !currentUserId || !currentAppId) {
    throw new Error("Firestore instance, user ID, or app ID not provided for saveMedicalHistory.");
  }
  const userDocRef = doc(firestoreDb, `artifacts/${currentAppId}/users/${currentUserId}/medicalHistory`, 'userProfile');
  await setDoc(userDocRef, data, { merge: true });
  console.log("Medical history saved to Firestore for user:", currentUserId);
};

export const getMedicalHistory = async (firestoreDb: Firestore, currentAppId: string, currentUserId: string): Promise<MedicalHistoryData | null> => {
    if (!firestoreDb || !currentUserId || !currentAppId) {
        throw new Error("Firestore instance, user ID, or app ID not provided for getMedicalHistory.");
    }
    const userDocRef = doc(firestoreDb, `artifacts/${currentAppId}/users/${currentUserId}/medicalHistory`, 'userProfile');
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        console.log("Medical history fetched from Firestore for user:", currentUserId);
        return docSnap.data() as MedicalHistoryData;
    } else {
        console.log("No medical history found for user:", currentUserId);
        return null;
    }
};
