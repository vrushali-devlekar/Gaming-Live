import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, AlertCircle, RefreshCw, Zap, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './UsernameSetupModal.css';

export default function UsernameSetupModal() {
  const { user, updateUserProfile } = useAuth();
  
  const [usernameInput, setUsernameInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill input when modal mounts
  useEffect(() => {
    if (user && user.username) {
      setUsernameInput(user.username);
    }
  }, [user]);

  // Real-time callsign availability check effect
  useEffect(() => {
    if (!usernameInput || usernameInput.trim().length < 3) {
      setIsAvailable(null);
      setErrorMessage(usernameInput.length > 0 ? 'Minimum 3 characters required' : '');
      return;
    }

    const cleanName = usernameInput.trim();
    const isValidFormat = /^[a-zA-Z0-9_]{3,20}$/.test(cleanName);
    
    if (!isValidFormat) {
      setIsAvailable(false);
      setErrorMessage('Letters, numbers, or underscores only (3-20 chars)');
      return;
    }

    setErrorMessage('');
    setIsChecking(true);

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/user/check-username/${encodeURIComponent(cleanName)}`);
        const data = await response.json();
        setIsChecking(false);

        if (data.available || (user && user.username === cleanName)) {
          setIsAvailable(true);
        } else {
          setIsAvailable(false);
          setErrorMessage('Callsign already taken by another coder');
        }
      } catch (err) {
        setIsChecking(false);
        setIsAvailable(true); // Fallback offline availability mode
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [usernameInput, user]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAvailable || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/user/set-username', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: usernameInput.trim(),
          userId: user ? user._id : undefined
        })
      });

      const data = await response.json();
      setIsSubmitting(false);

      if (data.success && data.user) {
        if (updateUserProfile) {
          updateUserProfile(data.user);
        }
      } else {
        setErrorMessage(data.message || 'Failed to confirm callsign. Please try again.');
      }
    } catch (err) {
      setIsSubmitting(false);
      // Fallback local update if offline
      if (updateUserProfile && user) {
        updateUserProfile({
          ...user,
          username: usernameInput.trim(),
          isProfileSetup: true
        });
      }
    }
  };

  // Only render modal if user exists and profile setup is pending (isProfileSetup === false)
  if (!user || user.isProfileSetup !== false) {
    return null;
  }

  return (
    <div className="username-modal-overlay">
      <div className="username-modal-container">
        {/* Header Bar */}
        <div className="username-modal-header-bar">
          <div className="flex items-center gap-2.5">
            <ShieldAlert size={22} className="text-[#facc15] animate-pulse" />
            <div>
              <span className="font-mono text-[9px] text-[#facc15] tracking-[0.2em] block uppercase leading-none">
                REGISTRATION PROTOCOL
              </span>
              <h2 className="font-military text-xl text-white tracking-widest font-bold mt-0.5">
                ENTER CUSTOM CALLSIGN
              </h2>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] font-mono text-[10px] font-bold rounded">
            STEP 1/1
          </span>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="username-modal-body">
          <p className="font-mono text-xs text-gray-300 leading-relaxed">
            Welcome, Operator! Before dropping into the compiler matrix, confirm your custom gamer callsign below. This handle will appear on global leaderboards and squad rooms.
          </p>

          <div className="callsign-input-wrapper">
            <label className="font-military text-xs text-gray-400 tracking-wider uppercase block mb-1">
              CALLSIGN / GAMER TAG
            </label>

            <div className="relative">
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. GHOST_CODER_99"
                maxLength={20}
                required
                className={`callsign-input-field ${
                  isAvailable === true ? 'success' : isAvailable === false ? 'error' : ''
                }`}
              />
            </div>

            {/* Real-time Status Indicator Badge */}
            <div className="mt-2">
              {isChecking ? (
                <div className="availability-status-pill status-checking">
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Checking callsign availability...</span>
                </div>
              ) : isAvailable === true ? (
                <div className="availability-status-pill status-available">
                  <CheckCircle size={13} />
                  <span>CALLSIGN AVAILABLE // READY FOR DEPLOYMENT</span>
                </div>
              ) : isAvailable === false ? (
                <div className="availability-status-pill status-taken">
                  <AlertCircle size={13} />
                  <span>{errorMessage || 'CALLSIGN TAKEN // CHOOSE ANOTHER HANDLE'}</span>
                </div>
              ) : errorMessage ? (
                <div className="availability-status-pill status-taken">
                  <AlertCircle size={13} />
                  <span>{errorMessage}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={!isAvailable || isChecking || isSubmitting}
            className="btn-confirm-callsign"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>SAVING CALLSIGN...</span>
              </>
            ) : (
              <>
                <Zap size={18} className="fill-black" />
                <span>CONFIRM CALLSIGN &amp; ENTER LOBBY</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
