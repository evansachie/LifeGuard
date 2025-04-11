import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';
import { FaPills, FaClipboardList, FaChartLine } from 'react-icons/fa';
import AddMedicationForm from './components/AddMedicationForm';

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
      className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <FaPills className="text-4xl mr-3 text-blue-500" />
            <h1 className="text-3xl font-bold">Medication Tracker</h1>
          </div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage and track your medications effectively
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className={`p-6 rounded-xl shadow-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Compliance Rate</p>
                <h3 className="text-2xl font-bold text-blue-500">
                  {complianceRate ? `${Math.round(complianceRate)}%` : 'N/A'}
                </h3>
              </div>
              <FaChartLine className="text-2xl text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            className={`p-6 rounded-xl shadow-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Medications</p>
                <h3 className="text-2xl font-bold text-green-500">
                  {medications.filter(m => m.active).length}
                </h3>
              </div>
              <FaPills className="text-2xl text-green-500" />
            </div>
          </motion.div>

          <motion.div
            className={`p-6 rounded-xl shadow-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Today's Doses</p>
                <h3 className="text-2xl font-bold text-purple-500">
                  {medications.reduce((acc, med) => acc + med.Time.length, 0)}
                </h3>
              </div>
              <FaClipboardList className="text-2xl text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Medication List */}
          <div className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h2 className="text-xl font-bold mb-4">Current Medications</h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {medications.map(medication => (
                  <motion.div
                    key={medication.Id}
                    className={`p-4 rounded-lg border ${
                      isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                    } transition-colors`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{medication.Name}</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {medication.Dosage}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {medication.Time.map((time, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                            >
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTrackDose(medication.Id, true)}
                          className="px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 text-white text-sm transition-colors"
                        >
                          Taken
                        </button>
                        <button
                          onClick={() => handleTrackDose(medication.Id, false)}
                          className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm transition-colors"
                        >
                          Missed
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Add Medication Form */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h2 className="text-xl font-bold mb-4">Add New Medication</h2>
            <AddMedicationForm onSubmit={handleAddMedication} isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicationTracker;
