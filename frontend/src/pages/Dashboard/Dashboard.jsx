import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Pause, SkipForward, SkipBack, Music, Disc, Trophy, Shield, Flame, 
  Radio, Volume2, Gamepad2, UserPlus, Check, RefreshCw, Link, Crosshair, Zap, Award
} from 'lucide-react';
import GamerHeader from '../../components/GamerHeader/GamerHeader';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import JoinMatchModal from '../../components/JoinMatchModal/JoinMatchModal';
import { themeService } from '../../services/themeService';
import { audioService } from '../../services/audioService';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState(themeService.getCurrentTheme());
  const [isMatching, setIsMatching] = useState(false);
  const [matchTime, setMatchTime] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const [currentTrack, setCurrentTrack] = useState({
    title: "SYNTHWAVE CYBERPUNK LOBBY",
    artist: "DJ KO-DER ft. ANTIGRAVITY",
    duration: "2:45"
  });

  // Matchmaking timer effect
  useEffect(() => {
    let timer;
    if (isMatching) {
      timer = setInterval(() => {
        setMatchTime((prev) => prev + 1);
      }, 1000);
    } else {
      setMatchTime(0);
    }
    return () => clearInterval(timer);
  }, [isMatching]);

  // Handle simulated matchmaking redirect to Arena page after 3 seconds
  useEffect(() => {
    if (isMatching && matchTime >= 3) {
      setIsMatching(false);
      navigate('/arena');
    }
  }, [isMatching, matchTime, navigate]);

  const formatMatchTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartMatch = () => {
    try {
      audioService.playBeep(800, 0.06, 'sine');
    } catch (e) {}
    setIsMatching(!isMatching);
  };

  // Metallic Badges for Top Squads
  const ConquerorBadge = () => (
    <svg className="w-8 h-8 filter drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z" fill="#1b1c28" stroke="#FACC15" strokeWidth="4" />
      <path d="M50 15 L75 30 L75 70 L50 85 L25 70 L25 30 Z" fill="#FACC15" opacity="0.25" />
      <polygon points="50,22 58,40 78,40 62,52 68,72 50,60 32,72 38,52 22,40 42,40" fill="#FACC15" />
    </svg>
  );

  const AceBadge = () => (
    <svg className="w-8 h-8 filter drop-shadow-[0_0_6px_rgba(148,163,184,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 8 L82 30 L82 70 L50 92 L18 70 L18 30 Z" fill="#1b1c28" stroke="#94A3B8" strokeWidth="4" />
      <circle cx="50" cy="50" r="22" fill="#E2E8F0" opacity="0.15" />
      <path d="M50 30 L63 50 L50 70 L37 50 Z" fill="#E2E8F0" />
      <circle cx="50" cy="50" r="8" fill="#FACC15" />
    </svg>
  );

  const CrownBadge = () => (
    <svg className="w-8 h-8 filter drop-shadow-[0_0_6px_rgba(180,83,9,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 10 L80 32 L80 68 L50 90 L20 68 L20 32 Z" fill="#1b1c28" stroke="#B45309" strokeWidth="4" />
      <path d="M30 65 L35 40 L45 50 L50 35 L55 50 L65 40 L70 65 Z" fill="#CD7F32" stroke="#B45309" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="50" cy="65" r="4" fill="#B45309" />
    </svg>
  );

  // Sample squad data
  const squadLeaderboard = [
    { rank: 1, name: "VIPER_SQUAD", points: 8940, players: ["Viper", "Wraith", "Sage", "Jett"], badge: <ConquerorBadge />, style: 'metallic-badge-gold' },
    { rank: 2, name: "CYBER_GHOSTS", points: 8210, players: [user?.username || "Ghost", "Neo", "Trinity", "Morpheus"], badge: <AceBadge />, style: 'metallic-badge-silver' },
    { rank: 3, name: "APEX_CODERS", points: 7650, players: ["Apex", "Dev", "Stack", "Heap"], badge: <CrownBadge />, style: 'metallic-badge-bronze' }
  ];

  return (
    <div className="gaming-dashboard-page">
      {/* Visual Background Overlays */}
      <div className="grid-matrix-overlay"></div>
      <div className="scanlines-overlay"></div>

      {/* Top Gamer Header */}
      <div className="relative z-10">
        <GamerHeader 
          onOpenSettings={() => setIsSettingsOpen(true)} 
          username={user?.username || "GHOST_CODER"} 
          currentXP={2840} 
          maxXP={5000} 
        />
      </div>

      {/* Main Single-Screen 100vh Workspace Grid */}
      <main className="relative z-10 flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch min-h-0 overflow-hidden">
        
        {/* ================= LEFT SECTION: TOP SQUADS (GLASSMORPHISM) ================= */}
        <section className="lg:col-span-1 flex flex-col gap-4 animate-fade-in-up">
          <div className="glass-panel-industrial p-5 h-full flex flex-col justify-between clip-industrial-card relative">
            <div className="absolute top-0 right-8 w-12 h-[2px] bg-cyan-400"></div>
            
            <div>
              <div className="flex items-center gap-2 mb-5 border-b border-white/10 pb-3">
                <Trophy className="text-[#FACC15] w-5 h-5" />
                <h2 className="font-military text-xl tracking-wider text-white">
                  TOP CONQUEROR SQUADS
                </h2>
              </div>

              {/* Squad List */}
              <div className="flex flex-col gap-3.5">
                {squadLeaderboard.map((squad) => (
                  <div 
                    key={squad.rank}
                    className={`p-3 bg-black/50 border hover:border-[#00ffcc]/60 transition-all duration-200 clip-industrial-card flex items-center justify-between ${squad.style}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {squad.badge}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-military text-[10px] text-gray-500">0{squad.rank}</span>
                          <span className="font-military text-sm text-white tracking-wide font-bold">{squad.name}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono truncate max-w-[130px]">
                          {squad.players.join(" • ")}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block font-mono text-xs text-[#FACC15] font-semibold">{squad.points}</span>
                      <span className="text-[9px] text-gray-500 font-mono tracking-wider">PTS</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Live Protocol */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <h3 className="font-military text-xs text-cyan-400 tracking-widest mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                LIVE STATUS PROTOCOL
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-400">
                <div className="bg-black/50 p-2 border border-white/10">
                  <span className="block text-gray-500">TOTAL SQUADS</span>
                  <span className="text-white font-bold">1,402 Active</span>
                </div>
                <div className="bg-black/50 p-2 border border-white/10">
                  <span className="block text-gray-500">MIN. REQ.</span>
                  <span className="text-white font-bold">4000+ PTS</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= CENTER SECTION: TACTICAL OPERATOR CARD & CTAS ================= */}
        <section className="lg:col-span-2 flex flex-col justify-between items-center relative animate-fade-in-up">
          
          {/* TACTICAL OPERATOR SHOWCASE CARD */}
          <div className="operator-card-container my-auto">
            {/* Ambient Background Aura */}
            <div className="operator-aura-glow"></div>

            {/* Top Loadout Badge */}
            <div className="loadout-badge-pill">
              <Zap size={13} className="text-[#FACC15]" />
              <span>LOADOUT: CONQUEROR M416 + LEVEL 3 HELMET</span>
            </div>

            {/* Character Full-Body Armored Silhouette SVG Illustration */}
            <div className="relative w-full flex-1 flex items-center justify-center my-2 pointer-events-none">
              <svg className="w-64 h-64 filter drop-shadow-[0_0_20px_rgba(0,255,204,0.3)]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Armored Pedestal & Hologram Rings */}
                <ellipse cx="100" cy="180" rx="70" ry="14" fill="#00ffcc" opacity="0.1" />
                <ellipse cx="100" cy="180" rx="70" ry="14" stroke="#00ffcc" strokeWidth="1.5" strokeDasharray="4 4" />
                <ellipse cx="100" cy="180" rx="45" ry="9" stroke="#facc15" strokeWidth="1" />

                {/* Tactical Armored Body / Mummy Suit Silhouette */}
                {/* Torso & Armor Vest */}
                <path d="M70 75 L130 75 L140 130 L125 175 L75 175 L60 130 Z" fill="#121722" stroke="#00ffcc" strokeWidth="2" />
                <path d="M85 85 L115 85 L120 120 L80 120 Z" fill="#1a2233" stroke="#facc15" strokeWidth="1.5" />
                
                {/* Shoulder Armor Pads */}
                <path d="M50 75 L70 70 L75 100 L55 105 Z" fill="#1a2233" stroke="#00ffcc" strokeWidth="1.5" />
                <path d="M150 75 L130 70 L125 100 L145 105 Z" fill="#1a2233" stroke="#00ffcc" strokeWidth="1.5" />

                {/* Level 3 Helmet & Visor */}
                <path d="M75 55 C75 35 125 35 125 55 L120 75 L80 75 Z" fill="#1e2638" stroke="#00ffcc" strokeWidth="2" />
                <path d="M82 50 H118 V62 H82 Z" fill="#00ffcc" opacity="0.85" filter="drop-shadow(0 0 8px #00ffcc)" />
                <line x1="82" y1="56" x2="118" y2="56" stroke="#0b0e14" strokeWidth="2" />

                {/* Tactical Weapon (M416 Slung Across) */}
                <path d="M45 110 L155 70 L158 78 L48 118 Z" fill="#2d374d" stroke="#facc15" strokeWidth="1.5" />
                <circle cx="150" cy="73" r="4" fill="#ff4757" />
              </svg>
            </div>

            {/* Bottom Stats Strip */}
            <div className="operator-stats-strip">
              <div className="stat-badge-item">
                <span className="stat-badge-label">CURRENT TIER</span>
                <span className="stat-badge-val text-[#FACC15]">GOLD I</span>
              </div>
              <div className="stat-badge-item">
                <span className="stat-badge-label">WIN RATE</span>
                <span className="stat-badge-val text-[#00ffcc]">68.4%</span>
              </div>
              <div className="stat-badge-item">
                <span className="stat-badge-label">K/D RATIO</span>
                <span className="stat-badge-val text-white">4.20</span>
              </div>
            </div>
          </div>

          {/* Matchmaking Overlay */}
          {isMatching && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-[#0c0d12]/95 border-2 border-[#FACC15] py-3 px-8 flex items-center gap-4 clip-industrial-card backdrop-blur-md animate-pulse">
              <Radio className="text-[#FACC15] w-6 h-6 animate-pulse" />
              <div className="font-mono text-sm">
                <span className="text-gray-400">SEARCHING ARENA...</span>
                <span className="text-[#FACC15] ml-2 font-bold">{formatMatchTime(matchTime)}</span>
              </div>
            </div>
          )}

          {/* HIGH-CONTRAST SKEWED LOBBY CTAS */}
          <div className="lobby-cta-row">
            <button
              onClick={handleStartMatch}
              className="cta-btn-gamer cta-btn-yellow"
            >
              <span>{isMatching ? 'CANCEL' : 'START DUO MATCH'}</span>
              <span className="cta-subtext">{isMatching ? 'MATCHMAKING...' : 'RANDOM 1V1 MATCHMAKING'}</span>
            </button>
            
            <button
              onClick={() => {
                try { audioService.playBeep(900, 0.06, 'sine'); } catch (e) {}
                setIsJoinModalOpen(true);
              }}
              className="cta-btn-gamer cta-btn-cyan"
            >
              <span>JOIN BY INVITE LINK</span>
              <span className="cta-subtext">PASTE MATCH COORDINATES</span>
            </button>
          </div>

        </section>

        {/* ================= RIGHT SECTION: MAP & MUSIC SELECTOR (GLASSMORPHISM) ================= */}
        <section className="lg:col-span-1 flex flex-col gap-4 animate-fade-in-up">
          <div className="glass-panel-industrial p-5 h-full flex flex-col justify-between clip-industrial-card relative">
            <div className="absolute top-0 left-8 w-12 h-[2px] bg-yellow-400"></div>

            <div className="flex flex-col gap-4">
              
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Gamepad2 className="text-cyan-400 w-5 h-5" />
                <h2 className="font-military text-lg tracking-wider text-white">
                  TACTICAL ARENA
                </h2>
              </div>

              {/* Map Preview */}
              <div className="relative group border border-white/15 overflow-hidden bg-black/50 clip-industrial-card">
                <div className="h-40 w-full relative overflow-hidden">
                  <img 
                    src={activeTheme.image} 
                    alt={`Map ${activeTheme.name}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <span className="block font-military text-[10px] text-cyan-400 tracking-widest font-bold" style={{ color: activeTheme.accentColor }}>CURRENT MAP</span>
                  <h3 className="font-military text-lg text-white tracking-wide" style={{ textShadow: `0 0 10px ${activeTheme.accentGlow}` }}>
                    {activeTheme.name}
                  </h3>
                </div>
              </div>

              {/* Music Player */}
              <div className="bg-black/60 border border-white/10 p-3.5 clip-industrial-card flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="text-[#1DB954] w-4 h-4" />
                    <span className="text-[10px] font-military text-gray-400 tracking-widest">MUSIC PLAYER</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse"></span>
                    <span className="text-[8px] font-mono text-[#1DB954]">LINKED</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className={`w-9 h-9 rounded-full bg-black border border-gray-800 flex items-center justify-center relative ${isPlayingMusic ? 'animate-spin-slow' : ''}`}>
                      <Disc className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-military text-xs text-white truncate tracking-wide">{currentTrack.title}</h4>
                    <p className="font-mono text-[9px] text-gray-500 truncate">{currentTrack.artist}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/10 mt-1">
                  <div className="flex items-center gap-2">
                    <button className="text-gray-500 hover:text-white transition-colors"><SkipBack size={13} /></button>
                    <button 
                      onClick={() => setIsPlayingMusic(!isPlayingMusic)} 
                      className="w-6 h-6 rounded-full bg-[#1db954]/10 border border-[#1db954]/30 flex items-center justify-center text-[#1db954] hover:bg-[#1db954]/20 hover:scale-105 transition-all"
                    >
                      {isPlayingMusic ? <Pause size={10} /> : <Play size={10} />}
                    </button>
                    <button className="text-gray-500 hover:text-white transition-colors"><SkipForward size={13} /></button>
                  </div>

                  <div className="flex items-end gap-[2px] h-4">
                    <span className={`w-[2px] bg-[#1DB954] rounded-t-full transition-all duration-300 ${isPlayingMusic ? 'h-3 animate-pulse' : 'h-1'}`}></span>
                    <span className={`w-[2px] bg-[#1DB954] rounded-t-full transition-all duration-300 ${isPlayingMusic ? 'h-4 animate-pulse' : 'h-1.5'}`} style={{ animationDelay: '0.1s' }}></span>
                    <span className={`w-[2px] bg-[#1DB954] rounded-t-full transition-all duration-300 ${isPlayingMusic ? 'h-2 animate-pulse' : 'h-1'}`} style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>

              </div>

            </div>

            <div className="mt-6">
              <button 
                onClick={() => navigate('/theme')}
                className="w-full py-2.5 bg-transparent border border-white/15 hover:border-cyan-400 hover:text-cyan-400 font-military text-xs tracking-wider transition-all duration-300 clip-industrial-card flex items-center justify-center gap-2 text-gray-300 cursor-pointer"
              >
                <span>CHANGE ARENA MAP</span>
              </button>
            </div>

          </div>
        </section>

      </main>

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      <JoinMatchModal 
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
}
