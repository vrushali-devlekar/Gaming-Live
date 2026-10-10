import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  Check, 
  Swords, 
  Trophy,
  Zap,
  Star, 
  GitFork, 
  Code2, 
  TrendingUp, 
  Award, 
  Clock, 
  ShieldCheck, 
  BarChart3, 
  Cpu, 
  Activity,
  UserPlus
} from 'lucide-react';
import CommandHeader from '../../components/CommandHeader/CommandHeader';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import { useAuth } from '../../context/AuthContext';
import './Analytics.css';

export default function Analytics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'github' | 'stats'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // GitHub Profile & Repos State
  const [githubProfile, setGithubProfile] = useState(null);
  const [githubRepos, setGithubRepos] = useState([]);
  const [isLoadingGithub, setIsLoadingGithub] = useState(true);

  const targetGithubHandle = user?.githubUsername || user?.username || 'octocat';

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
        console.warn('GitHub API fetch warning:', err);
      } finally {
        if (isMounted) setIsLoadingGithub(false);
      }
    };

    fetchGithubData();

    return () => {
      isMounted = false;
    };
  }, [targetGithubHandle]);

  // Match History
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
      date: 'Today, 17:42'
    },
    {
      id: 'M-8919',
      result: 'VICTORY',
      problem: 'Quantum LRU Cache Buffer',
      sector: 'Sector 02',
      opponent: { name: 'VEX_HUNTER', avatar: 'VH' },
      executionTime: '0.05ms',
      testsPassed: '12/12',
      mmrDelta: '+42 MMR',
      date: 'Today, 16:15'
    },
    {
      id: 'M-8914',
      result: 'DEFEAT',
      problem: 'Subnet Packet Delay Time',
      sector: 'Sector 05',
      opponent: { name: 'CYBER_REAPER', avatar: 'CR' },
      executionTime: '0.12ms',
      testsPassed: '7/10',
      mmrDelta: '-15 MMR',
      date: 'Yesterday, 21:08'
    },
    {
      id: 'M-8908',
      result: 'VICTORY',
      problem: 'Trapping Water Grid',
      sector: 'Sector 01',
      opponent: { name: 'BYTE_MUMMY', avatar: 'BM' },
      executionTime: '0.02ms',
      testsPassed: '8/8',
      mmrDelta: '+28 MMR',
      date: 'Yesterday, 19:30'
    },
    {
      id: 'M-8901',
      result: 'VICTORY',
      problem: 'Perimeter Firewall Traversal',
      sector: 'Sector 03',
      opponent: { name: 'KODER_SAGE', avatar: 'KS' },
      executionTime: '0.04ms',
      testsPassed: '15/15',
      mmrDelta: '+38 MMR',
      date: '2 days ago'
    }
  ];

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
    }
  ];

  const reposToDisplay = githubRepos.length > 0 ? githubRepos : fallbackRepos;
  const username = user?.username || 'GHOST_OPERATOR';
  const rank = user?.rank || 'CONQUEROR TIER';
  const mmr = user?.stats?.mmr || '3,850';

  return (
    <div className="cyber-analytics-viewport">
      {/* Shared Command Header */}
      <CommandHeader onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="analytics-main-container">
        
        {/* ================= TOP OPERATOR PROFILE DOSSIER ================= */}
        <section className="profile-dossier-card">
          <div className="profile-dossier-inner">
            
            {/* Avatar & Ident */}
            <div className="dossier-avatar-col">
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`}
                alt="Avatar"
                className="dossier-avatar-img"
              />
              <div className="dossier-rank-tag">{rank}</div>
            </div>

            {/* Profile Core Info */}
            <div className="dossier-info-col">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="dossier-username">{username.toUpperCase()}</h1>
                <span className="dossier-status-badge">
                  <span className="status-beacon-green" /> ONLINE
                </span>
              </div>

              <span className="dossier-title-label">TITLE: MASTER ALGORITHM DUELIST</span>
              
              {/* XP Level Progress Bar */}
              <div className="level-progress-wrapper">
                <div className="flex justify-between text-xs font-mono text-muted mb-1">
                  <span>LEVEL 14 CONQUEROR</span>
                  <span className="text-lime">3,420 / 4,000 XP</span>
                </div>
                <div className="level-track-bar">
                  <div className="level-fill-bar" style={{ width: '85%' }} />
                </div>
              </div>
            </div>

            {/* Quick Stats Block */}
            <div className="dossier-stats-col">
              <div className="quick-stat-box">
                <span className="qs-label">SEASON MMR</span>
                <span className="qs-val text-lime">{mmr}</span>
              </div>
              <div className="quick-stat-box">
                <span className="qs-label">WIN RATE</span>
                <span className="qs-val text-cyan">79.2%</span>
              </div>
              <div className="quick-stat-box">
                <span className="qs-label">TOTAL MATCHES</span>
                <span className="qs-val text-white">48 DUELS</span>
              </div>
            </div>

          </div>
        </section>

        {/* ================= TAB NAVIGATION ================= */}
        <div className="analytics-tabs-strip">
          <button
            onClick={() => setActiveTab('history')}
            className={`analytics-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          >
            <Swords size={15} />
            <span>MATCH TELEMETRY HISTORY</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`analytics-tab-btn ${activeTab === 'github' ? 'active' : ''}`}
          >
            <Code2 size={15} />
            <span>GITHUB REPOSITORIES</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`analytics-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          >
            <BarChart3 size={15} />
            <span>LANGUAGE & SKILL MATRIX</span>
          </button>
        </div>

        {/* ================= TAB CONTENT 1: MATCH HISTORY ================= */}
        {activeTab === 'history' && (
          <div className="match-history-grid">
            {matchHistoryList.map((m) => (
              <div key={m.id} className="match-card">
                <div className="match-card-top">
                  <div className="flex items-center gap-2">
                    <span className={`match-badge ${m.result.toLowerCase()}`}>
                      {m.result}
                    </span>
                    <span className="match-problem-title">{m.problem}</span>
                  </div>
                  <span className={`match-mmr-delta ${m.result === 'VICTORY' ? 'positive' : 'negative'}`}>
                    {m.mmrDelta}
                  </span>
                </div>

                <div className="match-card-meta">
                  <div className="flex items-center gap-2">
                    <span className="text-muted font-mono text-xs">VS</span>
                    <span className="text-white font-header font-bold text-sm">@{m.opponent.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs text-muted">
                    <span>{m.testsPassed} Tests</span>
                    <span>•</span>
                    <span className="text-lime">{m.executionTime}</span>
                    <span>•</span>
                    <span>{m.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= TAB CONTENT 2: GITHUB REPOSITORIES ================= */}
        {activeTab === 'github' && (
          <div className="github-repos-grid">
            {reposToDisplay.map((repo) => (
              <div key={repo.id} className="repo-card">
                <div className="repo-card-top">
                  <h3 className="repo-name">{repo.name}</h3>
                  <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-link">
                    <ExternalLink size={14} />
                  </a>
                </div>

                <p className="repo-desc">{repo.description || 'No description provided.'}</p>

                <div className="repo-footer">
                  <span className="repo-lang-pill">{repo.language || 'JavaScript'}</span>
                  <div className="flex items-center gap-3 font-mono text-xs text-muted">
                    <span className="flex items-center gap-1"><Star size={12} className="text-amber" /> {repo.stargazers_count}</span>
                    <span className="flex items-center gap-1"><GitFork size={12} /> {repo.forks_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= TAB CONTENT 3: STATS & SKILL MATRIX ================= */}
        {activeTab === 'stats' && (
          <div className="stats-matrix-grid">
            <div className="matrix-card">
              <h3 className="matrix-title">LANGUAGE PROFICIENCY</h3>
              <div className="space-y-3 mt-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>JavaScript (ES6+)</span>
                    <span className="text-lime">62% of battles</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded overflow-hidden">
                    <div className="h-full bg-lime" style={{ width: '62%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>Python 3.11</span>
                    <span className="text-cyan">26% of battles</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded overflow-hidden">
                    <div className="h-full bg-cyan" style={{ width: '26%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>C++ 20</span>
                    <span className="text-amber">12% of battles</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded overflow-hidden">
                    <div className="h-full bg-amber" style={{ width: '12%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="matrix-card">
              <h3 className="matrix-title">ALGORITHMIC MASTERY</h3>
              <div className="space-y-3 mt-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>Graph Theory & BFS/DFS</span>
                    <span className="text-lime">92% Accuracy</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded overflow-hidden">
                    <div className="h-full bg-lime" style={{ width: '92%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>Dynamic Programming</span>
                    <span className="text-amber">74% Accuracy</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded overflow-hidden">
                    <div className="h-full bg-amber" style={{ width: '74%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>Arrays & Two Pointers</span>
                    <span className="text-lime">98% Accuracy</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded overflow-hidden">
                    <div className="h-full bg-lime" style={{ width: '98%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
