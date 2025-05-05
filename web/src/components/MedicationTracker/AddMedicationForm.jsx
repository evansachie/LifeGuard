import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaClock, FaInfoCircle } from 'react-icons/fa';
import MedicationSearch from './MedicationSearch';

const defaultFormData = {
  name: '',
  dosage: '',
  frequency: 'daily',
  times: ['08:00'],
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  notes: '',
  active: true,
};

const AddMedicationForm = ({ onSubmit, isDarkMode, initialData = null }) => {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        name: initialData.Name || '',
        dosage: initialData.Dosage || '',
        frequency: initialData.Frequency || 'daily',
        times: initialData.Time || ['08:00'],
        startDate: initialData.StartDate?.split('T')[0] || defaultFormData.startDate,
        endDate: initialData.EndDate?.split('T')[0] || '',
        notes: initialData.Notes || '',
        active: initialData.Active ?? true,
      };
    }
    return defaultFormData;
  });

  const [selectedMedication, setSelectedMedication] = useState(null);

  const isFormValid = useMemo(() => {
    return (
      formData?.name?.trim() !== '' &&
      formData?.dosage?.trim() !== '' &&
      formData?.times?.length > 0 &&
      formData?.times?.every((time) => time !== '')
    );
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      // If endDate is empty string, set it to null
      endDate: formData.endDate || null,
    };

    onSubmit(initialData ? { ...submissionData, Id: initialData.Id } : submissionData);
    if (!initialData) {
      setFormData(defaultFormData);
      setSelectedMedication(null);
    }
  };

  const handleMedicationSelect = (name, medication) => {
    setFormData((prev) => ({
      ...prev,
      name,
      // Auto-fill dosage if available and field is empty
      dosage: !prev.dosage && medication?.strength ? medication.strength : prev.dosage,
    }));

    setSelectedMedication(medication);
  };

  const addTimeSlot = () => {
    setFormData((prev) => ({
      ...prev,
      times: [...prev.times, '12:00'],
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium mb-1">Medication Name</div>
          <MedicationSearch
            value={formData.name}
            onChange={handleMedicationSelect}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Show medication details if a medication was selected from search */}
        {selectedMedication && (
          <div className={`p-3 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <div className="flex items-center mb-2">
              <FaInfoCircle className="text-blue-500 mr-2" />
              <span className="font-medium">Medication Information</span>
            </div>
            {selectedMedication.genericName && (
              <div className="text-sm mb-1">
                <span className="font-medium">Generic name:</span> {selectedMedication.genericName}
              </div>
            )}
            {selectedMedication.form && (
              <div className="text-sm mb-1">
                <span className="font-medium">Form:</span> {selectedMedication.form}
              </div>
            )}
            {selectedMedication.indications && (
              <div className="text-sm">
                <span className="font-medium">Used for:</span>{' '}
                {selectedMedication.indications.substring(0, 150)}
                {selectedMedication.indications.length > 150 ? '...' : ''}
              </div>
            )}
          </div>
        )}

        <div>
          <div className="text-sm font-medium mb-1">Dosage</div>
          <input
            type="text"
            value={formData.dosage}
            onChange={(e) => setFormData((prev) => ({ ...prev, dosage: e.target.value }))}
            className={`w-full rounded-lg p-2.5 border transition-colors ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                : 'bg-white border-gray-300 focus:border-blue-500'
            }`}
            placeholder="e.g., 500mg"
            required
          />
        </div>

        <div>
          <div className="text-sm font-medium mb-1">Frequency</div>
          <select
            value={formData.frequency}
            onChange={(e) => setFormData((prev) => ({ ...prev, frequency: e.target.value }))}
            className={`w-full rounded-lg p-2.5 border transition-colors ${
              isDarkMode
                ? 'bg-dark-card border-gray-700 text-white focus:border-blue-500'
                : 'bg-white border-gray-300 focus:border-blue-500'
            }`}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Times</div>
          <div className="space-y-2">
            {formData.times.map((time, index) => (
              <div key={index} className="flex items-center gap-2">
                <FaClock className="text-gray-400" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    const newTimes = [...formData.times];
                    newTimes[index] = e.target.value;
                    setFormData((prev) => ({ ...prev, times: newTimes }));
                  }}
                  className={`flex-1 rounded-lg p-2.5 border transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                      : 'bg-white border-gray-300 focus:border-blue-500'
                  }`}
                />
                {formData.times.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(index)}
                    className="p-2 text-red-500 hover:text-red-600"
                    aria-label="Remove time slot"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTimeSlot}
            className="mt-2 text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            <FaPlus /> Add Time
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium mb-1">Start Date</div>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
              className={`w-full rounded-lg p-2.5 border transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                  : 'bg-white border-gray-300 focus:border-blue-500'
              }`}
              required
            />
          </div>
          <div>
            <div className="text-sm font-medium mb-1">End Date</div>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
              className={`w-full rounded-lg p-2.5 border transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                  : 'bg-white border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-1">Notes (Optional)</div>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            className={`w-full rounded-lg p-2.5 border transition-colors ${
              isDarkMode
                ? 'bg-dark-card border-gray-700 text-white focus:border-blue-500'
                : 'bg-white border-gray-300 focus:border-blue-500'
            }`}
            rows="3"
            placeholder="Add any special instructions or notes"
          />
        </div>

        <motion.button
          type="submit"
          className={`w-full py-4 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
            isFormValid
              ? isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              : isDarkMode
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={isFormValid ? { scale: 1.02 } : {}}
          whileTap={isFormValid ? { scale: 0.98 } : {}}
          disabled={!isFormValid}
        >
          <FaPlus />
          {initialData ? 'Update Medication' : 'Add Medication'}
        </motion.button>
      </div>
    </form>
  );
};

export default AddMedicationForm;
