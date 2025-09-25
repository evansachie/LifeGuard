import { useEffect, useRef } from 'react';
import { AudioVisualizerProps } from '../../types/wellnessHub.types';

const AudioVisualizer = ({ audioRef, isDarkMode }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (audioRef.current && !analyserRef.current) {
      try {
        // Create audio context and analyser
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);

        source.connect(analyser);
        analyser.connect(audioContextRef.current.destination);

        analyser.fftSize = 256;
        analyserRef.current = analyser;
      } catch (error: unknown) {
        console.error('Failed to setup audio context:', error);
      }
    }
  }, [audioRef]);

  useEffect(() => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = (): void => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const animate = (): void => {
        animationRef.current = requestAnimationFrame(animate);

        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDarkMode]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch((error: unknown) => {
          console.error('Failed to close audio context:', error);
        });
      }
    };
  }, []);

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
