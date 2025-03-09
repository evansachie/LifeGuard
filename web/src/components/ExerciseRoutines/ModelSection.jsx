import React, { useEffect } from 'react';

const MODEL_URL = import.meta.env.VITE_MODEL_URL;

const ModelSection = ({ activeExercise, selectedCategory }) => {
  useEffect(() => {
    const iframe = document.querySelector('.model-container iframe');
    if (!iframe || !selectedCategory) return;

    iframe.src = `${MODEL_URL}`;

    const highlightMuscles = () => {
      if (!activeExercise?.targetMuscles) return;

      iframe.contentWindow.postMessage({
        type: 'callMethod',
        data: {
          method: 'clearAnnotations'
        }
      }, '*');

      activeExercise.targetMuscles.forEach(muscle => {
        iframe.contentWindow.postMessage({
          type: 'callMethod',
          data: {
            method: 'showAnnotation',
            args: [muscle]
          }
        }, '*');
      });
    };

    const attempts = [0, 1000, 2000, 3000]; 
    attempts.forEach(delay => {
      setTimeout(highlightMuscles, delay);
    });

    const handleMessage = (event) => {
      if (event.data === 'viewerready') {
        highlightMuscles();
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [activeExercise, selectedCategory]);

  return (
    <div className="model-section">
      <div className="model-container">
        <iframe
          title="3D Muscle Model"
          src={MODEL_URL}
          allowFullScreen
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
        />
      </div>
    </div>
  );
};

export default ModelSection;
