import React from 'react';
import LevelBadge from '../../ui/LevelBadge/LevelBadge';
import coderSilhouette from '../../assets/coder_silhouette.png';
import './LobbyCharacter.css';

export default function LobbyCharacter({ level = 45, username = "TACTICAL_DEVEL" }) {
  return (
    <div className="lobby-character-container">
      {/* Radar HUD Pulsing Rings */}
      <div className="character-hud-radar">
        <div className="radar-circle circle-1 animate-radar-pulse"></div>
        <div className="radar-circle circle-2 animate-radar-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="radar-circle circle-3 animate-radar-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Avatar Character Silhouette */}
      <div className="character-silhouette-wrapper">
        <img 
          src={coderSilhouette} 
          alt="Coder Lobby Character" 
          className="character-silhouette"
        />
        {/* Shadow Overlay to ground the avatar */}
        <div className="character-shadow"></div>
      </div>

      {/* Glowing Level Badge Overlay */}
      <div className="character-badge-overlay">
        <LevelBadge level={level} size="lg" />
      </div>

      {/* Tactical HUD Overlay Panels */}
      <div className="hud-diagnostic-left font-mono-tactical">
        <div className="hud-metric">
          <span className="metric-dot dot-active"></span>
          <span className="metric-label">CPU LOAD</span>
          <span className="metric-val text-gold-glow">14%</span>
        </div>
        <div className="hud-metric">
          <span className="metric-dot dot-active"></span>
          <span className="metric-label">COMPILER</span>
          <span className="metric-val text-gold-glow">ONLINE</span>
        </div>
        <div className="hud-metric">
          <span className="metric-dot dot-warning"></span>
          <span className="metric-label">LATENCY</span>
          <span className="metric-val text-warning">18ms</span>
        </div>
      </div>

      <div className="hud-diagnostic-right font-mono-tactical">
        <div className="hud-metric">
          <span className="metric-label">SYSTEM_ID</span>
          <span className="metric-val">C_BATTLE_45</span>
        </div>
        <div className="hud-metric">
          <span className="metric-label">LOC</span>
          <span className="metric-val">SERVER_EU_W</span>
        </div>
      </div>

      {/* Name banner */}
      <div className="character-name-banner">
        <div className="banner-skew bg-brushed-steel">
          <span className="font-military character-banner-name">{username}</span>
        </div>
      </div>
    </div>
  );
}
