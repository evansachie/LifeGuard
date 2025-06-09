import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';
import { FaPlus, FaBell } from 'react-icons/fa';

import MedicationList from '../../components/MedicationTracker/MedicationList';
import MedicationStats from '../../components/MedicationTracker/MedicationStats';
import AddMedicationModal from '../../components/MedicationTracker/AddMedicationModal';
import NotificationPreferencesModal from '../../components/MedicationTracker/NotificationPreferencesModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import SearchAndFilter from '../../components/MedicationTracker/SearchAndFilter';
import { Medication, MedicationData, FiltersType } from '../../types/medicationTracker.types';

interface MedicationTrackerProps {
  isDarkMode: boolean;
}

const MedicationTracker: React.FC<MedicationTrackerProps> = ({ isDarkMode }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [complianceRate, setComplianceRate] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [medicationToDelete, setMedicationToDelete] = useState<Medication | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<FiltersType>({
    status: '',
    frequency: '',
    timeOfDay: '',
  });
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchMedications();
    fetchComplianceRate();
  }, []);

  const fetchMedications = async (): Promise<void> => {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.MEDICATIONS.LIST);
      setMedications(response.data);
    } catch (error) {
      toast.error('Failed to fetch medications');
    } finally {
      setLoading(false);
    }
  };

  const fetchComplianceRate = async (): Promise<void> => {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.MEDICATIONS.COMPLIANCE);
      setComplianceRate(response.data);
    } catch (error) {
      console.error('Failed to fetch compliance rate:', error);
    }
  };

  const handleAddMedication = async (medicationData: MedicationData): Promise<void> => {
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

  const handleEditMedication = async (medicationData: MedicationData): Promise<void> => {
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

  const handleTrackDose = async (medicationId: string, taken: boolean): Promise<void> => {
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
    } catch (error: any) {
      console.error('Track dose error:', error);
      toast.error(error.message || 'Failed to track dose');
    }
  };

  const handleDeleteMedication = async (medicationId: string): Promise<void> => {
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

  // Filter medications
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

  const handleFilterChange = (filterName: string, value: string): void => {
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
            type="button"
            aria-label="Open notification settings"
            title="Notification Settings"
          >
            <FaBell className="text-blue-500 text-sm" />
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
            <FaPlus className="text-sm" />
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

        {/* Add Medication Modal */}
        <AddMedicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddMedication}
          isDarkMode={isDarkMode}
        />

        {/* Edit Medication Modal */}
        <AddMedicationModal
          isOpen={!!editingMedication}
          onClose={() => setEditingMedication(null)}
          onSubmit={handleEditMedication}
          editingMedication={editingMedication}
          isDarkMode={isDarkMode}
        />

        {/* Notification Preferences Modal */}
        <NotificationPreferencesModal
          isOpen={isNotificationSettingsOpen}
          onClose={() => setIsNotificationSettingsOpen(false)}
          isDarkMode={isDarkMode}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={!!medicationToDelete}
          onClose={() => setMedicationToDelete(null)}
          onConfirm={() => medicationToDelete?.Id && handleDeleteMedication(medicationToDelete.Id)}
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
