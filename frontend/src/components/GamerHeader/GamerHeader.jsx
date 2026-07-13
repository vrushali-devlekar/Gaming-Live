import React from 'react';
import { Settings, Shield, Zap, Coins, LogOut } from 'lucide-react';
import LevelBadge from '../../ui/LevelBadge/LevelBadge';
import ProgressBar from '../../ui/ProgressBar/ProgressBar';
import './GamerHeader.css';

export default function GamerHeader({ onOpenSettings, currentXP = 2450, maxXP = 5000, username = "TACTICAL_DEVEL" }) {
  return (
    <header className="gamer-header bg-brushed-steel">
      <div className="header-left">
        {/* Player Profile Section */}
        <div className="player-profile">
          <div className="avatar-wrapper">
            <div className="avatar-border">
              {/* Sleek SVG Hacker/Soldier icon as mini-avatar */}
              <svg className="avatar-svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="#151722" stroke="var(--color-gold)" strokeWidth="2" />
                <path d="M50 15 L80 35 L80 65 L50 85 L20 65 L20 35 Z" fill="#1f2230" stroke="#35394b" strokeWidth="2" />
                {/* Hooded head silhouette */}
                <path d="M50 25 C42 25 35 32 35 40 C35 48 38 52 38 58 L62 58 C62 52 65 48 65 40 C65 32 58 25 50 25 Z" fill="#555b75" />
                <path d="M30 75 C30 65 40 60 50 60 C60 60 70 65 70 75 L75 80 L25 80 Z" fill="#35394b" />
                {/* Glowing Hacker Visor */}
                <path d="M42 38 L58 38 L56 42 L44 42 Z" fill="var(--color-gold)" filter="drop-shadow(0 0 2px var(--color-gold))" />
              </svg>
              {/* Online Indicator */}
              <span className="online-dot"></span>
            </div>
            <LevelBadge level={45} size="sm" />
          </div>
          
          <div className="profile-details">
            <div className="profile-top">
              <span className="player-name font-military">{username}</span>
              <div className="tier-pill font-military">
                <Shield size={12} className="tier-icon" />
                <span>CONQUEROR</span>
              </div>
            </div>
            <div className="xp-container">
              <ProgressBar value={currentXP} max={maxXP} label="EXP" showValues={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Center: Token/Room Currency & Menu Tabs */}
      <div className="header-center">
        <div className="token-display">
          <div className="token-item">
            <div className="token-icon-wrapper gold-bg">
              <Zap size={14} className="token-icon" />
            </div>
            <div className="token-info">
              <span className="token-label font-military">FREE ROOM CREDITS</span>
              <span className="token-value font-mono-tactical">1 / 1</span>
            </div>
          </div>
          <div className="token-item">
            <div className="token-icon-wrapper dark-bg">
              <Coins size={14} className="token-icon yellow-color" />
            </div>
            <div className="token-info">
              <span className="token-label font-military">BP CODES</span>
              <span className="token-value font-mono-tactical">124,500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: System Controls */}
      <div className="header-right">
        {/* Navigation buttons */}
        <div className="nav-buttons font-military">
          <button className="nav-btn active-tab">Lobby</button>
          <button className="nav-btn">Rankings</button>
          <button className="nav-btn">Clan</button>
        </div>

        <div className="control-icons">
          <button 
            className="control-icon-btn tooltip-container" 
            onClick={onOpenSettings}
            title="LOBBY SETTINGS"
          >
            <Settings size={18} />
          </button>
          <button 
            className="control-icon-btn logout-btn tooltip-container" 
            title="EXIT MATCH"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
