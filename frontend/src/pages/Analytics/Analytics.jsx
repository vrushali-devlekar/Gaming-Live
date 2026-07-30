import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Shield, Award, Calendar, Clock, Target, Cpu, HardDrive, 
  Swords, BookOpen, ChevronRight, Zap, ExternalLink, Star, GitFork, Code2
} from 'lucide-react';
import { themeService } from '../../services/themeService';
import { useAuth } from '../../context/AuthContext';
import './Analytics.css';

// SVG GitHub Icon Component
const GithubIcon = ({ size = 14, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Analytics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'github', 'weaponry', 'operations'
  const activeTheme = themeService.getCurrentTheme();

  // Dynamic Backend Analytics State
  const [liveAnalytics, setLiveAnalytics] = useState(null);

  // GitHub Profile & Repos State
  const [githubProfile, setGithubProfile] = useState(null);
  const [githubRepos, setGithubRepos] = useState([]);
  const [isLoadingGithub, setIsLoadingGithub] = useState(true);

  // Fetch dynamic Analytics stats from MongoDB backend
  useEffect(() => {
    fetch('http://localhost:3001/api/user/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setLiveAnalytics(data);
        }
      })
      .catch((err) => console.warn('Analytics API fetch warning:', err));
  }, []);

  // Determine target GitHub handle
  const targetGithubHandle = user?.githubUsername || user?.username || 'vrushali-devlekar';

  // Fetch GitHub User Profile & Top 6 Public Repositories
  useEffect(() => {
    let isMounted = true;
    setIsLoadingGithub(true);

    const fetchGithubData = async () => {
      try {
        const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(targetGithubHandle)}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          if (isMounted) setGithubProfile(userData);
        }

        const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(targetGithubHandle)}/repos?sort=updated&per_page=6`);
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          if (isMounted && Array.isArray(reposData)) {
            setGithubRepos(reposData);
          }
        }
      } catch (err) {
        console.warn('GitHub API fetch warning (using fallback state):', err);
      } finally {
        if (isMounted) setIsLoadingGithub(false);
      }
    };

    fetchGithubData();

    return () => {
      isMounted = false;
    };
  }, [targetGithubHandle]);

  // Audio tone trigger
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
    } catch (e) {}
  };

  const handleTabChange = (tab) => {
    playBeep(700, 0.06, 'sine');
    setActiveTab(tab);
  };

  // Language Dot Color Helper
  const getLangDotClass = (lang) => {
    if (!lang) return 'lang-dot-js';
    const l = lang.toLowerCase();
    if (l.includes('javascript')) return 'lang-dot-js';
    if (l.includes('python')) return 'lang-dot-py';
    if (l.includes('c++') || l.includes('cpp')) return 'lang-dot-cpp';
    if (l.includes('typescript')) return 'lang-dot-ts';
    if (l.includes('html') || l.includes('css')) return 'lang-dot-html';
    return 'lang-dot-js';
  };

  // Dynamic Recent Operations data
  const operations = liveAnalytics?.operations || [
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
      speed: 85,
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

  // Live merged stats
  const activeUser = liveAnalytics?.profile || user;
  const statsMatchesPlayed = liveAnalytics?.stats?.matchesPlayed || activeUser?.stats?.matchesPlayed || 48;
  const statsWins = liveAnalytics?.stats?.wins || activeUser?.stats?.wins || 36;
  const statsWinStreak = liveAnalytics?.stats?.winStreak || activeUser?.winStreak || 7;
  const statsTotalSolves = activeUser?.stats?.totalSolves || 142;
  const statsBp = liveAnalytics?.stats?.bp || activeUser?.stats?.bp || 12850;
  const statsLevel = liveAnalytics?.stats?.level || activeUser?.stats?.level || 14;
  const statsRank = liveAnalytics?.stats?.rank || activeUser?.rank || 'CONQUEROR';
  const winRatio = Math.round((statsWins / Math.max(1, statsMatchesPlayed)) * 1000) / 10;

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
            <h1 className="font-military text-2xl tracking-wider text-white">PLAYER STATS &amp; GITHUB ARSENAL</h1>
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
            <div className="absolute top-0 right-8 w-12 h-[2px] bg-[#00ffcc]"></div>
            
            <div className="flex flex-col gap-5">
              {/* Profile Card Summary */}
              <div className="flex flex-col items-center text-center pb-5 border-b border-steel-border/50">
                
                {/* Real GitHub Avatar Image in Glowing Neon Ring */}
                <div className="avatar-container-lg mb-3">
                  <div className="avatar-frame-glow">
                    <img 
                      src={githubProfile?.avatar_url || activeUser?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeUser?.username || 'Ghost'}`} 
                      alt="GitHub Profile Avatar" 
                      className="w-full h-full rounded-full object-cover border border-[#00ffcc]"
                    />
                  </div>
                  <span className="level-badge-lg font-military">LVL {statsLevel}</span>
                </div>

                <h2 className="font-military text-2xl text-white tracking-wider mb-0.5">
                  {activeUser?.username || githubProfile?.name || "GHOST_CODER"}
                </h2>

                <a 
                  href={githubProfile?.html_url || `https://github.com/${targetGithubHandle}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-mono text-[#00ffcc] hover:underline flex items-center gap-1 mb-3"
                >
                  <GithubIcon size={12} />
                  <span>@{githubProfile?.login || targetGithubHandle}</span>
                </a>

                {/* Direct GitHub Profile Link Button */}
                <a 
                  href={githubProfile?.html_url || `https://github.com/${targetGithubHandle}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-2 bg-black/60 hover:bg-[#00ffcc]/20 text-[#00ffcc] border border-[#00ffcc]/50 font-military text-xs tracking-wider rounded clip-industrial-card transition-all flex items-center justify-center gap-2 mb-2"
                >
                  <GithubIcon size={14} />
                  <span>VIEW GITHUB PROFILE</span>
                  <ExternalLink size={12} />
                </a>

                <span 
                  className="font-military text-xs px-3 py-1 bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/40 rounded clip-industrial-card tracking-wider mt-1"
                >
                  PERIMETER BREACHER
                </span>
              </div>

              {/* Conqueror Tier Info */}
              <div className="bg-black/40 p-4 border border-steel-border/50 rounded clip-steel-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-12 h-12 filter drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z" fill="#151722" stroke="#FACC15" strokeWidth="4" />
                      <path d="M50 15 L75 30 L75 70 L50 85 L25 70 L25 30 Z" fill="#FACC15" opacity="0.25" />
                      <polygon points="50,22 58,40 78,40 62,52 68,72 50,60 32,72 38,52 22,40 42,40" fill="#FACC15" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-military text-md text-gold leading-none tracking-wide">
                      {statsRank}
                    </span>
                    <span className="block font-mono text-[10px] text-gray-500 mt-1">LOBBY RATING</span>
                    <span className="block font-mono text-xs text-white font-bold mt-0.5">
                      {statsBp.toLocaleString()} POINTS
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-gray-900/60 grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-400">
                  <div>
                    <span className="text-gray-600 block">PUBLIC REPOS</span>
                    <span className="text-[#00ffcc] font-bold">{githubProfile?.public_repos || 18}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">FOLLOWERS</span>
                    <span className="text-white font-bold">{githubProfile?.followers || 42}</span>
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
          <div className="tab-list-container border-b border-steel-border/60 pb-1 flex-shrink-0">
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
              onClick={() => handleTabChange('github')}
              className={`tab-btn font-military text-sm px-6 py-2 transition-all ${
                activeTab === 'github' 
                  ? 'active-tab text-[#00ffcc] border-b-2 border-[#00ffcc]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              GITHUB REPOSITORIES (TACTICAL ARSENAL)
            </button>

            <button 
              onClick={() => handleTabChange('weaponry')}
              className={`tab-btn font-military text-sm px-6 py-2 transition-all ${
                activeTab === 'weaponry' 
                  ? 'active-tab text-[#00ffcc] border-b-2 border-[#00ffcc]' 
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
              
              <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="stat-box bg-black/40 border border-steel-border/50 p-4 clip-steel-sm">
                  <span className="text-gray-500 font-mono text-[9px] block uppercase">Matches Played</span>
                  <span className="font-military text-3xl text-white block mt-1 tracking-wider">
                    {statsMatchesPlayed}
                  </span>
                  <span className="text-[8px] font-mono text-gray-600 block mt-1">SEASON: SS14</span>
                </div>
                <div className="stat-box bg-black/40 border border-steel-border/50 p-4 clip-steel-sm">
                  <span className="text-gray-500 font-mono text-[9px] block uppercase">Breached (Wins)</span>
                  <span className="font-military text-3xl text-gold block mt-1 tracking-wider">
                    {statsWins}
                  </span>
                  <span className="text-[8px] font-mono text-green-500 block mt-1">WIN RATIO: {winRatio}%</span>
                </div>
                <div className="stat-box bg-black/40 border border-steel-border/50 p-4 clip-steel-sm">
                  <span className="text-gray-500 font-mono text-[9px] block uppercase">Win Streak</span>
                  <span className="font-military text-3xl text-white block mt-1 tracking-wider">
                    {statsWinStreak}🔥
                  </span>
                  <span className="text-[8px] font-mono text-cyan-400 block mt-1">ACTIVE STREAK</span>
                </div>
                <div className="stat-box bg-black/40 border border-steel-border/50 p-4 clip-steel-sm">
                  <span className="text-gray-500 font-mono text-[9px] block uppercase">Total Solves</span>
                  <span className="font-military text-3xl text-white block mt-1 tracking-wider">
                    {statsTotalSolves}
                  </span>
                  <span className="text-[8px] font-mono text-gray-600 block mt-1">DSA PROBLEMS</span>
                </div>
                <div className="stat-box bg-black/40 border border-steel-border/50 p-4 clip-steel-sm">
                  <span className="text-gray-500 font-mono text-[9px] block uppercase">Syntax Accuracy</span>
                  <span className="font-military text-3xl text-white block mt-1 tracking-wider">94%</span>
                  <span className="text-[8px] font-mono text-green-500 block mt-1">PASS RATINGS</span>
                </div>
                <div className="stat-box bg-black/40 border border-steel-border/50 p-4 clip-steel-sm">
                  <span className="text-gray-500 font-mono text-[9px] block uppercase">Total BP Codes</span>
                  <span className="font-military text-3xl text-white block mt-1 tracking-wider">
                    {statsBp.toLocaleString()}
                  </span>
                  <span className="text-[8px] font-mono text-gold block mt-1">AVAILABLE BP</span>
                </div>

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

              {/* Radar Chart */}
              <div className="lg:col-span-4 bg-iron-gray border border-steel-border/50 p-5 clip-steel-sm flex flex-col justify-between items-center text-center">
                <div className="w-full flex items-center justify-between border-b border-steel-border/50 pb-2 mb-3">
                  <span className="font-military text-xs text-white tracking-widest block">TACTICAL RADAR</span>
                  <span className="text-[8px] font-mono text-gray-500">SS14 STAT INDEX</span>
                </div>

                <div className="relative w-44 h-44 flex items-center justify-center my-2">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    
                    <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    
                    <polygon 
                      points="100,35 158,82 142,140 62,142 45,78" 
                      fill="var(--color-gold-glow)" 
                      stroke="var(--theme-accent-color)" 
                      strokeWidth="2.5" 
                      className="radar-poly-pulse" 
                    />
                    
                    <circle cx="100" cy="35" r="3" fill="var(--theme-accent-color)" />
                    <circle cx="158" cy="82" r="3" fill="var(--theme-accent-color)" />
                    <circle cx="142" cy="140" r="3" fill="var(--theme-accent-color)" />
                    <circle cx="62" cy="142" r="3" fill="var(--theme-accent-color)" />
                    <circle cx="45" cy="78" r="3" fill="var(--theme-accent-color)" />
                  </svg>
                </div>

                <div className="font-mono text-[9px] text-gray-500 mt-2 leading-relaxed text-left border-t border-steel-border/50 pt-2 w-full">
                  <span className="text-[#FACC15] font-bold block mb-1">TACTICAL INSIGHT:</span>
                  Operator {activeUser?.username || "GHOST_CODER"} has exceptional Breach K/D and Collaboration scores.
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: GITHUB REPOSITORIES (TACTICAL ARSENAL) */}
          {activeTab === 'github' && (
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-230px)] pr-2 custom-scrollbar flex-1">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-military text-xs text-[#00ffcc] tracking-widest uppercase flex items-center gap-1.5">
                  <GithubIcon size={14} />
                  PUBLIC REPOSITORIES ARSENAL (TOP 6)
                </span>
                <span className="font-mono text-[10px] text-gray-400">
                  FETCHED FROM @{targetGithubHandle}
                </span>
              </div>

              {isLoadingGithub ? (
                <div className="text-center py-12 font-mono text-xs text-[#00ffcc] animate-pulse">
                  TRANSMITTING GITHUB ARSENAL DATA...
                </div>
              ) : githubRepos.length === 0 ? (
                <div className="text-center py-12 font-mono text-xs text-gray-400">
                  No public GitHub repositories found for @{targetGithubHandle}.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {githubRepos.map((repo) => (
                    <div 
                      key={repo.id}
                      className="repo-card-industrial p-4 clip-steel-sm flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-military text-lg text-white font-bold truncate pr-2">
                            {repo.name}
                          </h3>
                          <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded flex items-center gap-1">
                            <span className={`lang-dot ${getLangDotClass(repo.language)}`} />
                            {repo.language || 'Code'}
                          </span>
                        </div>

                        <p className="font-mono text-[10px] text-gray-400 leading-relaxed line-clamp-2 min-h-[28px]">
                          {repo.description || 'No description provided for this tactical repository.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/10 pt-3">
                        <div className="flex items-center gap-3 font-mono text-[10px] text-gray-400">
                          <span className="flex items-center gap-1 text-[#facc15]">
                            <Star size={12} fill="#facc15" />
                            {repo.stargazers_count}
                          </span>
                          <span className="flex items-center gap-1 text-white">
                            <GitFork size={12} />
                            {repo.forks_count}
                          </span>
                        </div>

                        <a 
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-[#00ffcc]/10 hover:bg-[#00ffcc] text-[#00ffcc] hover:text-black font-military text-xs font-bold rounded clip-steel-sm transition-all flex items-center gap-1"
                        >
                          <span>INSPECT REPO</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WEAPON MASTERY (IDEs) */}
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

          {/* TAB 4: OPERATION LOGS */}
          {activeTab === 'operations' && (
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-230px)] pr-2 custom-scrollbar flex-1">
              <div className="bg-[#0f1016] border border-steel-border/60 p-3 clip-industrial-card flex items-center justify-between text-[10px] font-military text-gray-400 tracking-wider">
                <span className="w-16">RESULT</span>
                <span className="flex-1 px-4">DECENT ARENA / MODE</span>
                <span className="w-20 text-center hidden md:block">BP CREDITS</span>
                <span className="w-20 text-center">RATING BP</span>
                <span className="w-20 text-center hidden md:block">TIME TIME</span>
                <span className="w-20 text-right hidden md:block">OPER. DATE</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {operations.map((oper) => (
                  <div 
                    key={oper.id}
                    className="p-3 bg-black/45 border border-steel-border/30 clip-steel-sm flex items-center justify-between text-xs font-mono text-gray-300 hover:border-gray-700 transition-colors"
                  >
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

                    <div className="flex-1 px-4">
                      <span className="text-white font-military font-bold block leading-none">{oper.map}</span>
                      <span className="text-[9px] text-gray-600 block mt-1">{oper.mode}</span>
                    </div>

                    <div className="w-20 text-center text-gold font-bold hidden md:block">
                      {oper.bp}
                    </div>

                    <div className={`w-20 text-center font-bold ${oper.pts.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {oper.pts}
                    </div>

                    <div className="w-20 text-center text-gray-500 hidden md:block">
                      {oper.time}
                    </div>

                    <div className="w-20 text-right text-gray-600 text-[10px] hidden md:block">
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
