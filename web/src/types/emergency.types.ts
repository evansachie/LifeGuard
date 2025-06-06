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

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface EmergencyUserData {
  name: string;
  phone: string;
  email: string;
  location: string;
  timestamp: string;
  medicalConditions?: string[];
  medications?: string[];
  emergencyContacts?: EmergencyContact[];
}

export interface EmergencyActions {
  handlePhoneCall: (phoneNumber: string) => void;
  getDirections: (location: string) => void;
  findNearbyHospitals: (location: string) => void;
  shareEmergencyInfo: (userData: EmergencyUserData) => void;
  copySuccess?: string;
  [key: string]: unknown;
}
