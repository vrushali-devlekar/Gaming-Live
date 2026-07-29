import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import './ThreeCharacter.css';

export default function ThreeCharacter({ activeTheme }) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Interactive drag rotation state
  const isDraggingRef = useRef(false);
  const previousMouseXRef = useRef(0);
  const userRotationYRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer;
    let animationFrameId;
    let handleResize;
    let mixer;

    try {
      const width = containerRef.current.clientWidth || 340;
      const height = containerRef.current.clientHeight || 380;

      // 1. Scene Setup
      const scene = new THREE.Scene();

      // 2. Cinematography: Camera (45° FOV) positioned 3.5m at eye level (PUBG medium shot)
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0.25, 3.5);

      // 3. WebGL Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Clear container and append canvas
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(renderer.domElement);

      // Main Character Group Wrapper
      const modelGroup = new THREE.Group();
      scene.add(modelGroup);

      // ================= 4. CINEMATOGRAPHY & LIGHTING SETUP =================
      // Ambient Base Light
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      // Requirement: Warm-toned Directional Key Light (0xfff8e1, intensity 2.5) from front-right
      const warmKeyLight = new THREE.DirectionalLight(0xfff8e1, 2.5);
      warmKeyLight.position.set(3, 4, 3);
      warmKeyLight.castShadow = true;
      scene.add(warmKeyLight);

      // Requirement: Cool-toned SpotLight (0x80d8ff, intensity 3.0) from back-left for sharp rim lighting
      const coolRimSpotlight = new THREE.SpotLight(0x80d8ff, 3.0, 15, Math.PI / 4, 0.5);
      coolRimSpotlight.position.set(-3, 3, -3);
      coolRimSpotlight.lookAt(0, 0, 0);
      scene.add(coolRimSpotlight);

      // Pedestal Deck Point Light (#00e5ff)
      const pedestalLight = new THREE.PointLight(0x00e5ff, 2.5, 4);
      pedestalLight.position.set(0, -0.5, 0.5);
      scene.add(pedestalLight);

      // ================= 5. CYBER GLOWING PEDESTAL (#00e5ff) =================
      const pedestalGroup = new THREE.Group();

      // Pedestal Deck Base
      const deckGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.05, 32);
      const deckMat = new THREE.MeshStandardMaterial({
        color: 0x14161f,
        metalness: 0.8,
        roughness: 0.2
      });
      const deck = new THREE.Mesh(deckGeo, deckMat);
      deck.position.y = -0.62;
      deck.receiveShadow = true;
      pedestalGroup.add(deck);

      // Outer Glowing Ring (#00e5ff)
      const ringGeo = new THREE.TorusGeometry(0.95, 0.02, 16, 64);
      const platformRingMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.95
      });
      const platformRing = new THREE.Mesh(ringGeo, platformRingMat);
      platformRing.rotation.x = Math.PI / 2;
      platformRing.position.y = -0.6;
      pedestalGroup.add(platformRing);

      modelGroup.add(pedestalGroup);

      // ================= 6. PROCEDURAL FALLBACK MUMMY MODEL =================
      const characterGroup = new THREE.Group();
      const selectedSkin = localStorage.getItem('gaming_live_player_skin') || 'mummy';
      let wrapColor = 0xf3f3ef;
      let strapColor = 0xe6e6db;
      let helmetColor = 0x22242f;
      let visorColor = '#00e5ff';

      if (selectedSkin === 'samurai') {
        wrapColor = 0x161616;
        strapColor = 0xff007f;
        helmetColor = 0x181818;
        visorColor = '#ff007f';
      } else if (selectedSkin === 'recon') {
        wrapColor = 0x3d4536;
        strapColor = 0x5a6350;
        helmetColor = 0x272c22;
        visorColor = '#a855f7';
      }

      const mummyMat = new THREE.MeshStandardMaterial({ color: wrapColor, roughness: 0.9, metalness: 0.1 });
      const strapMat = new THREE.MeshStandardMaterial({ color: strapColor, roughness: 1.0 });
      const helmetMat = new THREE.MeshStandardMaterial({ color: helmetColor, metalness: 0.8, roughness: 0.3 });
      const visorGlowMat = new THREE.MeshBasicMaterial({ color: visorColor });
      const glacierIceMat = new THREE.MeshStandardMaterial({
        color: 0xa5f3fc,
        roughness: 0.05,
        metalness: 0.2,
        transparent: true,
        opacity: 0.85,
        emissive: 0x0284c7,
        emissiveIntensity: 0.5
      });

      // Torso & Armor
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.72, 16), mummyMat);
      torso.position.y = 0.2;
      characterGroup.add(torso);

      // Head with Lvl 3 Helmet & Visor Slit
      const headGroup = new THREE.Group();
      headGroup.position.y = 0.68;
      const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), mummyMat);
      headGroup.add(headMesh);

      const helmetDome = new THREE.Mesh(new THREE.SphereGeometry(0.158, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6), helmetMat);
      headGroup.add(helmetDome);

      const visorSlit = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.035, 0.04), visorGlowMat);
      visorSlit.position.set(0, 0.02, 0.14);
      headGroup.add(visorSlit);
      characterGroup.add(headGroup);

      // Glacier M416 Rifle
      const rifle = new THREE.Group();
      rifle.add(new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.045, 0.026), glacierIceMat));
      rifle.position.set(0, 0.28, 0.2);
      rifle.rotation.set(0, 0.25, 0.2);
      characterGroup.add(rifle);

      characterGroup.position.y = 0.16;

      // ================= 7. 3D GLTF CHARACTER & FBX ANIMATION LOADER =================
      const gltfLoader = new GLTFLoader();
      const fbxLoader = new FBXLoader();

      const modelCandidates = [
        '/models/pubg_tactical_character.glb',
        '/models/mummy_character.glb',
        '/models/bgmi_mummy_character.glb'
      ];

      const loadModel = (index) => {
        if (index >= modelCandidates.length) {
          modelGroup.add(characterGroup);
          setIsLoading(false);
          return;
        }

        gltfLoader.load(
          modelCandidates[index],
          (gltf) => {
            const characterObj = gltf.scene;
            characterObj.scale.set(1.0, 1.0, 1.0);
            characterObj.position.set(0, -0.6, 0);

            characterObj.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            modelGroup.add(characterObj);

            // Attempt FBX animation loading if present
            fbxLoader.load(
              '/animations/lobby_idle_1.fbx',
              (animFbx) => {
                if (animFbx.animations && animFbx.animations.length > 0) {
                  mixer = new THREE.AnimationMixer(characterObj);
                  const idleAction = mixer.clipAction(animFbx.animations[0]);
                  idleAction.play();
                }
              },
              undefined,
              () => console.info("FBX animation file '/animations/lobby_idle_1.fbx' not found. Using procedural rotation.")
            );

            setIsLoading(false);
          },
          undefined,
          () => loadModel(index + 1)
        );
      };

      loadModel(0);

      // Environment Map loader check
      gltfLoader.load(
        '/models/lobby_studio_background.glb',
        (envGltf) => {
          const env = envGltf.scene;
          env.position.set(0, -1, -5);
          scene.add(env);
        },
        undefined,
        () => console.info("Environment GLB '/models/lobby_studio_background.glb' not present.")
      );

      // ================= 8. INTERACTIVE Y-AXIS MOUSE ROTATION LISTENERS =================
      const handleMouseDown = (e) => {
        isDraggingRef.current = true;
        previousMouseXRef.current = e.clientX;
      };

      const handleMouseMove = (e) => {
        if (!isDraggingRef.current) return;
        const deltaX = e.clientX - previousMouseXRef.current;
        userRotationYRef.current += deltaX * 0.008;
        previousMouseXRef.current = e.clientX;
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
      };

      const domElem = containerRef.current;
      domElem.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      // Touch handlers for mobile devices
      const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
          isDraggingRef.current = true;
          previousMouseXRef.current = e.touches[0].clientX;
        }
      };

      const handleTouchMove = (e) => {
        if (isDraggingRef.current && e.touches.length === 1) {
          const deltaX = e.touches[0].clientX - previousMouseXRef.current;
          userRotationYRef.current += deltaX * 0.008;
          previousMouseXRef.current = e.touches[0].clientX;
        }
      };

      const handleTouchEnd = () => {
        isDraggingRef.current = false;
      };

      domElem.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);

      // ================= 9. ANIMATION LOOP =================
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        // Update AnimationMixer if FBX skeletal animation is playing
        if (mixer) mixer.update(delta);

        // Auto slow rotation + Mouse drag rotation
        if (!isDraggingRef.current) {
          userRotationYRef.current += 0.004;
        }
        modelGroup.rotation.y = userRotationYRef.current;

        // Floating idle motion
        modelGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.03;

        renderer.render(scene, camera);
      };
      animate();

      // Window resize listener
      handleResize = () => {
        if (!containerRef.current || !renderer) return;
        const newW = containerRef.current.clientWidth || 340;
        const newH = containerRef.current.clientHeight || 380;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };
      window.addEventListener('resize', handleResize);

    } catch (err) {
      console.error("ThreeJS scene error:", err);
      setIsLoading(false);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (renderer && renderer.domElement) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="three-character-viewport flex items-center justify-center relative w-full h-full cursor-grab active:cursor-grabbing">
      <div ref={containerRef} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs z-20 pointer-events-none">
          <div className="w-10 h-10 border-2 border-[#00e5ff]/30 border-t-[#00e5ff] rounded-full animate-spin mb-3"></div>
          <span className="font-military text-xs text-[#00e5ff] tracking-widest font-bold animate-pulse">
            LOADING TACTICAL LOBBY STAGE...
          </span>
        </div>
      )}
    </div>
  );
}
