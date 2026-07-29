import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Award, Calendar, Clock, Target, Cpu, HardDrive, Swords, BookOpen, ChevronRight, Zap } from 'lucide-react';
import { themeService } from '../../services/themeService';
import './Analytics.css';

export default function Analytics() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'weaponry', 'operations'
  const activeTheme = themeService.getCurrentTheme();

  // Simulated sound settings check (like theme selector)
  const soundEnabled = true;

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
      console.warn("Web Audio API not supported");
    }
  };

  const handleTabChange = (tab) => {
    playBeep(700, 0.06, 'sine');
    setActiveTab(tab);
  };

  // Recent Battle logs data
  const operations = [
    { id: 1, result: 'VICTORY', mvp: true, map: 'CYBERPUNK NEON', mode: 'DUEL 1V1', bp: '+280', pts: '+42', time: '14:24', date: '2026-07-28' },
    { id: 2, result: 'VICTORY', mvp: false, map: 'ERANGEL MILITARY', mode: 'SQUAD 4V4', bp: '+180', pts: '+28', time: '12:15', date: '2026-07-26' },
    { id: 3, result: 'DEFEAT', mvp: false, map: 'MIRAMAR OUTLAW', mode: 'DUEL 1V1', bp: '+45', pts: '-15', time: '15:00', date: '2026-07-25' },
    { id: 4, result: 'VICTORY', mvp: true, map: 'VIKENDI BLIZZARD', mode: 'DUEL 1V1', bp: '+310', pts: '+48', time: '10:42', date: '2026-07-23' },
    { id: 5, result: 'VICTORY', mvp: false, map: 'SANHOK JUNGLE', mode: 'SQUAD 4V4', bp: '+220', pts: '+32', time: '11:05', date: '2026-07-20' }
  ];

  // IDE Weapons data
  const ideWeapons = [
    {
      name: 'VS CODE (M416)',
      type: 'Assault Code Editor',
      desc: 'Highly modular, reliable, and versatile. The standard-issue compiler for high-octane 1v1 duels. Offers robust multi-extension fire rates.',
      usage: '185 MATCHES',
      level: 8,
      maxLevel: 10,
      accuracy: 82,
      speed: 85, // WPM
      control: 90
    },
    {
      name: 'VIM (AWM)',
      type: 'Sniper Editor (Heavy)',
      desc: 'Keyboard-only precision execution. Capable of bypassing massive security subroutines in a single key sequence. Demands extreme mouse-free discipline.',
      usage: '32 MATCHES',
      level: 5,
      maxLevel: 10,
      accuracy: 96,
      speed: 45,
      control: 50
    },
    {
      name: 'SUBLIME TEXT (Micro UZI)',
      type: 'Submachine Editor (Light)',
      desc: 'Ultra-lightweight scripting shell. Deploys instantly for fast hotfixes and quick perimeter patchups where compile speed outweighs syntax complexity.',
      usage: '20 MATCHES',
      level: 4,
      maxLevel: 10,
      accuracy: 62,
      speed: 110,
      control: 95
    },
    {
      name: 'NEOVIM (Groza)',
      type: 'Airdrop Assault Terminal',
      desc: 'Advanced command-line environment configured with custom Lua matrices. Delivers peak execution speeds for top-tier squad leaders.',
      usage: '11 MATCHES',
      level: 3,
      maxLevel: 10,
      accuracy: 88,
      speed: 75,
      control: 70
    }
  ];

  return (
    <div className="analytics-page">
      <div className="analytics-grid-bg"></div>
      <div className="analytics-scanlines"></div>

      {/* HEADER BAR */}
      <header className="analytics-header relative z-10 flex items-center justify-between border-b border-steel-border px-6 py-4 bg-panel-bg">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              playBeep(500, 0.1, 'sine');
              navigate('/lobby');
            }}
            className="back-btn flex items-center justify-center text-gray-400 hover:text-white border border-steel-border hover:border-gold-glow p-2 rounded transition-all clip-industrial-card cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
              <span className="font-mono text-[9px] text-gold tracking-[0.25em]">INTEL PROFILE PORTAL</span>
            </div>
            <h1 className="font-military text-2xl tracking-wider text-white">PLAYER STATS & ANALYTICS</h1>
          </div>
        </div>

        <div className="text-[10px] font-mono text-gray-500 bg-black/30 px-3 py-1 border border-gray-900">
          SECURE PROTOCOL ID: 5124021489
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="analytics-main relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 flex-1 items-stretch min-h-0">
        
        {/* ================= LEFT SIDEBAR (3 COLS): PROFILE ID CARD ================= */}
        <section className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-iron-gray border border-steel-border p-5 h-full flex flex-col justify-between clip-industrial-card relative">
            <div className="absolute top-0 right-8 w-12 h-[2px] bg-gold"></div>
            
            <div className="flex flex-col gap-5">
              {/* Profile Card Summary */}
              <div className="flex flex-col items-center text-center pb-5 border-b border-steel-border/50">
                
                {/* Large Profile Avatar */}
                <div className="avatar-container-lg mb-3">
                  <div className="avatar-frame-glow">
                    <svg className="w-20 h-20" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="48" fill="#0c0d12" stroke="var(--theme-accent-color)" strokeWidth="3" />
                      <path d="M50 15 L80 35 L80 65 L50 85 L20 65 L20 35 Z" fill="#151722" stroke="#2d3142" strokeWidth="2" />
                      <path d="M50 25 C42 25 35 32 35 40 C35 48 38 52 38 58 L62 58 C62 52 65 48 65 40 C65 32 58 25 50 25 Z" fill="#555b75" />
                      <path d="M30 75 C30 65 40 60 50 60 C60 60 70 65 70 75 L75 80 L25 80 Z" fill="#35394b" />
                      <path d="M42 38 L58 38 L56 42 L44 42 Z" fill="var(--theme-accent-color)" filter="drop-shadow(0 0 3px var(--theme-accent-color))" />
                    </svg>
                  </div>
                  <span className="level-badge-lg font-military">LVL 45</span>
                </div>

                <h2 className="font-military text-2xl text-white tracking-wider mb-0.5">GHOST_CODER</h2>
                <span className="text-[10px] font-mono text-gray-500 block mb-2">CLAN: ALPHA_CODERS</span>
                
                <span 
                  className="font-military text-xs px-3 py-1 bg-gold/10 text-gold border border-gold/30 rounded clip-industrial-card tracking-wider"
                  style={{ backgroundColor: `${activeTheme.accentColor}15`, color: activeTheme.accentColor, borderColor: `${activeTheme.accentColor}40` }}
                >
                  PERIMETER BREACHER
                </span>
              </div>

              {/* Conqueror Tier Info */}
              <div className="bg-black/40 p-4 border border-steel-border/50 rounded clip-steel-sm">
                <div className="flex items-center gap-3">
                  {/* Conqueror Badge representation */}
                  <div className="flex-shrink-0">
                    <svg className="w-12 h-12 filter drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z" fill="#151722" stroke="#FACC15" strokeWidth="4" />
                      <path d="M50 15 L75 30 L75 70 L50 85 L25 70 L25 30 Z" fill="#FACC15" opacity="0.25" />
                      <polygon points="50,22 58,40 78,40 62,52 68,72 50,60 32,72 38,52 22,40 42,40" fill="#FACC15" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-military text-md text-gold leading-none tracking-wide">CONQUEROR</span>
                    <span className="block font-mono text-[10px] text-gray-500 mt-1">LOBBY RATING</span>
                    <span className="block font-mono text-xs text-white font-bold mt-0.5">4,850 POINTS</span>
                  </div>
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-gray-900/60 grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-400">
                  <div>
                    <span className="text-gray-600 block">SERVER RANK</span>
                    <span className="text-white font-bold">#28 (TOP 100)</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">WIN RATING</span>
                    <span className="text-white font-bold">2,402 PTS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tactical stats footer preview */}
            <div className="mt-6 pt-4 border-t border-steel-border/50 text-[9px] font-mono text-gray-500 leading-relaxed uppercase">
              <div className="flex justify-between mb-1">
                <span>SEASON STABILITY</span>
                <span className="text-green-500 font-bold">94.2% SECURED</span>
              </div>
              <div className="w-full h-1 bg-black border border-gray-900 rounded-sm overflow-hidden flex">
                <div className="h-full bg-green-500" style={{ width: '94.2%' }}></div>
              </div>
              <span className="text-right block mt-0.5">ANTI-CHEAT VERIFIED // OK</span>
            </div>

          </div>
        </section>

        {/* ================= RIGHT DETAILS PANEL (9 COLS) ================= */}
        <section className="lg:col-span-9 flex flex-col gap-5">
          
          {/* TAB SYSTEM */}
          <div className="flex gap-2 border-b border-steel-border/60 pb-1 flex-shrink-0">
            <button 
              onClick={() => handleTabChange('overview')}
              className={`tab-btn font-military text-sm px-6 py-2 transition-all ${
                activeTab === 'overview' 
                  ? 'active-tab text-gold border-b-2 border-gold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              COMBAT STATS OVERVIEW
            </button>
            <button 
              onClick={() => handleTabChange('weaponry')}
              className={`tab-btn font-military text-sm px-6 py-2 transition-all ${
                activeTab === 'weaponry' 
                  ? 'active-tab text-gold border-b-2 border-gold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              COMPILER MASTERY (WEAPONS)
            </button>
            <button 
              onClick={() => handleTabChange('operations')}
              className={`tab-btn font-military text-sm px-6 py-2 transition-all ${
                activeTab === 'operations' 
                  ? 'active-tab text-gold border-b-2 border-gold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              RECENT LOG OPERATIONS
            </button>
          </div>

          {/* TAB 1: STATS OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 overflow-y-auto max-h-[calc(100vh-230px)] pr-2 custom-scrollbar flex-1 items-stretch">
              
              {/* Stat Grid (6 Cols) */}
              <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="stat-box bg-black/40 border border-steel-border/50 p-4 clip-steel-sm">
                  <span className="text-gray-500 font-mono text-[9px] block uppercase">Matches Played</span>
                  <span className="font-military text-3xl text-white block mt-1 tracking-wider">248</span>
                  <span className="text-[8px] font-mono text-gray-600 block mt-1">SEASON: SS12</span>
                </div>
                <div className="stat-box bg-black/40 border border-steel-border/50 p-4 clip-steel-sm">
                  <span className="text-gray-500 font-mono text-[9px] block uppercase">Breached (Wins)</span>
                  <span className="font-military text-3xl text-gold block mt-1 tracking-wider">84</span>
                  <span className="text-[8px] font-mono text-green-500 block mt-1">WIN RATIO: 33.8%</span>
                </div>
                <div className="stat-box bg-black/40 border border-steel-border/50 p-4 clip-steel-sm">
                  <span className="text-gray-500 font-mono text-[9px] block uppercase">K/D Ratio</span>
                  <span className="font-military text-3xl text-white block mt-1 tracking-wider">4.73</span>
                  <span className="text-[8px] font-mono text-cyan-400 block mt-1">AVG BYPASS/MATCH</span>
                </div>
                <div className="stat-box bg-black/40 border border-steel-border/50 p-4 clip-steel-sm">
                  <span className="text-gray-500 font-mono text-[9px] block uppercase">Top 10 Finishes</span>
                  <span className="font-military text-3xl text-white block mt-1 tracking-wider">192</span>
                  <span className="text-[8px] font-mono text-gray-600 block mt-1">RATIO: 77.4%</span>
                </div>
                <div className="stat-box bg-black/40 border border-steel-border/50 p-4 clip-steel-sm">
                  <span className="text-gray-500 font-mono text-[9px] block uppercase">Syntax Accuracy</span>
                  <span className="font-military text-3xl text-white block mt-1 tracking-wider">82%</span>
                  <span className="text-[8px] font-mono text-green-500 block mt-1">100% SUCCESS RATINGS</span>
                </div>
                <div className="stat-box bg-black/40 border border-steel-border/50 p-4 clip-steel-sm">
                  <span className="text-gray-500 font-mono text-[9px] block uppercase">Total BP Codes</span>
                  <span className="font-military text-3xl text-white block mt-1 tracking-wider">124.5K</span>
                  <span className="text-[8px] font-mono text-gold block mt-1">AVAILABLE BP POINTS</span>
                </div>

                {/* Additional detailed metrics */}
                <div className="col-span-full bg-iron-gray border border-steel-border/50 p-4 clip-steel-sm flex flex-col gap-3">
                  <h3 className="font-military text-xs text-white tracking-widest flex items-center gap-1.5 border-b border-steel-border/50 pb-2">
                    <Swords size={12} className="text-gold" />
                    DETAILED COMBAT RECORD
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] font-mono text-gray-400">
                    <div className="bg-black/35 p-2 rounded">
                      <span className="text-gray-600 block">AVG TESTS RUN</span>
                      <span className="text-white font-bold">14.2 / Match</span>
                    </div>
                    <div className="bg-black/35 p-2 rounded">
                      <span className="text-gray-600 block">BREACH RATIO</span>
                      <span className="text-[#FACC15] font-bold">78.5% (High)</span>
                    </div>
                    <div className="bg-black/35 p-2 rounded">
                      <span className="text-gray-600 block">TOTAL EXP EARNED</span>
                      <span className="text-white font-bold">142,400 XP</span>
                    </div>
                    <div className="bg-black/35 p-2 rounded">
                      <span className="text-gray-600 block">LONGEST BREACH</span>
                      <span className="text-white font-bold">28m 14s</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Radar Chart Visual (4 Cols) */}
              <div className="lg:col-span-4 bg-iron-gray border border-steel-border/50 p-5 clip-steel-sm flex flex-col justify-between items-center text-center">
                <div className="w-full flex items-center justify-between border-b border-steel-border/50 pb-2 mb-3">
                  <span className="font-military text-xs text-white tracking-widest block">TACTICAL RADAR</span>
                  <span className="text-[8px] font-mono text-gray-500">SS12 STAT INDEX</span>
                </div>

                {/* SVG Radar Chart Representation */}
                <div className="relative w-44 h-44 flex items-center justify-center my-2">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    {/* Ring grids */}
                    <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    
                    {/* Axis lines */}
                    <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <line x1="43" y1="43" x2="157" y2="157" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <line x1="43" y1="157" x2="157" y2="43" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    
                    {/* Data Polygon filled */}
                    {/* Vertices: 
                        1. Top (100, 40): Efficiency = 85% -> y = 100 - (80 * 0.85) = 32
                        2. Right (180, 100): K/D = 90% -> x = 100 + (80 * 0.9) = 172
                        3. Bottom (100, 180): Survival = 70% -> y = 100 + (80 * 0.7) = 156
                        4. Left (20, 100): Tactics = 92% -> x = 100 - (80 * 0.92) = 26
                        5. Top-Left / Diagonal helper vertices representation. Let's make it a 5-point radar polygon:
                           We will draw a custom polygon matching BGMI's beautiful style:
                    */}
                    <polygon 
                      points="100,35 158,82 142,140 62,142 45,78" 
                      fill="var(--color-gold-glow)" 
                      stroke="var(--theme-accent-color)" 
                      strokeWidth="2.5" 
                      className="radar-poly-pulse" 
                    />
                    
                    {/* Interactive points */}
                    <circle cx="100" cy="35" r="3" fill="var(--theme-accent-color)" />
                    <circle cx="158" cy="82" r="3" fill="var(--theme-accent-color)" />
                    <circle cx="142" cy="140" r="3" fill="var(--theme-accent-color)" />
                    <circle cx="62" cy="142" r="3" fill="var(--theme-accent-color)" />
                    <circle cx="45" cy="78" r="3" fill="var(--theme-accent-color)" />
                  </svg>

                  {/* Labels around the chart */}
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 font-military text-[9px] text-white">EFFICIENCY</span>
                  <span className="absolute top-1/2 right-0 -translate-y-1/2 font-military text-[9px] text-[#FACC15]">BREACH (KD)</span>
                  <span className="absolute bottom-0 right-8 font-military text-[9px] text-white">SURVIVAL</span>
                  <span className="absolute bottom-0 left-8 font-military text-[9px] text-white">TACTICS</span>
                  <span className="absolute top-1/2 left-0 -translate-y-1/2 font-military text-[9px] text-[#FACC15]">COLLAB</span>
                </div>

                <div className="font-mono text-[9px] text-gray-500 mt-2 leading-relaxed text-left border-t border-steel-border/50 pt-2 w-full">
                  <span className="text-[#FACC15] font-bold block mb-1">TACTICAL INSIGHT:</span>
                  Ghost Coder has exceptional Breach K/D and Collaboration scores. Excels in rapid multi-extension code compiler operations.
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: WEAPON MASTERY (IDEs) */}
          {activeTab === 'weaponry' && (
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-230px)] pr-2 custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ideWeapons.map((weapon, index) => (
                  <div 
                    key={index}
                    className="bg-black/40 border border-steel-border/50 p-4 clip-steel-sm relative hover:border-[#FACC15]/40 transition-colors duration-200"
                  >
                    <div className="absolute top-2 right-2 bg-black/85 text-[9px] font-mono text-gold px-2 py-0.5 border border-gray-900 font-bold uppercase">
                      {weapon.usage}
                    </div>

                    <div className="mb-2">
                      <span className="text-[#FACC15] font-military text-[9px] block tracking-wider leading-none">
                        {weapon.type}
                      </span>
                      <h3 className="font-military text-lg text-white font-bold leading-tight mt-0.5">
                        {weapon.name}
                      </h3>
                    </div>

                    <p className="text-[10px] text-gray-400 font-mono leading-relaxed h-12 overflow-hidden mb-3">
                      {weapon.desc}
                    </p>

                    {/* Progress Level bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 mb-1">
                        <span>IDE PROGRESS MASTER LEVEL</span>
                        <span className="text-white font-bold">LVL {weapon.level} / {weapon.maxLevel}</span>
                      </div>
                      <div className="w-full h-1.5 bg-black border border-gray-900 rounded-sm overflow-hidden flex">
                        <div 
                          className="h-full bg-gold transition-all duration-300"
                          style={{ width: `${(weapon.level / weapon.maxLevel) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats details */}
                    <div className="grid grid-cols-3 gap-2 text-[9px] font-mono text-gray-400 border-t border-steel-border/30 pt-3">
                      <div className="bg-black/35 p-1 text-center rounded">
                        <span className="text-gray-600 block uppercase">Accuracy</span>
                        <span className="text-white font-bold">{weapon.accuracy}%</span>
                      </div>
                      <div className="bg-black/35 p-1 text-center rounded">
                        <span className="text-gray-600 block uppercase">Speed</span>
                        <span className="text-white font-bold">{weapon.speed} WPM</span>
                      </div>
                      <div className="bg-black/35 p-1 text-center rounded">
                        <span className="text-gray-600 block uppercase">Control</span>
                        <span className="text-white font-bold">{weapon.control}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: OPERATION LOGS */}
          {activeTab === 'operations' && (
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-230px)] pr-2 custom-scrollbar flex-1">
              
              {/* Header Titles */}
              <div className="bg-[#0f1016] border border-steel-border/60 p-3 clip-industrial-card flex items-center justify-between text-[10px] font-military text-gray-400 tracking-wider">
                <span className="w-16">RESULT</span>
                <span className="flex-1 px-4">DECENT ARENA / MODE</span>
                <span className="w-20 text-center">BP CREDITS</span>
                <span className="w-20 text-center">RATING BP</span>
                <span className="w-20 text-center">TIME TIME</span>
                <span className="w-20 text-right">OPER. DATE</span>
              </div>

              {/* Logs Rows */}
              <div className="flex flex-col gap-2.5">
                {operations.map((oper) => (
                  <div 
                    key={oper.id}
                    className="p-3 bg-black/45 border border-steel-border/30 clip-steel-sm flex items-center justify-between text-xs font-mono text-gray-300 hover:border-gray-700 transition-colors"
                  >
                    {/* Victory/Defeat Badge */}
                    <div className="w-16 flex items-center gap-1">
                      <span 
                        className={`font-military text-[10px] px-2 py-0.5 rounded font-black tracking-widest shadow ${
                          oper.result === 'VICTORY' 
                            ? 'bg-gold text-black' 
                            : 'bg-red-500/10 text-red-500 border border-red-500/30'
                        }`}
                      >
                        {oper.result}
                      </span>
                      {oper.mvp && (
                        <span className="bg-cyan-500 text-black font-military text-[8px] px-1 font-bold rounded">
                          MVP
                        </span>
                      )}
                    </div>

                    {/* Arena details */}
                    <div className="flex-1 px-4">
                      <span className="text-white font-military font-bold block leading-none">{oper.map}</span>
                      <span className="text-[9px] text-gray-600 block mt-1">{oper.mode}</span>
                    </div>

                    {/* BP Credits */}
                    <div className="w-20 text-center text-gold font-bold">
                      {oper.bp}
                    </div>

                    {/* Rating Points change */}
                    <div className={`w-20 text-center font-bold ${oper.pts.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {oper.pts}
                    </div>

                    {/* Match Time Duration */}
                    <div className="w-20 text-center text-gray-500">
                      {oper.time}
                    </div>

                    {/* Operation Date */}
                    <div className="w-20 text-right text-gray-600 text-[10px]">
                      {oper.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}
