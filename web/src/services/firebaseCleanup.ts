import { database } from './firebaseConfig';
import { ref, set, get, query } from 'firebase/database';

/**
 * Cleans up the Firebase database structure by removing test data
 * and ensuring the proper data structure is in place.
 */
export const cleanupFirebaseStructure = async (deviceId: string): Promise<void> => {
  console.log('🧹 Starting Firebase structure cleanup for device:', deviceId);

  try {
    // Check if the test key exists
    const testRef = ref(database, `devices/${deviceId}/sensorData/test`);
    const testSnapshot = await get(query(testRef));

    if (testSnapshot.exists()) {
      console.log('🔍 Found static test data, removing it...');

      // Save the test data temporarily if needed for migration
      const testData = testSnapshot.val();
      console.log('📊 Test data content:', testData);

      // Delete the test key
      await set(testRef, null);
      console.log('✅ Successfully removed test data');

      // Optionally migrate the test data to a properly formatted entry
      if (testData) {
        const timestamp = testData.timestamp || Date.now();
        const properKey = `data_${timestamp}`;
        const properRef = ref(database, `devices/${deviceId}/sensorData/${properKey}`);

        // Only migrate if there's actual data
        if (testData.environmental || testData.motion) {
          console.log('📦 Migrating test data to proper format with key:', properKey);
          await set(properRef, {
            ...testData,
            timestamp: timestamp,
          });
          console.log('✅ Successfully migrated test data');
        }
      }
    } else {
      console.log('✅ No test data found, structure is already clean');
    }
  } catch (error) {
    console.error('❌ Error during Firebase cleanup:', error);
  }
};
