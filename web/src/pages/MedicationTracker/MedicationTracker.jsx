import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';
import MedicationList from '../../components/MedicationTracker/MedicationList';
import MedicationStats from '../../components/MedicationTracker/MedicationStats';
import AddMedicationForm from '../../components/MedicationTracker/AddMedicationForm';

const MedicationTracker = ({ isDarkMode }) => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [complianceRate, setComplianceRate] = useState(null);

  useEffect(() => {
    fetchMedications();
    fetchComplianceRate();
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.MEDICATIONS.LIST);
      setMedications(response.data);
    } catch (error) {
      toast.error('Failed to fetch medications');
    } finally {
      setLoading(false);
    }
  };

  const fetchComplianceRate = async () => {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.MEDICATIONS.COMPLIANCE);
      setComplianceRate(response.data);
    } catch (error) {
      console.error('Failed to fetch compliance rate:', error);
    }
  };

  const handleAddMedication = async (medicationData) => {
    try {
      await fetchWithAuth(API_ENDPOINTS.MEDICATIONS.ADD, {
        method: 'POST',
        body: JSON.stringify(medicationData)
      });
      fetchMedications();
      toast.success('Medication added successfully');
    } catch (error) {
      toast.error('Failed to add medication');
    }
  };

  const handleTrackDose = async (medicationId, taken) => {
    try {
      await fetchWithAuth(API_ENDPOINTS.MEDICATIONS.TRACK, {
        method: 'POST',
        body: JSON.stringify({ 
          medicationId, 
          taken,
          scheduledTime: new Date().toTimeString().split(' ')[0]
        })
      });
      fetchMedications();
      fetchComplianceRate();
      toast.success('Dose tracked successfully');
    } catch (error) {
      console.error('Track dose error:', error);
      toast.error(error.message || 'Failed to track dose');
    }
  };

  return (
    <motion.div 
      className={`min-h-screen p-6 ${isDarkMode ? 'bg-dark-mode text-gray-100' : 'bg-gray-50 text-gray-900'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Medication Tracker
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Stay on top of your medication schedule with ease
          </p>
        </div>

        {/* Stats Overview */}
        <MedicationStats 
          medications={medications}
          complianceRate={complianceRate}
          isDarkMode={isDarkMode}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MedicationList
              medications={medications}
              loading={loading}
              onTrackDose={handleTrackDose}
              isDarkMode={isDarkMode}
            />
          </div>
          
          <div className={`${
            isDarkMode ? 'bg-dark-card' : 'bg-white'
          } rounded-xl shadow-lg p-6 h-fit sticky top-6`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Add New Medication
            </h2>
            <AddMedicationForm 
              onSubmit={handleAddMedication}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicationTracker;
