import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Swords, User, Lock, ArrowRight, RefreshCw, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { themeService } from '../../services/themeService';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { loginAsGuest, loginWithGoogle, loginWithGithub } = useAuth();
  const activeTheme = themeService.getCurrentTheme();

  const [callsign, setCallsign] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    if (isAuthenticating) return;

    setIsAuthenticating(true);
    setTimeout(() => {
      loginAsGuest(callsign.trim() || 'GHOST_OPERATOR');
      setIsAuthenticating(false);
      navigate('/lobby');
    }, 1200);
  };

  return (
    <div className="login-page font-sans select-none flex flex-col justify-between min-h-screen relative overflow-hidden bg-[#08090d]">
      
      {/* Background Matrix Grid & Scanlines */}
      <div className="login-grid-bg" />
      <div className="login-scanlines" />

      {/* TOP HEADER */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-[#2d3142]/60 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#00ffcc] animate-ping rounded-full" />
          <div>
            <span className="font-mono text-[9px] text-[#00ffcc] tracking-[0.25em] block leading-none">SECURITY CHECKPOINT</span>
            <h1 className="font-military text-xl text-white tracking-widest mt-1">CODEBATTLE // AUTHENTICATION</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-black/40 border border-slate-800 clip-steel-sm text-xs font-mono text-gray-400">
          <Shield size={14} className="text-[#00ffcc]" />
          <span>STATUS: GATEWAY ONLINE</span>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center p-6 max-w-md mx-auto w-full">
        
        {/* Login Modal Box */}
        <div className="w-full bg-[#0b0e14] border-2 border-[#00ffcc] p-8 clip-steel-widget shadow-[0_0_50px_rgba(0,255,204,0.25)] relative flex flex-col items-center text-center">
          
          {/* Top Metallic Accent Bar */}
          <div className="absolute top-0 right-12 w-20 h-[3px] bg-[#00ffcc]" />

          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-full bg-[#00ffcc]/10 border-2 border-[#00ffcc] text-[#00ffcc] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,255,204,0.3)]">
            <Swords size={32} />
          </div>

          <h2 className="font-military text-2xl text-white tracking-widest font-black leading-none mb-2">
            OPERATOR LOGIN
          </h2>
          
          <p className="font-mono text-xs text-gray-400 leading-relaxed mb-6">
            Authenticate your credentials to enter the battle lobby and access tactical duels.
          </p>

          {/* OAUTH PROVIDER BUTTONS */}
          <div className="w-full flex flex-col gap-3 mb-6">
            
            {/* GOOGLE OAUTH */}
            <button
              onClick={loginWithGoogle}
              type="button"
              className="w-full py-3 px-4 bg-white hover:bg-gray-100 text-black font-military font-bold text-xs tracking-wider clip-steel-sm flex items-center justify-center gap-3 transition-colors cursor-pointer border-none"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>CONTINUE WITH GOOGLE</span>
            </button>

            {/* GITHUB OAUTH */}
            <button
              onClick={loginWithGithub}
              type="button"
              className="w-full py-3 px-4 bg-[#24292e] hover:bg-[#1b1f23] text-white font-military font-bold text-xs tracking-wider clip-steel-sm flex items-center justify-center gap-3 transition-colors cursor-pointer border-none"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>CONTINUE WITH GITHUB</span>
            </button>

          </div>

          <div className="w-full flex items-center gap-3 mb-6 text-[10px] font-mono text-gray-500 uppercase">
            <div className="flex-1 h-[1px] bg-slate-800" />
            <span>OR GUEST TACTICAL ACCESS</span>
            <div className="flex-1 h-[1px] bg-slate-800" />
          </div>

          {/* TACTICAL GUEST AUTH FORM */}
          <form onSubmit={handleGuestSubmit} className="w-full flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] font-mono text-gray-400 uppercase">OPERATOR CALLSIGN / USERNAME:</label>
              <div className="relative">
                <input
                  type="text"
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value)}
                  placeholder="Enter callsign (e.g. GHOST_CODER)"
                  className="w-full bg-[#121620] border border-[#252e3d] text-white font-mono text-xs p-3 pl-9 rounded focus:outline-none focus:border-[#00ffcc] tracking-wide"
                />
                <User size={14} className="absolute left-3 top-3.5 text-gray-500" />
              </div>
            </div>

            {/* MAIN ENTER LOBBY CTA BUTTON */}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-4 bg-[#FACC15] hover:bg-[#ebd510] text-black font-military font-black text-lg tracking-widest clip-angular-btn start-match-glow transition-all duration-300 flex items-center justify-center gap-2 border-none cursor-pointer select-none mt-2"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>ENTER BATTLE LOBBY</span>
                  <ArrowRight size={18} fill="black" />
                </>
              )}
            </button>

          </form>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 px-8 py-3 border-t border-[#2d3142]/40 bg-black/50 text-[9px] font-mono text-gray-600 flex justify-between uppercase">
        <span>SECURITY ENCRYPTION: SHA-256 ACTIVE</span>
        <span>SESSION GATEWAY V4.2</span>
      </footer>

    </div>
  );
}
