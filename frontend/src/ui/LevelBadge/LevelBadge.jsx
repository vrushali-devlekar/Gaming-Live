import React from 'react';
import './LevelBadge.css';

export default function LevelBadge({ level = 45, size = 'md', glow = true }) {
  return (
    <div className={`level-badge-container badge-size-${size} ${glow ? 'badge-glow' : ''}`}>
      <div className="badge-bg">
        <svg viewBox="0 0 100 100" className="badge-svg">
          {/* Outer glowing border */}
          <polygon points="50,5 95,28 95,72 50,95 5,72 5,28" className="badge-poly-outer" />
          {/* Inner details */}
          <polygon points="50,12 88,32 88,68 50,88 12,68 12,32" className="badge-poly-inner" />
        </svg>
        <div className="badge-text font-military">
          <span className="lvl-label">LV</span>
          <span className="lvl-value">{level}</span>
        </div>
      </div>
    </div>
  );
}
