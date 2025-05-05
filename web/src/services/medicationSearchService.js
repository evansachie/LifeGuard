/**
 * Service to search for medications using OpenFDA API
 */
export const searchMedications = async (query, limit = 10) => {
  if (!query || query.length < 2) return [];

  try {
    // Use OpenFDA API to search for medications
    const response = await fetch(
      `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${query}"&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch medication data');
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      // Try searching by generic name if brand name search fails
      const genericResponse = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${query}"&limit=${limit}`
      );

      if (!genericResponse.ok) {
        return [];
      }

      const genericData = await genericResponse.json();
      return formatMedicationResults(genericData.results || []);
    }

    return formatMedicationResults(data.results);
  } catch (error) {
    console.error('Error searching medications:', error);
    return [];
  }
};

/**
 * Format API results into a consistent medication object structure
 */
function formatMedicationResults(results) {
  return results.map((result) => {
    const openfda = result.openfda || {};

    return {
      id:
        openfda.application_number?.[0] ||
        openfda.ndc?.[0] ||
        `med-${Math.random().toString(36).substring(2, 9)}`,
      brandName: openfda.brand_name?.[0] || 'Unknown',
      genericName: openfda.generic_name?.[0] || 'Unknown',
      manufacturer: openfda.manufacturer_name?.[0] || 'Unknown',
      strength: openfda.strength?.[0] || '',
      form: openfda.dosage_form?.[0] || '',
      route: openfda.route?.[0] || '',
      warnings: result.warnings?.[0] || '',
      indications: result.indications_and_usage?.[0] || '',
      dosage: result.dosage_and_administration?.[0] || '',
    };
  });
}
