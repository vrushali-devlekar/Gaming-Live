import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './CommandHeader.css';

export default function CommandHeader({ onOpenSettings }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const currentPath = location.pathname;

  // Conqueror Crest Badge SVG Component
  const ConquerorCrest = () => (
    <svg className="w-5 h-5 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z" fill="#080B11" stroke="#F59E0B" strokeWidth="5" />
      <polygon points="50,22 58,40 78,40 62,52 68,72 50,60 32,72 38,52 22,40 42,40" fill="#F59E0B" />
    </svg>
  );

  return (
    <header className="command-header-navbar">
      {/* Left: User Callsign & Rank Crest */}
      <div className="header-callsign-group">
        <div className="callsign-title-col">
          <span className="callsign-main-title">
            <span className="status-beacon-green"></span>
            COMMANDER // {user?.username?.toUpperCase() || "GHOST_CODER"}
          </span>
          <span className="callsign-subtitle-tag">STATUS: ONLINE // WAR-ROOM</span>
        </div>

        <div className="conqueror-crest-badge clip-tactical-badge">
          <ConquerorCrest />
          <span className="crest-text-title">{user?.rank || "CONQUEROR TIER"}</span>
        </div>
      </div>

      {/* Center: Telemetry Metrics */}
      <div className="header-telemetry-metrics">
        <div className="telemetry-chip-box">
          <span className="chip-lbl-tag">SEASON MMR</span>
          <span className="chip-val-text amber">3,850 MMR</span>
        </div>
        <div className="telemetry-chip-box">
          <span className="chip-lbl-tag">ROOM CARDS</span>
          <span className="chip-val-text cyan">14 CARDS</span>
        </div>
        <div className="telemetry-chip-box">
          <span className="chip-lbl-tag">GLOBAL RANK</span>
          <span className="chip-val-text">#42 WORLD</span>
        </div>
      </div>

      {/* Right: Direct Navigation Tabs & Settings */}
      <div className="header-navigation-tabs">
        <button 
          onClick={() => navigate('/lobby')} 
          className={`nav-route-tab-btn clip-tactical-badge ${currentPath === '/lobby' ? 'active-tab' : ''}`}
        >
          COMMAND DECK
        </button>

        <button 
          onClick={() => navigate('/arena')} 
          className={`nav-route-tab-btn clip-tactical-badge ${currentPath === '/arena' ? 'active-tab' : ''}`}
        >
          DUEL ARENA
        </button>

        <button 
          onClick={() => navigate('/rooms')} 
          className={`nav-route-tab-btn clip-tactical-badge ${currentPath === '/rooms' ? 'active-tab' : ''}`}
        >
          CUSTOM ROOMS
        </button>

        <button 
          onClick={() => navigate('/theme')} 
          className={`nav-route-tab-btn clip-tactical-badge ${currentPath === '/theme' ? 'active-tab' : ''}`}
        >
          SECTOR MAPS
        </button>

        <button 
          onClick={() => navigate('/inventory')} 
          className={`nav-route-tab-btn clip-tactical-badge ${currentPath === '/inventory' ? 'active-tab' : ''}`}
        >
          LOCKER
        </button>

        <button 
          onClick={() => navigate('/clan')} 
          className={`nav-route-tab-btn clip-tactical-badge ${currentPath === '/clan' ? 'active-tab' : ''}`}
        >
          CLAN
        </button>

        <button 
          onClick={onOpenSettings}
          className="settings-btn-icon clip-tactical-badge"
          title="Settings"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
}
