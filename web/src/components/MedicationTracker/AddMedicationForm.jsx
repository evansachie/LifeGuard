import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaClock } from 'react-icons/fa';

const AddMedicationForm = ({ onSubmit, isDarkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    times: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  });

  const isFormValid = useMemo(() => {
    return formData.name.trim() !== '' && 
           formData.dosage.trim() !== '' && 
           formData.times.length > 0 && 
           formData.times.every(time => time !== '');
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      dosage: '',
      frequency: 'daily',
      times: ['08:00'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    });
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      times: [...prev.times, '12:00']
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium mb-1">Medication Name</div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full rounded-lg p-2.5 border transition-colors ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 focus:border-blue-500'
            }`}
            required
          />
        </div>

        <div>
          <div className="text-sm font-medium mb-1">Dosage</div>
          <input
            type="text"
            value={formData.dosage}
            onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
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
            onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
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
                    setFormData(prev => ({ ...prev, times: newTimes }));
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
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className={`w-full rounded-lg p-2.5 border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-500'
              }`}
              required
            />
          </div>
          <div>
            <div className="text-sm font-medium mb-1">End Date (Optional)</div>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
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
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
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
          Add Medication
        </motion.button>
      </div>
    </form>
  );
};

export default AddMedicationForm;
