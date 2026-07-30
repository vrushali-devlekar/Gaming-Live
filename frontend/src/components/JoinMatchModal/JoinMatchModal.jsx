import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Crosshair, Send, X, ShieldAlert } from 'lucide-react';
import './JoinMatchModal.css';

export default function JoinMatchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [matchInput, setMatchInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleDeploy = (e) => {
    e.preventDefault();
    const rawVal = matchInput.trim();

    if (!rawVal) {
      setErrorMessage('Please enter a valid match URL or room code.');
      return;
    }

    let matchId = rawVal;

    // Parse matchId from full URL if pasted
    if (rawVal.includes('matchId=')) {
      try {
        const urlObj = new URL(rawVal);
        const parsed = urlObj.searchParams.get('matchId');
        if (parsed) matchId = parsed;
      } catch (err) {
        const split = rawVal.split('matchId=')[1];
        if (split) matchId = split.split('&')[0];
      }
    }

    matchId = matchId.trim().replace(/[^a-zA-Z0-9_-]/g, '');

    if (!matchId) {
      setErrorMessage('Invalid match coordinates or room code.');
      return;
    }

    setErrorMessage('');
    onClose();
    navigate(`/arena?matchId=${encodeURIComponent(matchId)}`);
  };

  return (
    <div className="join-modal-overlay" onClick={onClose}>
      <div className="join-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="join-modal-header">
          <div className="join-modal-title">
            <Radio size={20} className="text-[#00ffcc] animate-pulse" />
            <span>PASTE MATCH COORDINATES</span>
          </div>
          <button onClick={onClose} className="join-modal-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleDeploy}>
          <div className="join-input-group">
            <label className="join-input-label">
              ENTER MATCH LINK OR ROOM CODE:
            </label>
            <input
              type="text"
              value={matchInput}
              onChange={(e) => {
                setMatchInput(e.target.value);
                setErrorMessage('');
              }}
              placeholder="e.g. http://localhost:5173/arena?matchId=MATCH_98231 or MATCH_98231"
              className="join-text-input"
              autoFocus
            />
            {errorMessage && (
              <div className="join-error-message flex items-center gap-1">
                <ShieldAlert size={12} />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="text-[10px] font-mono text-gray-400 mb-5 leading-relaxed bg-black/40 p-3 rounded border border-white/10">
            <span className="text-[#00ffcc] font-bold block mb-1">TACTICAL INSTRUCTION:</span>
            Pasting a valid battle URL or Room Code will instantly pair your client to the host's match room and deploy your compiler.
          </div>

          {/* Action Row */}
          <div className="join-action-row">
            <button type="submit" className="deploy-match-btn">
              <Crosshair size={16} />
              <span>DEPLOY TO ARENA</span>
            </button>
            <button type="button" onClick={onClose} className="cancel-modal-btn">
              CANCEL
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
