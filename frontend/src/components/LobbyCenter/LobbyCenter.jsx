import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Shield, Users, Radio, Cpu, RefreshCw, X } from 'lucide-react';
import GamerButton from '../../ui/GamerButton/GamerButton';
import './LobbyCenter.css';

export default function LobbyCenter() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ranked');
  const [isMatching, setIsMatching] = useState(false);
  const [matchSeconds, setMatchSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isMatching) {
      interval = setInterval(() => {
        setMatchSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setMatchSeconds(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isMatching]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleStartMatch = () => {
    if (activeTab === 'custom') {
      navigate('/rooms');
    } else {
      setIsMatching(true);
    }
  };

  const handleCancelMatch = () => {
    setIsMatching(false);
  };

  return (
    <div className="lobby-center-console">
      {/* Mode selection tabs */}
      <div className="lobby-mode-tabs font-military">
        <button 
          className={`mode-tab ${activeTab === 'ranked' ? 'active' : ''}`}
          onClick={() => !isMatching && setActiveTab('ranked')}
          disabled={isMatching}
        >
          <Shield size={14} className="mode-tab-icon" />
          <span>RANKED LEAGUE</span>
        </button>
        <button 
          className={`mode-tab ${activeTab === 'casual' ? 'active' : ''}`}
          onClick={() => !isMatching && setActiveTab('casual')}
          disabled={isMatching}
        >
          <Cpu size={14} className="mode-tab-icon" />
          <span>TRAINING ARENA</span>
        </button>
        <button 
          className={`mode-tab ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => !isMatching && setActiveTab('custom')}
          disabled={isMatching}
        >
          <Users size={14} className="mode-tab-icon" />
          <span>CUSTOM ROOMS</span>
        </button>
      </div>

      {/* Main Console Details */}
      <div className="console-display bg-brushed-steel">
        <div className="console-hud-grid"></div>
        <div className="console-corner corner-tl"></div>
        <div className="console-corner corner-tr"></div>
        <div className="console-corner corner-bl"></div>
        <div className="console-corner corner-br"></div>

        {!isMatching ? (
          <div className="console-ready-state">
            <div className="console-info">
              <span className="console-sub font-mono-tactical">BATTLE ROYAL SYSTEMS READY</span>
              <h2 className="console-title font-military">
                {activeTab === 'ranked' ? 'MULTIPLAYER CODE DUEL' : 
                 activeTab === 'casual' ? 'COMPILER WARMUP DRILL' : 
                 'CUSTOM CODE ROOM'}
              </h2>
              <p className="console-desc text-gray-400">
                {activeTab === 'ranked' ? 'Compete 1v1 in real-time. Gain Rank points and climb Conqueror tiers.' : 
                 activeTab === 'casual' ? 'Test skills in solo sandbox coding problems. No rank stakes.' : 
                 'Host custom coding rooms or join via passcode invitation.'}
              </p>
            </div>
            
            <div className="console-status-row font-mono-tactical">
              <div className="status-item">
                <span className="label">ACTIVE PLAYERS</span>
                <span className="value text-gold-glow">2,854</span>
              </div>
              <div className="status-item">
                <span className="label">EST. SEARCH TIME</span>
                <span className="value text-gold-glow">00:18</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="console-matching-state">
            <div className="matching-radar-wrapper">
              <div className="matching-radar-sweep"></div>
              <Radio size={36} className="matching-radar-icon animate-pulse" />
            </div>

            <div className="matching-details">
              <span className="matching-status font-military text-gold-glow">MATCHMAKING ACTIVE</span>
              <span className="matching-timer font-mono-tactical">{formatTime(matchSeconds)}</span>
              <span className="matching-message font-mono-tactical">SEARCHING FOR OPPONENTS IN YOUR RANK LAYER...</span>
            </div>
            
            <div className="opponent-searching-avatars">
              <div className="searching-slot user-slot border-gold-glow">
                <span className="slot-name font-military">YOU</span>
              </div>
              <div className="searching-vs font-military">VS</div>
              <div className="searching-slot enemy-slot animate-pulse">
                <RefreshCw size={20} className="searching-spinner animate-spin" />
                <span className="slot-name font-military">SEARCHING...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button Bar */}
      <div className="lobby-actions-bar">
        {!isMatching ? (
          <GamerButton 
            variant="primary" 
            size="lg" 
            onClick={handleStartMatch} 
            className="start-match-btn shadow-gold-glow"
          >
            <Play fill="currentColor" size={20} className="mr-1" />
            <span>{activeTab === 'custom' ? 'ENTER CUSTOM LOBBY' : 'START MATCH'}</span>
          </GamerButton>
        ) : (
          <GamerButton 
            variant="danger" 
            size="lg" 
            onClick={handleCancelMatch} 
            className="cancel-match-btn"
          >
            <X size={20} className="mr-1" />
            <span>CANCEL MATCHMAKING</span>
          </GamerButton>
        )}
      </div>
    </div>
  );
}
