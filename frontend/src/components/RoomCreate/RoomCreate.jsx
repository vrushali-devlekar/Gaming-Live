import React, { useState } from 'react';
import { Lock, Unlock, ShieldAlert, Disc, Sliders, ChevronDown } from 'lucide-react';
import GamerCard from '../../ui/GamerCard/GamerCard';
import GamerButton from '../../ui/GamerButton/GamerButton';
import './RoomCreate.css';

export default function RoomCreate({ onCreateRoom }) {
  const [tier, setTier] = useState('free'); // 'free' or 'premium'
  const [roomName, setRoomName] = useState('');
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [maxUsers, setMaxUsers] = useState(2);
  const [theme, setTheme] = useState('cyberpunk');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    
    const roomData = {
      name: roomName,
      password: isPasswordProtected ? password : null,
      maxUsers,
      theme,
      tier,
      host: "GHOST_CODER"
    };
    
    if (onCreateRoom) {
      onCreateRoom(roomData);
    }
  };

  return (
    <GamerCard title="ROOM CREATION INTERFACE" highlight={true} className="room-create-card">
      <form onSubmit={handleSubmit} className="room-form">
        
        {/* Tier Toggle Selector */}
        <div className="form-group">
          <label className="form-label font-military">LICENSE TIER CONFIG</label>
          <div className="tier-toggle bg-brushed-steel-dark">
            <button
              type="button"
              className={`tier-btn ${tier === 'free' ? 'active-tier' : ''}`}
              onClick={() => setTier('free')}
            >
              <span className="font-military">FREE TIER</span>
              <span className="tier-sub">1 Active Room</span>
            </button>
            <button
              type="button"
              className={`tier-btn ${tier === 'premium' ? 'active-tier premium-glow' : ''}`}
              onClick={() => setTier('premium')}
            >
              <span className="font-military">PREMIUM</span>
              <span className="tier-sub text-gold-glow">Unlimited Rooms</span>
            </button>
          </div>
        </div>

        {/* Room Name Input */}
        <div className="form-group">
          <label htmlFor="room-name" className="form-label font-military">SQUAD ROOM NAME</label>
          <div className="input-hud-wrapper">
            <span className="input-hud-prefix font-mono-tactical">&gt;</span>
            <input
              id="room-name"
              type="text"
              placeholder="ENTER ROOM DESCRIPTOR..."
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="gamer-input font-mono-tactical"
              required
            />
          </div>
        </div>

        {/* Password Protection Toggle & Input */}
        <div className="form-group">
          <div className="password-header">
            <label className="form-label font-military">SECURITY DEPLOYMENT</label>
            <label className="gamer-toggle">
              <input
                type="checkbox"
                checked={isPasswordProtected}
                onChange={(e) => setIsPasswordProtected(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          {isPasswordProtected && (
            <div className="input-hud-wrapper animate-slide-down">
              <span className="input-hud-prefix">
                <Lock size={12} className="text-gold-glow" />
              </span>
              <input
                type="password"
                placeholder="ENTER SQUAD KEY..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="gamer-input font-mono-tactical"
                required={isPasswordProtected}
              />
            </div>
          )}
        </div>

        {/* Max Users Slider (Fixed 1-3) */}
        <div className="form-group">
          <div className="slider-header">
            <label className="form-label font-military">COLLABORATIVE CAPACITY</label>
            <span className="slider-max-display font-mono-tactical text-gold-glow">
              {maxUsers} / 3 SQUAD MEMBERS
            </span>
          </div>
          <div className="slider-control">
            <input
              type="range"
              min="1"
              max="3"
              value={maxUsers}
              onChange={(e) => setMaxUsers(parseInt(e.target.value))}
              className="gamer-slider"
            />
            <div className="slider-ticks font-mono-tactical">
              <span>1</span>
              <span>2</span>
              <span>3 (MAX)</span>
            </div>
          </div>
        </div>

        {/* Coding Theme / Playlist Selector */}
        <div className="form-group">
          <label className="form-label font-military">ARENA ENVIRONMENT SELECT</label>
          <div className="select-hud-wrapper">
            <span className="input-hud-prefix">
              <Disc size={14} className="spinning-vinyl-icon" />
            </span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="gamer-select-room font-mono-tactical"
            >
              <option value="cyberpunk">CYBERPUNK NEON - SYNTHWAVE BEATS</option>
              <option value="monochrome">RETRO TERMINAL - LOFI CODES</option>
              <option value="wasteland">WASTELAND STEEL - INDUSTRIAL METAL</option>
              <option value="orbit">COSMIC ORBIT - AMBIENT SPACE CHILL</option>
            </select>
            <ChevronDown size={16} className="select-arrow" />
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="form-submit-row">
          <GamerButton
            variant="primary"
            size="lg"
            type="submit"
            className="create-squad-btn shadow-gold-glow"
          >
            CREATE SQUAD ROOM
          </GamerButton>
        </div>

      </form>
    </GamerCard>
  );
}
