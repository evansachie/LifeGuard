import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';
import { FaPlus, FaBell } from 'react-icons/fa';

import MedicationList from '../../components/MedicationTracker/MedicationList';
import MedicationStats from '../../components/MedicationTracker/MedicationStats';
import AddMedicationForm from '../../components/MedicationTracker/AddMedicationForm';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import SearchAndFilter from '../../components/MedicationTracker/SearchAndFilter';
import NotificationPreferences from '../../components/MedicationTracker/NotificationPreferences';

const MedicationTracker = ({ isDarkMode }) => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [complianceRate, setComplianceRate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [medicationToDelete, setMedicationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    frequency: '',
    timeOfDay: '',
  });
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);

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
        body: JSON.stringify(medicationData),
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
          scheduledTime: new Date().toTimeString().split(' ')[0],
        }),
      });
      fetchMedications();
      fetchComplianceRate();
      toast.success('Dose tracked successfully');
    } catch (error) {
      console.error('Track dose error:', error);
      toast.error(error.message || 'Failed to track dose');
    }
  };

  const handleEditMedication = async (medicationData) => {
    try {
      await fetchWithAuth(`${API_ENDPOINTS.MEDICATIONS.UPDATE}/${medicationData.Id}`, {
        method: 'PUT',
        body: JSON.stringify(medicationData),
      });
      fetchMedications();
      toast.success('Medication updated successfully');
      setEditingMedication(null);
    } catch (error) {
      toast.error('Failed to update medication');
    }
  };

  const handleDeleteMedication = async (medicationId) => {
    setIsDeleting(true);
    try {
      await fetchWithAuth(`${API_ENDPOINTS.MEDICATIONS.DELETE}/${medicationId}`, {
        method: 'DELETE',
      });
      fetchMedications();
      toast.success('Medication deleted successfully');
      setMedicationToDelete(null);
    } catch (error) {
      toast.error('Failed to delete medication');
    } finally {
      setIsDeleting(false);
    }
  };

  // New function to filter medications
  const filteredMedications = medications.filter((med) => {
    const matchesSearch =
      med.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.Dosage.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !filters.status || (filters.status === 'active' ? med.Active : !med.Active);

    const matchesFrequency =
      !filters.frequency || med.Frequency.toLowerCase() === filters.frequency.toLowerCase();

    const matchesTimeOfDay =
      !filters.timeOfDay ||
      med.Time.some((time) => {
        const hour = parseInt(time.split(':')[0]);
        if (filters.timeOfDay === 'morning') return hour >= 6 && hour < 12;
        if (filters.timeOfDay === 'afternoon') return hour >= 12 && hour < 18;
        if (filters.timeOfDay === 'evening') return hour >= 18 || hour < 6;
        return true;
      });

    return matchesSearch && matchesStatus && matchesFrequency && matchesTimeOfDay;
  });

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  return (
    <motion.div
      className={`min-h-screen p-6 ${isDarkMode ? 'bg-dark-mode text-gray-100' : 'bg-gray-50 text-gray-900'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Title and Notification Settings Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Medication Tracker
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Stay on top of your medication schedule with ease
            </p>
          </div>
          <motion.button
            onClick={() => setIsNotificationSettingsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-full ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
            } shadow-lg`}
          >
            <FaBell className="text-blue-500" />
          </motion.button>
        </div>

        {/* Stats Overview */}
        <MedicationStats
          medications={medications}
          complianceRate={complianceRate}
          isDarkMode={isDarkMode}
        />

        {/* Search and Add Medication Row */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="w-2/3">
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filters={filters}
              onFilterChange={handleFilterChange}
              isDarkMode={isDarkMode}
            />
          </div>

          <motion.button
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaPlus />
            Add New Medication
          </motion.button>
        </div>

        {/* Medication List */}
        <div className="w-full">
          <MedicationList
            medications={filteredMedications}
            loading={loading}
            onTrackDose={handleTrackDose}
            onEdit={setEditingMedication}
            onDelete={(med) => setMedicationToDelete(med)}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                onClick={() => setIsModalOpen(false)}
              />

              {/* Modal Container */}
              <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  className={`w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl 
                    ${isDarkMode ? 'bg-dark-card' : 'bg-white'}`}
                >
                  {/* Modal Header */}
                  <div
                    className={`sticky top-0 px-6 py-4 border-b ${
                      isDarkMode ? 'border-gray-700/50' : 'border-gray-200'
                    } bg-opacity-80 backdrop-blur-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold flex items-center gap-3">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                        Add New Medication
                      </h2>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className={`rounded-full p-2 hover:bg-opacity-10 
                          ${isDarkMode ? 'hover:bg-white' : 'hover:bg-black'}`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                    <div className="p-6">
                      <AddMedicationForm
                        onSubmit={(data) => {
                          handleAddMedication(data);
                          setIsModalOpen(false);
                        }}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingMedication && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                onClick={() => setEditingMedication(null)}
              />

              <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  className={`w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl 
                    ${isDarkMode ? 'bg-dark-card' : 'bg-white'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={`sticky top-0 px-6 py-4 border-b ${
                      isDarkMode ? 'border-gray-700/50' : 'border-gray-200'
                    } bg-opacity-80 backdrop-blur-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold flex items-center gap-3">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                        Edit {editingMedication.Name}
                      </h2>
                      <button
                        onClick={() => setEditingMedication(null)}
                        className={`rounded-full p-2 hover:bg-opacity-10 
                          ${isDarkMode ? 'hover:bg-white' : 'hover:bg-black'}`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                    <AddMedicationForm
                      initialData={{
                        ...editingMedication,
                        times: editingMedication.Time || [], // Fix the field name here
                      }}
                      onSubmit={handleEditMedication}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Notification Preferences Modal */}
        <AnimatePresence>
          {isNotificationSettingsOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                onClick={() => setIsNotificationSettingsOpen(false)}
              />

              <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className={`w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl 
                    ${isDarkMode ? 'bg-dark-card' : 'bg-white'}`}
                >
                  <div
                    className={`px-6 py-4 border-b ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <h2 className="text-xl font-semibold">Notification Settings</h2>
                  </div>
                  <NotificationPreferences
                    isDarkMode={isDarkMode}
                    onClose={() => setIsNotificationSettingsOpen(false)}
                  />
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={!!medicationToDelete}
          onClose={() => setMedicationToDelete(null)}
          onConfirm={() => handleDeleteMedication(medicationToDelete?.Id)}
          title="Delete Medication"
          message="Are you sure you want to delete this medication? This action cannot be undone."
          itemName={medicationToDelete?.Name}
          isLoading={isDeleting}
          isDarkMode={isDarkMode}
        />
      </div>
    </motion.div>
  );
};

export default MedicationTracker;
