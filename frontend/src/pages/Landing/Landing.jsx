import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Swords, RefreshCw, Cpu, ShieldAlert, Wifi, Users, Server } from 'lucide-react';
import { themeService } from '../../services/themeService';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(false);
  const [syncStep, setSyncStep] = useState(0);
  const activeTheme = themeService.getCurrentTheme();

  // Play a soft gaming beep sound
  const playBeep = (freq = 800, duration = 0.08, type = 'sine') => {
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
      console.warn("Audio Context blocked");
    }
  };

  const handleEnterLobby = () => {
    if (isEntering) return;
    playBeep(900, 0.25, 'triangle');
    setIsEntering(true);
    setSyncStep(1);

    // Simulated network authentication steps
    setTimeout(() => {
      setSyncStep(2);
      playBeep(700, 0.08, 'sine');
      setTimeout(() => {
        setSyncStep(3);
        playBeep(800, 0.08, 'sine');
        setTimeout(() => {
          navigate('/lobby');
        }, 1200);
      }, 900);
    }, 800);
  };

  return (
    <div className="landing-page">
      <div className="landing-grid-bg"></div>
      <div className="landing-scanlines"></div>

      {/* TOP HEADER DETAILS */}
      <header className="landing-header relative z-10 flex items-center justify-between px-8 py-5 border-b border-steel-border/50 bg-panel-bg/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-gold animate-ping rounded-full"></div>
          <div>
            <span className="font-mono text-[9px] text-gold tracking-[0.25em] block leading-none">DEPLOYMENT GATEWAY</span>
            <h1 className="font-military text-xl text-white tracking-widest mt-1">GAMING-LIVE // SERVER</h1>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-[10px] font-mono text-gray-500">
          <div className="flex items-center gap-1.5">
            <Wifi size={12} className="text-green-500 animate-pulse" />
            <span>LATENCY: 12ms</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-cyan-400" />
            <span>PLAYERS: 4,850 Active</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="landing-main relative z-10 flex-1 flex flex-col justify-center items-center p-6 max-w-6xl mx-auto w-full gap-8">
        
        {/* HERO SECTION */}
        <section className="text-center max-w-2xl flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 text-gold font-military text-xs clip-industrial-card tracking-wider">
            <Swords size={12} />
            <span>TACTICAL COLLABORATIVE CODESPACE</span>
          </div>
          
          <h2 className="font-military text-5xl md:text-6xl text-white tracking-wider leading-none select-none">
            MULTIPLAYER <span style={{ color: activeTheme.accentColor }}>CODE BATTLE</span>
          </h2>
          
          <p className="font-mono text-xs text-gray-400 leading-relaxed max-w-md">
            Enter the perimeter compiler arena. Sync with squad members, configure your compiler weapon IDEs, and defeat the system firewall.
          </p>

          {/* MAIN LAUNCH ACTION */}
          <div className="mt-4 w-full max-w-sm">
            <button
              onClick={handleEnterLobby}
              className="w-full py-4.5 bg-gold hover:bg-gold-hover text-black font-military font-black text-2xl tracking-widest clip-angular-btn start-match-glow transition-all duration-300 flex flex-col items-center justify-center border-none cursor-pointer select-none relative"
            >
              <div className="btn-inner-border"></div>
              <div className="absolute top-1 left-4 w-4 h-[1px] bg-black/45"></div>
              <div className="absolute bottom-1 right-4 w-4 h-[1px] bg-black/45"></div>
              <span className="relative z-10">ENTER BATTLE LOBBY</span>
            </button>
          </div>
        </section>

        {/* FEATURE HIGHLIGHT GRID */}
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          
          {/* Card 1 */}
          <div className="feature-card bg-black/40 border border-steel-border/50 p-5 clip-steel-sm hover:border-gold/30 transition-all duration-300 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-military text-[10px] text-gold tracking-widest">TACTICAL INTEL</span>
              <Cpu size={14} className="text-gold" />
            </div>
            <div>
              <h3 className="font-military text-lg text-white font-bold leading-tight">3D HOLOGRAM AVATAR</h3>
              <p className="text-[10px] text-gray-400 font-mono leading-relaxed mt-2 h-auto md:h-14">
                Procedurally rendered 3D hologram player matching the iconic BGMI White Mummy outfit, spiky Level 3 helmet, and Glacier M416 skin.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="feature-card bg-black/40 border border-steel-border/50 p-5 clip-steel-sm hover:border-gold/30 transition-all duration-300 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-military text-[10px] text-gold tracking-widest">OPERATIONS</span>
              <Swords size={14} className="text-gold" />
            </div>
            <div>
              <h3 className="font-military text-lg text-white font-bold leading-tight">COLLABORATIVE ARENA</h3>
              <p className="text-[10px] text-gray-400 font-mono leading-relaxed mt-2 h-auto md:h-14">
                Real-time collaborative duels. Monitor cursor grids, test case runs, and track squad mates HP compiler logs.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="feature-card bg-black/40 border border-steel-border/50 p-5 clip-steel-sm hover:border-gold/30 transition-all duration-300 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-military text-[10px] text-gold tracking-widest">SYSTEM SCHEMES</span>
              <Server size={14} className="text-gold" />
            </div>
            <div>
              <h3 className="font-military text-lg text-white font-bold leading-tight">DYNAMIC MAP THEMES</h3>
              <p className="text-[10px] text-gray-400 font-mono leading-relaxed mt-2 h-auto md:h-14">
                Switch environments dynamically, pulling custom theme properties for Erangel Forest, Miramar Desert, Vikendi Blizzard, or Cyberpunk Neon.
              </p>
            </div>
          </div>

        </section>
      </main>

      {/* SYSTEM BAR FOOTER */}
      <footer className="relative z-10 px-8 py-3 border-t border-steel-border/30 bg-black/50 text-[9px] font-mono text-gray-600 flex justify-between uppercase">
        <span>SECURITY VERIFICATION: STABLE // ANTI-CHEAT LOADED</span>
        <span>VERSION 4.2.12-SECURE // CODESPACE LOBBY CORE</span>
      </footer>

      {/* SYSTEM AUTH SYNCING OVERLAY */}
      {isEntering && (
        <div className="sync-modal-overlay">
          <div className="sync-modal-container bg-iron-gray border-2 border-gold shadow-[0_0_30px_rgba(250,204,21,0.25)] p-8 text-center max-w-md w-full relative">
            <div className="absolute top-0 right-10 w-8 h-[3px] bg-gold"></div>
            
            <div className="flex flex-col items-center justify-center gap-5">
              <RefreshCw className="animate-spin text-gold w-12 h-12 mb-2" />
              
              <div>
                <h3 className="font-military text-2xl text-white tracking-widest mb-1">CONNECTING TO LOBBY</h3>
                <span className="font-mono text-[9px] text-cyan-400 tracking-[0.2em] font-bold">SECURE CHANNEL PORT_5005</span>
              </div>

              {/* Rolling logs console */}
              <div className="sync-terminal-logs font-mono text-[10px] text-gray-500 text-left bg-black/60 p-4 border border-gray-900 w-full h-32 flex flex-col justify-start gap-1 overflow-hidden select-none rounded">
                <p className="text-gold font-bold">&gt; AUTHENTICATING USER PROFILE GHOST_CODER...</p>
                {syncStep >= 1 && <p className="text-gray-400">&gt; Securing compiler sockets... DONE</p>}
                {syncStep >= 2 && <p className="text-gray-400">&gt; Allocating virtual matchmaking stack... DONE</p>}
                {syncStep >= 3 && <p className="text-green-400 font-bold">&gt; ENTRANCE PERMITTED. LAUNCHING LOBBY...</p>}
              </div>

              <div className="font-military text-[11px] text-gold/70 tracking-widest">
                DO NOT INTERRUPT LOBBY INITIALIZATION
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
