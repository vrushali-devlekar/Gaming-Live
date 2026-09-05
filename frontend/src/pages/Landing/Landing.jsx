import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import CyberGridCanvas from './CyberGridCanvas';
import HoloSphereCanvas from './HoloSphereCanvas';

gsap.registerPlugin(ScrollTrigger);

import { 
  Terminal, 
  Swords, 
  RefreshCw, 
  ShieldAlert, 
  Wifi, 
  Users, 
  Zap, 
  Trophy, 
  Crosshair, 
  Box, 
  Volume2, 
  VolumeX,
  Search,
  Sparkles,
  Lock,
  Shield,
  ChevronRight,
  Flame,
  Cpu,
  Activity,
  Layers,
  MapPin,
  Radio,
  Eye
} from 'lucide-react';
import { themeService } from '../../services/themeService';
import { useAuth } from '../../context/AuthContext';
import './Landing.css';

// Map & Air Drop Assets
import sanhokMapImg from '../../assets/sanhok_map.png';
import erangelMapImg from '../../assets/erangel_map.png';
import airDropCrateImg from '../../assets/air_drop_crate.png';

export default function Landing() {
  const navigate = useNavigate();
  const { isLoggedIn, loginWithGoogle, loginWithGithub } = useAuth();
  
  // Interactive State
  const [isEntering, setIsEntering] = useState(false);
  const [syncStep, setSyncStep] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedSector, setSelectedSector] = useState('sanhok');
  const [activeDebuffTab, setActiveDebuffTab] = useState('smoke');
  const [glitchEffect, setGlitchEffect] = useState(null); // 'smoke', 'flashbang', 'emp'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showRoyalePassModal, setShowRoyalePassModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Live Combat Log Feed
  const [combatLogs, setCombatLogs] = useState([
    { id: 1, time: 'T+01:22', text: '@cyber_ninja initiated [Sanhok_Perimeter] duel against @syntax_reaper', type: 'system' },
    { id: 2, time: 'T+01:24', text: '@cipher_fox: Submitting TwoSum solution (JavaScript)...', type: 'submit' },
    { id: 3, time: 'T+01:25', text: 'CRITICAL HIT: 5/5 test cases verified (O(n) time complexity)', type: 'crit' },
    { id: 4, time: 'T+01:25', text: '@null_pointer suffered -40HP zone recoil damage!', type: 'damage' },
    { id: 5, time: 'T+01:28', text: 'AIR DROP CRATE: Spawned at Zone 3 (Binary Search Riddle)', type: 'airdrop' },
  ]);

  // Web Audio Synthesizer
  const playBeep = (freq = 800, duration = 0.08, type = 'sine') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback
    }
  };

  // Trigger Screen Glitch Overlay
  const triggerDebuffGlitch = (effectType) => {
    playBeep(400, 0.15, 'sawtooth');
    setActiveDebuffTab(effectType);
    setGlitchEffect(effectType);
    setTimeout(() => {
      setGlitchEffect(null);
    }, 1500);
  };

  // Simulated Live Terminal Stream Loop
  useEffect(() => {
    const logPool = [
      { text: '@vortex_dev triggered [Smoke Screen] debuff on rival compiler!', type: 'debuff' },
      { text: '@binary_boss executed QuickSort in 1.2ms (Zero Allocation)', type: 'crit' },
      { text: '@ghost_coder claimed Air Drop Crate (+30 HP Shield restored)', type: 'airdrop' },
      { text: '@null_pointer: Solution failed on Test Case #4 (IndexOutOfBounds)', type: 'damage' },
      { text: 'PLAYZONE WARNING: Safe zone shrinking in 15 seconds...', type: 'system' },
      { text: '@cipher_fox achieved 10x STREAK: Conqueror Tier Bonus awarded!', type: 'crit' },
    ];

    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const now = new Date();
      const timestamp = `T+0${now.getMinutes() % 10}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;

      setCombatLogs((prevLogs) => [
        ...prevLogs.slice(-6),
        { id: Date.now(), time: timestamp, text: randomLog.text, type: randomLog.type }
      ]);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  // Keyboard Event Listener: Press ENTER to Launch Lobby
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !showAuthModal && !showRulesModal && !showRoyalePassModal && !isEntering) {
        handleEnterLobby();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoggedIn, isEntering, showAuthModal, showRulesModal, showRoyalePassModal]);

  // Lenis Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    gsap.fromTo('.landing-navbar', 
      { y: -60, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', delay: 0.1 }
    );

    const tl = gsap.timeline({ delay: 0.2 });
    
    tl.fromTo('.hero-protocol-badge',
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    )
    .fromTo('.hero-stencil-headline',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' },
      '-=0.2'
    )
    .fromTo('.btn-hazard-amber, .btn-glass-volt',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.12 },
      '-=0.4'
    );

    gsap.fromTo('.combat-radar-terminal',
      { x: 70, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.4 }
    );

    gsap.fromTo('.sector-nav-tab',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#arenas-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);

  // Scroll Helper
  const scrollToSection = (id) => {
    playBeep(600, 0.05, 'triangle');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Matchmaking Enter Lobby
  const handleEnterLobby = () => {
    if (isEntering) return;
    playBeep(900, 0.25, 'triangle');

    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    setIsEntering(true);
    setSyncStep(1);

    setTimeout(() => {
      setSyncStep(2);
      playBeep(700, 0.08, 'sine');
      setTimeout(() => {
        setSyncStep(3);
        playBeep(850, 0.08, 'sine');
        setTimeout(() => {
          navigate('/lobby');
        }, 1100);
      }, 800);
    }, 700);
  };

  // Auth Handler
  const handleAuthAction = (provider) => {
    playBeep(1000, 0.1, 'sine');
    setShowAuthModal(false);
    if (provider === 'google' && loginWithGoogle) loginWithGoogle();
    else if (provider === 'github' && loginWithGithub) loginWithGithub();
    else navigate('/login');
  };

  // Sector Data for Asymmetric Dossiers
  const sectorData = {
    sanhok: {
      id: 'SECTOR_01',
      name: 'SANHOK PERIMETER',
      mode: '1V1 SUDDEN DEATH',
      duration: '5-MIN BLITZ',
      elevation: '120m Terrain | Jungle Dense Node Mesh',
      tier: 'ACE MASTER',
      img: erangelMapImg,
      description: 'High-intensity 1-on-1 algorithmic speed duel. First programmer to pass all test cases or highest accuracy before zone collapse claims victory.'
    },
    military: {
      id: 'SECTOR_02',
      name: 'MILITARY BASE',
      mode: 'SQUAD DEFENSE (4V4)',
      duration: '15-MIN SQUAD',
      elevation: '340m Bunker | Shared Microservice Sandbox',
      tier: 'CONQUEROR',
      img: sanhokMapImg,
      description: 'Collaborative microservice architecture challenge. Synchronize code modules, share compiler state, and out-code rival squads in real-time.'
    },
    erangel: {
      id: 'SECTOR_03',
      name: 'ERANGEL SECTOR',
      mode: '100-CODER ROYALE',
      duration: '30-MIN ROYALE',
      elevation: '450m Peak | 90s Memory Overflow Elimination',
      tier: 'CONQUEROR',
      img: erangelMapImg,
      description: 'Drop into the massive 100-player compiler matrix. Every 90 seconds the bottom 15% get memory-overflowed and eliminated.'
    }
  };

  const activeSector = sectorData[selectedSector];

  // Esports Scoreboard Data
  const leaderboardData = [
    { rank: 1, handle: 'ViperX_Coder', tier: 'CONQUEROR', winRate: '94.2%', kdRatio: '14.8', bp: '24,850', lang: 'C++', breach: 'First Blood on TwoSum' },
    { rank: 2, handle: 'Shadow_Ninja', tier: 'CONQUEROR', winRate: '91.8%', kdRatio: '12.4', bp: '22,400', lang: 'Rust', breach: '10x Kill Streak in Squad' },
    { rank: 3, handle: 'NullPointer_God', tier: 'ACE MASTER', winRate: '88.5%', kdRatio: '10.9', bp: '19,950', lang: 'Python', breach: 'Solved Air Drop in 4.2s' },
    { rank: 4, handle: 'Erangel_King', tier: 'ACE MASTER', winRate: '86.1%', kdRatio: '9.7', bp: '18,200', lang: 'JS/TS', breach: '100-Royale Winner' },
    { rank: 5, handle: 'Glacier_M416', tier: 'CROWN I', winRate: '82.4%', kdRatio: '8.5', bp: '16,750', lang: 'Go', breach: 'Defused EMP Surge' },
  ];

  const filteredLeaderboard = leaderboardData.filter((item) =>
    item.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="command-center-root relative">
      
      {/* Dynamic Debuff Screen Glitch Overlay */}
      {glitchEffect && (
        <div className={`screen-glitch-overlay ${
          glitchEffect === 'smoke' ? 'glitch-smoke' : glitchEffect === 'flashbang' ? 'glitch-flashbang' : 'glitch-emp'
        }`} />
      )}

      {/* 2D CyberGrid Canvas */}
      <CyberGridCanvas />

      {/* Outer Coordinate Ruler Bars & Screen Reticle Corners */}
      <div className="coordinate-ruler-top">
        <span>LAT 19.404 / LON 72.821</span>
        <span className="text-[#00F5D4] font-bold">SYSTEM STATUS: 100% OPERATIONAL // PORT_5005</span>
        <span>UTC 14:02:46</span>
      </div>

      <div className="coordinate-ruler-side">
        [SYS_RETICLE_v4.2] // VALORANT_PROTOCOL_ACTIVE // MATRIX_READY
      </div>

      <div className="hud-corner-reticle reticle-tl" />
      <div className="hud-corner-reticle reticle-tr" />
      <div className="hud-corner-reticle reticle-bl" />
      <div className="hud-corner-reticle reticle-br" />

      <div className="landing-scanlines" />
      <div className="bg-glow-volt" />
      <div className="bg-glow-amber" />

      {/* --------------------------------------------------------------------------
          SECTION 1: COMMAND NAVBAR
          -------------------------------------------------------------------------- */}
      <nav className="landing-navbar px-6 py-3.5 flex items-center justify-between">
        
        {/* Left: Brand Mark & Barcode */}
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
          onMouseEnter={() => playBeep(1200, 0.03, 'sine')}
        >
          <div className="w-9 h-9 bg-[#00F5D4]/10 border border-[#00F5D4] flex items-center justify-center shadow-[0_0_15px_rgba(0,245,212,0.35)] clip-badge-sm">
            <Swords size={20} className="text-[#00F5D4] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="brand-glitch-title text-xl font-bold tracking-widest text-white leading-none">
                CODE<span className="text-[#00F5D4]">//BATTLE_01</span>
              </span>
              <span className="barcode-stamp text-xs text-gray-500 font-mono">||| | ||||</span>
            </div>
            <span className="text-[9px] font-mono text-gray-400 tracking-[0.2em] block uppercase mt-0.5">
              Asymmetric Command Client v4.2
            </span>
          </div>
        </div>

        {/* Center: Match Telemetry Pill */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-black/60 border border-[#00F5D4]/30 rounded-full font-mono text-xs shadow-[0_0_15px_rgba(0,245,212,0.1)]">
          <span className="w-2 h-2 bg-[#00F5D4] rounded-full animate-ping" />
          <span className="text-white font-bold">1,842 ACTIVE CODERS</span>
          <span className="text-gray-600">|</span>
          <span className="text-[#FF9E00] font-bold">AVG MATCH: 4M 12S</span>
        </div>

        {/* Right Nav & Terminal Access Trigger */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <button className="nav-link-btn" onClick={() => scrollToSection('arenas-section')}>ARENAS</button>
            <button className="nav-link-btn" onClick={() => scrollToSection('leaderboard-section')}>STANDINGS</button>
            <button className="nav-link-btn text-[#FF9E00]" onClick={() => setShowRoyalePassModal(true)}>⚡ PASS</button>
            <button className="nav-link-btn" onClick={() => setShowRulesModal(true)}>RULES</button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-black/50 border border-white/10 hover:border-[#00F5D4]/50 text-gray-400 hover:text-white rounded transition-all cursor-pointer"
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
          >
            {soundEnabled ? <Volume2 size={16} className="text-[#00F5D4]" /> : <VolumeX size={16} />}
          </button>

          <button
            onClick={() => {
              playBeep(850, 0.08, 'sine');
              if (!isLoggedIn) setShowAuthModal(true);
              else handleEnterLobby();
            }}
            onMouseEnter={() => playBeep(1100, 0.03, 'sine')}
            className="btn-glass-volt px-5 py-2.5 text-xs clip-angular-btn flex items-center gap-2 cursor-pointer font-military tracking-wider"
          >
            <Lock size={14} />
            <span>TERMINAL ACCESS</span>
          </button>
        </div>
      </nav>

      {/* --------------------------------------------------------------------------
          SECTION 2: THE STAGING GROUND (55/45 Hero & Live Radar Box)
          -------------------------------------------------------------------------- */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 w-full flex flex-col items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left 55%: Stencil Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            
            <div className="hero-protocol-badge">
              <span className="w-1.5 h-1.5 bg-[#FF2A6D] rounded-full animate-ping" />
              <span>[PROTOCOL ACTIVATED: SEASON 04 RANKED]</span>
            </div>

            <div>
              <h1 className="hero-stencil-headline text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight">
                DEATHMATCH <br />
                <span className="text-[#00F5D4] drop-shadow-[0_0_25px_rgba(0,245,212,0.5)]">FOR CODERS.</span>
              </h1>
              <p className="font-mono text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed mt-4">
                Real-time 1v1 and squad duel arena. Write optimal algorithms, dodge zone shrinkage, and trigger debuffs to wipe out the opponent's runtime.
              </p>
            </div>

            {/* Dual Action Triggers */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto pt-2">
              <button
                onClick={handleEnterLobby}
                onMouseEnter={() => playBeep(1200, 0.04, 'triangle')}
                className="btn-hazard-amber px-8 py-3.5 text-sm clip-angular-btn flex items-center gap-2.5 w-full sm:w-auto justify-center"
              >
                <Crosshair size={18} className="text-black stroke-[2.5]" />
                <span>INSTANT DUEL (1V1)</span>
              </button>

              <button
                onClick={() => {
                  playBeep(750, 0.1, 'sine');
                  if (!isLoggedIn) setShowAuthModal(true);
                  else navigate('/room-lobby');
                }}
                onMouseEnter={() => playBeep(950, 0.04, 'sine')}
                className="btn-glass-volt px-8 py-3.5 text-sm clip-angular-btn flex items-center gap-2.5 w-full sm:w-auto justify-center"
              >
                <Users size={16} />
                <span>ENTER AS SQUAD</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 w-full max-w-lg font-mono">
              <div>
                <div className="font-military text-2xl text-white font-bold">1,842</div>
                <div className="text-[10px] text-gray-400 uppercase mt-0.5">ONLINE CODERS</div>
              </div>
              <div>
                <div className="font-military text-2xl text-[#00F5D4] font-bold">0.2ms</div>
                <div className="text-[10px] text-gray-400 uppercase mt-0.5">JUDGE LATENCY</div>
              </div>
              <div>
                <div className="font-military text-2xl text-[#FF9E00] font-bold">2,500 BP</div>
                <div className="text-[10px] text-gray-400 uppercase mt-0.5">CHICKEN REWARD</div>
              </div>
            </div>
          </div>

          {/* Right 45%: Tactical Live Match Radar Box */}
          <div className="lg:col-span-5 w-full">
            <div className="combat-radar-terminal p-5 font-mono text-xs flex flex-col gap-4 relative">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Radio size={16} className="text-[#00F5D4] animate-pulse" />
                  <span className="font-military text-xs text-white font-bold tracking-wider uppercase">
                    TACTICAL LIVE MATCH RADAR
                  </span>
                </div>
                <span className="text-[10px] text-[#00F5D4] bg-[#00F5D4]/10 px-2 py-0.5 rounded border border-[#00F5D4]/30 font-bold">
                  RADAR ACTIVE
                </span>
              </div>

              {/* 3D Hologram Radar Embedded Box */}
              <div className="w-full h-36 rounded bg-black/60 border border-white/10 overflow-hidden relative">
                <HoloSphereCanvas />
              </div>

              {/* Live Combat Log Entries */}
              <div className="flex flex-col gap-2 h-44 overflow-y-auto pr-1 select-none">
                {combatLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className={`terminal-log-row flex items-start gap-2 p-2 rounded border ${
                      log.type === 'crit' 
                        ? 'bg-[#00F5D4]/10 border-[#00F5D4]/40 text-[#00F5D4]'
                        : log.type === 'damage'
                        ? 'bg-[#FF2A6D]/10 border-[#FF2A6D]/40 text-[#FF2A6D]'
                        : log.type === 'airdrop'
                        ? 'bg-[#FF9E00]/10 border-[#FF9E00]/40 text-[#FF9E00]'
                        : 'bg-black/40 border-white/10 text-gray-300'
                    }`}
                  >
                    <span className="text-gray-500 font-bold flex-shrink-0">[{log.time}]</span>
                    <span className="leading-tight">{log.text}</span>
                  </div>
                ))}
              </div>

              {/* Telemetry Status Bar */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Activity size={12} className="text-green-400" />
                  <span>SYNTAX MATRIX: STABLE</span>
                </span>
                <span className="text-[#00F5D4]">ANTI-CHEAT: ACTIVE</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* --------------------------------------------------------------------------
          SECTION 3: OPERATIONAL SECTORS (Asymmetric Horizontal Dossier Layout)
          -------------------------------------------------------------------------- */}
      <section id="arenas-section" className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00F5D4]/10 border border-[#00F5D4]/30 text-[#00F5D4] font-military text-xs tracking-widest clip-badge-sm mb-3">
            <Layers size={13} />
            <span>OPERATIONAL SECTORS</span>
          </div>
          <h2 className="font-military text-4xl text-white font-bold tracking-wider uppercase">
            ARENA <span className="text-[#00F5D4]">PROTOCOLS</span>
          </h2>
        </div>

        {/* Sector Navigation Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div
            className={`sector-nav-tab p-4 rounded clip-badge-sm ${selectedSector === 'sanhok' ? 'active' : ''}`}
            onClick={() => {
              playBeep(700, 0.05, 'sine');
              setSelectedSector('sanhok');
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-military text-sm text-white font-bold">SECTOR 01: SANHOK</span>
              <span className="text-[10px] font-mono text-[#00F5D4]">1V1 DUEL</span>
            </div>
            <span className="font-mono text-xs text-gray-400 block">5-Minute Sudden Death Blitz</span>
          </div>

          <div
            className={`sector-nav-tab p-4 rounded clip-badge-sm ${selectedSector === 'military' ? 'active' : ''}`}
            onClick={() => {
              playBeep(700, 0.05, 'sine');
              setSelectedSector('military');
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-military text-sm text-white font-bold">SECTOR 02: MILITARY BASE</span>
              <span className="text-[10px] font-mono text-[#FF9E00]">4V4 SQUAD</span>
            </div>
            <span className="font-mono text-xs text-gray-400 block">Shared Microservice Sandbox</span>
          </div>

          <div
            className={`sector-nav-tab p-4 rounded clip-badge-sm ${selectedSector === 'erangel' ? 'active' : ''}`}
            onClick={() => {
              playBeep(700, 0.05, 'sine');
              setSelectedSector('erangel');
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-military text-sm text-white font-bold">SECTOR 03: ERANGEL</span>
              <span className="text-[10px] font-mono text-[#FF2A6D]">100 ROYALE</span>
            </div>
            <span className="font-mono text-xs text-gray-400 block">90s Memory Overflow Elimination</span>
          </div>
        </div>

        {/* Expanded Asymmetric Sector Dossier */}
        <div className="active-dossier-box p-8 rounded-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Dossier Map Elevation Preview */}
          <div className="lg:col-span-5 h-64 rounded-lg overflow-hidden relative border border-white/15">
            <img src={activeSector.img} alt={activeSector.name} className="w-full h-full object-cover dossier-map-img" />
            <div className="absolute top-3 left-3 bg-black/85 px-3 py-1 border border-[#00F5D4]/40 text-[#00F5D4] font-military text-xs font-bold rounded">
              {activeSector.id} // {activeSector.mode}
            </div>
            <div className="absolute bottom-3 left-3 bg-black/85 px-3 py-1 font-mono text-[10px] text-gray-300 rounded border border-white/10">
              <MapPin size={11} className="inline mr-1 text-[#FF9E00]" />
              {activeSector.elevation}
            </div>
          </div>

          {/* Dossier Tactical Constraints & Launch Action */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-mono text-[#00F5D4] mb-1 uppercase tracking-widest">
                <span>CLASSIFIED MISSION DOSSIER</span>
              </div>
              <h3 className="font-military text-3xl text-white font-bold">{activeSector.name}</h3>
              <p className="font-mono text-xs text-gray-300 leading-relaxed mt-2">{activeSector.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 bg-black/50 border border-white/10 rounded">
                <span className="text-gray-500 block text-[10px]">TIME CONSTRAINT</span>
                <strong className="text-white font-bold">{activeSector.duration}</strong>
              </div>
              <div className="p-3 bg-black/50 border border-white/10 rounded">
                <span className="text-gray-500 block text-[10px]">DIFFICULTY TIER</span>
                <strong className="text-[#FF9E00] font-bold">{activeSector.tier}</strong>
              </div>
              <div className="p-3 bg-black/50 border border-white/10 rounded">
                <span className="text-gray-500 block text-[10px]">REWARD STAKE</span>
                <strong className="text-[#00F5D4] font-bold">2,500 BP</strong>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleEnterLobby}
                onMouseEnter={() => playBeep(1100, 0.04, 'triangle')}
                className="btn-hazard-amber px-8 py-3.5 text-xs clip-angular-btn"
              >
                DEPLOY TO MAP ({activeSector.id})
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* --------------------------------------------------------------------------
          SECTION 4: COMBAT OVERRIDE (Interactive Glitch HUD)
          -------------------------------------------------------------------------- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="debuff-feature-box p-8 clip-dossier-panel rounded-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 flex flex-col items-center text-center relative">
            <img src={airDropCrateImg} alt="Air Drop Crate" className="w-64 h-64 object-contain air-drop-crate-img mb-4 relative z-10" />
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF2A6D]/10 border border-[#FF2A6D]/40 text-[#FF2A6D] font-military text-xs tracking-widest clip-badge-sm mb-2 z-10">
              <Box size={14} />
              <span>COMBAT OVERRIDE MECHANICS</span>
            </div>
            <h3 className="font-military text-2xl text-white font-bold z-10">TACTICAL DEBUFFS &amp; PERKS</h3>
            <p className="font-mono text-xs text-gray-400 max-w-sm mt-2 leading-relaxed z-10">
              Click any debuff trigger below to test the screen visual override effect in real-time!
            </p>
          </div>

          {/* Interactive Clickable Debuff Cards */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <span className="font-mono text-xs text-[#00F5D4] tracking-widest uppercase block mb-1">
                INTERACTIVE OVERRIDE TESTING
              </span>
              <h3 className="font-military text-3xl text-white font-bold uppercase">
                CLICK TO TRIGGER SCREEN GLITCH
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div
                className={`debuff-hud-card p-4 rounded clip-badge-sm ${activeDebuffTab === 'smoke' ? 'active' : ''}`}
                onClick={() => triggerDebuffGlitch('smoke')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">💨</span>
                  <span className="font-military text-sm text-white font-bold">SMOKE SCREEN</span>
                </div>
                <p className="font-mono text-xs text-gray-400">Blurs opponent syntax highlighting for 12 seconds.</p>
              </div>

              <div
                className={`debuff-hud-card p-4 rounded clip-badge-sm ${activeDebuffTab === 'flashbang' ? 'active' : ''}`}
                onClick={() => triggerDebuffGlitch('flashbang')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">💥</span>
                  <span className="font-military text-sm text-white font-bold">FLASHBANG</span>
                </div>
                <p className="font-mono text-xs text-gray-400">Triggers blinding white flash burst on code compile.</p>
              </div>

              <div
                className={`debuff-hud-card p-4 rounded clip-badge-sm ${activeDebuffTab === 'emp' ? 'active' : ''}`}
                onClick={() => triggerDebuffGlitch('emp')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">⚡</span>
                  <span className="font-military text-sm text-white font-bold">EMP SURGE</span>
                </div>
                <p className="font-mono text-xs text-gray-400">Inverts test case inputs &amp; disables auto-suggestions.</p>
              </div>

              <div
                className={`debuff-hud-card p-4 rounded clip-badge-sm ${activeDebuffTab === 'airdrop' ? 'active' : ''}`}
                onClick={() => triggerDebuffGlitch('smoke')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">📦</span>
                  <span className="font-military text-sm text-white font-bold">AIR DROP CRATE</span>
                </div>
                <p className="font-mono text-xs text-gray-400">Solve 20-second riddle to restore +30 HP &amp; hints.</p>
              </div>

            </div>

            <div className="bg-black/60 p-4 border border-white/10 rounded font-mono text-xs text-gray-300">
              STATUS: <span className="text-[#00F5D4]">OVERRIDE SYSTEM READY</span> // Click debuff card above to preview combat penalty!
            </div>
          </div>

        </div>
      </section>

      {/* --------------------------------------------------------------------------
          SECTION 5: LIVE TIER STANDINGS (Brutalist Esports Scoreboard)
          -------------------------------------------------------------------------- */}
      <section id="leaderboard-section" className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF9E00]/10 border border-[#FF9E00]/30 text-[#FF9E00] font-military text-xs tracking-widest clip-badge-sm mb-3">
              <Trophy size={13} />
              <span>CONQUERORS HALL OF FAME</span>
            </div>
            <h2 className="font-military text-4xl text-white font-bold tracking-wider uppercase">
              HIGH-IMPACT <span className="text-[#FF9E00]">STANDINGS</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search callsign or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-black/60 border border-white/15 focus:border-[#00F5D4] text-xs font-mono text-white rounded outline-none w-48 sm:w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="brutalist-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>CALLSIGN</th>
                <th>TIER BADGE</th>
                <th>WIN RATE</th>
                <th>SOLVE RATIO</th>
                <th>BP POINTS</th>
                <th>RECENT BREACH</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaderboard.map((player) => (
                <tr key={player.rank} className="brutalist-row" onMouseEnter={() => playBeep(1000, 0.02, 'sine')}>
                  <td>
                    <span className="font-military text-sm text-[#FF9E00] font-bold pl-2">#{player.rank}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white tracking-wide">{player.handle}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white/5 border border-white/10 text-gray-400 rounded">
                        {player.lang}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-mono font-bold text-[#00F5D4]">{player.tier}</span>
                  </td>
                  <td className="font-mono text-sm text-green-400 font-bold">{player.winRate}</td>
                  <td className="font-mono text-sm text-gray-300">{player.kdRatio}</td>
                  <td className="font-mono text-sm text-[#FF9E00] font-bold">{player.bp}</td>
                  <td className="font-mono text-xs text-gray-400">{player.breach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --------------------------------------------------------------------------
          SECTION 6: FINAL EXTRACTION CTA & KEYBOARD SHORTCUT
          -------------------------------------------------------------------------- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="extraction-cta-banner p-10 flex flex-col items-center text-center gap-6">
          
          <div className="w-16 h-16 bg-[#FF9E00]/10 border border-[#FF9E00] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,158,0,0.35)] z-10">
            <Trophy size={32} className="text-[#FF9E00]" />
          </div>

          <h2 className="font-military text-3xl sm:text-5xl text-white font-bold tracking-wider uppercase max-w-3xl z-10">
            READY TO CLAIM YOUR FIRST <span className="text-[#FF9E00]">CHICKEN DINNER?</span>
          </h2>

          <p className="font-mono text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed z-10">
            Join 1,842+ competitive coders currently battling in real-time. Drop into the compiler matrix and test your algorithms under zone pressure.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 z-10">
            <button onClick={() => handleAuthAction('github')} className="social-oauth-btn clip-angular-btn">
              <span>AUTH WITH GITHUB</span>
            </button>
            
            <button onClick={() => handleAuthAction('google')} className="social-oauth-btn clip-angular-btn">
              <span>AUTH WITH GOOGLE</span>
            </button>

            <button onClick={handleEnterLobby} className="btn-hazard-amber px-8 py-3.5 text-sm clip-angular-btn">
              LAUNCH BATTLE LOBBY
            </button>
          </div>

          <div className="font-mono text-xs text-[#00F5D4] tracking-widest z-10 animate-pulse mt-2">
            [PRESS ENTER TO LAUNCH BATTLE]
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="command-footer relative z-10 text-gray-500 font-mono text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00F5D4]/10 border border-[#00F5D4] rounded flex items-center justify-center">
              <Swords size={16} className="text-[#00F5D4]" />
            </div>
            <div>
              <span className="font-military text-lg text-white font-bold tracking-widest block leading-none">
                CODEBATTLE ROYALE
              </span>
              <span className="text-[10px] text-gray-400">COMMAND CLIENT V4.2 // COMPETITIVE COMPILER ENGINE</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span>SERVERS: <strong className="text-green-400">OPERATIONAL</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={13} className="text-[#00F5D4]" />
              <span>VAC ANTI-CHEAT: <strong className="text-[#00F5D4]">ACTIVE</strong></span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-600 gap-4">
          <span>&copy; 2026 CODEBATTLE ROYALE. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-400 cursor-pointer" onClick={() => setShowRulesModal(true)}>TERMS OF COMBAT</span>
            <span className="hover:text-gray-400 cursor-pointer" onClick={() => setShowRulesModal(true)}>ANTI-CHEAT POLICY</span>
            <span className="hover:text-gray-400 cursor-pointer" onClick={() => setShowRoyalePassModal(true)}>ROYALE PASS REWARDS</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showRoyalePassModal && (
        <div className="modal-overlay" onClick={() => setShowRoyalePassModal(false)}>
          <div className="modal-container p-6 clip-dossier-panel rounded-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-[#FF9E00]" />
                <h3 className="font-military text-2xl text-white font-bold">SEASON 04 ROYALE PASS</h3>
              </div>
              <button onClick={() => setShowRoyalePassModal(false)} className="text-gray-400 hover:text-white text-xl font-bold cursor-pointer">✕</button>
            </div>
            <div className="font-mono text-xs text-gray-300">
              <p>Tier 1: Cyberpunk Editor Theme (Unlocked)</p>
              <p className="mt-2">Tier 50: Glacier M416 Syntax Highlighter</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowRoyalePassModal(false)} className="btn-hazard-amber px-6 py-2.5 text-xs clip-angular-btn font-military">CLOSE PREVIEW</button>
            </div>
          </div>
        </div>
      )}

      {showRulesModal && (
        <div className="modal-overlay" onClick={() => setShowRulesModal(false)}>
          <div className="modal-container p-6 clip-dossier-panel rounded-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} className="text-[#00F5D4]" />
                <h3 className="font-military text-2xl text-white font-bold">RULES OF COMBAT</h3>
              </div>
              <button onClick={() => setShowRulesModal(false)} className="text-gray-400 hover:text-white text-xl font-bold cursor-pointer">✕</button>
            </div>
            <div className="font-mono text-xs text-gray-300 space-y-3">
              <p>1. Playzone shrinkage damages submission time buffer by -15% on failed test cases.</p>
              <p>2. Air Drop crates grant +30 HP shield or thermal hints.</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowRulesModal(false)} className="btn-glass-volt px-6 py-2.5 text-xs clip-angular-btn font-military">UNDERSTOOD</button>
            </div>
          </div>
        </div>
      )}

      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-container p-8 clip-dossier-panel rounded-xl max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white font-bold text-sm bg-transparent border-none cursor-pointer">✕</button>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#00F5D4]/10 border border-[#00F5D4] text-[#00F5D4] flex items-center justify-center mb-3">
                <Shield size={22} />
              </div>
              <h2 className="font-military text-2xl text-white tracking-widest font-black uppercase mb-1">AUTHENTICATE</h2>
              <h2 className="font-military text-2xl text-[#00F5D4] tracking-widest font-black uppercase mb-4">CODER PROFILE</h2>
              <div className="w-full flex flex-col gap-3 mb-4">
                <button onClick={() => handleAuthAction('github')} className="social-oauth-btn clip-angular-btn w-full justify-between">
                  <span className="font-military text-xs">CONTINUE WITH GITHUB</span>
                  <ChevronRight size={16} className="text-[#00F5D4]" />
                </button>
                <button onClick={() => handleAuthAction('google')} className="social-oauth-btn clip-angular-btn w-full justify-between">
                  <span className="font-military text-xs text-[#FF9E00]">CONTINUE WITH GOOGLE</span>
                  <ChevronRight size={16} className="text-[#FF9E00]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEntering && (
        <div className="modal-overlay">
          <div className="sync-modal-container p-8 text-center max-w-md w-full relative">
            <div className="flex flex-col items-center justify-center gap-5">
              <RefreshCw className="animate-spin text-[#FF9E00] w-12 h-12 mb-2" />
              <div>
                <h3 className="font-military text-2xl text-white tracking-widest mb-1">CONNECTING TO LOBBY</h3>
                <span className="font-mono text-[9px] text-[#00F5D4] tracking-[0.2em] font-bold">SECURE CHANNEL PORT_5005</span>
              </div>
              <div className="font-mono text-[10px] text-gray-400 text-left bg-black/70 p-4 border border-gray-800 w-full h-32 flex flex-col justify-start gap-1 overflow-hidden select-none rounded">
                <p className="text-[#FF9E00] font-bold">&gt; AUTHENTICATING USER PROFILE GHOST_CODER...</p>
                {syncStep >= 1 && <p className="text-gray-400">&gt; Securing compiler sockets... DONE</p>}
                {syncStep >= 2 && <p className="text-gray-400">&gt; Allocating virtual matchmaking stack... DONE</p>}
                {syncStep >= 3 && <p className="text-green-400 font-bold">&gt; ENTRANCE PERMITTED. LAUNCHING LOBBY...</p>}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
