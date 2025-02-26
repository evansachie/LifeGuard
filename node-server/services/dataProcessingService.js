const { processDocuments } = require('./ragService');

// Process health data for RAG
async function processHealthData(healthData) {
  try {
    const documents = healthData.map(data => {
      // Convert health data to document format
      let content = `User health reading from ${new Date(data.timestamp).toLocaleString()}. `;
      
      if (data.heartRate) {
        content += `Heart rate: ${data.heartRate} BPM. `;
      }
      
      if (data.bloodPressure) {
        content += `Blood pressure: ${data.bloodPressure.systolic}/${data.bloodPressure.diastolic} mmHg. `;
      }
      
      if (data.bodyTemperature) {
        content += `Body temperature: ${data.bodyTemperature}°C. `;
      }
      
      if (data.oxygenSaturation) {
        content += `Oxygen saturation: ${data.oxygenSaturation}%. `;
      }
      
      if (data.activity) {
        content += `Activity: ${data.activity}. `;
      }
      
      return {
        content,
        source: 'health_data',
        type: 'health_reading',
        userId: data.userId,
        timestamp: data.timestamp
      };
    });
    
    await processDocuments(documents);
    return true;
  } catch (error) {
    console.error('Error processing health data:', error);
    throw error;
  }
}

// Process environmental data for RAG
async function processEnvironmentalData(envData) {
  try {
    const documents = envData.map(data => {
      // Convert environmental data to document format
      let content = `Environmental reading from ${new Date(data.timestamp).toLocaleString()}. `;
      
      if (data.temperature) {
        content += `Temperature: ${data.temperature}°C. `;
      }
      
      if (data.humidity) {
        content += `Humidity: ${data.humidity}%. `;
      }
      
      if (data.airQuality) {
        content += `Air quality index: ${data.airQuality}. `;
      }
      
      if (data.barometricPressure) {
        content += `Barometric pressure: ${data.barometricPressure} hPa. `;
      }
      
      if (data.location) {
        content += `Location: Latitude ${data.location.latitude}, Longitude ${data.location.longitude}. `;
      }
      
      return {
        content,
        source: 'environmental_data',
        type: 'environmental_reading',
        userId: data.userId,
        timestamp: data.timestamp
      };
    });
    
    await processDocuments(documents);
    return true;
  } catch (error) {
    console.error('Error processing environmental data:', error);
    throw error;
  }
}

// Process medical knowledge for RAG
async function processMedicalKnowledge(medicalData) {
  try {
    const documents = medicalData.map(data => {
      return {
        content: data.content,
        source: 'medical_knowledge',
        type: data.type || 'general',
        userId: 'system',
        timestamp: data.timestamp || new Date().toISOString()
      };
    });
    
    await processDocuments(documents);
    return true;
  } catch (error) {
    console.error('Error processing medical knowledge:', error);
    throw error;
  }
}

// Process user profile data for personalized responses
async function processUserProfiles(profiles) {
  try {
    const documents = profiles.map(profile => {
      let content = `User profile for user ID ${profile.userId}. `;
      
      if (profile.name) {
        content += `Name: ${profile.name}. `;
      }
      
      if (profile.age) {
        content += `Age: ${profile.age}. `;
      }
      
      if (profile.gender) {
        content += `Gender: ${profile.gender}. `;
      }
      
      if (profile.medicalConditions && profile.medicalConditions.length > 0) {
        content += `Medical conditions: ${profile.medicalConditions.join(', ')}. `;
      }
      
      if (profile.medications && profile.medications.length > 0) {
        content += `Medications: ${profile.medications.join(', ')}. `;
      }
      
      if (profile.allergies && profile.allergies.length > 0) {
        content += `Allergies: ${profile.allergies.join(', ')}. `;
      }
      
      return {
        content,
        source: 'user_profile',
        type: 'profile',
        userId: profile.userId,
        timestamp: profile.updatedAt || new Date().toISOString()
      };
    });
    
    await processDocuments(documents);
    return true;
  } catch (error) {
    console.error('Error processing user profiles:', error);
    throw error;
  }
}

module.exports = {
  processHealthData,
  processEnvironmentalData,
  processMedicalKnowledge,
  processUserProfiles
};
