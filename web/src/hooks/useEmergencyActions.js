import { useState } from 'react';
import { toast } from 'react-toastify';

export function useEmergencyActions() {
  const [copySuccess, setCopySuccess] = useState('');

  const handlePhoneCall = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    if (window.innerWidth > 768) {
      navigator.clipboard.writeText(cleanNumber);
      toast.info('Phone number copied to clipboard for manual dialing', {
        autoClose: 5000,
      });
      return;
    }

    setTimeout(() => {
      const a = document.createElement('a');
      a.href = `tel:${cleanNumber}`;
      a.rel = 'noopener noreferrer';
      a.click();
    }, 300);
  };

  const shareEmergencyInfo = async (userData) => {
    const shareText = `Emergency alert for ${userData.name}.\nLocation: ${userData.location}\nPhone: ${userData.phone}\nPlease provide assistance immediately.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Emergency Alert',
          text: shareText,
          url: window.location.href,
        });
        toast.success('Emergency information shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
        fallbackShare(shareText);
      }
    } else {
      fallbackShare(shareText);
    }
  };

  const fallbackShare = (shareText) => {
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        setCopySuccess('Emergency information copied to clipboard!');
        toast.success('Emergency information copied to clipboard!');
        setTimeout(() => setCopySuccess(''), 3000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        toast.error('Failed to copy emergency information');
      });
  };

  const getDirections = (location) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank');
  };

  const findNearbyHospitals = (location) => {
    const searchUrl = `https://www.google.com/maps/search/hospitals+near+${encodeURIComponent(location)}`;
    window.open(searchUrl, '_blank');
  };

  return {
    handlePhoneCall,
    shareEmergencyInfo,
    getDirections,
    findNearbyHospitals,
    copySuccess,
  };
}
