import { motion } from 'framer-motion';
import { FaRegCheckCircle, FaChevronLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface TermsOfUseProps {
  isDarkMode: boolean;
}

const TermsOfUse = ({ isDarkMode }: TermsOfUseProps) => {
  return (
    <div
      className={`py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${
        isDarkMode ? 'text-gray-200' : 'text-gray-800'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <Link
            to="/dashboard"
            className={`flex items-center ${
              isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            } transition-colors`}
          >
            <FaChevronLeft className="mr-1" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>

        <div className={`rounded-xl p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
          <h2 className="text-xl font-semibold mb-4">Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the LifeGuard application (the &quot;App&quot;), you agree to be
            these Terms of Use. If you do not agree to these Terms, you may not use the App.
          </p>

          <h2 className="text-xl font-semibold mb-4 mt-8">Use of the Service</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              You must be at least 18 years old to use this App or have permission from a parent or
              guardian.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account.
            </li>
            <li>
              You agree not to use the App for any illegal purposes or in violation of any local,
              state, national, or international law.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mb-4 mt-8">Health Information</h2>
          <p className="mb-4">
            LifeGuard is designed to monitor and provide information about health metrics and
            environmental conditions. However:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              The App is not a substitute for professional medical advice, diagnosis, or treatment.
            </li>
            <li>
              Always seek the advice of your physician or other qualified health provider with any
              questions regarding a medical condition.
            </li>
            <li>
              Never disregard professional medical advice or delay seeking it because of information
              provided by the App.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mb-4 mt-8">Data Privacy</h2>
          <p className="mb-4">
            Please refer to our Privacy Policy for information about how we collect, use, and
            disclose your personal information.
          </p>

          <h2 className="text-xl font-semibold mb-4 mt-8">Changes to Terms</h2>
          <p className="mb-4">
            We may modify these Terms at any time. Your continued use of the App after any
            modifications indicates your acceptance of the modified Terms.
          </p>

          <h2 className="text-xl font-semibold mb-4 mt-8">Termination</h2>
          <p className="mb-4">
            We reserve the right to terminate or suspend your account and access to the App at any
            time, without prior notice or liability, for any reason.
          </p>

          <h2 className="text-xl font-semibold mb-4 mt-8">Disclaimer of Warranties</h2>
          <p className="mb-4">
            The App is provided &quot;as is&quot; and &quot;as available&quot; without any
            warranties of any kind, either express or implied, including but not limited to, the
            implied warranties of merchantability, fitness for a particular purpose, or
            non-infringement.
          </p>

          <h2 className="text-xl font-semibold mb-4 mt-8">Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall LifeGuard or its suppliers be liable for any damages whatsoever,
            including without limitation, damages for loss of use, data, or profits, arising out of
            the use or inability to use the App.
          </p>

          <h2 className="text-xl font-semibold mb-4 mt-8">Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed by the laws of the jurisdiction in which you reside,
            without regard to its conflict of law provisions.
          </p>

          <h2 className="text-xl font-semibold mb-4 mt-8">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at support@lifeguard.com.
          </p>
        </div>

        <div
          className={`flex items-center rounded-lg p-4 ${
            isDarkMode ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-50 text-blue-800'
          } mb-8`}
        >
          <FaRegCheckCircle className="text-xl mr-3 flex-shrink-0" />
          <p>
            By using LifeGuard, you acknowledge that you have read and understood our Terms of Use
            and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfUse;
