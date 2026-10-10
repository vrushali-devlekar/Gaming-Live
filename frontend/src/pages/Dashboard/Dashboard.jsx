import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings, 
  Crosshair, 
  Swords, 
  Activity, 
  Clock, 
  ShieldCheck, 
  Terminal, 
  ChevronDown, 
  LogOut, 
  BarChart2, 
  UserPlus,
  Copy, 
  Check, 
  X, 
  Flame,
  Trophy,
  Zap,
  Target,
  Code2,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  Radio,
  DoorOpen
} from 'lucide-react';
import CommandHeader from '../../components/CommandHeader/CommandHeader';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import JoinMatchModal from '../../components/JoinMatchModal/JoinMatchModal';
import { themeService } from '../../services/themeService';
import { audioService } from '../../services/audioService';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Invite modal states
  const [isCopied, setIsCopied] = useState(false);
  const [inviteTarget, setInviteTarget] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const currentTrack = {
    title: "CYBER ARENA TELEMETRY // CYBER SYNTH (PORT 3001)",
    duration: "2:45"
  };

  // Recommended Challenges list
  const recommendedChallenges = [
    { id: 'firewall-bypass', title: 'Perimeter Firewall Traversal', diff: 'Medium', reward: '+85 MMR', cat: 'Graph BFS' },
    { id: 'quantum-lru', title: 'Quantum LRU Cache Buffer', diff: 'Hard', reward: '+140 MMR', cat: 'Data Structure' },
    { id: 'subnet-sync', title: 'Subnet Packet Delay Time', diff: 'Medium', reward: '+90 MMR', cat: 'Dijkstra' }
  ];

  // Recent Match History
  const recentMatches = [
    { id: 1, vs: 'NEO_GHOST', result: 'VICTORY', mmr: '+45', problem: 'Two Sum Perimeter', time: '12m ago', speed: '0.04ms' },
    { id: 2, vs: 'VEX_HUNTER', result: 'VICTORY', mmr: '+40', problem: 'Valid Sockets Sequence', time: '1h ago', speed: '0.08ms' },
    { id: 3, vs: 'CYBER_REAPER', result: 'DEFEAT', mmr: '-20', problem: 'Subnet Delay Time', time: '4h ago', speed: '1.42ms' },
    { id: 4, vs: 'BYTE_MUMMY', result: 'VICTORY', mmr: '+50', problem: 'Trapping Water Grid', time: '1d ago', speed: '0.06ms' }
  ];

  // Active Challengers Board
  const challengersList = [
    { name: "NEO_GHOST", rank: "ACE 5★", mmr: "3,920", winRate: "78%", avatar: "NG" },
    { name: "VEX_HUNTER", rank: "CONQUEROR", mmr: "4,150", winRate: "84%", avatar: "VH" },
    { name: "CYBER_REAPER", rank: "ACE", mmr: "3,680", winRate: "71%", avatar: "CR" },
    { name: "BYTE_MUMMY", rank: "CROWN I", mmr: "3,410", winRate: "65%", avatar: "BM" },
    { name: "KODER_SAGE", rank: "CONQUEROR", mmr: "4,020", winRate: "82%", avatar: "KS" }
  ];

  const handleChallengePlayer = (playerName) => {
    try { audioService.playBeep(950, 0.06, 'triangle'); } catch (e) {}
    navigate(`/arena?target=${encodeURIComponent(playerName)}`);
  };

  const handleCopyRoomLink = () => {
    try { audioService.playBeep(900, 0.04, 'sine'); } catch (e) {}
    const link = `https://codebattle.io/room/ROOM-8921`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSendDispatch = (e) => {
    e.preventDefault();
    if (!inviteTarget.trim()) return;
    try { audioService.playBeep(950, 0.06, 'triangle'); } catch (e) {}
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setInviteTarget('');
      setIsInviteModalOpen(false);
    }, 1800);
  };

  const username = user?.username || 'GHOST_OPERATOR';
  const rank = user?.rank || 'CONQUEROR TIER';
  const mmr = user?.stats?.mmr || '3,850';
  const winRate = user?.stats?.winRate || '82%';
  const streak = user?.stats?.streak || '7 WIN STREAK';

  return (
    <div className="cyber-dashboard-viewport">
      {/* Shared Command Header Navigation */}
      <CommandHeader onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Dashboard Layout Grid */}
      <main className="dashboard-main-container">
        
        {/* ================= TOP STATS OVERVIEW CARDS ================= */}
        <section className="stats-overview-grid">
          {/* Card 1: Rank & Division */}
          <div className="stat-card">
            <div className="stat-icon-box lime">
              <Trophy size={18} />
            </div>
            <div className="stat-meta">
              <span className="stat-label">SEASON TIER</span>
              <span className="stat-value text-lime">{rank}</span>
              <span className="stat-sub">Top 1.2% Globally</span>
            </div>
          </div>

          {/* Card 2: Rating MMR */}
          <div className="stat-card">
            <div className="stat-icon-box cyan">
              <Zap size={18} />
            </div>
            <div className="stat-meta">
              <span className="stat-label">RATING TELEMETRY</span>
              <span className="stat-value text-cyan">{mmr} MMR</span>
              <span className="stat-sub">+120 MMR This Week</span>
            </div>
          </div>

          {/* Card 3: Win Rate & Streak */}
          <div className="stat-card">
            <div className="stat-icon-box amber">
              <TrendingUp size={18} />
            </div>
            <div className="stat-meta">
              <span className="stat-label">WIN RATE & STREAK</span>
              <span className="stat-value text-amber">{winRate} ({streak})</span>
              <span className="stat-sub">48 Battles Completed</span>
            </div>
          </div>

          {/* Card 4: Clan Affiliation */}
          <div className="stat-card">
            <div className="stat-icon-box lime">
              <Users size={18} />
            </div>
            <div className="stat-meta">
              <span className="stat-label">TACTICAL SQUAD</span>
              <span className="stat-value">TASK FORCE 141</span>
              <span className="stat-sub">Rank #01 Asia-South</span>
            </div>
          </div>
        </section>

        {/* ================= 3-COLUMN WORKSPACE ================= */}
        <section className="dashboard-workspace-grid">
          
          {/* LEFT 30%: Quick Match Launch & Active Challengers */}
          <div className="workspace-column flex flex-col gap-4">
            
            {/* Quick Match Launch Panel */}
            <div className="cyber-panel p-5">
              <div className="panel-header">
                <div className="flex items-center gap-2">
                  <Swords size={16} className="text-lime" />
                  <h3 className="panel-title">DUEL DEPLOYMENT</h3>
                </div>
                <span className="panel-badge-green">QUEUES OPEN</span>
              </div>

              <p className="text-xs text-muted font-mono mb-4 leading-relaxed">
                Launch an instant 1v1 algorithmic duel or dispatch custom room invites to rival coders.
              </p>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => navigate('/arena')}
                  className="btn-cyber-primary w-full py-3"
                >
                  <Swords size={16} />
                  <span>START 1V1 DUEL ARENA</span>
                </button>

                <button
                  onClick={() => navigate('/rooms')}
                  className="btn-cyber-secondary w-full py-2.5"
                >
                  <DoorOpen size={16} className="text-cyan" />
                  <span>CUSTOM ROOM LOBBY</span>
                </button>

                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="btn-cyber-ghost w-full"
                >
                  <UserPlus size={14} />
                  <span>Dispatch Target Invite</span>
                </button>
              </div>
            </div>

            {/* Active Challengers Roster */}
            <div className="cyber-panel p-5 flex-1 flex flex-col min-h-[300px]">
              <div className="panel-header">
                <div className="flex items-center gap-2">
                  <Crosshair size={16} className="text-amber" />
                  <h3 className="panel-title">ACTIVE CHALLENGERS</h3>
                </div>
                <span className="text-xs font-mono text-muted">5 ONLINE</span>
              </div>

              <div className="challengers-list-scroll custom-scrollbar">
                {challengersList.map((coder, idx) => (
                  <div key={idx} className="challenger-row">
                    <div className="flex items-center gap-2.5">
                      <div className="challenger-avatar">{coder.avatar}</div>
                      <div>
                        <span className="challenger-name">{coder.name}</span>
                        <span className="challenger-meta">{coder.rank} • {coder.mmr} MMR ({coder.winRate} WR)</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleChallengePlayer(coder.name)}
                      className="btn-challenge-chip"
                    >
                      ENGAGE
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* CENTER 45%: Tactical Operations Dossier & Recommended Battles */}
          <div className="workspace-column flex flex-col gap-4">
            
            {/* Operational Briefing Hero Banner */}
            <div className="cyber-panel p-6 operational-hero-banner relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-lime font-bold tracking-widest flex items-center gap-1.5">
                  <Activity size={14} className="animate-pulse" />
                  SECTOR PROTOCOL // KRONOS 04
                </span>
                <span className="text-[11px] font-mono text-muted">SEASON 4 ACTIVE</span>
              </div>

              <h2 className="font-header text-2xl font-extrabold text-white uppercase tracking-wide mb-2">
                HIGH-IMPACT ALGORITHMIC COMPETITION
              </h2>

              <p className="text-xs text-secondary leading-relaxed max-w-xl mb-4">
                Compete against rival engineers in sandboxed runtime challenges. Secure test cases with linear O(N) complexity to deal critical zone recoil damage.
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="info-chip">
                  <Clock size={13} className="text-amber" />
                  <span>15:00 MAX RUNTIME</span>
                </div>
                <div className="info-chip">
                  <ShieldCheck size={13} className="text-lime" />
                  <span>AES-256 SECURED</span>
                </div>
                <div className="info-chip">
                  <Code2 size={13} className="text-cyan" />
                  <span>JS / PY / C++</span>
                </div>
              </div>
            </div>

            {/* Recommended Battle Missions */}
            <div className="cyber-panel p-5 flex-1">
              <div className="panel-header">
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-cyan" />
                  <h3 className="panel-title">RECOMMENDED BATTLE MISSIONS</h3>
                </div>
                <button onClick={() => navigate('/theme')} className="text-xs text-lime font-mono hover:underline flex items-center gap-1">
                  <span>Explore Sectors</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {recommendedChallenges.map((mission) => (
                  <div key={mission.id} className="mission-item-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="mission-title">{mission.title}</h4>
                        <span className="mission-tags">{mission.cat} • {mission.diff}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="mission-reward">{mission.reward}</span>
                        <button
                          onClick={() => navigate(`/arena?problemId=${mission.id}`)}
                          className="btn-mission-battle"
                        >
                          <Swords size={13} />
                          <span>Battle</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT 25%: Recent Match History & Ambient Audio */}
          <div className="workspace-column flex flex-col gap-4">
            
            {/* Recent Match History */}
            <div className="cyber-panel p-5 flex-1 flex flex-col min-h-[300px]">
              <div className="panel-header">
                <div className="flex items-center gap-2">
                  <BarChart2 size={16} className="text-lime" />
                  <h3 className="panel-title">RECENT MATCH HISTORY</h3>
                </div>
                <button onClick={() => navigate('/analytics')} className="text-xs text-muted font-mono hover:text-white">
                  View All
                </button>
              </div>

              <div className="matches-list-scroll custom-scrollbar">
                {recentMatches.map((m) => (
                  <div key={m.id} className="match-history-entry">
                    <div className="flex items-center justify-between mb-1">
                      <span className="match-vs-name">vs @{m.vs}</span>
                      <span className={`match-result-pill ${m.result.toLowerCase()}`}>
                        {m.result} ({m.mmr})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                      <span>{m.problem}</span>
                      <span>{m.speed} • {m.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ambient War-Room Audio Strip */}
            <div className="cyber-panel p-4 audio-panel-strip">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="equalizer-indicator">
                    <span className={`eq-bar ${isPlayingMusic && !isMuted ? 'active' : ''}`} />
                    <span className={`eq-bar ${isPlayingMusic && !isMuted ? 'active' : ''}`} style={{ animationDelay: '0.2s' }} />
                    <span className={`eq-bar ${isPlayingMusic && !isMuted ? 'active' : ''}`} style={{ animationDelay: '0.4s' }} />
                  </div>
                  <div>
                    <span className="font-header font-bold text-xs text-white block truncate max-w-[180px]">
                      {currentTrack.title}
                    </span>
                    <span className="font-mono text-[10px] text-muted">TACTICAL AUDIO STREAM</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="audio-action-btn"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                  
                  <button 
                    onClick={() => setIsPlayingMusic(!isPlayingMusic)} 
                    className="audio-action-btn"
                    title={isPlayingMusic ? "Pause" : "Play"}
                  >
                    {isPlayingMusic ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                </div>
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* TACTICAL MATCH DISPATCH MODAL */}
      {isInviteModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsInviteModalOpen(false)}>
          <div className="tactical-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-lime" />
                <h3 className="modal-title">DISPATCH MATCH CHALLENGE</h3>
              </div>
              <button onClick={() => setIsInviteModalOpen(false)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-4 mt-3">
              <div>
                <label className="text-xs font-mono text-muted uppercase block mb-1.5">Direct Arena Room Link:</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value="https://codebattle.io/room/ROOM-8921" 
                    className="input-cyber-search flex-1"
                  />
                  <button 
                    onClick={handleCopyRoomLink}
                    className="btn-cyber-primary"
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{isCopied ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendDispatch}>
                <label className="text-xs font-mono text-muted uppercase block mb-1.5">Target GitHub Handle / Callsign:</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="e.g. @octocat or NEO_GHOST"
                    value={inviteTarget}
                    onChange={(e) => setInviteTarget(e.target.value)}
                    className="input-cyber-search flex-1"
                  />
                  <button 
                    type="submit"
                    className="btn-cyber-primary"
                  >
                    <span>{inviteSent ? 'SENT!' : 'DISPATCH'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
