import React from 'react';
import './GamerButton.css';

export default function GamerButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  className = '',
  type = 'button'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`gamer-btn btn-variant-${variant} btn-size-${size} ${disabled ? 'btn-disabled' : ''} ${className}`}
    >
      {/* Background slash styling overlay */}
      <span className="btn-accent-overlay"></span>
      {/* Grid overlay for tactical style */}
      <span className="btn-grid-overlay"></span>
      {/* Corner bracket decorations */}
      <span className="btn-bracket-tl"></span>
      <span className="btn-bracket-br"></span>
      
      {/* Button Content */}
      <span className="btn-content font-military">{children}</span>
    </button>
  );
}
