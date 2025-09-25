import { memo } from 'react';
import { FaExternalLinkAlt, FaShareAlt, FaBookmark } from 'react-icons/fa';
import { HealthTip, RelatedTip } from '../../types/healthTips.types';
import Modal from '../Modal/Modal';

interface HealthTipModalProps {
  tip: HealthTip | null;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const HealthTipModal = ({ tip, isOpen, onClose, isDarkMode }: HealthTipModalProps) => {
  if (!isOpen || !tip) return null;

  const handleShare = (): void => {
    if (navigator.share) {
      navigator
        .share({
          title: tip.title,
          text: tip.description,
          url: window.location.href,
        })
        .catch((error) => console.log('Error sharing:', error));
    }
  };

  const canShare = (): boolean => {
    return typeof navigator.share !== 'undefined';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-2xl"
      zIndex="z-[1050]"
      isDarkMode={isDarkMode}
      showCloseButton={true}
    >
      <div className="p-5">
        <h2 className="text-xl font-bold mb-5">{tip.title}</h2>

        {tip.imageUrl && (
          <div className="mb-5 -mx-5">
            <img
              src={tip.imageUrl}
              alt={tip.imageAlt || ''}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/default-health.jpg';
              }}
            />
          </div>
        )}

        <div
          className={`inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wide rounded-full ${
            isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'
          }`}
        >
          {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
        </div>

        <div className="space-y-4">
          <p
            className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            {tip.description}
          </p>

          {tip.longDescription && (
            <p
              className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {tip.longDescription}
            </p>
          )}

          {tip.tips && tip.tips.length > 0 && (
            <div className={`mt-5 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-2">Key Points:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {tip.tips.map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div
          className={`flex flex-wrap gap-3 mt-6 pt-5 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          {tip.url && (
            <a
              href={tip.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 py-2 px-4 rounded-lg ${
                isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-medium transition-colors`}
            >
              Learn More <FaExternalLinkAlt size={14} />
            </a>
          )}

          <button
            className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
            aria-label="Save this tip"
          >
            <FaBookmark size={14} /> Save
          </button>

          {canShare() && (
            <button
              className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
              onClick={handleShare}
              aria-label="Share this tip"
            >
              <FaShareAlt size={14} /> Share
            </button>
          )}
        </div>

        {tip.relatedTips && tip.relatedTips.length > 0 && (
          <div
            className={`mt-8 pt-5 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <h3 className="text-lg font-semibold mb-4">Related Tips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tip.relatedTips.map((relatedTip: RelatedTip) => (
                <div
                  key={relatedTip.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all hover:-translate-y-1 ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <h4 className="font-medium mb-1">{relatedTip.title}</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {relatedTip.description.substring(0, 60)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default memo(HealthTipModal);
