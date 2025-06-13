import { motion } from 'framer-motion';
import {
  FaShieldAlt,
  FaUserShield,
  FaDatabase,
  FaLock,
  FaShareAlt,
  FaUserCog,
  FaHistory,
  FaEnvelope,
} from 'react-icons/fa';
import { Section } from '../../components/PrivacyPolicy/Section';
import { BackButton } from '../../components/Buttons/BackButton';

interface PrivacyPolicyProps {
  isDarkMode: boolean;
}

const PrivacyPolicy = ({ isDarkMode }: PrivacyPolicyProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`min-h-screen p-6 md:p-12 ${
        isDarkMode
          ? 'dark-mode bg-gradient-to-br from-gray-900 to-gray-800'
          : 'bg-gradient-to-br from-gray-50 to-white text-gray-900'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <BackButton text="Back to Settings" to="/settings" isDarkMode={isDarkMode} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-8 rounded-xl shadow-lg backdrop-blur-sm ${
            isDarkMode ? 'bg-[#2D2D2D]/90 hover:bg-[#2D2D2D]/95' : 'bg-white/90 hover:bg-white/95'
          } transition-all duration-300`}
        >
          <div className="flex items-center gap-3 mb-8">
            <FaShieldAlt className="text-3xl text-blue-500" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>

          <div className="space-y-8">
            {/* Privacy sections with icons */}
            <Section
              icon={<FaUserShield />}
              title="Our Commitment to Privacy"
              isDarkMode={isDarkMode}
            >
              <p>
                Your privacy is important to us. This Privacy Policy outlines how we collect, use,
                and protect your personal information when you use our application.
              </p>
            </Section>

            <Section icon={<FaDatabase />} title="Information We Collect" isDarkMode={isDarkMode}>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Personal Information:</strong> Name, email, profile picture
                </li>
                <li>
                  <strong>Health Data:</strong> Activity tracking, health metrics
                </li>
                <li>
                  <strong>Environmental Data:</strong> Air quality readings
                </li>
                <li>
                  <strong>Usage Information:</strong> App interactions, preferences
                </li>
              </ul>
            </Section>

            <Section
              icon={<FaLock />}
              title="How We Protect Your Information"
              isDarkMode={isDarkMode}
            >
              <p>We implement industry-standard security measures including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>End-to-end encryption</li>
                <li>Secure data storage</li>
                <li>Regular security audits</li>
                <li>Access controls</li>
              </ul>
            </Section>

            <Section icon={<FaShareAlt />} title="Information Sharing" isDarkMode={isDarkMode}>
              <p>We do not sell your personal information. We only share data with:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Service providers who assist in delivering our services</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </Section>

            <Section icon={<FaUserCog />} title="Your Choices" isDarkMode={isDarkMode}>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and update your information</li>
                <li>Request data deletion</li>
                <li>Opt-out of communications</li>
                <li>Control app permissions</li>
              </ul>
            </Section>

            <Section icon={<FaHistory />} title="Policy Updates" isDarkMode={isDarkMode}>
              <p>
                We may update this policy periodically. We will notify you of significant changes
                via email or app notification.
              </p>
            </Section>

            <Section icon={<FaEnvelope />} title="Contact Us" isDarkMode={isDarkMode}>
              <p className="mb-2">For privacy-related inquiries, contact us at:</p>
              <div className="space-y-1">
                <a
                  href="mailto:evansachie0101@gmail.com"
                  className="block text-blue-500 hover:underline"
                >
                  evansachie0101@gmail.com
                </a>
                <a
                  href="mailto:michaeladugyamfi76@gmail.com"
                  className="block text-blue-500 hover:underline"
                >
                  michaeladugyamfi76@gmail.com
                </a>
              </div>
            </Section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
