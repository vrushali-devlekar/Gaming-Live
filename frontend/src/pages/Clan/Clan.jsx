import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy, Shield, Swords, PlusCircle, UserPlus, Zap, Activity, Clock, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import CommandHeader from '../../components/CommandHeader/CommandHeader';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import './Clan.css';

export default function Clan() {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const squadTasks = [
    { id: 1, name: 'FIREWALL BYPASS ROUTINE', assignee: 'GHOST_CODER', status: 'COMPILED', speed: '0.04ms', testCases: '10/10' },
    { id: 2, name: 'BUFFER OVERFLOW SHIELD', assignee: 'NEON_VIPER', status: 'IN PROGRESS', speed: 'COMPILING...', testCases: '8/10' },
    { id: 3, name: 'DNS INFILTRATION EVASION', assignee: 'CYBER_ACE', status: 'READY', speed: '0.08ms', testCases: '10/10' },
    { id: 4, name: 'SSL SOCKETS HANDSHAKE', assignee: 'OPEN SQUAD SLOT', status: 'OPEN SLOT', speed: 'N/A', testCases: '0/10' }
  ];

  const clanLeaderboard = [
    { rank: 1, name: 'APEX_CODERS', leader: 'ApexMaster', rating: 24850, size: '48 / 50', status: 'DOMINANT' },
    { rank: 2, name: 'STACK_BREACHERS', leader: 'HeapOverflow', rating: 22100, size: '45 / 50', status: 'CONTENDER' },
    { rank: 3, name: 'RECOIL_SQUAD', leader: 'ZeroGrip', rating: 19420, size: '50 / 50', status: 'ACTIVE' },
    { rank: 4, name: 'CYBER_INTEGRATORS', leader: 'WebSockets', rating: 17200, size: '39 / 50', status: 'ACTIVE' }
  ];

  return (
    <div className="clan-page-container">
      {/* Top Command Bar */}
      <CommandHeader onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Content Area */}
      <main className="clan-main-content">
        
        {/* Banner / Operational Dossier Header */}
        <section className="clan-hero-banner clip-tactical-card">
          <div className="clan-hero-overlay"></div>
          <div className="clan-hero-body">
            <div className="clan-hero-title-group">
              <span className="clan-hero-badge">
                <Shield size={12} className="text-[#F59E0B]" />
                SQUAD COMMAND CENTER // ALGORITHM CLANS
              </span>
              <h1 className="clan-hero-title">TASK FORCE 141 // SQUAD OPS</h1>
              <p className="clan-hero-subtitle">
                COOPERATIVE 4V4 HIGH-LATENCY CODE BREACH OPERATIONS & REGIONAL LEADERBOARDS
              </p>
            </div>

            <div className="clan-hero-stats">
              <div className="clan-stat-box">
                <span className="clan-stat-label">CURRENT CLAN</span>
                <span className="clan-stat-value text-amber-400">APEX_CODERS</span>
              </div>
              <div className="clan-stat-divider"></div>
              <div className="clan-stat-box">
                <span className="clan-stat-label">SQUAD MMR</span>
                <span className="clan-stat-value text-cyan-400">24,850</span>
              </div>
              <div className="clan-stat-divider"></div>
              <div className="clan-stat-box">
                <span className="clan-stat-label">GLOBAL RANK</span>
                <span className="clan-stat-value text-white">#01 ASIA-SOUTH</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Tactical Grid */}
        <div className="clan-grid-layout">
          
          {/* LEFT: 4V4 ACTIVE SQUAD OPERATIONS (60%) */}
          <div className="clan-left-column">
            <div className="tactical-card clip-tactical-card glass-tactical-card">
              <div className="card-header">
                <div className="card-header-title">
                  <Swords size={16} className="text-[#F59E0B]" />
                  <span>4V4 SQUAD BATTLES - ACTIVE OPERATIONAL MODULES</span>
                </div>
                <span className="status-live-chip">
                  <Activity size={10} className="animate-pulse text-emerald-400" />
                  3/4 MODULES SYNCED
                </span>
              </div>

              <div className="squad-mission-brief">
                <div className="brief-title font-mono text-cyan-400">OPERATION: CYBER-FORTRESS ARRAY</div>
                <p className="brief-desc">
                  Assemble your squad to construct the Secure Perimeter firewall array. Each member compiles one sub-system routine. Unlocking all modules triggers full squad integration and unlocks +500 MMR bonus!
                </p>
              </div>

              {/* Tasks List */}
              <div className="squad-tasks-list">
                {squadTasks.map((task) => (
                  <div 
                    key={task.id}
                    className={`task-card clip-tactical-badge ${
                      task.status === 'COMPILED' ? 'task-compiled' :
                      task.status === 'OPEN SLOT' ? 'task-open' : 'task-in-progress'
                    }`}
                  >
                    <div className="task-left">
                      <div className="task-id font-mono">MODULE 0{task.id}</div>
                      <div className="task-name">{task.name}</div>
                      <div className="task-meta">
                        <span>OPERATOR: </span>
                        <span className={task.status === 'OPEN SLOT' ? 'text-amber-400' : 'text-cyan-400 font-bold'}>
                          {task.assignee}
                        </span>
                        <span className="meta-dot">•</span>
                        <span>TESTS: {task.testCases}</span>
                      </div>
                    </div>

                    <div className="task-right">
                      {task.status === 'OPEN SLOT' ? (
                        <button 
                          className="clip-tactical-btn invite-btn"
                          onClick={() => alert("INVITING PLAYERS TO SQUAD...")}
                        >
                          <UserPlus size={12} />
                          <span>INVITE</span>
                        </button>
                      ) : (
                        <div className="task-status-badge">
                          <span className={`status-text ${task.status === 'COMPILED' ? 'text-cyan-400' : 'text-amber-400'}`}>
                            {task.status}
                          </span>
                          <span className="task-speed font-mono">{task.speed}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Squad Progress Bar */}
              <div className="squad-progress-container">
                <div className="progress-label-row font-mono">
                  <span>SQUAD SYNCHRONIZATION</span>
                  <span className="text-cyan-400 font-bold">75%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="squad-actions">
                <button className="clip-tactical-btn primary-action-btn flex-1">
                  <Zap size={14} />
                  <span>INITIATE SQUAD SYNCHRONIZATION</span>
                </button>
                <button className="clip-tactical-btn secondary-action-btn">
                  <Clock size={14} />
                  <span>REQUEST AIRDROP HINT</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: CLAN STANDINGS & LEADERBOARD (40%) */}
          <div className="clan-right-column">
            
            {/* Regional Clan Standings */}
            <div className="tactical-card clip-tactical-card glass-tactical-card">
              <div className="card-header">
                <div className="card-header-title">
                  <Trophy size={16} className="text-[#F59E0B]" />
                  <span>GLOBAL REGIONAL CLAN STANDINGS</span>
                </div>
              </div>

              <div className="leaderboard-list">
                {clanLeaderboard.map((clan) => (
                  <div key={clan.rank} className="leaderboard-item clip-tactical-badge">
                    <div className="rank-badge font-mono">
                      #{clan.rank < 10 ? `0${clan.rank}` : clan.rank}
                    </div>
                    
                    <div className="clan-info">
                      <div className="clan-name-row">
                        <span className="clan-name">{clan.name}</span>
                        <span className="clan-status-tag">{clan.status}</span>
                      </div>
                      <div className="clan-details font-mono">
                        <span>LEADER: {clan.leader}</span>
                        <span className="meta-dot">•</span>
                        <span>{clan.size}</span>
                      </div>
                    </div>

                    <div className="clan-rating font-mono">
                      <span className="rating-num">{clan.rating.toLocaleString()}</span>
                      <span className="rating-label">PTS</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clan Actions */}
              <div className="clan-card-footer">
                <button className="clip-tactical-btn outline-btn full-width" onClick={() => alert("INITIALIZING NEW CLAN OPERATIONS...")}>
                  <PlusCircle size={14} />
                  <span>CREATE NEW ALGORITHM CLAN</span>
                </button>
              </div>
            </div>

            {/* Upcoming Clan War Widget */}
            <div className="tactical-card clip-tactical-card glass-tactical-card clan-war-card">
              <div className="card-header">
                <div className="card-header-title">
                  <Shield size={16} className="text-rose-500" />
                  <span>NEXT SECTOR CLAN WAR</span>
                </div>
                <span className="text-xs font-mono text-rose-400 animate-pulse">02H 14M 35S</span>
              </div>

              <div className="clan-war-vs font-mono">
                <div className="vs-team">
                  <span className="text-cyan-400 font-bold">APEX_CODERS</span>
                  <span className="text-[10px] text-gray-400">YOUR CLAN</span>
                </div>
                <div className="vs-badge">VS</div>
                <div className="vs-team text-right">
                  <span className="text-rose-400 font-bold">KRONOS_SYNDICATE</span>
                  <span className="text-[10px] text-gray-400">RANK #02</span>
                </div>
              </div>

              <div className="clan-war-meta font-mono text-gray-400 text-xs mt-2">
                <span>SECTOR: </span>
                <span className="text-white">NEO-SHIBUYA MATRIX (GRAPH THEORY)</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}

