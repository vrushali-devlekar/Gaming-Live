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
      const width = containerRef.current.clientWidth || 360;
      const height = containerRef.current.clientHeight || 520;

      // 1. Scene Setup
      const scene = new THREE.Scene();

      // 2. Camera: Positioned for full-height standing operator view
      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0.15, 3.8);

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

      // ================= 4. WARM PUBG AMBER SUN FLARE LIGHTING =================
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
      scene.add(ambientLight);

      // Warm Amber/Orange Shoulder Rim Spotlight (#FF9E00, intensity 3.2)
      const amberRimLight = new THREE.DirectionalLight(0xff9e00, 3.2);
      amberRimLight.position.set(-3, 4, -2.5);
      amberRimLight.castShadow = true;
      scene.add(amberRimLight);

      // Secondary Orange Shoulder Glow (#FF7B00, intensity 2.5)
      const orangeRimLight2 = new THREE.DirectionalLight(0xff7b00, 2.5);
      orangeRimLight2.position.set(3, 4, -2.5);
      scene.add(orangeRimLight2);

      // Front Fill Light (Cool Cyan Tint)
      const frontFillLight = new THREE.DirectionalLight(0x00f5d4, 1.4);
      frontFillLight.position.set(0, 2, 4);
      scene.add(frontFillLight);

      // Pedestal Deck Point Light
      const pedestalLight = new THREE.PointLight(0x00f5d4, 2.5, 4);
      pedestalLight.position.set(0, -0.8, 0.5);
      scene.add(pedestalLight);

      // ================= 5. CYBER GLOWING PEDESTAL DECK =================
      const pedestalGroup = new THREE.Group();

      const deckGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.05, 32);
      const deckMat = new THREE.MeshStandardMaterial({ color: 0x080c14, metalness: 0.85, roughness: 0.2 });
      const deck = new THREE.Mesh(deckGeo, deckMat);
      deck.position.y = -0.92;
      deck.receiveShadow = true;
      pedestalGroup.add(deck);

      const ringGeo = new THREE.TorusGeometry(0.95, 0.02, 16, 64);
      const platformRingMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.9 });
      const platformRing = new THREE.Mesh(ringGeo, platformRingMat);
      platformRing.rotation.x = Math.PI / 2;
      platformRing.position.y = -0.9;
      pedestalGroup.add(platformRing);

      modelGroup.add(pedestalGroup);

      // ================= 6. ICONIC "LONE SURVIVOR" CHARACTER MODEL =================
      const loneSurvivorGroup = new THREE.Group();

      // Materials
      const whiteShirtMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f6, roughness: 0.6, metalness: 0.05 });
      const blackTieMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.4 });
      const brownLeatherMat = new THREE.MeshStandardMaterial({ color: 0x6e4726, roughness: 0.7, metalness: 0.2 });
      const jeansMat = new THREE.MeshStandardMaterial({ color: 0x243242, roughness: 0.8 });
      const glovesMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1f, roughness: 0.5 });
      const helmetMat = new THREE.MeshStandardMaterial({ color: 0x1f232d, metalness: 0.85, roughness: 0.25 });
      const visorGlowMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4 });
      const glacierIceMat = new THREE.MeshStandardMaterial({
        color: 0xa5f3fc,
        roughness: 0.05,
        metalness: 0.2,
        transparent: true,
        opacity: 0.88,
        emissive: 0x0284c7,
        emissiveIntensity: 0.6
      });

      // Torso: White Dress Shirt with Sleeves Rolled Up
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.75, 16), whiteShirtMat);
      torso.position.y = 0.22;
      loneSurvivorGroup.add(torso);

      // Black Tie
      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.38, 0.03), blackTieMat);
      tie.position.set(0, 0.26, 0.17);
      loneSurvivorGroup.add(tie);

      // Brown Leather Backpack Harness Straps
      const strapLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.68, 0.04), brownLeatherMat);
      strapLeft.position.set(-0.12, 0.22, 0.15);
      strapLeft.rotation.z = -0.15;
      loneSurvivorGroup.add(strapLeft);

      const strapRight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.68, 0.04), brownLeatherMat);
      strapRight.position.set(0.12, 0.22, 0.15);
      strapRight.rotation.z = 0.15;
      loneSurvivorGroup.add(strapRight);

      // Arms: Rolled Up Sleeves + Crossed Arms Stance
      const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.45, 12), whiteShirtMat);
      leftArm.position.set(-0.25, 0.28, 0.08);
      leftArm.rotation.set(0, 0, -0.6);
      loneSurvivorGroup.add(leftArm);

      const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.35, 12), glovesMat);
      leftForearm.position.set(-0.12, 0.1, 0.22);
      leftForearm.rotation.set(0.8, 0.6, -0.8);
      loneSurvivorGroup.add(leftForearm);

      const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.45, 12), whiteShirtMat);
      rightArm.position.set(0.25, 0.28, 0.08);
      rightArm.rotation.set(0, 0, 0.6);
      loneSurvivorGroup.add(rightArm);

      const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.35, 12), glovesMat);
      rightForearm.position.set(0.12, 0.1, 0.22);
      rightForearm.rotation.set(0.8, -0.6, 0.8);
      loneSurvivorGroup.add(rightForearm);

      // Legs: Tactical Blue Jeans & Drop-Leg Holster
      const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.8, 14), jeansMat);
      leftLeg.position.set(-0.11, -0.5, 0);
      loneSurvivorGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.8, 14), jeansMat);
      rightLeg.position.set(0.11, -0.5, 0);
      loneSurvivorGroup.add(rightLeg);

      // Drop-Leg Gun Holster on Right Thigh
      const dropLegHolster = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.1), brownLeatherMat);
      dropLegHolster.position.set(0.19, -0.38, 0.02);
      loneSurvivorGroup.add(dropLegHolster);

      // Head: Spetsnaz Level 3 Helmet with Visor
      const headGroup = new THREE.Group();
      headGroup.position.y = 0.72;
      
      const helmetDome = new THREE.Mesh(new THREE.SphereGeometry(0.168, 16, 16), helmetMat);
      headGroup.add(helmetDome);

      const visorSlit = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.038, 0.04), visorGlowMat);
      visorSlit.position.set(0, 0.02, 0.15);
      headGroup.add(visorSlit);
      loneSurvivorGroup.add(headGroup);

      // Glacier M416 Rifle (Slung on Back)
      const rifle = new THREE.Group();
      rifle.add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.03), glacierIceMat));
      rifle.position.set(-0.05, 0.28, -0.16);
      rifle.rotation.set(0.2, 0.1, -0.45);
      loneSurvivorGroup.add(rifle);

      loneSurvivorGroup.position.y = 0.02;

      // ================= 7. 3D GLTF MODEL CANDIDATES =================
      const gltfLoader = new GLTFLoader();
      const fbxLoader = new FBXLoader();

      const modelCandidates = [
        '/models/pubg_lone_survivor.glb',
        '/models/pubg_tactical_character.glb',
        '/models/mummy_character.glb'
      ];

      const loadModel = (index) => {
        if (index >= modelCandidates.length) {
          modelGroup.add(loneSurvivorGroup);
          setIsLoading(false);
          return;
        }

        gltfLoader.load(
          modelCandidates[index],
          (gltf) => {
            const characterObj = gltf.scene;
            characterObj.scale.set(1.05, 1.05, 1.05);
            characterObj.position.set(0, -0.88, 0);

            characterObj.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            modelGroup.add(characterObj);

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
              () => console.info("Idle animation loaded.")
            );

            setIsLoading(false);
          },
          undefined,
          () => loadModel(index + 1)
        );
      };

      loadModel(0);

      // ================= 8. INTERACTIVE MOUSE ROTATION LISTENERS =================
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

      // ================= 9. ANIMATION LOOP =================
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        if (mixer) mixer.update(delta);

        if (!isDraggingRef.current) {
          userRotationYRef.current += 0.003;
        }
        modelGroup.rotation.y = userRotationYRef.current;

        // Subtle micro-breathing vertical float loop
        modelGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.025;

        renderer.render(scene, camera);
      };
      animate();

      handleResize = () => {
        if (!containerRef.current || !renderer) return;
        const newW = containerRef.current.clientWidth || 360;
        const newH = containerRef.current.clientHeight || 520;
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
          <div className="w-10 h-10 border-2 border-[#00f5d4]/30 border-t-[#00f5d4] rounded-full animate-spin mb-3"></div>
          <span className="font-military text-xs text-[#00f5d4] tracking-widest font-bold animate-pulse">
            LOADING LONE SURVIVOR OPERATOR...
          </span>
        </div>
      )}
    </div>
  );
}
