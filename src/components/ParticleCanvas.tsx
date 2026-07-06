import React, { useEffect, useRef, useState } from 'react';

interface ParticleCanvasProps {
  mood?: 'cyan' | 'violet' | 'green';
  speedMultiplier?: number;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  angle: number;
  speed: number;
  orbitRadius: number;
  z: number; // For 3D depth perception
}

interface Node3D {
  x: number;
  y: number;
  z: number;
  px: number; // Projected x
  py: number; // Projected y
}

export default function ParticleCanvas({ mood = 'cyan', speedMultiplier = 1 }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const [fps, setFps] = useState(60);

  // Set colors based on mood
  const getColors = () => {
    switch (mood) {
      case 'violet':
        return {
          primary: 'rgba(139, 92, 246, 0.75)',
          primaryGlow: 'rgba(139, 92, 246, 0.2)',
          accent: 'rgba(0, 242, 255, 0.6)',
        };
      case 'green':
        return {
          primary: 'rgba(16, 185, 129, 0.75)',
          primaryGlow: 'rgba(16, 185, 129, 0.2)',
          accent: 'rgba(139, 92, 246, 0.6)',
        };
      case 'cyan':
      default:
        return {
          primary: 'rgba(0, 242, 255, 0.75)',
          primaryGlow: 'rgba(0, 242, 255, 0.2)',
          accent: 'rgba(139, 92, 246, 0.6)',
        };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle resizing
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particle pool
    const particles: Particle[] = [];
    const particleCount = Math.min(120, Math.floor((width * height) / 12000));
    const colors = getColors();

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const orbitRadius = 150 + Math.random() * 300;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: 0,
        targetY: 0,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 1.2 - 0.2,
        radius: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.35 ? colors.primary : colors.accent,
        angle,
        speed: (Math.random() * 0.005 + 0.002) * speedMultiplier,
        orbitRadius,
        z: Math.random() * 200 - 100,
      });
    }

    // 3D Wireframe Cyber-Core Nodes (Sphere)
    const nodes: Node3D[] = [];
    const nodeCount = 45;
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.acos(Math.random() * 2 - 1);
      const phi = Math.random() * Math.PI * 2;
      const radius = 180; // Core size
      nodes.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
        px: 0,
        py: 0,
      });
    }

    let rotX = 0.004;
    let rotY = 0.006;
    let angleX = 0;
    let angleY = 0;

    let lastTime = performance.now();
    let frameCount = 0;

    // Loop
    const draw = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      ctx.fillStyle = '#090a0f';
      ctx.fillRect(0, 0, width, height);

      // Interpolate mouse
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Current colors based on props updates
      const currentColors = getColors();

      // Render Neural Connections
      ctx.lineWidth = 0.35;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.1 * (1 - dist / 110)})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Render micro-particles
      particles.forEach((p) => {
        // Drifting motion
        p.angle += p.speed;
        p.y += p.vy;

        // Circular dynamic oscillation
        const dx = Math.cos(p.angle) * 0.45;
        p.x += p.vx + dx;

        // Respawn if goes off screen
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10 || p.x > width + 10) {
          p.x = Math.random() * width;
        }

        // Mouse interaction
        if (mouse.x > -100 && mouse.y > -100) {
          const mDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (mDist < 160) {
            // Draw connection lines to mouse
            const alphaFactor = (1 - mDist / 160) * 0.2;
            ctx.strokeStyle = `rgba(14, 165, 233, ${alphaFactor})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            // Attract/Repel slightly
            const force = (160 - mDist) / 160;
            const angleToMouse = Math.atan2(p.y - mouse.y, p.x - mouse.x);
            p.x += Math.cos(angleToMouse) * force * 1.5;
            p.y += Math.sin(angleToMouse) * force * 1.5;
          }
        }

        // Render particle
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mood, speedMultiplier]);

  return (
    <div className="absolute inset-0 -z-10 bg-cyber-bg overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* Subtle status indicator in bottom-right margin */}
      <div className="absolute bottom-5 right-6 font-mono text-[9px] tracking-wider text-neutral-600 flex items-center gap-2 select-none">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
        SYSTEM ACTIVE // FPS: {fps}
      </div>
    </div>
  );
}
