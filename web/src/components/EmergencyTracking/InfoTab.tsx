import React, { useRef } from 'react';
import {
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaDirections,
  FaHospital,
  FaExternalLinkAlt,
  FaAmbulance,
  FaShareAlt,
} from 'react-icons/fa';
import { useEmergencyMap } from '../../hooks/useEmergencyMap';
import { EmergencyUserData, EmergencyActions } from '../../types/emergency.types';

interface InfoTabProps {
  userData: EmergencyUserData;
  isDarkMode: boolean;
  actions: EmergencyActions;
  accraCoordinates: [number, number];
  isLoading: boolean;
}

const InfoTab: React.FC<InfoTabProps> = ({ userData, isDarkMode, actions, accraCoordinates, isLoading }) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEmergencyMap(mapContainer, isLoading, isDarkMode, userData, accraCoordinates);

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="mb-4">
        <div
          className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'} border border-red-300 dark:border-red-800 mb-4`}
        >
          <p className="flex items-center">
            <FaClock className="text-red-500 mr-2" />
            <span className="font-medium">Alert triggered at: </span>
            <span className="ml-2">{userData.timestamp}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
        <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm`}>
          <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-600/30">
            User Information
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Name
              </span>
              <span className="text-lg font-bold">{userData.name}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Phone
              </span>
              <div className="flex items-center">
                <button
                  onClick={() => actions.handlePhoneCall(userData.phone)}
                  className="text-lg font-bold text-blue-500 hover:underline flex items-center"
                >
                  {userData.phone}
                  <FaPhone className="ml-2 text-sm text-green-500" />
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Email
              </span>
              <div className="flex items-center">
                <a
                  href={`mailto:${userData.email}`}
                  className="text-lg font-bold text-blue-500 hover:underline flex items-center"
                >
                  {userData.email}
                  <FaEnvelope className="ml-2 text-sm text-blue-500" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm`}>
          <h3 className="text-xl font-semibold mb-3 border-b pb-2 border-gray-600/30 flex items-center justify-between">
            <span>Location</span>
            <button
              onClick={() => actions.getDirections(userData.location)}
              className="text-sm bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition-colors flex items-center"
            >
              <FaDirections className="mr-1" /> Get Directions
            </button>
          </h3>

          <div className="space-y-3 mb-3">
            <div className="flex flex-col">
              <span className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Address
              </span>
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-red-500 mt-1 mr-2" />
                <span className="font-bold">{userData.location}</span>
              </div>
            </div>
          </div>

          <div
            ref={mapContainer}
            className="h-[200px] bg-gray-200 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600"
            id="map"
          />

          <div className="mt-3 flex justify-between">
            <button
              onClick={() => actions.findNearbyHospitals(userData.location)}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors flex items-center"
            >
              <FaHospital className="mr-1" /> Find Nearby Hospitals
            </button>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(userData.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition-colors flex items-center"
            >
              Open in Google Maps <FaExternalLinkAlt className="ml-1 text-xs" />
            </a>
          </div>
        </div>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm`}>
          <h3 className="text-xl font-semibold mb-3 border-b pb-2 border-gray-600/30 flex items-center">
            <FaAmbulance className="text-red-500 mr-2" />
            Emergency Action
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => actions.handlePhoneCall(userData.phone)}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center text-lg font-medium"
            >
              <FaPhone className="mr-2" /> Call {userData.name}
            </button>

            <button
              onClick={() => actions.handlePhoneCall('112')}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center text-lg font-medium"
            >
              <FaAmbulance className="mr-2" /> Call Emergency Services
            </button>
          </div>
    </div>

        <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm`}>
          <h3 className="text-xl font-semibold mb-3 border-b pb-2 border-gray-600/30">Share</h3>
          <p className="mb-3 text-sm">Share this emergency information with others who can help:</p>
          <button
            onClick={() => actions.shareEmergencyInfo(userData)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center text-lg font-medium"
          >
            <FaShareAlt className="mr-2" /> Share Emergency Information
          </button>
          {actions.copySuccess && (
            <p className="text-green-500 text-xs mt-2 text-center">{actions.copySuccess}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoTab;
