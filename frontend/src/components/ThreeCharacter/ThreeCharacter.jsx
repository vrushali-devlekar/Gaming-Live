import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import coderSilhouette from '../../assets/coder_silhouette.png';
import './ThreeCharacter.css';

export default function ThreeCharacter({ activeTheme }) {
  const containerRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  
  // Refs to update colors dynamically without restarting scene
  const materialsRef = useRef({});
  const lightsRef = useRef({});

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer;
    let animationFrameId;
    let handleResize;

    try {
      // Get current container dimensions
      const width = containerRef.current.clientWidth || 300;
      const height = containerRef.current.clientHeight || 350;

      // Scene setup
      const scene = new THREE.Scene();

      // Camera setup - positioned to focus on the full character
      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0.15, 3.2);

      // Renderer setup
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      // Clear container and append canvas
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(renderer.domElement);

      // Main rotating group wrapper
      const modelGroup = new THREE.Group();
      scene.add(modelGroup);

      // ================= PROCEDURAL FALLBACK: WHITE MUMMY + Lvl 3 HELMET + GLACIER M416 =================
      const characterGroup = new THREE.Group();

      // Materials
      const mummyMat = new THREE.MeshStandardMaterial({ 
        color: 0xf3f3ef, // Off-white bandage wraps
        roughness: 0.95, 
        metalness: 0.05 
      });
      
      const bandageStrapMat = new THREE.MeshStandardMaterial({ 
        color: 0xe6e6db, // Darker bandage straps
        roughness: 1.0 
      });
      
      const level3Mat = new THREE.MeshStandardMaterial({ 
        color: 0x22242f, // Dark matte steel
        metalness: 0.8, 
        roughness: 0.35 
      });
      
      const visorGlowMat = new THREE.MeshBasicMaterial({ 
        color: 0x00f0ff // Cyan glowing visor slit
      });
      
      const iceMat = new THREE.MeshStandardMaterial({
        color: 0xa5f3fc, // Translucent ice-cyan for Glacier M416
        roughness: 0.05,
        metalness: 0.15,
        transparent: true,
        opacity: 0.8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.55
      });

      // 1. Mummy Torso (Bandage Wrapped)
      const torsoGeo = new THREE.CylinderGeometry(0.18, 0.15, 0.72, 16);
      const torso = new THREE.Mesh(torsoGeo, mummyMat);
      torso.position.y = 0.2;
      characterGroup.add(torso);

      // Procedural bandage loops wrapping Torso
      const torsoLoop1Geo = new THREE.TorusGeometry(0.182, 0.008, 4, 12);
      const loop1 = new THREE.Mesh(torsoLoop1Geo, bandageStrapMat);
      loop1.rotation.set(0.1, 0, 0.15);
      loop1.position.set(0, 0.35, 0);
      characterGroup.add(loop1);

      const loop2 = loop1.clone();
      loop2.rotation.set(-0.15, 0, -0.2);
      loop2.position.y = 0.1;
      characterGroup.add(loop2);

      const loop3 = loop1.clone();
      loop3.rotation.set(0.2, 0.1, -0.05);
      loop3.position.y = 0.25;
      characterGroup.add(loop3);

      // 2. Head wrapped in bandages
      const headGeo = new THREE.SphereGeometry(0.13, 16, 16);
      const head = new THREE.Mesh(headGeo, mummyMat);
      head.position.y = 0.68;
      characterGroup.add(head);

      // 3. Level 3 Helmet (BGMI Icon)
      const helmetGroup = new THREE.Group();
      // Dome
      const helmetDomeGeo = new THREE.SphereGeometry(0.155, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2 + 0.15);
      const helmetDome = new THREE.Mesh(helmetDomeGeo, level3Mat);
      helmetDome.position.y = 0.7;
      helmetGroup.add(helmetDome);

      // Front Visor Shield
      const visorPlateGeo = new THREE.BoxGeometry(0.19, 0.11, 0.13);
      const visorPlate = new THREE.Mesh(visorPlateGeo, level3Mat);
      visorPlate.position.set(0, 0.66, 0.1);
      helmetGroup.add(visorPlate);

      // Cyan glowing visor slit
      const slitGeo = new THREE.BoxGeometry(0.13, 0.015, 0.02);
      const slit = new THREE.Mesh(slitGeo, visorGlowMat);
      slit.position.set(0, 0.68, 0.166);
      helmetGroup.add(slit);
      
      characterGroup.add(helmetGroup);

      // 4. Arms positioned holding the rifle
      // Left Arm (holding barrel)
      const armGeoL = new THREE.CylinderGeometry(0.042, 0.038, 0.42, 10);
      armGeoL.rotateZ(0.6); // Angle inward
      armGeoL.rotateX(0.4); // Angle forward
      const armL = new THREE.Mesh(armGeoL, mummyMat);
      armL.position.set(-0.25, 0.38, 0.12);
      characterGroup.add(armL);

      // Right Arm (holding grip/stock)
      const armGeoR = new THREE.CylinderGeometry(0.042, 0.038, 0.42, 10);
      armGeoR.rotateZ(-0.6); // Angle inward
      armGeoR.rotateX(0.4); // Angle forward
      const armR = new THREE.Mesh(armGeoR, mummyMat);
      armR.position.set(0.25, 0.38, 0.12);
      characterGroup.add(armR);

      // 5. Legs (Bandage Wrapped + Black tights)
      // Left Thigh
      const thighGeoL = new THREE.CylinderGeometry(0.075, 0.065, 0.28, 12);
      const thighL = new THREE.Mesh(thighGeoL, mummyMat);
      thighL.position.set(-0.09, -0.16, 0);
      characterGroup.add(thighL);

      // Right Thigh
      const thighR = thighL.clone();
      thighR.position.x = 0.09;
      characterGroup.add(thighR);

      // Left Legging (Tights)
      const shinGeoL = new THREE.CylinderGeometry(0.05, 0.038, 0.45, 10);
      const shinL = new THREE.Mesh(shinGeoL, leggingsMat);
      shinL.position.set(-0.09, -0.48, 0);
      characterGroup.add(shinL);

      // Right Legging
      const shinR = shinL.clone();
      shinR.position.x = 0.09;
      characterGroup.add(shinR);

      // Left Sneaker (Glowing Hot Pink)
      const footGeo = new THREE.BoxGeometry(0.08, 0.07, 0.17);
      const shoeL = new THREE.Mesh(footGeo, shoeMat);
      shoeL.position.set(-0.09, -0.72, 0.03);
      characterGroup.add(shoeL);

      // Right Sneaker
      const shoeR = shoeL.clone();
      shoeR.position.x = 0.09;
      characterGroup.add(shoeR);

      // 6. GLACIER M416 RIFLE (Holding in hands)
      const rifle = new THREE.Group();
      // Rifle Main Body
      const rBody = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.045, 0.026), iceMat);
      rifle.add(rBody);
      
      // Barrel
      const rBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.28, 8), iceMat);
      rBarrel.geometry.rotateZ(Math.PI / 2);
      rBarrel.position.set(0.33, 0.01, 0);
      rifle.add(rBarrel);

      // Stock
      const rStock = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.07, 0.022), iceMat);
      rStock.position.set(-0.26, -0.01, 0);
      rifle.add(rStock);

      // Magazine
      const rMag = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.1, 0.022), iceMat);
      rMag.geometry.rotateZ(-0.2);
      rMag.position.set(0.07, -0.07, 0);
      rifle.add(rMag);

      // Scope
      const rScope = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.11, 8), iceMat);
      rScope.geometry.rotateZ(Math.PI / 2);
      rScope.position.set(0.02, 0.04, 0);
      rifle.add(rScope);

      // Position held diagonally across torso
      rifle.rotation.z = 0.2; // slight diagonal angle
      rifle.rotation.y = 0.25; // angled slightly forward
      rifle.position.set(0, 0.28, 0.2);
      characterGroup.add(rifle);

      // Shift group Y up to stand correctly
      characterGroup.position.y = 0.16;

      // ================= CIRCULAR STAND PLATFORM =================
      const deckGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.04, 32);
      const deckMat = new THREE.MeshStandardMaterial({ 
        color: 0x1c1d24, 
        metalness: 0.5, 
        roughness: 0.4 
      });
      const deck = new THREE.Mesh(deckGeo, deckMat);
      deck.position.y = -0.62;
      scene.add(deck);

      // Outer neon ring (Glows in selected theme color)
      const ringGeo = new THREE.TorusGeometry(0.85, 0.015, 6, 32);
      const platformRingMat = new THREE.MeshBasicMaterial({
        color: activeTheme.accentColor,
        transparent: true,
        opacity: 0.8
      });
      const platformRing = new THREE.Mesh(ringGeo, platformRingMat);
      platformRing.rotation.x = Math.PI / 2;
      platformRing.position.y = -0.6;
      scene.add(platformRing);

      // ================= CODE PARTICLES SYSTEM =================
      const particleCount = 65;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const speeds = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 1.1 + 0.35;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.random() * 2.5 - 0.8;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
        speeds[i] = Math.random() * 0.007 + 0.003;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const particleMat = new THREE.PointsMaterial({
        color: activeTheme.accentColor,
        size: 0.03,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // ================= LIGHTING SETUP =================
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight1.position.set(2, 4, 3);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(activeTheme.accentColor, 0.8);
      dirLight2.position.set(-2, 2, -2);
      scene.add(dirLight2);

      const pointGlowLight = new THREE.PointLight(activeTheme.accentColor, 1.5, 5);
      pointGlowLight.position.set(0, 0.5, 1.2);
      scene.add(pointGlowLight);

      // Save references to update colors
      materialsRef.current = { platformRingMat, particleMat };
      lightsRef.current = { dirLight2, pointGlowLight };

      // ================= GLTF/GLB MODEL LOADER WORKFLOW =================
      const gltfLoader = new GLTFLoader();
      
      gltfLoader.load(
        '/models/bgmi_mummy_character.glb', // User glb model endpoint
        (gltf) => {
          const loadedCharacter = gltf.scene;
          loadedCharacter.scale.set(1.0, 1.0, 1.0);
          loadedCharacter.position.set(0, -0.6, 0);

          loadedCharacter.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                child.material.roughness = 0.45;
                child.material.metalness = 0.45;
              }
            }
          });

          // GLTF loaded successfully, remove procedural fallback
          modelGroup.add(loadedCharacter);
        },
        undefined,
        (error) => {
          // Model file missing, add our detailed procedural fallback character
          console.info("Mummy model file '/models/bgmi_mummy_character.glb' not found. Rendering high-fidelity procedural fallback.");
          modelGroup.add(characterGroup);
        }
      );

      // ================= ANIMATION LOOP =================
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Slowly rotate the model group Y axis
        modelGroup.rotation.y = elapsedTime * 0.38;

        // Gentle floating animation
        modelGroup.position.y = Math.sin(elapsedTime * 1.25) * 0.035;

        // Animate code particles
        const positionsArr = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          positionsArr[i * 3 + 1] += speeds[i];
          if (positionsArr[i * 3 + 1] > 1.6) {
            positionsArr[i * 3 + 1] = -0.8;
          }
        }
        particles.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
      };
      animate();

      // ================= RESIZING HANDLER =================
      handleResize = () => {
        if (!containerRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

    } catch (err) {
      console.error("Three.js initialization failed, loading fallback silhouette image:", err);
      setHasError(true);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (renderer) renderer.dispose();
    };
  }, []);

  // Update theme colors dynamically on state change
  useEffect(() => {
    const { platformRingMat, particleMat } = materialsRef.current;
    const { dirLight2, pointGlowLight } = lightsRef.current;

    if (platformRingMat) platformRingMat.color.set(activeTheme.accentColor);
    if (particleMat) particleMat.color.set(activeTheme.accentColor);
    
    if (dirLight2) dirLight2.color.set(activeTheme.accentColor);
    if (pointGlowLight) pointGlowLight.color.set(activeTheme.accentColor);
  }, [activeTheme]);

  if (hasError) {
    return (
      <div className="three-character-viewport flex flex-col items-center justify-center">
        <img 
          src={coderSilhouette} 
          alt="Player Character Fallback Silhouette" 
          className="h-[350px] object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.15)] filter brightness-95" 
        />
      </div>
    );
  }

  return (
    <div className="three-character-viewport" ref={containerRef}>
      {/* WebGL Canvas builds here */}
    </div>
  );
}
