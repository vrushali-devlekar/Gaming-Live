import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, UserPlus, ExternalLink, Copy, Check, X, 
  Swords, CheckCircle2, XCircle, Code2, Star, GitFork
} from 'lucide-react';
import { themeService } from '../../services/themeService';
import { audioService } from '../../services/audioService';
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
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'github'
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [inviteTarget, setInviteTarget] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  // GitHub Profile & Repos State
  const [githubProfile, setGithubProfile] = useState(null);
  const [githubRepos, setGithubRepos] = useState([]);
  const [isLoadingGithub, setIsLoadingGithub] = useState(true);

  // Determine target GitHub handle (@vrushali as per specifications)
  const targetGithubHandle = user?.githubUsername || user?.username || 'vrushali';

  // Fetch GitHub Data with Graceful Fallbacks
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

  const handleCopyRoomLink = () => {
    try {
      audioService.playBeep(900, 0.04, 'sine');
    } catch (e) {}
    const link = `https://codebattle.io/room/ROOM-8921`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSendDispatch = (e) => {
    e.preventDefault();
    if (!inviteTarget.trim()) return;
    try {
      audioService.playBeep(950, 0.06, 'triangle');
    } catch (e) {}
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setInviteTarget('');
      setIsInviteModalOpen(false);
    }, 1800);
  };

  // Language Dot Helper
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

  // Chronological Recent Match History Data
  const matchHistoryList = [
    {
      id: 'M-8921',
      result: 'VICTORY',
      problem: 'Two Sum Perimeter',
      sector: 'Sector 04',
      opponent: { name: 'NEO_GHOST', avatar: 'NG' },
      executionTime: '0.03ms',
      testsPassed: '10/10',
      mmrDelta: '+35 MMR',
      date: '2026-09-05 17:42'
    },
    {
      id: 'M-8919',
      result: 'VICTORY',
      problem: 'LRU Cache Grid',
      sector: 'Sector 02',
      opponent: { name: 'VEX_HUNTER', avatar: 'VH' },
      executionTime: '0.05ms',
      testsPassed: '12/12',
      mmrDelta: '+42 MMR',
      date: '2026-09-05 16:15'
    },
    {
      id: 'M-8914',
      result: 'DEFEAT',
      problem: 'Graph Traversal Matrix',
      sector: 'Sector 05',
      opponent: { name: 'CYBER_REAPER', avatar: 'CR' },
      executionTime: '0.12ms',
      testsPassed: '7/10',
      mmrDelta: '-15 MMR',
      date: '2026-09-04 21:08'
    },
    {
      id: 'M-8908',
      result: 'VICTORY',
      problem: 'Binary Tree Perimeter',
      sector: 'Sector 01',
      opponent: { name: 'BYTE_MUMMY', avatar: 'BM' },
      executionTime: '0.02ms',
      testsPassed: '8/8',
      mmrDelta: '+28 MMR',
      date: '2026-09-04 19:30'
    },
    {
      id: 'M-8901',
      result: 'VICTORY',
      problem: 'Dynamic Programming Matrix',
      sector: 'Sector 03',
      opponent: { name: 'KODER_SAGE', avatar: 'KS' },
      executionTime: '0.04ms',
      testsPassed: '15/15',
      mmrDelta: '+38 MMR',
      date: '2026-09-03 14:22'
    }
  ];

  // Fallback Repositories if GitHub API is offline
  const fallbackRepos = [
    {
      id: 101,
      name: 'codebattle-engine',
      description: 'Ultra-low latency WebSockets compiler & code execution sandbox engine.',
      language: 'JavaScript',
      stargazers_count: 34,
      forks_count: 8,
      html_url: `https://github.com/${targetGithubHandle}`
    },
    {
      id: 102,
      name: 'tactical-compiler-ui',
      description: 'AAA gaming inspired dark-mode design system built for esports platforms.',
      language: 'TypeScript',
      stargazers_count: 48,
      forks_count: 12,
      html_url: `https://github.com/${targetGithubHandle}`
    },
    {
      id: 103,
      name: 'dsa-arena-benchmarks',
      description: 'High-performance Data Structures & Algorithms execution profiling suite.',
      language: 'C++',
      stargazers_count: 19,
      forks_count: 4,
      html_url: `https://github.com/${targetGithubHandle}`
    },
    {
      id: 104,
      name: 'webgl-shader-effects',
      description: 'Holographic matrix shader background pipelines for React dashboards.',
      language: 'JavaScript',
      stargazers_count: 27,
      forks_count: 6,
      html_url: `https://github.com/${targetGithubHandle}`
    }
  ];

  const displayRepos = githubRepos.length > 0 ? githubRepos : fallbackRepos;
  const avatarUrl = githubProfile?.avatar_url || user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=vrushali`;
  const displayHandle = githubProfile?.login || targetGithubHandle;
  const displayCallsign = user?.username?.toUpperCase() || "VRUSHALI";
  const userLevel = user?.stats?.level || 14;

  return (
    <div className="analytics-dossier-viewport">
      <div className="dossier-grid-overlay"></div>
      <div className="dossier-scanline-layer"></div>

      {/* ================= 1. TOP NAVIGATION BAR ================= */}
      <header className="dossier-top-bar">
        <div className="top-bar-left">
          <button 
            onClick={() => {
              try { audioService.playBeep(500, 0.08, 'sine'); } catch (e) {}
              navigate('/lobby');
            }}
            className="return-lobby-btn clip-tactical-btn"
          >
            <ArrowLeft size={15} />
            <span>RETURN TO COMMAND DECK</span>
          </button>

          <div className="top-title-group">
            <span className="top-status-indicator">
              <span className="beacon-pulse"></span>
              SECURE TELEMETRY LINK ACTIVE
            </span>
            <h1 className="top-main-title">
              OPERATOR DOSSIER <span className="title-slash">//</span> COMBAT TELEMETRY & RECORDS
            </h1>
          </div>
        </div>

        <div className="top-bar-right">
          <button 
            onClick={() => {
              try { audioService.playBeep(850, 0.05, 'sine'); } catch (e) {}
              setIsInviteModalOpen(true);
            }}
            className="invite-action-top-btn clip-tactical-badge"
          >
            <UserPlus size={14} />
            <span>INVITE FRIEND</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN TWO-COLUMN WORKSPACE ================= */}
      <main className="dossier-main-layout">
        
        {/* ================= 2. LEFT COLUMN: OPERATOR PROFILE & INVITE HUB ================= */}
        <aside className="dossier-profile-card glass-dossier-panel clip-tactical-card">
          <div className="profile-hero-section">
            {/* Real Avatar in Illuminated Titanium Frame */}
            <div className="titanium-avatar-frame">
              <div className="titanium-ring-glow">
                <img 
                  src={avatarUrl} 
                  alt="Operator Avatar" 
                  className="avatar-img"
                />
              </div>
              <span className="level-badge clip-tactical-badge">LVL {userLevel}</span>
            </div>

            {/* Callsign & GitHub Handle */}
            <h2 className="operator-callsign-text">
              COMMANDER <span className="accent-amber">//</span> {displayCallsign}
            </h2>

            <a 
              href={githubProfile?.html_url || `https://github.com/${displayHandle}`}
              target="_blank"
              rel="noreferrer"
              className="github-inspect-link"
            >
              <GithubIcon size={13} />
              <span>@{displayHandle}</span>
              <ExternalLink size={11} />
            </a>
          </div>

          {/* Clean Stat Strip */}
          <div className="clean-stat-strip clip-tactical-card">
            <div className="stat-pill">
              <span className="stat-label">PUBLIC REPOS</span>
              <span className="stat-value cyan">{githubProfile?.public_repos || 18}</span>
            </div>

            <div className="stat-pill">
              <span className="stat-label">FOLLOWERS</span>
              <span className="stat-value white">{githubProfile?.followers || 42}</span>
            </div>

            <div className="stat-pill">
              <span className="stat-label">SEASON WIN RATE</span>
              <span className="stat-value amber">78.5%</span>
            </div>
          </div>

          {/* Rank Badge Indicator */}
          <div className="rank-tier-box clip-tactical-card">
            <div className="rank-icon-wrapper">
              <svg className="w-9 h-9 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z" fill="#080B11" stroke="#F59E0B" strokeWidth="5" />
                <polygon points="50,22 58,40 78,40 62,52 68,72 50,60 32,72 38,52 22,40 42,40" fill="#F59E0B" />
              </svg>
            </div>
            <div className="rank-details">
              <span className="rank-tier-title">CONQUEROR TIER</span>
              <span className="rank-rating-sub">3,850 SEASON MMR</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button 
            onClick={() => {
              try { audioService.playBeep(900, 0.05, 'sine'); } catch (e) {}
              setIsInviteModalOpen(true);
            }}
            className="dispatch-invite-btn cta-hazard-amber clip-tactical-btn"
          >
            <UserPlus size={16} />
            <span>DISPATCH MATCH INVITE</span>
          </button>
        </aside>

        {/* ================= 3. MAIN VIEWPORT TABS & CONTENT ================= */}
        <section className="dossier-main-viewport">
          
          {/* Tab Navigation System */}
          <div className="viewport-tab-header">
            <button 
              onClick={() => {
                try { audioService.playBeep(700, 0.04, 'sine'); } catch (e) {}
                setActiveTab('history');
              }}
              className={`viewport-tab-btn clip-tactical-badge ${activeTab === 'history' ? 'active amber' : ''}`}
            >
              <Swords size={14} />
              <span>COMBAT MATCH HISTORY</span>
            </button>

            <button 
              onClick={() => {
                try { audioService.playBeep(700, 0.04, 'sine'); } catch (e) {}
                setActiveTab('github');
              }}
              className={`viewport-tab-btn clip-tactical-badge ${activeTab === 'github' ? 'active cyan' : ''}`}
            >
              <GithubIcon size={14} />
              <span>GITHUB ARSENAL (REPOSITORIES)</span>
            </button>
          </div>

          {/* TAB 1: COMBAT MATCH HISTORY */}
          {activeTab === 'history' && (
            <div className="dossier-tab-content scrollable-viewport custom-scrollbar">
              
              {/* Summary telemetry header pill */}
              <div className="telemetry-summary-strip glass-dossier-panel clip-tactical-card">
                <div className="summary-col">
                  <span className="summary-lbl">TOTAL DUELS</span>
                  <span className="summary-val">48 MATCHES</span>
                </div>
                <div className="summary-col border-left">
                  <span className="summary-lbl">DEFEATED TARGETS</span>
                  <span className="summary-val amber">36 WINS</span>
                </div>
                <div className="summary-col border-left">
                  <span className="summary-lbl">AVG COMPILER LATENCY</span>
                  <span className="summary-val cyan">0.04ms</span>
                </div>
                <div className="summary-col border-left">
                  <span className="summary-lbl">SECURITY BREACH SCORE</span>
                  <span className="summary-val green">100% VERIFIED</span>
                </div>
              </div>

              {/* Match History List */}
              <div className="match-history-list">
                {matchHistoryList.map((match) => {
                  const isWin = match.result === 'VICTORY';
                  return (
                    <div 
                      key={match.id}
                      className={`match-entry-card glass-dossier-panel clip-tactical-card ${isWin ? 'victory-border' : 'defeat-border'}`}
                    >
                      {/* Result Banner */}
                      <div className={`result-banner ${isWin ? 'victory' : 'defeat'}`}>
                        {isWin ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        <span>{match.result}</span>
                      </div>

                      {/* Problem & Sector Information */}
                      <div className="match-problem-info">
                        <h3 className="problem-title">{match.problem}</h3>
                        <span className="sector-tag">{match.sector} // ID: {match.id}</span>
                      </div>

                      {/* Opponent Faced */}
                      <div className="match-opponent-col">
                        <span className="opponent-lbl">OPPONENT FACED</span>
                        <div className="opponent-badge">
                          <div className="opponent-avatar clip-tactical-badge">{match.opponent.avatar}</div>
                          <span className="opponent-name">@{match.opponent.name}</span>
                        </div>
                      </div>

                      {/* Performance Telemetry */}
                      <div className="match-telemetry-grid">
                        <div className="telemetry-cell">
                          <span className="cell-lbl">EXEC TIME</span>
                          <span className="cell-val cyan">{match.executionTime}</span>
                        </div>

                        <div className="telemetry-cell">
                          <span className="cell-lbl">TESTS PASSED</span>
                          <span className="cell-val white">{match.testsPassed}</span>
                        </div>

                        <div className="telemetry-cell">
                          <span className="cell-lbl">MMR DELTA</span>
                          <span className={`cell-val ${isWin ? 'green' : 'red'}`}>{match.mmrDelta}</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: GITHUB ARSENAL (REPOSITORIES) */}
          {activeTab === 'github' && (
            <div className="dossier-tab-content scrollable-viewport custom-scrollbar">
              
              <div className="repo-header-info glass-dossier-panel clip-tactical-card">
                <span className="repo-header-title">
                  <GithubIcon size={15} className="text-[#00F5D4]" />
                  PUBLIC REPOSITORIES ARSENAL // @{displayHandle}
                </span>
                <span className="repo-header-sub font-mono">
                  REAL-TIME SYNCHRONIZATION VIA GITHUB REST API
                </span>
              </div>

              {isLoadingGithub ? (
                <div className="loading-state-box glass-dossier-panel clip-tactical-card">
                  <span className="loading-pulse-text">FETCHING ARSENAL TELEMETRY...</span>
                </div>
              ) : (
                <div className="repo-grid">
                  {displayRepos.map((repo) => (
                    <div 
                      key={repo.id}
                      className="repo-card glass-dossier-panel clip-tactical-card"
                    >
                      <div className="repo-card-top">
                        <div className="repo-title-row">
                          <Code2 size={16} className="text-[#00F5D4]" />
                          <h3 className="repo-name">{repo.name}</h3>
                        </div>
                        
                        <p className="repo-desc">
                          {repo.description || 'Tactical repository for algorithmic combat and compiled matrix operations.'}
                        </p>
                      </div>

                      <div className="repo-card-bottom">
                        <div className="repo-meta-strip">
                          <span className="repo-lang-tag">
                            <span className={`lang-dot ${getLangDotClass(repo.language)}`} />
                            {repo.language || 'Code'}
                          </span>

                          <span className="repo-stat-tag amber">
                            <Star size={12} fill="#F59E0B" />
                            {repo.stargazers_count}
                          </span>

                          <span className="repo-stat-tag white">
                            <GitFork size={12} />
                            {repo.forks_count}
                          </span>
                        </div>

                        <a 
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inspect-repo-btn clip-tactical-badge"
                        >
                          <span>INSPECT REPO</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </section>

      </main>

      {/* ================= TACTICAL DISPATCH MODAL ================= */}
      {isInviteModalOpen && (
        <div className="modal-backdrop-overlay">
          <div className="tactical-modal-card glass-dossier-panel clip-tactical-card">
            
            <div className="modal-header-row">
              <div className="modal-title-group">
                <UserPlus size={16} className="text-[#F59E0B]" />
                <span className="modal-title-text">TACTICAL DISPATCH // MATCH INVITE</span>
              </div>

              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="modal-close-btn"
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body-content">
              {/* Direct Room Link Copy */}
              <div className="dispatch-input-group">
                <label className="input-label">DIRECT DUEL ROOM LINK</label>
                <div className="input-copy-wrapper">
                  <input 
                    type="text" 
                    readOnly 
                    value="https://codebattle.io/room/ROOM-8921" 
                    className="tactical-read-input"
                  />
                  <button 
                    onClick={handleCopyRoomLink}
                    className="copy-btn clip-tactical-badge"
                  >
                    {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    <span>{isCopied ? 'COPIED' : 'COPY LINK'}</span>
                  </button>
                </div>
              </div>

              {/* Direct Handle Invite Dispatch */}
              <form onSubmit={handleSendDispatch} className="dispatch-input-group">
                <label className="input-label">DISPATCH TO GITHUB HANDLE / CALLSIGN</label>
                <div className="input-copy-wrapper">
                  <input 
                    type="text"
                    placeholder="e.g. @vrushali or NEO_GHOST"
                    value={inviteTarget}
                    onChange={(e) => setInviteTarget(e.target.value)}
                    className="tactical-text-input"
                  />
                  <button 
                    type="submit"
                    className="dispatch-submit-btn cta-hazard-amber clip-tactical-badge"
                  >
                    <span>{inviteSent ? 'DISPATCHED!' : 'SEND DISPATCH'}</span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
