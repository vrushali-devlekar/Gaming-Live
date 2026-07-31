import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { 
  Terminal, 
  Swords, 
  RefreshCw, 
  Cpu, 
  ShieldAlert, 
  Wifi, 
  Users, 
  Server, 
  Zap, 
  Trophy, 
  Flame, 
  Crosshair, 
  Box, 
  Eye, 
  Volume2, 
  VolumeX,
  Search,
  CheckCircle,
  Sparkles,
  Lock,
  ArrowRight,
  Shield,
  HelpCircle,
  Award,
  ChevronRight
} from 'lucide-react';
import { themeService } from '../../services/themeService';
import { useAuth } from '../../context/AuthContext';
import './Landing.css';

// Import generated map & tactical assets
import sanhokMapImg from '../../assets/sanhok_map.png';
import erangelMapImg from '../../assets/erangel_map.png';
import airDropCrateImg from '../../assets/air_drop_crate.png';

export default function Landing() {
  const navigate = useNavigate();
  const { isLoggedIn, loginWithGoogle, loginWithGithub } = useAuth();
  
  // Interactive state management
  const [isEntering, setIsEntering] = useState(false);
  const [syncStep, setSyncStep] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedMode, setSelectedMode] = useState('royale');
  const [activeDebuffTab, setActiveDebuffTab] = useState('smoke');
  const [leaderboardFilter, setLeaderboardFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal visibility states
  const [showRoyalePassModal, setShowRoyalePassModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const activeTheme = themeService.getCurrentTheme();

  // GSAP Entrance and Scroll Animations
  useEffect(() => {
    // 1. Navbar entrance animation
    gsap.fromTo('.landing-navbar', 
      { y: -80, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 }
    );

    // 2. Hero Left Column Entrance Animations
    const tl = gsap.timeline({ delay: 0.4 });
    
    tl.fromTo('.hero-live-pill',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
    )
    .fromTo('.hero-title-text',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.hero-title-text + p',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    )
    .fromTo('.btn-tactical-yellow, .btn-tactical-cyan',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.15 },
      '-=0.5'
    )
    .fromTo('.grid-cols-3.border-t > div',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.1 },
      '-=0.4'
    );

    // 3. Hero Right Column (HUD Widget) entrance animation
    gsap.fromTo('.hero-radar-widget',
      { x: 100, opacity: 0, rotate: 2 },
      { x: 0, opacity: 1, rotate: 0, duration: 1.2, ease: 'power4.out', delay: 0.8 }
    );

    // 4. Scroll Trigger animations for Deployment Zones Cards
    gsap.fromTo('.mode-card',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#arenas-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );

    // 5. Scroll Trigger for Air Drop Gameplay section
    gsap.fromTo('.gameplay-feature-box',
      { scale: 0.95, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gameplay-feature-box',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);

  // Tactical Gaming Audio Synthesizer Beep
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
      // Audio context fallbacks
    }
  };

  // Smooth scroll handler
  const scrollToSection = (id) => {
    playBeep(600, 0.05, 'triangle');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Enter Lobby sync sequence handler
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

  // Auth Handler helper
  const handleAuthAction = (provider) => {
    playBeep(1000, 0.1, 'sine');
    setShowAuthModal(false);
    if (provider === 'google' && loginWithGoogle) {
      loginWithGoogle();
    } else if (provider === 'github' && loginWithGithub) {
      loginWithGithub();
    } else {
      navigate('/login');
    }
  };

  // Mock Leaderboard Data
  const leaderboardData = [
    { rank: 1, handle: 'ViperX_Coder', tier: 'CONQUEROR', winRate: '94.2%', kdRatio: '14.8', bp: '24,850', lang: 'C++', avatar: '🌟' },
    { rank: 2, handle: 'Shadow_Ninja', tier: 'CONQUEROR', winRate: '91.8%', kdRatio: '12.4', bp: '22,400', lang: 'Rust', avatar: '🔥' },
    { rank: 3, handle: 'NullPointer_God', tier: 'ACE MASTER', winRate: '88.5%', kdRatio: '10.9', bp: '19,950', lang: 'Python', avatar: '⚡' },
    { rank: 4, handle: 'Erangel_King', tier: 'ACE MASTER', winRate: '86.1%', kdRatio: '9.7', bp: '18,200', lang: 'JS/TS', avatar: '👑' },
    { rank: 5, handle: 'Glacier_M416', tier: 'CROWN I', winRate: '82.4%', kdRatio: '8.5', bp: '16,750', lang: 'Go', avatar: '💎' },
    { rank: 6, handle: 'Sanhok_Ghost', tier: 'CROWN I', winRate: '80.0%', kdRatio: '7.8', bp: '15,300', lang: 'C++', avatar: '🎯' },
    { rank: 7, handle: 'Cyber_Mummy', tier: 'DIAMOND II', winRate: '77.3%', kdRatio: '6.9', bp: '14,100', lang: 'Java', avatar: '🛡️' },
  ];

  const filteredLeaderboard = leaderboardData.filter((item) =>
    item.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="landing-page">
      {/* Background Matrix & Overlay FX */}
      <div className="landing-grid-bg"></div>
      <div className="landing-scanlines"></div>
      <div className="bg-glow-orb-cyan"></div>
      <div className="bg-glow-orb-yellow"></div>

      {/* --------------------------------------------------------------------------
          1. NAVIGATION BAR
          -------------------------------------------------------------------------- */}
      <nav className="landing-navbar px-6 py-4 flex items-center justify-between">
        {/* Tactical Logo */}
        <div className="nav-logo-box" onClick={() => navigate('/')}>
          <div className="nav-logo-icon-wrapper">
            <Swords size={22} className="text-[#00ffcc] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-military text-2xl tracking-widest text-white leading-none font-bold">
                CODE<span className="text-[#00ffcc]">BATTLE</span>
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#00ffcc]/10 border border-[#00ffcc]/30 text-[#00ffcc] font-bold rounded">
                v4.2
              </span>
            </div>
            <span className="text-[9px] font-mono text-gray-400 tracking-[0.25em] block uppercase mt-0.5">
              Multiplayer Algorithmic Royale
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-2">
          <button className="nav-link-btn" onClick={() => scrollToSection('arenas-section')}>
            ARENAS
          </button>
          <button className="nav-link-btn" onClick={() => scrollToSection('leaderboard-section')}>
            LEADERBOARD
          </button>
          <button className="nav-link-btn flex items-center gap-1.5" onClick={() => setShowRoyalePassModal(true)}>
            <Sparkles size={13} className="text-[#facc15]" />
            <span>ROYALE PASS</span>
          </button>
          <button className="nav-link-btn" onClick={() => setShowRulesModal(true)}>
            RULES
          </button>
        </div>

        {/* Auth & Audio Actions */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-black/40 border border-white/10 hover:border-[#00ffcc]/50 text-gray-400 hover:text-white rounded transition-all cursor-pointer"
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
          >
            {soundEnabled ? <Volume2 size={16} className="text-[#00ffcc]" /> : <VolumeX size={16} />}
          </button>

          {!isLoggedIn ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="hidden sm:inline-flex px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-military text-xs tracking-wider clip-badge-sm transition-all cursor-pointer"
            >
              LOGIN / AUTH
            </button>
          ) : null}

          <button
            onClick={handleEnterLobby}
            className="btn-tactical-yellow px-5 py-2.5 text-sm clip-angular-btn flex items-center gap-2 cursor-pointer"
          >
            <Zap size={16} className="fill-black" />
            <span>ENTER LOBBY</span>
          </button>
        </div>
      </nav>

      {/* --------------------------------------------------------------------------
          2. HERO SECTION
          -------------------------------------------------------------------------- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Aggressive Headlines & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          {/* Live Player Counter Pill */}
          <div className="hero-live-pill">
            <div className="live-pulse-dot"></div>
            <span className="font-bold text-white">1,420 ACTIVE CODERS</span>
            <span className="text-gray-400">IN BATTLE ZONE</span>
          </div>

          {/* Aggressive Title */}
          <div>
            <h1 className="hero-title-text font-black uppercase">
              DROP IN. <br />
              <span className="hero-highlight-cyan">CODE HARD.</span> <br />
              <span className="hero-highlight-yellow">SURVIVE.</span>
            </h1>
            <p className="font-mono text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed mt-4">
              The ultimate real-time multiplayer algorithmic battle royale. Parachute into competitive compiler arenas, solve DSA challenges under zone pressure, and execute tactical debuffs to claim the Chicken Dinner!
            </p>
          </div>

          {/* Dual Action Gamer Buttons */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto pt-2">
            <button
              onClick={handleEnterLobby}
              className="btn-tactical-yellow px-8 py-4 text-lg clip-angular-btn flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              <Crosshair size={22} className="text-black" />
              <span>QUICK MATCH</span>
            </button>

            <button
              onClick={() => {
                playBeep(750, 0.1, 'sine');
                if (!isLoggedIn) setShowAuthModal(true);
                else navigate('/room-lobby');
              }}
              className="btn-tactical-cyan px-7 py-4 text-base clip-angular-btn flex items-center gap-2.5 w-full sm:w-auto justify-center"
            >
              <Users size={18} />
              <span>CREATE SQUAD ROOM</span>
            </button>
          </div>

          {/* Key Quick Stats Bar */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 w-full max-w-xl">
            <div>
              <div className="font-military text-2xl text-white font-bold">100 CODERS</div>
              <div className="font-mono text-[10px] text-gray-400 uppercase">Royale Lobby Size</div>
            </div>
            <div>
              <div className="font-military text-2xl text-[#00ffcc] font-bold">3.2 MIN</div>
              <div className="font-mono text-[10px] text-gray-400 uppercase">Avg Zone Shrink</div>
            </div>
            <div>
              <div className="font-military text-2xl text-[#facc15] font-bold">2,500 BP</div>
              <div className="font-mono text-[10px] text-gray-400 uppercase">Winner Reward</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Tactical HUD Radar Widget */}
        <div className="lg:col-span-5 w-full">
          <div className="hero-radar-widget p-6 clip-steel-card rounded-lg flex flex-col gap-5">
            {/* Top Telemetry Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#00ffcc] rounded-full animate-ping"></div>
                <span className="font-mono text-xs text-[#00ffcc] font-bold tracking-widest uppercase">
                  RADAR TELEMETRY // ONLINE
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-gray-400">
                <Wifi size={13} className="text-green-400" />
                <span>12ms PING</span>
              </div>
            </div>

            {/* Middle Sweeping Radar & Status */}
            <div className="flex items-center justify-around py-4">
              <div className="radar-sweep-circle">
                <div className="radar-spin"></div>
                <Crosshair size={32} className="text-[#00ffcc]/60 animate-pulse" />
              </div>
              <div className="flex flex-col gap-2 font-mono text-xs">
                <div className="flex items-center gap-2 text-gray-300">
                  <Server size={14} className="text-[#facc15]" />
                  <span>REGION: ASIA-SOUTH (MUMBAI)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <ShieldAlert size={14} className="text-[#00ffcc]" />
                  <span>ANTI-CHEAT: VAC ACTIVE</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Cpu size={14} className="text-purple-400" />
                  <span>IDE CORE: MONACO V4</span>
                </div>
              </div>
            </div>

            {/* Bottom Status Banner */}
            <div className="bg-black/50 p-3 border border-white/10 rounded font-mono text-xs flex justify-between items-center text-gray-300">
              <span>MATCHMAKING QUEUE: <strong className="text-[#00ffcc]">INSTANT</strong></span>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/40 rounded text-[10px]">READY</span>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------------
          3. GAME MODES SHOWCASE GRID
          -------------------------------------------------------------------------- */}
      <section id="arenas-section" className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00ffcc]/10 border border-[#00ffcc]/30 text-[#00ffcc] font-military text-xs tracking-widest clip-badge-sm mb-3">
            <Swords size={13} />
            <span>DEPLOYMENT ZONES</span>
          </div>
          <h2 className="font-military text-4xl text-white font-bold tracking-wider uppercase">
            TACTICAL <span className="text-[#00ffcc]">GAME MODES</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm text-gray-400 mt-2">
            Select your deployment zone. From 1v1 rapid speed-duels to full 100-coder battle royales.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mode 1: 1v1 Solo Duel */}
          <div
            className={`mode-card clip-steel-card p-5 ${selectedMode === '1v1' ? 'selected' : ''}`}
            onClick={() => {
              playBeep(700, 0.08, 'sine');
              setSelectedMode('1v1');
            }}
          >
            <div className="mode-card-img-wrapper rounded mb-4">
              <img src={erangelMapImg} alt="Erangel Duel" className="mode-card-img" />
              <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 border border-[#00ffcc]/40 text-[#00ffcc] font-military text-xs font-bold rounded">
                1V1 SOLO DUEL
              </div>
            </div>

            <h3 className="font-military text-2xl text-white font-bold mb-2">ERANGEL SPEED DUEL</h3>
            <p className="font-mono text-xs text-gray-400 leading-relaxed mb-4">
              High-intensity 1-on-1 algorithmic duel. First coder to pass all test cases or highest accuracy before zone collapse claims victory.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <div className="mode-spec-badge">👤 2 PLAYERS</div>
              <div className="mode-spec-badge">⏱️ 5 MINS</div>
              <div className="mode-spec-badge text-[#facc15]">💰 100 BP</div>
            </div>

            <button className="w-full btn-tactical-cyan py-3 text-sm clip-angular-btn">
              SELECT 1V1 DUEL
            </button>
          </div>

          {/* Mode 2: 4v4 Squad Deathmatch */}
          <div
            className={`mode-card clip-steel-card p-5 ${selectedMode === 'squad' ? 'selected' : ''}`}
            onClick={() => {
              playBeep(700, 0.08, 'sine');
              setSelectedMode('squad');
            }}
          >
            <div className="mode-card-img-wrapper rounded mb-4">
              <img src={sanhokMapImg} alt="Sanhok Squad" className="mode-card-img" />
              <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 border border-[#facc15]/40 text-[#facc15] font-military text-xs font-bold rounded">
                4V4 SQUAD MATCH
              </div>
            </div>

            <h3 className="font-military text-2xl text-white font-bold mb-2">SANHOK BOOTCAMP</h3>
            <p className="font-mono text-xs text-gray-400 leading-relaxed mb-4">
              Coordinate code modules with 3 squadmates in real-time. Share compiler state, block enemy tactical debuffs, and out-code rival squads.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <div className="mode-spec-badge">👥 4V4 TEAMS</div>
              <div className="mode-spec-badge">⏱️ 15 MINS</div>
              <div className="mode-spec-badge text-[#facc15]">💰 400 BP</div>
            </div>

            <button className="w-full btn-tactical-cyan py-3 text-sm clip-angular-btn">
              SELECT 4V4 SQUAD
            </button>
          </div>

          {/* Mode 3: 100-Coder Royale */}
          <div
            className={`mode-card clip-steel-card p-5 ${selectedMode === 'royale' ? 'selected' : ''}`}
            onClick={() => {
              playBeep(700, 0.08, 'sine');
              setSelectedMode('royale');
            }}
          >
            <div className="mode-card-img-wrapper rounded mb-4">
              <img src={erangelMapImg} alt="100 Coder Royale" className="mode-card-img" />
              <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 border border-[#ff4757]/40 text-[#ff4757] font-military text-xs font-bold rounded">
                🔥 BATTLE ROYALE
              </div>
            </div>

            <h3 className="font-military text-2xl text-white font-bold mb-2">100-CODER ROYALE</h3>
            <p className="font-mono text-xs text-gray-400 leading-relaxed mb-4">
              Drop into the massive 100-player compiler matrix. Safe playzone shrinks dynamically every 3 minutes. Last surviving programmer wins!
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <div className="mode-spec-badge">🔥 100 PLAYERS</div>
              <div className="mode-spec-badge">⏱️ 30 MINS</div>
              <div className="mode-spec-badge text-[#facc15]">🏆 2,500 BP + CONQUEROR</div>
            </div>

            <button className="w-full btn-tactical-yellow py-3 text-sm clip-angular-btn text-black font-bold">
              DEPLOY 100-ROYALE
            </button>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------------
          4. TACTICAL GAMEPLAY FEATURES (Air Drops & Debuffs)
          -------------------------------------------------------------------------- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="gameplay-feature-box p-8 clip-steel-card rounded-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Air Drop Crate Graphic & Mechanics */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            <img src={airDropCrateImg} alt="Air Drop Crate" className="w-64 h-64 object-contain air-drop-glow-img mb-4" />
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff4757]/10 border border-[#ff4757]/40 text-[#ff4757] font-military text-xs tracking-widest clip-badge-sm mb-2">
              <Box size={14} />
              <span>TACTICAL AIR DROP CRATE</span>
            </div>
            <h3 className="font-military text-2xl text-white font-bold">SUPPLY DROPS & BONUS CODE</h3>
            <p className="font-mono text-xs text-gray-400 max-w-sm mt-2 leading-relaxed">
              Every 5 minutes, high-value Air Drops land in the arena. Solve bonus optimization problems for 2x score multipliers and tactical perks!
            </p>
          </div>

          {/* Right Column: Debuffs & Mechanics Breakdown */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <span className="font-mono text-xs text-[#00ffcc] tracking-widest uppercase block mb-1">
                COMBAT MECHANICS // IN-GAME DEBUFFS
              </span>
              <h3 className="font-military text-3xl text-white font-bold uppercase">
                SHRINKING PLAYZONE & POWER-UPS
              </h3>
            </div>

            {/* Debuff Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                className={`debuff-chip p-3 rounded clip-badge-sm text-center ${activeDebuffTab === 'smoke' ? 'active' : ''}`}
                onClick={() => setActiveDebuffTab('smoke')}
              >
                <div className="font-military text-sm text-white font-bold">SMOKE SCREEN</div>
                <div className="font-mono text-[10px] text-gray-400">Editor Blur</div>
              </div>
              <div
                className={`debuff-chip p-3 rounded clip-badge-sm text-center ${activeDebuffTab === 'flash' ? 'active' : ''}`}
                onClick={() => setActiveDebuffTab('flash')}
              >
                <div className="font-military text-sm text-white font-bold">FLASHBANG</div>
                <div className="font-mono text-[10px] text-gray-400">Terminal Flash</div>
              </div>
              <div
                className={`debuff-chip p-3 rounded clip-badge-sm text-center ${activeDebuffTab === 'emp' ? 'active' : ''}`}
                onClick={() => setActiveDebuffTab('emp')}
              >
                <div className="font-military text-sm text-white font-bold">EMP PULSE</div>
                <div className="font-mono text-[10px] text-gray-400">Disable Autocomplete</div>
              </div>
              <div
                className={`debuff-chip p-3 rounded clip-badge-sm text-center ${activeDebuffTab === 'radar' ? 'active' : ''}`}
                onClick={() => setActiveDebuffTab('radar')}
              >
                <div className="font-military text-sm text-white font-bold">CODE RADAR</div>
                <div className="font-mono text-[10px] text-gray-400">Spy Enemy Logs</div>
              </div>
            </div>

            {/* Dynamic Active Tab Content */}
            <div className="bg-black/60 p-5 border border-white/10 rounded font-mono text-xs leading-relaxed text-gray-300">
              {activeDebuffTab === 'smoke' && (
                <p>
                  💨 <strong className="text-[#facc15]">SMOKE SCREEN:</strong> Obfuscates your enemy's editor syntax highlighting for 30 seconds. Forces opponent to read raw unformatted text while their playzone timer ticks down!
                </p>
              )}
              {activeDebuffTab === 'flash' && (
                <p>
                  💥 <strong className="text-[#ff4757]">FLASHBANG:</strong> Triggered upon code compilation. Flashes a blinding white light across the opponent's screen for 3 seconds, interrupting their focus.
                </p>
              )}
              {activeDebuffTab === 'emp' && (
                <p>
                  ⚡ <strong className="text-[#00ffcc]">EMP PULSE:</strong> Disables Intellisense, auto-formatting, and code completion suggestions for rival team members during key algorithmic challenges.
                </p>
              )}
              {activeDebuffTab === 'radar' && (
                <p>
                  👁️ <strong className="text-purple-400">CODE RADAR:</strong> Grants 15 seconds of thermal insight into rival team test case failures, revealing edge cases they are currently stuck on.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------------
          5. TOP RANKS / HALL OF FAME (LEADERBOARD)
          -------------------------------------------------------------------------- */}
      <section id="leaderboard-section" className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] font-military text-xs tracking-widest clip-badge-sm mb-3">
              <Trophy size={13} />
              <span>CONQUERORS HALL OF FAME</span>
            </div>
            <h2 className="font-military text-4xl text-white font-bold tracking-wider uppercase">
              TOP RANKS <span className="text-[#facc15]">&amp; STANDINGS</span>
            </h2>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search coder or lang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-black/60 border border-white/15 focus:border-[#00ffcc] text-xs font-mono text-white rounded outline-none w-48 sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>PLAYER HANDLE</th>
                <th>TIER</th>
                <th>WIN RATE</th>
                <th>SOLVE RATIO</th>
                <th>BP POINTS</th>
                <th>MAIN TECH</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaderboard.map((player) => (
                <tr key={player.rank} className="leaderboard-row">
                  <td>
                    {player.rank === 1 ? (
                      <div className="rank-badge-top1">1</div>
                    ) : player.rank === 2 ? (
                      <div className="rank-badge-top2">2</div>
                    ) : player.rank === 3 ? (
                      <div className="rank-badge-top3">3</div>
                    ) : (
                      <span className="font-military text-sm text-gray-400 pl-2">#{player.rank}</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{player.avatar}</span>
                      <span className="font-bold text-white tracking-wide">{player.handle}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`rank-tier-pill ${
                        player.tier === 'CONQUEROR'
                          ? 'tier-conqueror'
                          : player.tier === 'ACE MASTER'
                          ? 'tier-ace'
                          : player.tier === 'CROWN I'
                          ? 'tier-crown'
                          : 'tier-diamond'
                      }`}
                    >
                      {player.tier}
                    </span>
                  </td>
                  <td className="font-mono text-sm text-green-400 font-bold">{player.winRate}</td>
                  <td className="font-mono text-sm text-gray-300">{player.kdRatio}</td>
                  <td className="font-mono text-sm text-[#facc15] font-bold">{player.bp}</td>
                  <td>
                    <span className="px-2 py-1 bg-white/5 border border-white/10 text-gray-300 font-mono text-xs rounded">
                      {player.lang}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --------------------------------------------------------------------------
          6. FINAL CTA SECTION & FOOTER
          -------------------------------------------------------------------------- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="cta-banner-bg p-10 clip-steel-card rounded-2xl flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 bg-[#facc15]/10 border border-[#facc15] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.3)]">
            <Trophy size={32} className="text-[#facc15]" />
          </div>

          <h2 className="font-military text-4xl sm:text-5xl text-white font-bold tracking-wider uppercase max-w-2xl">
            CLAIM YOUR FIRST <span className="text-[#facc15]">CHICKEN DINNER</span>
          </h2>

          <p className="font-mono text-sm text-gray-300 max-w-xl leading-relaxed">
            Join 1,420+ competitive coders currently battling in real-time. Drop into the compiler matrix and test your algorithms under pressure.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleAuthAction('github')}
              className="social-login-btn clip-angular-btn"
            >
              <span>LOGIN WITH GITHUB</span>
            </button>
            <button
              onClick={() => handleAuthAction('google')}
              className="social-login-btn clip-angular-btn"
            >
              <span>LOGIN WITH GOOGLE</span>
            </button>
            <button
              onClick={handleEnterLobby}
              className="btn-tactical-yellow px-8 py-3.5 text-base clip-angular-btn"
            >
              LAUNCH BATTLE LOBBY
            </button>
          </div>
        </div>
      </section>

      {/* Tactical Footer */}
      <footer className="landing-footer relative z-10 text-gray-500 font-mono text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00ffcc]/10 border border-[#00ffcc] rounded flex items-center justify-center">
              <Swords size={16} className="text-[#00ffcc]" />
            </div>
            <div>
              <span className="font-military text-lg text-white font-bold tracking-widest block leading-none">
                CODEBATTLE ROYALE
              </span>
              <span className="text-[10px] text-gray-400">V4.2.0 // COMPETITIVE COMPILER ENGINE</span>
            </div>
          </div>

          {/* System Status Indicators */}
          <div className="flex flex-wrap items-center gap-6 text-[11px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span>SERVERS: <strong className="text-green-400">OPERATIONAL</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={13} className="text-[#00ffcc]" />
              <span>VAC ANTI-CHEAT: <strong className="text-[#00ffcc]">ACTIVE</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi size={13} className="text-[#facc15]" />
              <span>GLOBAL LATENCY: <strong className="text-[#facc15]">12ms</strong></span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-600 gap-4">
          <span>&copy; 2026 CODEBATTLE ROYALE. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-400 cursor-pointer" onClick={() => setShowRulesModal(true)}>
              TERMS OF COMBAT
            </span>
            <span className="hover:text-gray-400 cursor-pointer" onClick={() => setShowRulesModal(true)}>
              ANTI-CHEAT POLICY
            </span>
            <span className="hover:text-gray-400 cursor-pointer" onClick={() => setShowRoyalePassModal(true)}>
              ROYALE PASS REWARDS
            </span>
          </div>
        </div>
      </footer>

      {/* --------------------------------------------------------------------------
          7. MODALS (Royale Pass, Rules, Auth Selector, Sync Overlay)
          -------------------------------------------------------------------------- */}
      
      {/* Royale Pass Modal */}
      {showRoyalePassModal && (
        <div className="modal-overlay" onClick={() => setShowRoyalePassModal(false)}>
          <div className="modal-container p-6 clip-steel-card rounded-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-[#facc15]" />
                <h3 className="font-military text-2xl text-white font-bold tracking-wider">
                  SEASON 14 ROYALE PASS
                </h3>
              </div>
              <button
                onClick={() => setShowRoyalePassModal(false)}
                className="text-gray-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4 font-mono text-xs">
              <div className="bg-black/50 p-4 border border-[#facc15]/30 rounded flex justify-between items-center">
                <div>
                  <div className="font-military text-lg text-[#facc15] font-bold">TIER 1 REWARD</div>
                  <div className="text-gray-300">White Mummy White Code Editor Theme</div>
                </div>
                <span className="px-3 py-1 bg-[#facc15]/20 text-[#facc15] border border-[#facc15] font-bold rounded">
                  UNLOCKED
                </span>
              </div>

              <div className="bg-black/50 p-4 border border-white/10 rounded flex justify-between items-center">
                <div>
                  <div className="font-military text-lg text-white font-bold">TIER 50 REWARD</div>
                  <div className="text-gray-300">Glacier M416 Syntax Highlighter Skin</div>
                </div>
                <span className="px-3 py-1 bg-white/10 text-gray-400 border border-white/10 rounded">
                  LVL 50 REQ
                </span>
              </div>

              <div className="bg-black/50 p-4 border border-white/10 rounded flex justify-between items-center">
                <div>
                  <div className="font-military text-lg text-[#00ffcc] font-bold">TIER 100 REWARD</div>
                  <div className="text-gray-300">Golden Conqueror Keycaps &amp; Sound Pack</div>
                </div>
                <span className="px-3 py-1 bg-white/10 text-gray-400 border border-white/10 rounded">
                  LVL 100 REQ
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowRoyalePassModal(false)}
                className="btn-tactical-yellow px-6 py-2.5 text-sm clip-angular-btn"
              >
                CLOSE PREVIEW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="modal-overlay" onClick={() => setShowRulesModal(false)}>
          <div className="modal-container p-6 clip-steel-card rounded-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} className="text-[#00ffcc]" />
                <h3 className="font-military text-2xl text-white font-bold tracking-wider">
                  RULES OF COMBAT
                </h3>
              </div>
              <button
                onClick={() => setShowRulesModal(false)}
                className="text-gray-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4 font-mono text-xs text-gray-300 leading-relaxed">
              <div className="p-3 bg-black/40 border border-white/10 rounded">
                <strong className="text-[#00ffcc] block mb-1">1. SHRINKING PLAYZONE:</strong>
                Submitting incorrect test cases immediately shrinks your team buffer zone by -15%. Zone collapse tick damage reduces maximum code submission time.
              </div>
              <div className="p-3 bg-black/40 border border-white/10 rounded">
                <strong className="text-[#facc15] block mb-1">2. AIR DROPS:</strong>
                Bonus supply crates spawn mid-match with bonus DSA optimization tasks. Solving them grants instant score multipliers and shield perks.
              </div>
              <div className="p-3 bg-black/40 border border-white/10 rounded">
                <strong className="text-[#ff4757] block mb-1">3. ANTI-CHEAT ENGINE:</strong>
                AI-driven solution plagiarism and syntax copy-paste detectors are active. Automated script bots result in immediate match forfeit and rank reset.
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowRulesModal(false)}
                className="btn-tactical-cyan px-6 py-2.5 text-sm clip-angular-btn"
              >
                UNDERSTOOD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-card-wrapper max-w-[620px] shadow-[0_0_50px_rgba(0,255,204,0.15)] relative" onClick={(e) => e.stopPropagation()}>
            <div className="auth-card-content flex flex-col items-center text-center">
              
              {/* Close button inside modal content */}
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white font-bold text-sm bg-transparent border-none cursor-pointer"
              >
                ✕
              </button>

              {/* Security Shield badge */}
              <div className="flex flex-col items-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#00ffcc]/5 border border-[#00ffcc]/30 text-[#00ffcc] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,204,0.1)]">
                  <Shield size={22} />
                </div>
                <span className="text-[10px] font-mono text-[#00ffcc] tracking-[0.2em] uppercase font-bold flex items-center gap-1">
                  <Lock size={10} /> SECURE ACCESS
                </span>
              </div>

              {/* Title */}
              <h2 className="font-military text-2xl text-white tracking-widest uppercase font-black leading-none mb-1">
                AUTHENTICATE
              </h2>
              <h2 className="font-military text-2xl text-[#00ffcc] tracking-widest uppercase font-black leading-none mb-4">
                CODER PROFILE
              </h2>
              
              <p className="font-mono text-[11px] text-gray-400 leading-relaxed mb-6">
                Sign in with 1-click to access multiplayer arenas and save your BP rank stats.
              </p>

              {/* OAUTH BUTTONS */}
              <div className="w-full flex flex-col gap-3.5 mb-6">
                
                {/* GITHUB OAUTH */}
                <button
                  onClick={() => handleAuthAction('github')}
                  className="auth-btn-github w-full py-3.5 px-5 flex items-center justify-between transition-all cursor-pointer bg-transparent"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4.5 h-4.5 fill-white" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span className="font-military text-xs text-white font-bold tracking-wider">
                      CONTINUE WITH <span className="text-[#00ffcc]">GITHUB</span>
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-[#00ffcc]" />
                </button>

                {/* GOOGLE OAUTH */}
                <button
                  onClick={() => handleAuthAction('google')}
                  className="auth-btn-google w-full py-3.5 px-5 flex items-center justify-between transition-all cursor-pointer bg-transparent"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4.5 h-4.5 fill-[#facc15]" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V13.4h6.86c-.277 1.56-1.602 4.585-6.86 4.585-4.54 0-8.24-3.765-8.24-8.4s3.7-8.4 8.24-8.4c2.58 0 4.307 1.095 5.298 2.045l2.465-2.37C18.251 1.21 15.497 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.185-1.925H12.24z"/>
                    </svg>
                    <span className="font-military text-xs text-white font-bold tracking-wider">
                      CONTINUE WITH <span className="text-[#facc15]">GOOGLE</span>
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-[#facc15]" />
                </button>

              </div>

              {/* Card Footer Divider */}
              <div className="w-full flex items-center gap-2 mb-4 text-[8px] font-mono text-gray-600 uppercase tracking-widest">
                <div className="flex-1 h-[1px] bg-gray-800" />
                <span className="flex items-center gap-1">
                  <Lock size={8} /> SECURE LOGIN
                </span>
                <div className="flex-1 h-[1px] bg-gray-800" />
              </div>

              {/* Footer Links */}
              <div className="flex items-center gap-3 text-[8px] font-mono text-gray-500 tracking-wider">
                <span className="hover:text-gray-300 cursor-pointer">TERMS OF SERVICE</span>
                <span>•</span>
                <span className="hover:text-gray-300 cursor-pointer">PRIVACY POLICY</span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Tactical Lobby Synchronization Overlay */}
      {isEntering && (
        <div className="sync-modal-overlay">
          <div className="sync-modal-container bg-[#12141c] border-2 border-[#facc15] shadow-[0_0_30px_rgba(250,204,21,0.25)] p-8 text-center max-w-md w-full relative">
            <div className="absolute top-0 right-10 w-8 h-[3px] bg-[#facc15]"></div>
            
            <div className="flex flex-col items-center justify-center gap-5">
              <RefreshCw className="animate-spin text-[#facc15] w-12 h-12 mb-2" />
              
              <div>
                <h3 className="font-military text-2xl text-white tracking-widest mb-1">CONNECTING TO LOBBY</h3>
                <span className="font-mono text-[9px] text-[#00ffcc] tracking-[0.2em] font-bold">SECURE CHANNEL PORT_5005</span>
              </div>

              {/* Rolling logs console */}
              <div className="sync-terminal-logs font-mono text-[10px] text-gray-400 text-left bg-black/70 p-4 border border-gray-900 w-full h-32 flex flex-col justify-start gap-1 overflow-hidden select-none rounded">
                <p className="text-[#facc15] font-bold">&gt; AUTHENTICATING USER PROFILE GHOST_CODER...</p>
                {syncStep >= 1 && <p className="text-gray-400">&gt; Securing compiler sockets... DONE</p>}
                {syncStep >= 2 && <p className="text-gray-400">&gt; Allocating virtual matchmaking stack... DONE</p>}
                {syncStep >= 3 && <p className="text-green-400 font-bold">&gt; ENTRANCE PERMITTED. LAUNCHING LOBBY...</p>}
              </div>

              <div className="font-military text-[11px] text-[#facc15]/70 tracking-widest">
                DO NOT INTERRUPT LOBBY INITIALIZATION
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
