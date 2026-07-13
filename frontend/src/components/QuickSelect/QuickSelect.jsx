import React, { useState } from 'react';
import { Play, Pause, Music, Disc, ChevronRight } from 'lucide-react';
import GamerCard from '../../ui/GamerCard/GamerCard';
import './QuickSelect.css';

export default function QuickSelect() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <GamerCard title="ACTIVE ARENA & MAP SELECT" className="quick-select-card">
      <div className="arena-display">
        {/* Arena Thumbnail Background */}
        <div className="arena-thumbnail">
          <div className="arena-overlay"></div>
          {/* Cyberpunk Grid Art Effect inside CSS */}
          <div className="cyberpunk-grid-lines"></div>
          
          <div className="arena-details">
            <span className="arena-category font-military">CODING ARENA</span>
            <span className="arena-name font-military text-gold-glow">CYBERPUNK NEON</span>
            <span className="arena-mode font-mono-tactical">VS CODE BATTLE / DUEL</span>
          </div>
        </div>

        {/* Music Player Bar (Spinning Vinyl) */}
        <div className="music-selector bg-brushed-steel-dark">
          <div className="music-left">
            <div className={`vinyl-wrapper ${isPlaying ? 'spinning' : ''}`}>
              <Disc className="vinyl-icon" />
              <div className="vinyl-center"></div>
            </div>
            
            <div className="music-meta">
              <span className="music-title font-military">SYNTHWAVE BEATS</span>
              <span className="music-artist font-mono-tactical">LOBBY THEME CHILL</span>
            </div>
          </div>

          <div className="music-right">
            <button 
              className="music-toggle-btn"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </div>
        </div>

        {/* Arena Selector Button */}
        <button className="select-arena-btn font-military">
          <span>CHANGE THEME SELECTOR</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </GamerCard>
  );
}
