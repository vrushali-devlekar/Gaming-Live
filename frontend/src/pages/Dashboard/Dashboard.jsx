import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Pause, Volume2, VolumeX, Settings, Crosshair, Swords, Activity, 
  Clock, ShieldCheck, Terminal, ChevronDown, LogOut, BarChart2, UserPlus,
  Copy, Check, X, Flame
} from 'lucide-react';
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
  const [activeTheme, setActiveTheme] = useState(themeService.getCurrentTheme());
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeBladeItem, setActiveBladeItem] = useState('01');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Invite modal states
  const [isCopied, setIsCopied] = useState(false);
  const [inviteTarget, setInviteTarget] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const profileDropdownRef = useRef(null);

  const currentTrack = {
    title: "TACTICAL WAR-ROOM TELEMETRY // DJ KO-DER",
    duration: "2:45"
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBladeClick = (index, route = null) => {
    try {
      audioService.playBeep(900, 0.04, 'sine');
    } catch (e) {}

    setActiveBladeItem(index);
    if (route) {
      navigate(route);
    }
  };

  const handleChallengePlayer = (playerName) => {
    try {
      audioService.playBeep(950, 0.06, 'triangle');
    } catch (e) {}
    navigate(`/arena?target=${encodeURIComponent(playerName)}`);
  };

  const handleDisconnectSession = async () => {
    try {
      audioService.playBeep(600, 0.08, 'sawtooth');
    } catch (e) {}
    setIsProfileDropdownOpen(false);
    if (logout) {
      await logout();
    }
    navigate('/login');
  };

  const handleViewIntel = () => {
    try {
      audioService.playBeep(850, 0.04, 'sine');
    } catch (e) {}
    setIsProfileDropdownOpen(false);
    navigate('/analytics');
  };

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

  // Metallic Conqueror Crest SVG
  const ConquerorCrest = () => (
    <svg className="w-4 h-4 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z" fill="#080B11" stroke="#F59E0B" strokeWidth="6" />
      <polygon points="50,22 58,40 78,40 62,52 68,72 50,60 32,72 38,52 22,40 42,40" fill="#F59E0B" />
    </svg>
  );

  // Active Challengers Mock Data
  const challengersList = [
    { name: "NEO_GHOST", rank: "ACE 5★", mmr: "3,920", winRate: "78%", avatar: "NG" },
    { name: "VEX_HUNTER", rank: "CONQUEROR", mmr: "4,150", winRate: "84%", avatar: "VH" },
    { name: "CYBER_REAPER", rank: "ACE", mmr: "3,680", winRate: "71%", avatar: "CR" },
    { name: "BYTE_MUMMY", rank: "CROWN I", mmr: "3,410", winRate: "65%", avatar: "BM" },
    { name: "KODER_SAGE", rank: "CONQUEROR", mmr: "4,020", winRate: "82%", avatar: "KS" }
  ];

  return (
    <div className="executive-lobby-viewport">
      {/* Background Volumetric Glows & Monolithic Structural Slabs */}
      <div className="monolithic-structural-slab left-slab"></div>
      <div className="monolithic-structural-slab right-slab"></div>
      <div className="volumetric-corner-glow glow-red"></div>
      <div className="volumetric-corner-glow glow-cyan"></div>

      {/* ================= 1. TOP MINIMALIST STATUS HEADER ================= */}
      <header className="executive-top-bar">
        {/* Callsign & Rank Crest with Interactive Profile Dropdown */}
        <div className="top-user-group" ref={profileDropdownRef}>
          <button 
            className="callsign-capsule-btn"
            onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
            aria-expanded={isProfileDropdownOpen}
            aria-haspopup="true"
          >
            <div className="callsign-box">
              <span className="callsign-text">
                <span className="status-beacon-dot"></span>
                COMMANDER // {user?.username?.toUpperCase() || "VRUSHALI"}
                <ChevronDown size={14} className={`capsule-dropdown-chevron ${isProfileDropdownOpen ? 'open' : ''}`} />
              </span>
              <span className="callsign-sub-tag">STATUS: ONLINE // WAR-ROOM</span>
            </div>
          </button>

          <div className="conqueror-pill-badge clip-tactical-badge">
            <ConquerorCrest />
            <span className="conqueror-pill-text">CONQUEROR TIER</span>
          </div>

          {/* Profile Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="profile-dropdown-menu clip-tactical-card">
              <button 
                className="profile-dropdown-item"
                onClick={handleViewIntel}
              >
                <BarChart2 size={14} className="dropdown-icon amber" />
                <span>VIEW INTEL & STATS</span>
              </button>
              <button 
                className="profile-dropdown-item"
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  setIsInviteModalOpen(true);
                }}
              >
                <UserPlus size={14} className="dropdown-icon cyan" />
                <span>DISPATCH MATCH INVITE</span>
              </button>
              <div className="dropdown-divider"></div>
              <button 
                className="profile-dropdown-item danger"
                onClick={handleDisconnectSession}
              >
                <LogOut size={14} className="dropdown-icon red" />
                <span>DISCONNECT SESSION</span>
              </button>
            </div>
          )}
        </div>

        {/* Real-Time Telemetry Metrics */}
        <div className="top-telemetry-metrics">
          <div className="telemetry-item">
            <span className="telemetry-lbl">SEASON MMR</span>
            <span className="telemetry-val amber">3,850 MMR</span>
          </div>
          <div className="telemetry-item">
            <span className="telemetry-lbl">ROOM CARDS</span>
            <span className="telemetry-val cyan">14 CARDS</span>
          </div>
          <div className="telemetry-item">
            <span className="telemetry-lbl">GLOBAL RANK</span>
            <span className="telemetry-val">#42 WORLD</span>
          </div>
        </div>

        {/* Top System Tabs */}
        <div className="top-actions-right">
          <button 
            onClick={() => navigate('/lobby')} 
            className="top-tab-btn active clip-tactical-badge"
          >
            COMMAND DECK
          </button>
          <button 
            onClick={() => navigate('/theme')} 
            className="top-tab-btn clip-tactical-badge"
          >
            SECTOR THEMES
          </button>
          <button 
            onClick={() => navigate('/stream')} 
            className="top-tab-btn clip-tactical-badge"
          >
            LIVE BROADCAST
          </button>
          <button 
            onClick={() => navigate('/inventory')} 
            className="top-tab-btn clip-tactical-badge"
          >
            ARMORY LOCKER
          </button>
          <button 
            onClick={() => navigate('/clan')} 
            className="top-tab-btn clip-tactical-badge"
          >
            CLAN OPS
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="settings-btn-round clip-tactical-badge"
            title="Settings"
          >
            <Settings size={14} />
          </button>
        </div>
      </header>

      {/* ================= 2. MAIN THREE-COLUMN WORKSPACE ================= */}
      <main className="executive-main-grid">
        
        {/* ================= LEFT TACTICAL NAVIGATION BLADE ================= */}
        <aside className="left-tactical-blade">
          {/* Brand Mark with Glitch Effect */}
          <div className="brand-header-refined">
            <h1 className="brand-title-text brand-glitch">
              CODE<span className="accent-slash">//</span>BATTLE
            </h1>
            <span className="brand-micro-tag">
              TACTICAL COMPILER // PROTOCOL 04
            </span>
          </div>

          {/* Numbered Index Menu Blade */}
          <nav className="tactical-blade-menu">
            <button 
              onClick={() => handleBladeClick('01', '/arena')}
              className={`blade-menu-item ${activeBladeItem === '01' ? 'active-blade' : ''}`}
            >
              <div className="blade-item-label">
                <span>01 // 1V1 DUEL ARENA</span>
              </div>
              <Flame size={13} className="text-[#F59E0B] animate-pulse" />
            </button>

            <button 
              onClick={() => handleBladeClick('02', '/rooms')}
              className={`blade-menu-item ${activeBladeItem === '02' ? 'active-blade' : ''}`}
            >
              <span>02 // CUSTOM ROOMS</span>
              <span className="blade-muted-badge clip-tactical-badge">HOST</span>
            </button>

            <button 
              onClick={() => handleBladeClick('03', '/theme')}
              className={`blade-menu-item ${activeBladeItem === '03' ? 'active-blade' : ''}`}
            >
              <span>03 // SECTOR THEMES</span>
            </button>

            <button 
              onClick={() => handleBladeClick('04', '/stream')}
              className={`blade-menu-item ${activeBladeItem === '04' ? 'active-blade' : ''}`}
            >
              <span>04 // LIVE BROADCAST</span>
              <span className="blade-live-badge clip-tactical-badge">LIVE</span>
            </button>

            <button 
              onClick={() => handleBladeClick('05', '/inventory')}
              className={`blade-menu-item ${activeBladeItem === '05' ? 'active-blade' : ''}`}
            >
              <span>05 // PLAYER LOCKER</span>
            </button>

            <button 
              onClick={() => handleBladeClick('06', '/clan')}
              className={`blade-menu-item ${activeBladeItem === '06' ? 'active-blade' : ''}`}
            >
              <span>06 // CLAN OPS</span>
            </button>
          </nav>

          <div></div>
        </aside>

        {/* ================= CENTER PURE ARCHITECTURAL ATMOSPHERE (NO IMAGES / CUTOUTS) ================= */}
        <section className="center-architectural-stage">
          <div className="atmospheric-hologram-dossier clip-tactical-card">
            <div className="holo-corner-tag top-l">[GRID_04 // SEC_KEY 0x98A1]</div>
            <div className="holo-corner-tag top-r">[PROTOCOL_04_ACTIVE]</div>

            <span className="briefing-sector-code">
              <Crosshair size={14} className="text-[#00F5D4]" />
              SANHOK REDLINE PROTOCOL
            </span>

            <h2 className="architectural-main-title">
              HIGH-IMPACT ALGORITHMIC COMPETITION
            </h2>

            <div className="briefing-params-strip">
              <div className="briefing-chip amber">
                <Clock size={13} />
                <span>15:00 MAX RUNTIME</span>
              </div>

              <div className="briefing-chip cyan">
                <Activity size={13} />
                <span>02:45 / WAVE 3 SHRINK</span>
              </div>

              <div className="briefing-chip green">
                <ShieldCheck size={13} />
                <span>AES-256 ENCRYPTED</span>
              </div>
            </div>

            <div className="holo-domain-tag">
              [DOMAIN FOCUS: GRAPH THEORY &amp; DYNAMIC PROGRAMMING]
            </div>
          </div>
        </section>

        {/* ================= RIGHT ACTIVE CHALLENGERS ROSTER & AUDIO STRIP ================= */}
        <aside className="right-roster-dock">
          
          {/* Active Challengers Board */}
          <div className="glass-panel-graphite roster-panel-card clip-tactical-card">
            <div className="roster-header-row">
              <span className="roster-header-title">
                <Swords size={14} className="text-[#F59E0B]" />
                ACTIVE CHALLENGERS ROSTER
              </span>
              <span className="roster-count-tag clip-tactical-badge">
                5 ONLINE
              </span>
            </div>

            <div className="roster-scroll-list">
              {challengersList.map((coder, idx) => (
                <div key={idx} className="roster-entry-chip clip-tactical-badge">
                  <div className="entry-user-details">
                    <div className="entry-avatar-tag clip-tactical-badge">
                      {coder.avatar}
                    </div>
                    <div className="entry-name-column">
                      <span className="entry-username-text">{coder.name}</span>
                      <span className="entry-telemetry-sub">
                        {coder.rank} • {coder.mmr} MMR ({coder.winRate} WR)
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleChallengePlayer(coder.name)}
                    className="engage-action-btn clip-tactical-badge"
                  >
                    ENGAGE
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Minimal Single-Line Audio Strip */}
          <div className="glass-panel-graphite minimal-audio-strip clip-tactical-card">
            <div className="audio-left-meta">
              <div className="mini-equalizer-bars">
                <span className={`mini-eq-bar ${isPlayingMusic && !isMuted ? 'playing' : ''}`} style={{ animationDelay: '0s' }} />
                <span className={`mini-eq-bar ${isPlayingMusic && !isMuted ? 'playing' : ''}`} style={{ animationDelay: '0.2s' }} />
                <span className={`mini-eq-bar ${isPlayingMusic && !isMuted ? 'playing' : ''}`} style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="audio-track-name">{currentTrack.title}</span>
            </div>

            <div className="audio-inline-controls">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="audio-icon-btn"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
              
              <button 
                onClick={() => setIsPlayingMusic(!isPlayingMusic)} 
                className="audio-icon-btn"
                title={isPlayingMusic ? "Pause" : "Play"}
              >
                {isPlayingMusic ? <Pause size={13} /> : <Play size={13} />}
              </button>
            </div>
          </div>

        </aside>

      </main>

      {/* ================= 3. BOTTOM PRECISION COMMAND BAR ================= */}
      <footer className="executive-bottom-bar">
        {/* Live Ticker Stream with Timestamps */}
        <div className="bottom-live-ticker clip-tactical-card">
          <div className="ticker-protocol-tag">
            <Terminal size={13} />
            <span>LIVE PROTOCOL LOGS</span>
          </div>

          <div className="ticker-marquee-scroll">
            <div className="ticker-log-entry">
              <span className="font-mono text-gray-500">[17:51:20]</span>
              <span className="log-tag-breach">[BREACH]</span> @NEO_GHOST defeated @VEX_HUNTER in 03:12 (Graph Theory)
            </div>
            <div className="ticker-log-entry">
              <span className="font-mono text-gray-500">[17:51:04]</span>
              <span className="log-tag-win">[MATCH WIN]</span> @KODER_SAGE promoted to CONQUEROR DIVISION [4,020 MMR]
            </div>
            <div className="ticker-log-entry">
              <span className="font-mono text-gray-500">[17:50:48]</span>
              <span className="log-tag-sys">[SYSTEM]</span> CUSTOM ROOM #8921 initiated by @CYBER_REAPER
            </div>
            {/* Duplicate for infinite loop */}
            <div className="ticker-log-entry">
              <span className="font-mono text-gray-500">[17:51:20]</span>
              <span className="log-tag-breach">[BREACH]</span> @NEO_GHOST defeated @VEX_HUNTER in 03:12 (Graph Theory)
            </div>
          </div>
        </div>

        {/* Dual High-Impact Skewed CTA Buttons */}
        <div className="bottom-action-ctas">
          <button
            onClick={() => {
              try { audioService.playBeep(800, 0.05, 'sine'); } catch (e) {}
              navigate('/arena');
            }}
            className="precision-cta-btn cta-hazard-amber clip-tactical-btn"
          >
            <span>START 1V1 DUEL</span>
          </button>

          <button
            onClick={() => {
              try { audioService.playBeep(900, 0.05, 'sine'); } catch (e) {}
              navigate('/rooms');
            }}
            className="precision-cta-btn cta-dark-cyan clip-tactical-btn"
          >
            <span>CUSTOM MATCH LINK</span>
          </button>
        </div>
      </footer>

      {/* TACTICAL MATCH DISPATCH MODAL */}
      {isInviteModalOpen && (
        <div className="modal-backdrop-overlay">
          <div className="tactical-modal-card glass-panel-graphite clip-tactical-card">
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
