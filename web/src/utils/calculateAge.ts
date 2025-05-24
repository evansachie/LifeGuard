/**
 * Calculate age from birth date string
 * @param birthDateString - Birth date in format YYYY-MM-DD
 * @returns Age in years or null if calculation fails
 */
export const calculateAge = (birthDateString: string): number | null => {
  if (!birthDateString) {
    console.error('No birth date provided');
    return null;
  }

  try {
    // Parse the birthDateString to ensure we have a valid date
    const birthDate = new Date(birthDateString);

    // Check if birthDate is valid
    if (isNaN(birthDate.getTime())) {
      console.error('Invalid birth date format:', birthDateString);
      return null;
    }

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // If birth month hasn't occurred yet this year, or
    // it's the birth month but the birth day hasn't occurred yet,
    // then reduce the age by 1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    console.log(`Calculated age from ${birthDateString}: ${age}`);
    return age;
  } catch (error) {
    console.error('Error calculating age:', error);
    return null;
  }
};
