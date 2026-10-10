import React, { useEffect, useRef } from 'react';

export default function IsometricCubeCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 280);

    let angleX = 0.55;
    let angleY = 0.65;
    let angleZ = 0.2;

    const size = 60;
    const vertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const project = (x, y, z) => {
      let x1 = x * Math.cos(angleY) + z * Math.sin(angleY);
      let z1 = -x * Math.sin(angleY) + z * Math.cos(angleY);
      let y1 = y;

      let y2 = y1 * Math.cos(angleX) - z1 * Math.sin(angleX);
      let z2 = y1 * Math.sin(angleX) + z1 * Math.cos(angleX);
      let x2 = x1;

      let x3 = x2 * Math.cos(angleZ) - y2 * Math.sin(angleZ);
      let y3 = x2 * Math.sin(angleZ) + y2 * Math.cos(angleZ);
      let z3 = z2;

      const fov = 350;
      const distance = 4;
      const scale = fov / (distance + z3);

      return {
        x: width / 2 + x3 * size * scale * 0.01,
        y: height / 2 + y3 * size * scale * 0.01,
        z: z3
      };
    };

    const render = () => {
      angleX += 0.005;
      angleY += 0.008;
      angleZ += 0.002;

      ctx.clearRect(0, 0, width, height);

      // Radial backlight
      const grad = ctx.createRadialGradient(
        width / 2, height / 2, 10,
        width / 2, height / 2, 170
      );
      grad.addColorStop(0, 'rgba(190, 242, 100, 0.15)');
      grad.addColorStop(0.5, 'rgba(190, 242, 100, 0.03)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 170, 0, Math.PI * 2);
      ctx.fill();

      // Orbital glow rings
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(0.32);
      ctx.beginPath();
      ctx.ellipse(0, 35, 125, 32, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(190, 242, 100, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#bef264';
      ctx.shadowBlur = 10;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 45, 155, 40, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(190, 242, 100, 0.2)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.restore();

      const projected = vertices.map(v => project(v[0], v[1], v[2]));

      // Subtle translucent faces
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      const faces = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [0, 1, 5, 4],
        [2, 3, 7, 6],
        [1, 2, 6, 5],
        [0, 3, 7, 4]
      ];

      faces.forEach(face => {
        ctx.beginPath();
        ctx.moveTo(projected[face[0]].x, projected[face[0]].y);
        ctx.lineTo(projected[face[1]].x, projected[face[1]].y);
        ctx.lineTo(projected[face[2]].x, projected[face[2]].y);
        ctx.lineTo(projected[face[3]].x, projected[face[3]].y);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();

      // Edges
      edges.forEach(([startIdx, endIdx]) => {
        const p1 = projected[startIdx];
        const p2 = projected[endIdx];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = 'rgba(240, 245, 250, 0.85)';
        ctx.lineWidth = 1.6;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 6;
        ctx.stroke();
      });

      // Vertices
      projected.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#bef264';
        ctx.shadowColor = '#bef264';
        ctx.shadowBlur = 8;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="isometric-cube-canvas" 
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
