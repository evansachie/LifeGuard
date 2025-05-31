import React from 'react';

interface ProfileData {
  age: string | number;
  gender: string;
  weight: string | number;
  height: string | number;
  [key: string]: string | number | boolean | undefined;
}

interface PhysicalInformationSectionProps {
  profileData: ProfileData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  editMode: boolean;
  isDarkMode: boolean;
}

const PhysicalInformationSection: React.FC<PhysicalInformationSectionProps> = ({
  profileData,
  handleInputChange,
  editMode,
  isDarkMode,
}) => {
  return (
    <div className="physical-info-section">
      <h3>Physical Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Age</div>
          <input
            type="number"
            name="age"
            value={profileData.age}
            onChange={handleInputChange}
            disabled={!editMode}
            placeholder="Enter age"
            min="0"
            max="120"
            step="1"
          />
        </div>

        <div className="form-group">
          <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Gender</div>
          <select
            name="gender"
            value={profileData.gender}
            onChange={handleInputChange}
            disabled={!editMode}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Weight (kg)</div>
          <input
            type="number"
            name="weight"
            value={profileData.weight}
            onChange={handleInputChange}
            disabled={!editMode}
            placeholder="Enter weight"
            min="0"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Height (cm)</div>
          <input
            type="number"
            name="height"
            value={profileData.height}
            onChange={handleInputChange}
            disabled={!editMode}
            placeholder="Enter height"
            min="0"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
};

export default PhysicalInformationSection;
