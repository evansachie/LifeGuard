export interface Medication {
  Name: string;
  Dosage: string;
  Notes?: string;
  Time?: string[];
  [key: string]: unknown;
}

export interface MedicalInfo {
  age: string | number;
  gender: string;
  weight: string | number;
  height: string | number;
  bio: string;
}

export interface EmergencyUserData {
  name: string;
  location: string;
  phone: string;
  email: string;
  timestamp: string;
  medicalInfo: MedicalInfo;
  mapUrl: string | null;
  medications: Medication[];
  [key: string]: unknown;
}

export interface EmergencyActions {
  handlePhoneCall: (phoneNumber: string) => void;
  getDirections: (location: string) => void;
  findNearbyHospitals: (location: string) => void;
  shareEmergencyInfo: (userData: EmergencyUserData) => void;
  copySuccess?: string;
  [key: string]: unknown;
}
