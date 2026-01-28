import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export function MouseEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef<number>();
  const lastParticleTimeRef = useRef(0);
  const particleIdRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
      'rgba(79, 70, 229, ',
      'rgba(225, 29, 72, ',
      'rgba(59, 130, 246, ',
      'rgba(34, 197, 94, '
    ];

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      cursorRef.current = { x: e.clientX, y: e.clientY };

      const now = Date.now();
      if (now - lastParticleTimeRef.current > 30) {
        lastParticleTimeRef.current = now;

        const vx = (Math.random() - 0.5) * 8;
        const vy = (Math.random() - 0.5) * 8;
        const color = colors[Math.floor(Math.random() * colors.length)];

        const newParticle: Particle = {
          id: particleIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          vx,
          vy,
          life: 1,
          color
        };

        particlesRef.current.push(newParticle);
      }
    };

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const vx = Math.cos(angle) * 5;
        const vy = Math.sin(angle) * 5;
        const color = colors[Math.floor(Math.random() * colors.length)];

        const newParticle: Particle = {
          id: particleIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          vx,
          vy,
          life: 1,
          color
        };

        particlesRef.current.push(newParticle);
      }
    };

    const handleWindowResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2;
        particle.life -= 0.02;

        const size = Math.max(0, particle.life * 8);
        const opacity = Math.max(0, particle.life);

        if (size > 0.1) {
          ctx.fillStyle = particle.color + opacity.toFixed(2) + ')';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      const cursorSize = 12;
      ctx.strokeStyle = `rgba(79, 70, 229, 0.6)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cursorRef.current.x, cursorRef.current.y, cursorSize, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(225, 29, 72, 0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cursorRef.current.x, cursorRef.current.y, cursorSize + 6, 0, Math.PI * 2);
      ctx.stroke();

      animationIdRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleWindowResize);

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleWindowResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 50
      }}
    />
  );
}
