import { FaUserMd, FaHeartbeat, FaUser, FaAmbulance, FaHospital, FaPills } from 'react-icons/fa';
import { EmergencyUserData, EmergencyActions } from '../../types/emergency.types';

interface MedicalTabProps {
  userData: EmergencyUserData;
  actions: EmergencyActions;
  isDarkMode: boolean;
}

const MedicalTab = ({ userData, actions, isDarkMode }: MedicalTabProps) => {
  return (
    <div className="animate__animated animate__fadeIn">
      <div className="mb-4">
        <div
          className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'} border border-red-300 dark:border-red-800 mb-4 flex items-start`}
        >
          <FaUserMd className="text-red-500 mr-3 mt-1 text-xl" />
          <div>
            <h3 className="font-bold text-red-600 dark:text-red-400">Medical Information</h3>
            <p className="text-sm mt-1">
              This medical information may be critical during an emergency situation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
        <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm`}>
          <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-600/30 flex items-center">
            <FaHeartbeat className="text-red-500 mr-2" />
            Vital Information
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <div
              className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Age</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
                >
                  Demographics
                </span>
              </div>
              <p className="text-xl font-bold mt-1">{userData.medicalInfo.age}</p>
            </div>

            <div
              className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Gender</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
                >
                  Demographics
                </span>
              </div>
              <p className="text-xl font-bold mt-1">{userData.medicalInfo.gender}</p>
            </div>

            <div
              className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Weight</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900/50 text-green-200' : 'bg-green-100 text-green-800'}`}
                >
                  Physical
                </span>
              </div>
              <p className="text-xl font-bold mt-1">{userData.medicalInfo.weight} kg</p>
            </div>

            <div
              className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Height</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900/50 text-green-200' : 'bg-green-100 text-green-800'}`}
                >
                  Physical
                </span>
              </div>
              <p className="text-xl font-bold mt-1">{userData.medicalInfo.height} cm</p>
            </div>
          </div>
        </div>

        <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm`}>
          <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-600/30 flex items-center">
            <FaUser className="text-red-500 mr-2" />
            Bio
          </h3>

          <div
            className={`p-4 rounded-lg mb-2 ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-200'} mb-4 h-auto`}
          >
            <p className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-2">
              Additional User Information
            </p>
            <div className="overflow-y-auto max-h-[200px] whitespace-pre-line">
              {userData.medicalInfo.bio || 'No additional medical information provided.'}
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-4 border-b pb-2 border-gray-600/30 flex items-center">
            <FaPills className="text-red-500 mr-2" />
            Active Medications
          </h3>

          {userData.medications && userData.medications.length > 0 ? (
            <div className="overflow-y-auto max-h-[300px]">
              <div className="grid gap-3">
                {userData.medications.map((med, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-white'
                    } border ${isDarkMode ? 'border-gray-500' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold">{med.Name}</h4>
                        <p className="text-sm">{med.Dosage}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isDarkMode
                            ? 'bg-orange-900/50 text-orange-200'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        Active
                      </span>
                    </div>
                    {med.Notes && (
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                        <strong>Notes:</strong> {med.Notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${
                isDarkMode ? 'border-gray-500' : 'border-gray-200'
              } text-center`}
            >
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                No current medications
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm`}>
          <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-600/30 flex items-center">
            <FaAmbulance className="text-red-500 mr-2" />
            Emergency Medical Action
          </h3>

          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-4 rounded-lg mb-4">
            <h4 className="font-bold text-lg text-white">
              Important Emergency Medical Considerations
            </h4>
            <p className="mt-1 text-sm text-white">
              When responding to a medical emergency, remember these critical points:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div
              className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-200'}`}
            >
              <h5 className="font-bold flex items-center">
                <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center mr-2 text-xs">
                  1
                </span>
                Assess
              </h5>
              <p className="text-sm mt-1">
                Check responsiveness, breathing and immediate dangers first
              </p>
            </div>

            <div
              className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-200'}`}
            >
              <h5 className="font-bold flex items-center">
                <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center mr-2 text-xs">
                  2
                </span>
                Act
              </h5>
              <p className="text-sm mt-1">
                Call emergency services and provide this person&apos;s details
              </p>
            </div>

            <div
              className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-200'}`}
            >
              <h5 className="font-bold flex items-center">
                <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center mr-2 text-xs">
                  3
                </span>
                Monitor
              </h5>
              <p className="text-sm mt-1">
                Stay with the person and monitor their condition until help arrives
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-2">
            <button
              onClick={() => actions.handlePhoneCall('112')}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center text-lg font-medium"
            >
              <FaAmbulance className="mr-2" /> Call Emergency Services
            </button>

            <button
              onClick={() => actions.findNearbyHospitals(userData.location)}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center text-lg font-medium"
            >
              <FaHospital className="mr-2" /> Find Nearby Hospitals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalTab;
