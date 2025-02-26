require('dotenv').config();
const { connectToDatabase } = require('../config/mongodb');
const { processMedicalKnowledge } = require('../services/dataProcessingService');
const { createDocumentCollection } = require('../services/ragService');

// Sample medical knowledge data
const medicalKnowledgeData = [
  {
    content: "Heart rate is the number of times your heart beats per minute. A normal resting heart rate for adults ranges from 60 to 100 beats per minute. Generally, a lower heart rate at rest implies more efficient heart function and better cardiovascular fitness.",
    type: "heart_rate",
    timestamp: new Date().toISOString()
  },
  {
    content: "Blood pressure is the pressure of circulating blood against the walls of blood vessels. It is usually expressed in terms of the systolic pressure (maximum pressure during one heartbeat) over diastolic pressure (minimum pressure between heartbeats). A normal blood pressure reading is less than 120/80 mm Hg.",
    type: "blood_pressure",
    timestamp: new Date().toISOString()
  },
  {
    content: "Body temperature is a measure of the body's ability to generate and get rid of heat. The normal body temperature is 98.6°F (37°C) but can range from 97°F (36.1°C) to 99°F (37.2°C).",
    type: "body_temperature",
    timestamp: new Date().toISOString()
  },
  {
    content: "Oxygen saturation (SpO2) is a measure of the amount of oxygen-carrying hemoglobin in the blood relative to the amount of hemoglobin not carrying oxygen. Normal SpO2 levels are between 95% and 100%. Values under 90% are considered low.",
    type: "oxygen_saturation",
    timestamp: new Date().toISOString()
  },
  {
    content: "Regular physical activity can help prevent heart disease, stroke, diabetes, and several forms of cancer. Aim for at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous activity each week, along with muscle-strengthening activities on 2 or more days a week.",
    type: "physical_activity",
    timestamp: new Date().toISOString()
  },
  {
    content: "Sleep is essential for health and well-being. Adults should aim for 7-9 hours of quality sleep per night. Poor sleep has been linked to higher risks of conditions like heart disease, kidney disease, high blood pressure, diabetes, stroke, obesity, and depression.",
    type: "sleep",
    timestamp: new Date().toISOString()
  },
  {
    content: "Hydration is crucial for health. Water helps regulate body temperature, keep joints lubricated, prevent infections, deliver nutrients to cells, and keep organs functioning properly. It also improves sleep quality, cognition, and mood. Aim to drink about 8 glasses of water per day.",
    type: "hydration",
    timestamp: new Date().toISOString()
  },
  {
    content: "A balanced diet includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. It provides essential nutrients for growth, immune function, disease prevention, and overall health. Limit intake of processed foods, added sugars, and excessive salt.",
    type: "nutrition",
    timestamp: new Date().toISOString()
  },
  {
    content: "Stress management is important for overall health. Chronic stress can contribute to health problems like heart disease, high blood pressure, diabetes, and mental disorders like depression or anxiety. Techniques such as mindfulness, meditation, exercise, and adequate sleep can help manage stress.",
    type: "stress_management",
    timestamp: new Date().toISOString()
  },
  {
    content: "Air quality affects respiratory and cardiovascular health. Poor air quality can cause or worsen conditions like asthma, chronic obstructive pulmonary disease (COPD), heart disease, and stroke. Monitoring air quality and taking precautions on days with high pollution can help protect health.",
    type: "air_quality",
    timestamp: new Date().toISOString()
  }
];

async function seedMedicalKnowledge() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Create document collection if it doesn't exist
    await createDocumentCollection();
    
    // Process and store medical knowledge
    await processMedicalKnowledge(medicalKnowledgeData);
    
    console.log('Successfully seeded medical knowledge data');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding medical knowledge:', error);
    process.exit(1);
  }
}

// Run the seed function
seedMedicalKnowledge();
