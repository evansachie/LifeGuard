import { format } from 'date-fns';

export const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'MMM d');
  } catch (e) {
    return 'Unknown';
  }
};
