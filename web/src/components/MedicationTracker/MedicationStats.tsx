import { motion } from 'framer-motion';
import { FaPills, FaClipboardList, FaChartLine } from 'react-icons/fa';
import { MedicationStatsProps } from '../../types/medicationTracker.types';

const MedicationStats = ({ complianceRate, medications, isDarkMode }: MedicationStatsProps) => {
  const activeMedications = medications.filter((m) => m.Active);
  const totalDoses = medications.reduce((acc, med) => acc + med.Time.length, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[
        {
          title: 'Compliance Rate',
          value: complianceRate ? `${Math.round(complianceRate)}%` : 'N/A',
          icon: <FaChartLine className="text-lg text-blue-500" />,
          color: 'blue',
        },
        {
          title: 'Active Medications',
          value: activeMedications.length,
          icon: <FaPills className="text-lg text-green-500" />,
          color: 'green',
        },
        {
          title: "Today's Doses",
          value: totalDoses,
          icon: <FaClipboardList className="text-lg text-purple-500" />,
          color: 'purple',
        },
      ].map((stat, index) => (
        <motion.div
          key={stat.title}
          className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-dark-card' : 'bg-white'}`}
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { delay: index * 0.1 },
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {stat.title}
              </p>
              <h3 className={`text-2xl font-bold text-${stat.color}-500 mt-1`}>{stat.value}</h3>
            </div>
            {stat.icon}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MedicationStats;
