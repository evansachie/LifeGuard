import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaClock } from 'react-icons/fa';
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';
import { toast } from 'react-toastify';
import Spinner from '../Spinner/Spinner';
import {
  NotificationPreferencesProps,
  PreferencesState,
} from '../../types/medicationTracker.types';

const NotificationPreferences = ({ isDarkMode, onClose }: NotificationPreferencesProps) => {
  const [preferences, setPreferences] = useState<PreferencesState>({
    emailNotifications: true,
    reminderLeadTime: 15,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async (): Promise<void> => {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.USER_PREFERENCES.NOTIFICATIONS);
      const dbPrefs = response.data || {};
      setPreferences({
        emailNotifications: dbPrefs.EmailNotifications ?? true,
        reminderLeadTime: dbPrefs.ReminderLeadTime ?? 15,
      });
    } catch (error) {
      toast.error('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    try {
      await fetchWithAuth(API_ENDPOINTS.USER_PREFERENCES.NOTIFICATIONS, {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
      toast.success('Preferences saved successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Spinner size="medium" color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaBell className="text-blue-500" />
            <div>
              <label htmlFor="emailNotifications" className="font-medium cursor-pointer">
                Email Notifications
              </label>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Receive email reminders for your medications
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            id="emailNotifications"
            checked={preferences.emailNotifications}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                emailNotifications: e.target.checked,
              }))
            }
            className={`w-5 h-5 rounded border cursor-pointer ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-blue-500'
                : 'bg-white border-gray-300 text-blue-600'
            }`}
            aria-describedby="email-notifications-description"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaClock className="text-blue-500" />
            <div>
              <label htmlFor="reminderLeadTime" className="font-medium">
                Reminder Lead Time
              </label>
              <p
                id="reminder-lead-time-description"
                className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Minutes before scheduled time
              </p>
            </div>
          </div>
          <select
            id="reminderLeadTime"
            value={preferences.reminderLeadTime}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                reminderLeadTime: Number(e.target.value),
              }))
            }
            className={`rounded-lg px-3 py-2 border ${
              isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
            }`}
            aria-describedby="reminder-lead-time-description"
          >
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className={`px-4 py-2 rounded-lg ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
        >
          Cancel
        </button>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 
            disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>
    </div>
  );
};

export default NotificationPreferences;
