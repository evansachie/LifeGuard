export interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  age: string | number;
  gender: string;
  weight: string | number;
  height: string | number;
  profilePhotoUrl?: string;
  profileImage?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface EmergencyContact {
  Id: number;
  Name: string;
  Phone: string;
  Email?: string;
  Relationship?: string;
  isVerified?: boolean;
  createdAt?: string;
}
