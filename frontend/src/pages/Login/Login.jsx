import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Swords, Lock, RefreshCw, ChevronRight, Terminal, Cpu, Server, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { loginAsGuest, loginWithGoogle, loginWithGithub } = useAuth();

  const [callsign, setCallsign] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(true);

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    if (isAuthenticating) return;

    setIsAuthenticating(true);
    setTimeout(() => {
      loginAsGuest(callsign.trim() || 'GHOST_OPERATOR');
      setIsAuthenticating(false);
      navigate('/lobby');
    }, 800);
  };

  return (
    <div className="login-gateway-viewport">
      {/* Background Matrix Grid & Scanlines */}
      <div className="theme-grid-matrix-bg" />
      <div className="theme-scanline-overlay" />

      {/* TOP HEADER BAR */}
      <header className="login-top-bar">
        <Link to="/" className="flex items-center gap-3 text-decoration-none">
          <div className="w-8 h-8 bg-[#a3e635]/15 border border-[#a3e635] flex items-center justify-center rounded">
            <Swords size={18} className="text-[#a3e635]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-header text-base tracking-wider text-white font-extrabold leading-none">
                CODE<span className="text-lime">//</span>BATTLE
              </h1>
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] font-bold rounded">
                CYBER ARENA
              </span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/" className="text-xs font-mono text-muted hover:text-white flex items-center gap-1">
            <ArrowLeft size={13} />
            <span>BACK TO HOME</span>
          </Link>
          <div className="flex items-center gap-2 font-mono text-[11px] text-lime font-bold">
            <span className="status-beacon-green"></span>
            <span>GATEWAY READY</span>
          </div>
        </div>
      </header>

      {/* MAIN CENTER CONTAINER */}
      <main className="login-main-container">
        
        {/* Left Diagnostic Column */}
        <div className="login-side-col hidden lg:flex flex-col gap-4 font-mono text-xs text-muted">
          <div className="diagnostic-box">
            <span className="text-lime font-bold tracking-wider flex items-center gap-1.5 mb-2">
              <Cpu size={14} /> CLUSTER METRICS
            </span>
            <div className="w-12 h-[1px] bg-white/10 mb-2"></div>
            <p>• NODE: ASIA-SOUTH-01</p>
            <p>• GATEWAY: PORT_3001</p>
            <p>• PROTOCOL: WSS / REST</p>
            <p>• ENCRYPTION: AES-256</p>
          </div>
        </div>

        {/* Center Auth Card */}
        <div className="login-center-col">
          <div className="login-gateway-card">
            
            {/* Security Badge */}
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-[#a3e635]/10 border border-[#a3e635] text-[#a3e635] flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(163,230,53,0.2)]">
                <Shield size={22} />
              </div>
              <span className="text-[10px] font-mono text-lime tracking-widest uppercase font-bold flex items-center gap-1">
                <Lock size={11} /> SECURE OPERATOR ACCESS
              </span>
            </div>

            {/* Title */}
            <h2 className="font-header text-2xl text-white tracking-wider uppercase font-extrabold text-center mb-1">
              OPERATOR AUTHENTICATION
            </h2>
            <p className="font-mono text-xs text-muted text-center mb-6 max-w-sm mx-auto">
              Authenticate your identity to enter competitive multiplayer coding battles.
            </p>

            {/* OAUTH BUTTONS */}
            <div className="w-full flex flex-col gap-3 mb-6">
              
              {/* GITHUB OAUTH */}
              <button
                onClick={loginWithGithub}
                className="oauth-btn github-btn"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>Continue with <strong className="text-white">GitHub</strong></span>
                </div>
                <ChevronRight size={16} className="text-muted" />
              </button>

              {/* GOOGLE OAUTH */}
              <button
                onClick={loginWithGoogle}
                className="oauth-btn google-btn"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 fill-[#f59e0b]" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V13.4h6.86c-.277 1.56-1.602 4.585-6.86 4.585-4.54 0-8.24-3.765-8.24-8.4s3.7-8.4 8.24-8.4c2.58 0 4.307 1.095 5.298 2.045l2.465-2.37C18.251 1.21 15.497 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.185-1.925H12.24z"/>
                  </svg>
                  <span>Continue with <strong className="text-white">Google</strong></span>
                </div>
                <ChevronRight size={16} className="text-muted" />
              </button>

            </div>

            {/* Quick Guest Access */}
            <div className="w-full pt-4 border-t border-white/10">
              <form onSubmit={handleGuestSubmit} className="flex flex-col gap-2.5">
                <label className="text-xs font-mono text-muted uppercase">Quick Instant Guest Access:</label>
                <input
                  type="text"
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value)}
                  placeholder="Enter Callsign (e.g. CYBER_NINJA)"
                  className="input-cyber-search w-full"
                />
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="btn-cyber-primary w-full py-3 mt-1"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>INITIALIZING SESSION...</span>
                    </>
                  ) : (
                    <span>LAUNCH AS GUEST OPERATOR</span>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Right Diagnostic Column */}
        <div className="login-side-col hidden lg:flex flex-col gap-4 font-mono text-xs text-muted text-right items-end">
          <div className="diagnostic-box">
            <span className="text-amber font-bold tracking-wider flex items-center gap-1.5 mb-2 justify-end">
              <Server size={14} /> ARENA CLUSTER
            </span>
            <div className="w-12 h-[1px] bg-white/10 mb-2 ml-auto"></div>
            <p>DUEL SERVERS: ONLINE</p>
            <p>LATENCY: 14MS (OPTIMAL)</p>
            <p>ACTIVE SESSIONS: 1,842</p>
          </div>
        </div>

      </main>

      {/* FOOTER BAR */}
      <footer className="login-footer">
        <span>SECURITY PROTOCOL: QUANTUM AES-256</span>
        <span>CODEBATTLE CYBER ARENA</span>
      </footer>

    </div>
  );
}
