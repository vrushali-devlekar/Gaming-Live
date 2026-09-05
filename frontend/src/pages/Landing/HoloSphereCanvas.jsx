import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HoloSphereCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Holographic Outer Sphere (Icosahedron Wireframe)
    const icoGeometry = new THREE.IcosahedronGeometry(1.8, 3);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const holoSphere = new THREE.Mesh(icoGeometry, wireframeMaterial);
    scene.add(holoSphere);

    // 3. Inner Core Sphere (Denser Wireframe with Yellow Glow)
    const coreGeometry = new THREE.IcosahedronGeometry(1.1, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreSphere);

    // 4. Rotating Equator Ring / Target Radar Scanner
    const ringGeometry = new THREE.RingGeometry(2.1, 2.15, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const scannerRing1 = new THREE.Mesh(ringGeometry, ringMaterial);
    scannerRing1.rotation.x = Math.PI / 2;
    scene.add(scannerRing1);

    const scannerRing2 = new THREE.Mesh(
      new THREE.RingGeometry(2.3, 2.33, 48),
      new THREE.MeshBasicMaterial({
        color: 0xff4757,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      })
    );
    scannerRing2.rotation.x = Math.PI / 3;
    scannerRing2.rotation.y = Math.PI / 4;
    scene.add(scannerRing2);

    // 5. Pulsing Tactical Data Points (Particles around sphere)
    const particlesCount = 180;
    const particlePositions = new Float32Array(particlesCount * 3);
    const radius = 2.0;

    for (let i = 0; i < particlesCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius + (Math.random() - 0.5) * 0.4;

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ffcc,
      size: 0.04,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. Pulse Ping Effect Rings
    const pingGeometry = new THREE.RingGeometry(0.1, 0.15, 32);
    const pingMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const pingMesh = new THREE.Mesh(pingGeometry, pingMaterial);
    scene.add(pingMesh);

    // 7. Mouse interaction parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse target lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Rotations
      holoSphere.rotation.y = elapsedTime * 0.15 + targetX * 0.5;
      holoSphere.rotation.x = elapsedTime * 0.08 + targetY * 0.5;

      coreSphere.rotation.y = -elapsedTime * 0.25;
      coreSphere.rotation.z = elapsedTime * 0.1;

      scannerRing1.rotation.z = elapsedTime * 0.4;
      scannerRing2.rotation.z = -elapsedTime * 0.3;

      particles.rotation.y = elapsedTime * 0.1;

      // Pulse Ping expansion effect
      const pingScale = ((elapsedTime % 2) / 2) * 2.2 + 0.1;
      const pingOpacity = 1 - (pingScale / 2.3);
      pingMesh.scale.set(pingScale, pingScale, pingScale);
      pingMaterial.opacity = Math.max(0, pingOpacity);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const reqId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 z-10" />

      {/* Cybernetic HUD Target Overlay Graphics */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4">
        {/* Top Corner Markers */}
        <div className="flex justify-between items-center text-[10px] font-mono text-[#00ffcc]">
          <span className="flex items-center gap-1 border-l-2 border-t-2 border-[#00ffcc] pl-1.5 pt-1">
            TARGET_LOCK // SYS_42
          </span>
          <span className="border-r-2 border-t-2 border-[#00ffcc] pr-1.5 pt-1">
            GRID: 48°21'N
          </span>
        </div>

        {/* Center Target Reticle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#00ffcc]/20 rounded-full flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 border border-[#facc15]/30 rounded-full animate-ping" />
          <div className="w-1.5 h-1.5 bg-[#00ffcc] rounded-full shadow-[0_0_10px_#00ffcc]" />
        </div>

        {/* Bottom Corner Markers */}
        <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
          <span className="border-l-2 border-b-2 border-[#00ffcc] pl-1.5 pb-1 text-[#facc15]">
            CORE: STABLE 99.8%
          </span>
          <span className="border-r-2 border-b-2 border-[#00ffcc] pr-1.5 pb-1 text-[#00ffcc]">
            HOLOGRAM V3.1
          </span>
        </div>
      </div>
    </div>
  );
}
