import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, SkipForward, SkipBack, Music, Disc, Trophy, Shield, Flame, Radio, Volume2, Gamepad2 } from 'lucide-react';
import GamerHeader from '../../components/GamerHeader/GamerHeader';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import coderSilhouette from '../../assets/coder_silhouette.png';
import cyberpunkBanner from '../../assets/cyberpunk_banner.png';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
    setIsMatching(!isMatching);
  };

  // SVG Custom Badges for Squad Leaderboard
  const ConquerorBadge = () => (
    <svg className="w-8 h-8 filter drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z" fill="#1b1c28" stroke="#FACC15" strokeWidth="4" />
      <path d="M50 15 L75 30 L75 70 L50 85 L25 70 L25 30 Z" fill="#FACC15" opacity="0.2" />
      <polygon points="50,22 58,40 78,40 62,52 68,72 50,60 32,72 38,52 22,40 42,40" fill="#FACC15" />
      <path d="M15 50 H30 M70 50 H85" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );

  const AceBadge = () => (
    <svg className="w-8 h-8 filter drop-shadow-[0_0_4px_rgba(226,232,240,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 8 L82 30 L82 70 L50 92 L18 70 L18 30 Z" fill="#1b1c28" stroke="#94A3B8" strokeWidth="4" />
      <circle cx="50" cy="50" r="22" fill="#E2E8F0" opacity="0.15" />
      <path d="M50 30 L63 50 L50 70 L37 50 Z" fill="#E2E8F0" />
      <circle cx="50" cy="50" r="8" fill="#FACC15" />
    </svg>
  );

  const CrownBadge = () => (
    <svg className="w-8 h-8 filter drop-shadow-[0_0_4px_rgba(180,83,9,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 10 L80 32 L80 68 L50 90 L20 68 L20 32 Z" fill="#1b1c28" stroke="#B45309" strokeWidth="4" />
      {/* Crown Shape */}
      <path d="M30 65 L35 40 L45 50 L50 35 L55 50 L65 40 L70 65 Z" fill="#CD7F32" stroke="#B45309" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="50" cy="65" r="4" fill="#B45309" />
    </svg>
  );

  // Sample squad data
  const squadLeaderboard = [
    { rank: 1, name: "VIPER_SQUAD", points: 8940, players: ["Viper", "Wraith", "Sage", "Jett"], badge: <ConquerorBadge /> },
    { rank: 2, name: "CYBER_GHOSTS", points: 8210, players: ["Ghost", "Neo", "Trinity", "Morpheus"], badge: <AceBadge /> },
    { rank: 3, name: "APEX_CODERS", points: 7650, players: ["Apex", "Dev", "Stack", "Heap"], badge: <CrownBadge /> },
  ];

  return (
    <div className="gaming-dashboard-page">
      {/* Visual Overlays */}
      <div className="grid-matrix-overlay"></div>
      <div className="scanlines-overlay"></div>

      {/* Top Header Section */}
      <div className="relative z-10">
        <GamerHeader 
          onOpenSettings={() => setIsSettingsOpen(true)} 
          username="GHOST_CODER" 
          currentXP={2840} 
          maxXP={5000} 
        />
      </div>

      {/* Main Grid Layout */}
      <main className="relative z-10 flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* ================= LEFT SECTION: TOP SQUADS ================= */}
        <section className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-iron-gray clip-industrial-card p-5 h-full flex flex-col justify-between border-t-2 border-[#2d3142] relative">
            
            {/* Hard-edge accent light */}
            <div className="absolute top-0 right-8 w-12 h-[2px] bg-cyan-400"></div>
            
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-[#2d3142]/60 pb-3">
                <Trophy className="text-[#FACC15] w-6 h-6" />
                <h2 className="font-military text-2xl tracking-wider text-white">
                  TOP SQUADS
                </h2>
              </div>

              {/* Squad List */}
              <div className="flex flex-col gap-4">
                {squadLeaderboard.map((squad) => (
                  <div 
                    key={squad.rank}
                    className="p-3 bg-[#1c1e2d] border border-[#2d3142] hover:border-[#FACC15]/40 transition-colors duration-200 clip-industrial-card flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {/* Badge representation */}
                      <div className="flex-shrink-0">
                        {squad.badge}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-military text-[11px] text-gray-500">0{squad.rank}</span>
                          <span className="font-military text-sm text-white tracking-wide font-bold">{squad.name}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono truncate max-w-[140px]">
                          {squad.players.join(" • ")}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block font-mono text-xs text-[#FACC15] font-semibold">{squad.points}</span>
                      <span className="text-[9px] text-gray-500 font-mono tracking-wider">RATING</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical stats preview */}
            <div className="mt-8 border-t border-[#2d3142]/60 pt-4">
              <h3 className="font-military text-xs text-cyan-400 tracking-widest mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                LIVE STATUS PROTOCOL
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-400">
                <div className="bg-black/40 p-2 border border-[#1f2230]">
                  <span className="block text-gray-500">TOTAL SQUADS</span>
                  <span className="text-white font-bold">1,402 Active</span>
                </div>
                <div className="bg-black/40 p-2 border border-[#1f2230]">
                  <span className="block text-gray-500">MIN. REQUIREMENT</span>
                  <span className="text-white font-bold">4000+ PTS</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= CENTER SECTION: PLAYER STAND & CTA ================= */}
        <section className="lg:col-span-2 flex flex-col justify-between items-center relative min-h-[500px]">
          
          {/* Holographic Radar / Stand platform */}
          <div className="w-full flex-1 flex flex-col justify-center items-center relative mt-4">
            
            {/* Futuristic floating radar grid */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-cyan-500/10 pointer-events-none flex items-center justify-center">
              <div className="w-60 h-60 rounded-full border border-cyan-500/5 animate-pulse flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border border-cyan-500/10"></div>
              </div>
            </div>

            {/* Radar scanner sweep */}
            {isMatching && (
              <div className="absolute w-[360px] h-[360px] rounded-full border-2 border-dashed border-[#FACC15]/25 animate-spin pointer-events-none"></div>
            )}

            {/* Character Stand Graphic */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <img 
                src={coderSilhouette} 
                alt="Player Character Silhouette" 
                className="h-[350px] object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.15)] filter brightness-95" 
              />
              
              {/* Stand Platform (clip-hero-stand) */}
              <div className="w-[300px] h-8 bg-gradient-to-b from-[#1b1c28] to-[#0c0d12] border-t border-b border-[#2d3142] clip-hero-stand flex items-center justify-center relative -mt-3 shadow-lg">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-cyan-400/40"></div>
                <span className="font-military text-[10px] text-cyan-400 tracking-[0.2em] font-bold">TACTICAL PLATFORM V2</span>
              </div>
            </div>

            {/* Matchmaking Info Status */}
            {isMatching && (
              <div className="absolute bottom-16 bg-[#0c0d12]/95 border border-[#FACC15]/40 py-2 px-6 flex items-center gap-4 clip-industrial-card backdrop-blur-md animate-pulse">
                <Radio className="text-[#FACC15] w-5 h-5 animate-pulse" />
                <div className="font-mono text-xs">
                  <span className="text-gray-400">SEARCHING...</span>
                  <span className="text-[#FACC15] ml-2 font-bold">{formatMatchTime(matchTime)}</span>
                </div>
              </div>
            )}
          </div>

          {/* START MATCH CTA */}
          <div className="w-full max-w-md pb-6 relative z-10 px-4">
            <button
              onClick={handleStartMatch}
              className={`relative w-full py-4.5 bg-[#FACC15] hover:bg-[#ebd510] text-black font-military font-black text-2xl tracking-widest clip-angular-btn start-match-glow transition-all duration-300 flex flex-col items-center justify-center border-none cursor-pointer select-none`}
            >
              {/* Inner border lines */}
              <div className="btn-inner-border"></div>
              <div className="absolute top-1 left-4 w-4 h-[1px] bg-black/40"></div>
              <div className="absolute bottom-1 right-4 w-4 h-[1px] bg-black/40"></div>

              <span className="relative z-10 flex items-center gap-2">
                {isMatching ? 'CANCEL MATCH' : 'START MATCH'}
              </span>
              <span className="text-[10px] tracking-normal font-mono relative z-10 text-black/60 mt-0.5">
                {isMatching ? 'MATCHMAKING ACTIVE' : 'MODE: CODE DUEL 1V1 | ASIA'}
              </span>
            </button>
          </div>

        </section>

        {/* ================= RIGHT SECTION: MAP & MUSIC SELECTOR ================= */}
        <section className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-iron-gray clip-industrial-card p-5 h-full flex flex-col justify-between border-t-2 border-[#2d3142] relative">
            
            {/* Hard-edge accent light */}
            <div className="absolute top-0 left-8 w-12 h-[2px] bg-yellow-400"></div>

            <div className="flex flex-col gap-4">
              
              {/* Box Title */}
              <div className="flex items-center gap-2 border-b border-[#2d3142]/60 pb-3">
                <Gamepad2 className="text-cyan-400 w-5 h-5" />
                <h2 className="font-military text-lg tracking-wider text-white">
                  TACTICAL ARENA
                </h2>
              </div>

              {/* Map Image Selector Card */}
              <div className="relative group border border-[#2d3142] overflow-hidden bg-black/40 clip-industrial-card">
                
                {/* Diagonal cut corner details for inner frame */}
                <div className="absolute top-0 right-0 w-3 h-3 bg-[#2d3142] transform rotate-45 translate-x-1.5 -translate-y-1.5"></div>
                
                {/* Thumbnail */}
                <div className="h-44 w-full relative overflow-hidden">
                  <img 
                    src={cyberpunkBanner} 
                    alt="Map Synthwave Cyberpunk" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent"></div>
                  
                  {/* Subtle Grid Lines inside image */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                </div>

                {/* Map Name Overlay */}
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="block font-military text-[10px] text-cyan-400 tracking-widest font-bold">MAP</span>
                  <h3 className="font-military text-xl text-white tracking-wide neon-cyan-glow">
                    SYNTHWAVE CYBERPUNK
                  </h3>
                </div>
              </div>

              {/* Music Integration Interface (Spotify Hook) */}
              <div className="bg-[#0f1016] border border-[#2d3142] p-3.5 clip-industrial-card flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="text-[#1DB954] w-4 h-4" /> {/* Spotify Green */}
                    <span className="text-[10px] font-military text-gray-400 tracking-widest">MUSIC PLAYER</span>
                  </div>
                  
                  {/* Connected Hook Icon */}
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse"></span>
                    <span className="text-[8px] font-mono text-[#1DB954]">LINKED</span>
                  </div>
                </div>

                {/* Player details */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    {/* Vinyl spinning record disc */}
                    <div className={`w-10 h-10 rounded-full bg-black border border-gray-800 flex items-center justify-center relative ${isPlayingMusic ? 'animate-spin-slow' : ''}`}>
                      <Disc className="w-6 h-6 text-gray-600" />
                      <div className="absolute w-2 h-2 rounded-full bg-white/80 center-hole"></div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-military text-xs text-white truncate tracking-wide">{currentTrack.title}</h4>
                    <p className="font-mono text-[9px] text-gray-500 truncate">{currentTrack.artist}</p>
                  </div>
                </div>

                {/* Music Controls & Sound Wave Visualizer */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-900/60 mt-1">
                  
                  {/* Playback Controls */}
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

                  {/* Sound Wave bars */}
                  <div className="flex items-end gap-[2px] h-4">
                    <span className={`w-[2px] bg-[#1DB954] rounded-t-full transition-all duration-300 ${isPlayingMusic ? 'h-3 animate-pulse' : 'h-1'}`}></span>
                    <span className={`w-[2px] bg-[#1DB954] rounded-t-full transition-all duration-300 ${isPlayingMusic ? 'h-4 animate-pulse' : 'h-1.5'}`} style={{ animationDelay: '0.1s' }}></span>
                    <span className={`w-[2px] bg-[#1DB954] rounded-t-full transition-all duration-300 ${isPlayingMusic ? 'h-2 animate-pulse' : 'h-1'}`} style={{ animationDelay: '0.2s' }}></span>
                    <span className={`w-[2px] bg-[#1DB954] rounded-t-full transition-all duration-300 ${isPlayingMusic ? 'h-3 animate-pulse' : 'h-1.5'}`} style={{ animationDelay: '0.3s' }}></span>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Actions Selector */}
            <div className="mt-8">
              <button className="w-full py-2.5 bg-transparent border border-[#2d3142] hover:border-cyan-400 hover:text-cyan-400 font-military text-xs tracking-wider transition-all duration-300 clip-industrial-card flex items-center justify-center gap-2 text-gray-300">
                <span>CHANGE ARENA MODE</span>
              </button>
            </div>

          </div>
        </section>

      </main>

      {/* Settings Dialog Overlay */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
