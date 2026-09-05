import React, { useEffect, useRef } from 'react';

export default function CyberGridCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initEmbers();
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking with smooth lerp physics
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Tactical Embers Definition
    const emberCount = Math.min(Math.floor((width * height) / 14000), 75);
    let embers = [];

    class Ember {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        // Slow organic drift
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25 - 0.05; 
        this.size = Math.random() * 1.5 + 1.0;
        
        // Ultra-subtle tactical ember colors
        const isAmber = Math.random() > 0.45;
        this.color = isAmber 
          ? 'rgba(245, 158, 11, 0.12)' 
          : 'rgba(0, 245, 212, 0.15)';
        
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.015 + 0.008;
      }

      update() {
        // Natural upward & horizontal floating
        this.baseX += this.vx;
        this.baseY += this.vy;
        this.pulsePhase += this.pulseSpeed;

        // Wrap around boundaries smoothly
        if (this.baseX < -20) this.baseX = width + 20;
        if (this.baseX > width + 20) this.baseX = -20;
        if (this.baseY < -20) this.baseY = height + 20;
        if (this.baseY > height + 20) this.baseY = -20;

        // Smooth cursor proximity repulsion (drift without jitter)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = this.baseX;
        let targetY = this.baseY;

        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 35;
          const angle = Math.atan2(dy, dx);
          targetX = this.baseX - Math.cos(angle) * force;
          targetY = this.baseY - Math.sin(angle) * force;
        }

        // Smooth position lerp to prevent jitter
        this.x += (targetX - this.x) * 0.06;
        this.y += (targetY - this.y) * 0.06;
      }

      draw() {
        const pulseAlpha = (Math.sin(this.pulsePhase) + 1) * 0.5;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.7 + pulseAlpha * 0.3;
        ctx.fill();
        ctx.restore();
      }
    }

    function initEmbers() {
      embers = [];
      for (let i = 0; i < emberCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        embers.push(new Ember(x, y));
      }
    }

    initEmbers();

    const maxLineDistance = 130;

    // Render Loop
    const animate = () => {
      // Clear canvas so the CSS environmental layers show through cleanly
      ctx.clearRect(0, 0, width, height);

      // Draw faint, distance-faded tactical links
      for (let a = 0; a < embers.length; a++) {
        for (let b = a + 1; b < embers.length; b++) {
          const dx = embers[a].x - embers[b].x;
          const dy = embers[a].y - embers[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxLineDistance) {
            const alpha = (1 - dist / maxLineDistance) * 0.03; // Faint 3% opacity
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(embers[a].x, embers[a].y);
            ctx.lineTo(embers[b].x, embers[b].y);
            ctx.stroke();
          }
        }
      }

      // Draw & update dust embers
      embers.forEach((ember) => {
        ember.update();
        ember.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
