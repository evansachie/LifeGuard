import React, { useEffect, useRef, useState } from 'react';
import { useAudio } from '../../contexts/AudioContext';

const AudioVisualizer = ({ audioRef, isDarkMode }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [analyser, setAnalyser] = useState(null);
  const { setupAudioContext } = useAudio();

  useEffect(() => {
    if (audioRef.current && !analyser) {
      const newAnalyser = setupAudioContext(audioRef.current);
      setAnalyser(newAnalyser);
    }
  }, [audioRef, analyser, setupAudioContext]);

  useEffect(() => {
    if (!analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        if (isDarkMode) {
          gradient.addColorStop(0, '#3182ce');
          gradient.addColorStop(0.5, '#805ad5');
          gradient.addColorStop(1, '#d53f8c');
        } else {
          gradient.addColorStop(0, '#2b6cb0');
          gradient.addColorStop(0.5, '#6b46c1');
          gradient.addColorStop(1, '#b83280');
        }

        dataArray.forEach((item) => {
          const barHeight = item * 0.7;
          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        });
      };

      animate();
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="audio-visualizer"
      style={{
        width: '100%',
        height: '100px',
        borderRadius: '10px',
        marginTop: '1rem',
      }}
    />
  );
};

export default AudioVisualizer;
