import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Swords, User, Lock, ArrowRight, RefreshCw, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { themeService } from '../../services/themeService';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { loginAsGuest, loginWithGoogle, loginWithGithub } = useAuth();
  const activeTheme = themeService.getCurrentTheme();

  const [callsign, setCallsign] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);

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
    <div className="login-page select-none flex flex-col justify-between min-h-screen relative overflow-hidden bg-[#07090f] text-[#cbd5e1]">
      
      {/* Background Matrix Grid & Scanlines */}
      <div className="login-grid-bg" />
      <div className="login-scanlines" />
      <div className="bg-glow-orb-cyan absolute top-[-200px] left-1/4 w-[500px] h-[500px] bg-radial from-[#00ffcc]/5 to-transparent pointer-events-none z-0" />
      <div className="bg-glow-orb-yellow absolute bottom-[-200px] right-1/4 w-[500px] h-[500px] bg-radial from-[#facc15]/5 to-transparent pointer-events-none z-0" />

      {/* TOP HEADER */}
      <header className="relative z-10 flex items-center justify-between px-10 py-6">
        {/* Tactical Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00ffcc]/10 border border-[#00ffcc] flex items-center justify-center shadow-[0_0_10px_rgba(0,255,204,0.2)]">
            <Swords size={20} className="text-[#00ffcc]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-military text-xl tracking-widest text-white leading-none font-bold">
                CODE<span className="text-[#00ffcc]">BATTLE</span>
              </h1>
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#00ffcc]/10 border border-[#00ffcc]/30 text-[#00ffcc] font-bold rounded">
                v1.2
              </span>
            </div>
            <span className="text-[8px] font-mono text-gray-500 tracking-[0.25em] block uppercase mt-1">
              Multiplayer Algorithmic Royale
            </span>
          </div>
        </div>

        {/* System Online badge */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-[#00ffcc] tracking-wider font-bold">
          <span className="w-2 h-2 rounded-full bg-[#00ffcc] animate-pulse"></span>
          <span>// SYSTEM ONLINE</span>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 items-center px-10 py-4 max-w-7xl mx-auto">
        
        {/* Left Diagnostic Column */}
        <div className="hidden lg:flex lg:col-span-3 flex-col items-start gap-10 font-mono text-[11px] text-gray-600">
          <div className="flex flex-col gap-1">
            <span className="text-[#00ffcc] font-bold tracking-[0.2em]">&lt;CODE&gt;</span>
            <div className="w-12 h-[1px] bg-gray-800 my-1"></div>
            <div className="flex flex-col gap-1 text-[10px]">
              <span>- 001</span>
              <span>- 010</span>
              <span>- 011</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span>SYS_KERNEL_LOAD: OK</span>
            <span>SECURE_SHELL_TLS_1.3</span>
          </div>
        </div>

        {/* Center Glowing Split-Border Auth Card */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <div className="auth-card-wrapper shadow-[0_0_50px_rgba(0,255,204,0.08)]">
            <div className="auth-card-content flex flex-col items-center text-center">
              
              {/* Security Shield badge */}
              <div className="flex flex-col items-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#00ffcc]/5 border border-[#00ffcc]/30 text-[#00ffcc] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,204,0.1)]">
                  <Shield size={22} />
                </div>
                <span className="text-[10px] font-mono text-[#00ffcc] tracking-[0.2em] uppercase font-bold flex items-center gap-1">
                  <Lock size={10} /> SECURE ACCESS
                </span>
              </div>

              {/* Title */}
              <h2 className="font-military text-3xl text-white tracking-widest uppercase font-black leading-none mb-1">
                AUTHENTICATE
              </h2>
              <h2 className="font-military text-3xl text-[#00ffcc] tracking-widest uppercase font-black leading-none mb-4">
                CODER PROFILE
              </h2>
              
              <p className="font-mono text-xs text-gray-400 leading-relaxed max-w-xs mb-8">
                Sign in with 1-click to access multiplayer arenas and save your BP rank stats.
              </p>

              {/* OAUTH BUTTONS */}
              <div className="w-full flex flex-col gap-4 mb-6">
                
                {/* GITHUB OAUTH */}
                <button
                  onClick={loginWithGithub}
                  className="auth-btn-github w-full py-4 px-6 flex items-center justify-between transition-all cursor-pointer bg-transparent"
                >
                  <div className="flex items-center gap-4">
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span className="font-military text-sm text-white font-bold tracking-wider">
                      CONTINUE WITH <span className="text-[#00ffcc]">GITHUB</span>
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-[#00ffcc]" />
                </button>

                {/* GOOGLE OAUTH */}
                <button
                  onClick={loginWithGoogle}
                  className="auth-btn-google w-full py-4 px-6 flex items-center justify-between transition-all cursor-pointer bg-transparent"
                >
                  <div className="flex items-center gap-4">
                    <svg className="w-5 h-5 fill-[#facc15]" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V13.4h6.86c-.277 1.56-1.602 4.585-6.86 4.585-4.54 0-8.24-3.765-8.24-8.4s3.7-8.4 8.24-8.4c2.58 0 4.307 1.095 5.298 2.045l2.465-2.37C18.251 1.21 15.497 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.185-1.925H12.24z"/>
                    </svg>
                    <span className="font-military text-sm text-white font-bold tracking-wider">
                      CONTINUE WITH <span className="text-[#facc15]">GOOGLE</span>
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-[#facc15]" />
                </button>

              </div>

              {/* Guest Access Expandable */}
              <div className="w-full flex flex-col items-center mt-2 mb-6">
                <button 
                  onClick={() => setShowGuestForm(!showGuestForm)}
                  className="text-gray-500 hover:text-white font-mono text-[10px] tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer bg-transparent border-none"
                >
                  <span>{showGuestForm ? '[ COLLAPSE GUEST ACCESS ]' : '[ ACCESS AS GUEST OPERATOR ]'}</span>
                </button>

                {showGuestForm && (
                  <form onSubmit={handleGuestSubmit} className="w-full flex flex-col gap-3 mt-4 pt-4 border-t border-white/5 animate-fade-in">
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">CALLSIGN / USERNAME:</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={callsign}
                          onChange={(e) => setCallsign(e.target.value)}
                          placeholder="OPERATOR_CALLSIGN"
                          className="w-full bg-black/40 border border-slate-800 focus:border-[#00ffcc] text-white font-mono text-xs p-3 rounded outline-none tracking-wide"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full py-3 bg-[#00ffcc] hover:bg-[#00e6b8] text-black font-military font-bold text-xs tracking-widest transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                    >
                      {isAuthenticating ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>CONNECTING...</span>
                        </>
                      ) : (
                        <span>CONNECT TO BATTLE LOBBY</span>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Card Footer Divider */}
              <div className="w-full flex items-center gap-3 mb-4 text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                <div className="flex-1 h-[1px] bg-gray-800" />
                <span className="flex items-center gap-1.5">
                  <Lock size={9} /> SECURE LOGIN
                </span>
                <div className="flex-1 h-[1px] bg-gray-800" />
              </div>

              {/* Footer Links */}
              <div className="flex items-center gap-4 text-[9px] font-mono text-gray-500 tracking-wider">
                <span className="hover:text-gray-300 cursor-pointer">TERMS OF SERVICE</span>
                <span>•</span>
                <span className="hover:text-gray-300 cursor-pointer">PRIVACY POLICY</span>
              </div>

            </div>
          </div>
        </div>

        {/* Right Diagnostic Column */}
        <div className="hidden lg:flex lg:col-span-3 flex-col items-end gap-10 font-mono text-[11px] text-gray-600 text-right">
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[#facc15] font-bold tracking-[0.2em]">{`{ BATTLE MODE }`}</span>
            <div className="w-12 h-[1px] bg-gray-800 my-1"></div>
            {/* Dot grid matrix helper */}
            <div className="grid grid-cols-5 gap-1.5 mt-2 opacity-35">
              {[...Array(25)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span>VAC_ANTILAG_ACTIVE</span>
            <span>SHIELD_ENCR_AES256</span>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 px-10 py-5 text-[9px] font-mono text-gray-700 flex justify-between uppercase border-t border-gray-900/50">
        <span>SECURITY ENCRYPTION: SHA-256 ACTIVE</span>
        <span>SESSION GATEWAY V1.2</span>
      </footer>

      {/* Decorative HUD corners */}
      <div className="absolute top-10 left-10 w-4 h-4 border-t-2 border-l-2 border-[#00ffcc]/30 pointer-events-none" />
      <div className="absolute top-10 right-10 w-4 h-4 border-t-2 border-r-2 border-[#facc15]/30 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-4 h-4 border-b-2 border-l-2 border-[#00ffcc]/30 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-4 h-4 border-b-2 border-r-2 border-[#facc15]/30 pointer-events-none" />

    </div>
  );
}
