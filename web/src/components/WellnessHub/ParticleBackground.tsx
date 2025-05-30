import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  isDarkMode: boolean;
}

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  canvasWidth: number;
  canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5;
  }

  update(): void {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > this.canvasWidth) this.x = 0;
    if (this.x < 0) this.x = this.canvasWidth;
    if (this.y > this.canvasHeight) this.y = 0;
    if (this.y < 0) this.y = this.canvasHeight;
  }

  draw(ctx: CanvasRenderingContext2D, isDarkMode: boolean): void {
    ctx.fillStyle = isDarkMode
      ? `rgba(255, 255, 255, ${this.opacity})`
      : `rgba(0, 0, 0, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles: Particle[] = [];
    let animationFrameId: number;

    const resize = (): void => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Reinitialize particles when resizing
        init();
      }
    };

    const init = (): void => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx, isDarkMode);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        opacity: 0.6,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ParticleBackground;
