import { format } from 'date-fns';

/**
 * Formats a date string to 'MMM d' format (e.g., "Jan 5")
 * @param dateString - Date string to format
 * @returns Formatted date string or 'Unknown' if invalid date
 */
export const formatDate = (dateString: string | Date): string => {
  try {
    return format(new Date(dateString), 'MMM d');
  } catch (e) {
    return 'Unknown';
  }
};
