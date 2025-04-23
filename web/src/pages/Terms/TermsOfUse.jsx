import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BackButton } from '../../components/Buttons/BackButton';
import { FaFileContract } from 'react-icons/fa';

const TermsOfUse = ({ isDarkMode }) => {
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
          <div className="flex items-center gap-3">
            <FaFileContract className="text-2xl text-green-500" />
            <h1
              className={`text-3xl font-bold py-6 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}
            >
              Terms of Use
            </h1>
          </div>

          <div className="space-y-6">
            <section
              className={`p-6 rounded-lg ${
                isDarkMode
                  ? 'bg-[#3C3C3C]/50 hover:bg-[#3C3C3C]/70'
                  : 'bg-gray-50 hover:bg-gray-100/80'
              } transition-all duration-200`}
            >
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-600 dark:text-gray-300">
                By accessing and using LifeGuard, you accept and agree to be bound by the terms and
                conditions of this agreement.
              </p>
            </section>

            <section
              className={`p-6 rounded-lg ${
                isDarkMode
                  ? 'bg-[#3C3C3C]/50 hover:bg-[#3C3C3C]/70'
                  : 'bg-gray-50 hover:bg-gray-100/80'
              } transition-all duration-200`}
            >
              <h2 className="text-xl font-semibold mb-3">2. User Account</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>You are responsible for maintaining the confidentiality of your account.</li>
                <li>You must be at least 13 years old to use this service.</li>
                <li>You agree to provide accurate and complete information.</li>
              </ul>
            </section>

            <section
              className={`p-6 rounded-lg ${
                isDarkMode
                  ? 'bg-[#3C3C3C]/50 hover:bg-[#3C3C3C]/70'
                  : 'bg-gray-50 hover:bg-gray-100/80'
              } transition-all duration-200`}
            >
              <h2 className="text-xl font-semibold mb-3">3. Privacy</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your use of LifeGuard is also governed by our Privacy Policy. Please review our{' '}
                <Link to="/privacy-policy" className="text-blue-500 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            <section
              className={`p-6 rounded-lg ${
                isDarkMode
                  ? 'bg-[#3C3C3C]/50 hover:bg-[#3C3C3C]/70'
                  : 'bg-gray-50 hover:bg-gray-100/80'
              } transition-all duration-200`}
            >
              <h2 className="text-xl font-semibold mb-3">4. User Conduct</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Use the service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any portion of the service</li>
                <li>Interfere with or disrupt the service</li>
                <li>Share your account credentials with others</li>
              </ul>
            </section>

            <section
              className={`p-6 rounded-lg ${
                isDarkMode
                  ? 'bg-[#3C3C3C]/50 hover:bg-[#3C3C3C]/70'
                  : 'bg-gray-50 hover:bg-gray-100/80'
              } transition-all duration-200`}
            >
              <h2 className="text-xl font-semibold mb-3">5. Service Modifications</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We reserve the right to modify or discontinue the service at any time without
                notice.
              </p>
            </section>

            <section
              className={`p-6 rounded-lg ${
                isDarkMode
                  ? 'bg-[#3C3C3C]/50 hover:bg-[#3C3C3C]/70'
                  : 'bg-gray-50 hover:bg-gray-100/80'
              } transition-all duration-200`}
            >
              <h2 className="text-xl font-semibold mb-3">6. Disclaimer</h2>
              <p className="text-gray-600 dark:text-gray-300">
                The service is provided "as is" without warranties of any kind, either express or
                implied.
              </p>
            </section>

            <section
              className={`p-6 rounded-lg ${
                isDarkMode
                  ? 'bg-[#3C3C3C]/50 hover:bg-[#3C3C3C]/70'
                  : 'bg-gray-50 hover:bg-gray-100/80'
              } transition-all duration-200`}
            >
              <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
              <p className="text-gray-600 dark:text-gray-300">
                If you have any questions about these Terms, please contact us at:{' '}
                <a href="mailto:support@lifeguard.com" className="text-blue-500 hover:underline">
                  support@lifeguard.com
                </a>
              </p>
            </section>
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

export default TermsOfUse;
