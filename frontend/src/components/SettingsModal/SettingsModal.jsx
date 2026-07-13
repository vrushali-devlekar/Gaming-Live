import React, { useState } from 'react';
import { X, Volume2, Monitor, ShieldAlert, Sliders } from 'lucide-react';
import GamerCard from '../../ui/GamerCard/GamerCard';
import GamerButton from '../../ui/GamerButton/GamerButton';
import './SettingsModal.css';

export default function SettingsModal({ isOpen, onClose }) {
  const [volume, setVolume] = useState(70);
  const [sfx, setSfx] = useState(85);
  const [hudColor, setHudColor] = useState('gold');
  const [graphics, setGraphics] = useState('ultra');
  const [vsync, setVsync] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-container">
        <GamerCard title="SYSTEM OPERATIONS - CONFIG" highlight={true} className="settings-card">
          {/* Close button */}
          <button className="settings-close-btn" onClick={onClose}>
            <X size={18} />
          </button>

          <div className="settings-grid">
            {/* Left Column: Navigation categories */}
            <div className="settings-sidebar">
              <button className="settings-tab-btn active">
                <Sliders size={16} />
                <span className="font-military">AUDIO & SFX</span>
              </button>
              <button className="settings-tab-btn">
                <Monitor size={16} />
                <span className="font-military">HUD & GRAPHICS</span>
              </button>
              <button className="settings-tab-btn">
                <ShieldAlert size={16} />
                <span className="font-military">SECURITY</span>
              </button>
            </div>

            {/* Right Column: Settings controls */}
            <div className="settings-content">
              {/* Audio Section */}
              <div className="settings-section">
                <div className="section-title font-military">AUDIO CONTROLLER</div>
                
                <div className="setting-row">
                  <div className="setting-info">
                    <span className="setting-label font-military">Lobby Music Volume</span>
                    <span className="setting-desc">Adjust background tactical soundtrack</span>
                  </div>
                  <div className="setting-control flex-1 flex items-center gap-4 max-w-[200px]">
                    <Volume2 size={16} className="text-gray-400" />
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="gamer-slider"
                    />
                    <span className="slider-value font-mono-tactical">{volume}%</span>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-info">
                    <span className="setting-label font-military">Sound Effects (SFX)</span>
                    <span className="setting-desc">Matchmaking, click sounds and alert alerts</span>
                  </div>
                  <div className="setting-control flex-1 flex items-center gap-4 max-w-[200px]">
                    <Volume2 size={16} className="text-gray-400" />
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={sfx}
                      onChange={(e) => setSfx(e.target.value)}
                      className="gamer-slider"
                    />
                    <span className="slider-value font-mono-tactical">{sfx}%</span>
                  </div>
                </div>
              </div>

              {/* Graphics & HUD Customization */}
              <div className="settings-section">
                <div className="section-title font-military">VISUAL INTERFACE</div>
                
                <div className="setting-row">
                  <div className="setting-info">
                    <span className="setting-label font-military">HUD Primary Color</span>
                    <span className="setting-desc">Select active color scheme across dashboard</span>
                  </div>
                  <div className="setting-control">
                    <div className="hud-color-options">
                      <button 
                        className={`hud-color-btn bg-yellow-color ${hudColor === 'gold' ? 'selected' : ''}`}
                        onClick={() => setHudColor('gold')}
                        title="Tactical Gold"
                      ></button>
                      <button 
                        className={`hud-color-btn bg-pink-color ${hudColor === 'pink' ? 'selected' : ''}`}
                        onClick={() => setHudColor('pink')}
                        title="Neon Pink"
                      ></button>
                      <button 
                        className={`hud-color-btn bg-green-color ${hudColor === 'green' ? 'selected' : ''}`}
                        onClick={() => setHudColor('green')}
                        title="Laser Green"
                      ></button>
                    </div>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-info">
                    <span className="setting-label font-military">Graphics Render Detail</span>
                    <span className="setting-desc">Impacts particles and 3D hologram shadow quality</span>
                  </div>
                  <div className="setting-control">
                    <select 
                      value={graphics} 
                      onChange={(e) => setGraphics(e.target.value)}
                      className="gamer-select font-mono-tactical"
                    >
                      <option value="low">LOW PROFILE</option>
                      <option value="medium">BALANCED</option>
                      <option value="high">ULTRA HIGH</option>
                    </select>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-info">
                    <span className="setting-label font-military">V-Sync (Vertical Sync)</span>
                    <span className="setting-desc">Lock frames to monitor refresh rate</span>
                  </div>
                  <div className="setting-control">
                    <label className="gamer-toggle">
                      <input 
                        type="checkbox" 
                        checked={vsync}
                        onChange={(e) => setVsync(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-footer">
            <GamerButton variant="secondary" size="sm" onClick={onClose}>
              CANCEL
            </GamerButton>
            <GamerButton variant="primary" size="sm" onClick={onClose}>
              SAVE OPERATIONS
            </GamerButton>
          </div>
        </GamerCard>
      </div>
    </div>
  );
}
