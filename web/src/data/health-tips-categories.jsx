import { FaRunning, FaBrain, FaYoutube, FaBookMedical } from 'react-icons/fa';
import { MdHealthAndSafety, MdRestaurant } from 'react-icons/md';

export const categories = [
  { id: 'fitness', icon: <FaRunning />, label: 'Fitness' },
  { id: 'mental', icon: <FaBrain />, label: 'Mental Health' },
  { id: 'nutrition', icon: <MdRestaurant />, label: 'Nutrition' },
  { id: 'prevention', icon: <MdHealthAndSafety />, label: 'Prevention' },
  { id: 'resources', icon: <FaBookMedical />, label: 'Resources' },
  { id: 'videos', icon: <FaYoutube />, label: 'Videos' },
];
