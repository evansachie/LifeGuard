import { useState } from 'react';
import { toast } from 'react-toastify';
import { EmergencyActions, EmergencyUserData } from '../types/emergency.types';

export function useEmergencyActions(): EmergencyActions {
  const [copySuccess, setCopySuccess] = useState<string | undefined>(undefined);

  const handlePhoneCall = (phoneNumber: string): void => {
    window.location.href = `tel:${phoneNumber}`;
    toast.info(`Initiating call to ${phoneNumber}`);
  };

  const getDirections = (location: string): void => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`,
      '_blank'
    );
    toast.info('Opening directions in Google Maps');
  };

  const findNearbyHospitals = (location: string): void => {
    window.open(
      `https://www.google.com/maps/search/hospitals+near+${encodeURIComponent(location)}`,
      '_blank'
    );
    toast.info('Searching for nearby hospitals');
  };

  const shareEmergencyInfo = (userData: EmergencyUserData): void => {
    const shareText = `
EMERGENCY ALERT:
Name: ${userData.name}
Location: ${userData.location}
Phone: ${userData.phone}
Medical Info: ${userData.medicalInfo ? `${userData.medicalInfo.age} years old, ${userData.medicalInfo.gender}` : 'Not available'}
Time: ${userData.timestamp}
`.trim();

    try {
      if (navigator.share) {
        navigator.share({
          title: 'Emergency Alert',
          text: shareText,
        });
      } else {
        navigator.clipboard.writeText(shareText);
        setCopySuccess('Emergency information copied to clipboard');
        setTimeout(() => setCopySuccess(undefined), 3000);
      }
    } catch (error) {
      console.error('Error sharing emergency info:', error);
      toast.error('Unable to share emergency information');
    }
  };

  return {
    handlePhoneCall,
    getDirections,
    findNearbyHospitals,
    shareEmergencyInfo,
    copySuccess,
  };
}
