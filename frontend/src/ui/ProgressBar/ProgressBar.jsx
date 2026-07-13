import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({ value = 65, max = 100, label = "", showValues = true }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  // Create an array for segmented chunks
  const segments = Array.from({ length: 10 });

  return (
    <div className="gamer-progress-container">
      {label && (
        <div className="progress-header font-military">
          <span className="progress-label">{label}</span>
          {showValues && (
            <span className="progress-values font-mono-tactical">
              {value} / {max}
            </span>
          )}
        </div>
      )}
      
      <div className="progress-bar-track">
        {/* Continuous background bar */}
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }}>
          <div className="progress-bar-glow"></div>
        </div>
        
        {/* Segment overlays to create military dashes */}
        <div className="progress-bar-segments">
          {segments.map((_, i) => (
            <div key={i} className="progress-segment-divider"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
