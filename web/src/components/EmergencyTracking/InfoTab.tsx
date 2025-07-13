import { useRef, useState, useEffect } from 'react';
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
  locationOverride?: string | null;
}

const InfoTab = ({
  userData,
  isDarkMode,
  actions,
  accraCoordinates,
  isLoading,
  locationOverride,
}: InfoTabProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [, setMapError] = useState<boolean>(false);

  useEmergencyMap(mapContainer, isLoading, isDarkMode, userData, accraCoordinates);

  useEffect(() => {
    const checkMapboxConfig = () => {
      const token = import.meta.env.VITE_MAPBOX_API_KEY;
      if (!token) {
        setMapError(true);
        console.warn('Mapbox API key not found. Map functionality will be limited.');
      }
    };

    checkMapboxConfig();
  }, []);

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-5">
        {/* User Information */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm`}>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 border-gray-600/30">
            User Information
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Name
              </span>
              <span className="text-base font-bold">{userData.name}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Phone
              </span>
              <button
                onClick={() => actions.handlePhoneCall(userData.phone)}
                className="text-base font-bold text-blue-500 hover:underline flex items-center justify-start"
              >
                {userData.phone}
                <FaPhone className="ml-2 text-xs text-green-500" />
              </button>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Email
              </span>
              <a
                href={`mailto:${userData.email}`}
                className="text-base font-bold text-blue-500 hover:underline flex items-center justify-start"
              >
                {userData.email}
                <FaEnvelope className="ml-2 text-xs text-blue-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div
          className={`lg:col-span-2 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold flex items-center">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              Location
            </h3>
            <button
              onClick={() => actions.getDirections(userData.location)}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors flex items-center"
            >
              <FaDirections className="mr-1" /> Directions
            </button>
          </div>

          <div className="mb-3">
            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
              Address
            </span>
            <span className="text-sm font-medium block">
              {locationOverride || userData.location || 'Updating location...'}
            </span>

            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-2 mb-1">
              Coordinates
            </span>
            <span className="text-sm font-medium block">
              {accraCoordinates ? `${accraCoordinates[1]}, ${accraCoordinates[0]}` : 'Updating...'}
              {accraCoordinates && accraCoordinates[1] === 6.6745 ? (
                <span className="ml-2 text-xs text-yellow-500">(Test location: Kumasi)</span>
              ) : null}
            </span>
          </div>

          {/* Compact Map Container */}
          <div className="relative">
            <div
              ref={mapContainer}
              className={`h-32 w-full rounded-lg overflow-hidden border-2 ${
                isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-200'
              } shadow-inner`}
              style={{
                minHeight: '128px',
                position: 'relative',
              }}
            />

            {/* Map overlay with loading state */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <div className="text-white text-sm">Loading map...</div>
              </div>
            )}
          </div>

          {/* Map Action Buttons */}
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={() => actions.findNearbyHospitals(userData.location)}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors flex items-center"
            >
              <FaHospital className="mr-1" /> Hospitals
            </button>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(userData.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition-colors flex items-center"
            >
              Google Maps <FaExternalLinkAlt className="ml-1 text-xs" />
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm`}>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 border-gray-600/30 flex items-center">
            <FaAmbulance className="text-red-500 mr-2" />
            Emergency Actions
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => actions.handlePhoneCall(userData.phone)}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
            >
              <FaPhone className="mr-2" /> Call {userData.name}
            </button>

            <button
              onClick={() => actions.handlePhoneCall('112')}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
            >
              <FaAmbulance className="mr-2" /> Call Emergency Services
            </button>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm`}>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 border-gray-600/30">
            Share Info
          </h3>
          <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
            Share emergency details with others who can help:
          </p>
          <button
            onClick={() => actions.shareEmergencyInfo(userData)}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
          >
            <FaShareAlt className="mr-2" /> Share Emergency Info
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
