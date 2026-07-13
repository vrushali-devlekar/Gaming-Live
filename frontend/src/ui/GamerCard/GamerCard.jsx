import React from 'react';
import './GamerCard.css';

export default function GamerCard({ 
  children, 
  title = '', 
  className = '', 
  glow = false,
  highlight = false 
}) {
  return (
    <div className={`gamer-card ${glow ? 'card-glow' : ''} ${highlight ? 'card-highlight' : ''} ${className}`}>
      {/* Background patterns */}
      <div className="card-bg-steel"></div>
      <div className="card-hud-grid"></div>
      <div className="card-scanlines"></div>

      {/* Decorative corner brackets */}
      <div className="corner-bracket bracket-tl"></div>
      <div className="corner-bracket bracket-tr"></div>
      <div className="corner-bracket bracket-bl"></div>
      <div className="corner-bracket bracket-br"></div>
      
      {/* Top indicator bar */}
      <div className="card-header-bar">
        {title && <span className="card-title font-military">{title}</span>}
        <div className="card-header-dots">
          <span className="dot dot-1"></span>
          <span className="dot dot-2"></span>
          <span className="dot dot-3"></span>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}
