import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchUserData } from '../utils/dashboardApi';

/**
 * Custom hook to fetch and manage user data
 * @returns {Object} User data state and loading status
 */
const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const userId = localStorage.getItem('userId');
        const data = await fetchUserData(userId);
        
        if (data) {
          setUserData({
            userName: data.userName,
            email: data.email
          });
          localStorage.setItem('userName', data.userName);
        }
      } catch (error) {
        toast.error('Failed to fetch user data');
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  return { userData, isLoading };
};

export default useUserData;
