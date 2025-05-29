import React from 'react';
import {
  FaAmbulance,
  FaPhone,
  FaMapMarkerAlt,
  FaDirections,
  FaHospital,
  FaExternalLinkAlt,
  FaShareAlt,
  FaClipboardList,
} from 'react-icons/fa';
import { EmergencyUserData, EmergencyActions } from '../../types/emergency.types';

interface ActionsTabProps {
  userData: EmergencyUserData;
  actions: EmergencyActions;
  isDarkMode: boolean;
}

const ActionsTab: React.FC<ActionsTabProps> = ({ userData, actions, isDarkMode }) => {
  return (
    <div className="animate__animated animate__fadeIn">
      <div className="mb-4">
        <div
          className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'} border border-red-300 dark:border-red-800 mb-4 flex items-start`}
        >
          <FaAmbulance className="text-red-500 mr-3 mt-1 text-xl" />
          <div>
            <h3 className="font-bold text-red-600 dark:text-red-400">Emergency Response Actions</h3>
            <p className="text-sm mt-1">
              Take immediate action to assist {userData.name}. Every second counts in an emergency.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} hover:shadow-lg transition-all`}
        >
          <button
            onClick={() => actions.handlePhoneCall(userData.phone)}
            className="w-full text-left"
          >
            <div className="flex items-center mb-3">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaPhone className="text-2xl" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold">Call {userData.name}</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Primary action
                </p>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} mb-3`}>
              <span className="font-bold">Phone:</span> {userData.phone}
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
              Call the person who triggered this emergency alert immediately to check on their
              situation.
            </p>
          </button>
        </div>

        <div
          className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} hover:shadow-lg transition-all`}
        >
          <button onClick={() => actions.handlePhoneCall('112')} className="w-full text-left">
            <div className="flex items-center mb-3">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <FaAmbulance className="text-2xl" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold">Emergency Services</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Urgent help required
                </p>
              </div>
            </div>
            <div
              className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} mb-3 text-center`}
            >
              <span className="text-2xl font-bold text-red-500">112</span>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
              Call emergency services for professional medical assistance if the situation appears
              serious.
            </p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} hover:shadow-lg transition-all`}
        >
          <div className="flex items-center mb-3">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaMapMarkerAlt className="text-2xl" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold">Location Actions</h3>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Find & navigate
              </p>
            </div>
          </div>

          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3`}>
            Use these options to find the person&apos;s location or nearby medical facilities.
          </p>

          <div className="space-y-2">
            <button
              onClick={() => actions.getDirections(userData.location)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center justify-center font-medium"
            >
              <FaDirections className="mr-2" /> Get Directions
            </button>

            <button
              onClick={() => actions.findNearbyHospitals(userData.location)}
              className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all flex items-center justify-center font-medium"
            >
              <FaHospital className="mr-2" /> Find Nearby Hospitals
            </button>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(userData.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all flex items-center justify-center font-medium"
            >
              <FaExternalLinkAlt className="mr-2" /> Open in Google Maps
            </a>
          </div>
        </div>

        <div
          className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} hover:shadow-lg transition-all`}
        >
          <div className="flex items-center mb-3">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaShareAlt className="text-2xl" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold">Share Information</h3>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Coordinate response
              </p>
            </div>
          </div>

          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3`}>
            Share this emergency information with others who can help respond.
          </p>

          <button
            onClick={() => actions.shareEmergencyInfo(userData)}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center justify-center font-medium mb-3"
          >
            <FaShareAlt className="mr-2" /> Share Emergency Details
          </button>

          {actions.copySuccess && (
            <div className="text-green-500 text-sm p-2 bg-green-100 dark:bg-green-900/30 rounded text-center">
              {actions.copySuccess}
            </div>
          )}

          <div className="mt-3 p-2 rounded-lg bg-gray-800/40 text-xs">
            <p className="font-medium mb-1">Information shared:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name: {userData.name}</li>
              <li>Phone: {userData.phone}</li>
              <li>Location: {userData.location}</li>
            </ul>
          </div>
        </div>
      </div>

      <div
        className={`p-5 rounded-lg ${isDarkMode ? 'bg-red-900/40' : 'bg-red-50'} border border-red-300 dark:border-red-800`}
      >
        <h3 className="font-semibold text-red-600 dark:text-red-400 flex items-center text-lg mb-3">
          <FaClipboardList className="mr-2" />
          Emergency Response Checklist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold mb-2 text-sm uppercase tracking-wider">Immediate Actions</h4>
            <ul className="list-none space-y-2">
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center mr-2 text-xs mt-0.5">
                  1
                </span>
                <span>Call the person to assess their condition</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center mr-2 text-xs mt-0.5">
                  2
                </span>
                <span>Get their exact location if possible</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center mr-2 text-xs mt-0.5">
                  3
                </span>
                <span>Call emergency services if situation is serious</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2 text-sm uppercase tracking-wider">When Help Arrives</h4>
            <ul className="list-none space-y-2">
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center mr-2 text-xs mt-0.5">
                  4
                </span>
                <span>Share the medical information from this page</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center mr-2 text-xs mt-0.5">
                  5
                </span>
                <span>Provide any additional context you have</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center mr-2 text-xs mt-0.5">
                  6
                </span>
                <span>Stay with the person until they receive care</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionsTab;
