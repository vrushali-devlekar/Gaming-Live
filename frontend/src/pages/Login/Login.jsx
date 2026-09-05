import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Swords, Lock, RefreshCw, ChevronRight, Terminal, Cpu, Server } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { loginAsGuest, loginWithGoogle, loginWithGithub } = useAuth();

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
    }, 1000);
  };

  return (
    <div className="login-gateway-viewport">
      {/* Background Matrix Grid & Scanlines */}
      <div className="theme-grid-matrix-bg" />
      <div className="theme-scanline-overlay" />

      {/* TOP HEADER BAR */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#06B6D4]/10 border border-[#06B6D4] flex items-center justify-center clip-tactical-badge">
            <Swords size={18} className="text-[#06B6D4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-header text-lg tracking-[0.18em] text-white font-extrabold leading-none">
                CODE<span className="text-[#F59E0B]">//</span>BATTLE
              </h1>
              <span className="text-[9px] font-code px-1.5 py-0.5 bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-[#06B6D4] font-bold clip-tactical-badge">
                v4.2
              </span>
            </div>
            <span className="text-[8px] font-code text-gray-400 tracking-[0.2em] block uppercase mt-0.5">
              OPERATOR AUTHENTICATION GATEWAY
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-code text-[10px] text-[#06B6D4] tracking-wider font-bold">
          <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse"></span>
          <span>SYSTEM ONLINE // GATEWAY READY</span>
        </div>
      </header>

      {/* MAIN CENTER CONTAINER */}
      <main className="relative z-10 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 items-center px-8 py-4 max-w-6xl mx-auto">
        
        {/* Left Diagnostic Column */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 font-code text-[10px] text-gray-400">
          <div className="flex flex-col gap-1">
            <span className="text-[#06B6D4] font-bold tracking-[0.18em] flex items-center gap-1.5">
              <Cpu size={12} /> SYSTEM CLUSTER
            </span>
            <div className="w-12 h-[1px] bg-white/10 my-1"></div>
            <span>- CLUSTER: ASIA-SOUTH-01</span>
            <span>- GATEWAY: PORT_3001</span>
            <span>- ENCRYPTION: QUANTUM AES-256</span>
          </div>
        </div>

        {/* Center Auth Card */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <div className="login-gateway-card p-8 clip-tactical-card max-w-md w-full text-center">
            
            {/* Security Badge */}
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="w-11 h-11 bg-[#06B6D4]/10 border border-[#06B6D4] text-[#06B6D4] flex items-center justify-center clip-tactical-badge shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <Shield size={20} />
              </div>
              <span className="text-[9px] font-code text-[#06B6D4] tracking-[0.2em] uppercase font-bold flex items-center gap-1">
                <Lock size={10} /> SECURE IDENTITY VERIFICATION
              </span>
            </div>

            {/* Title */}
            <h2 className="font-header text-2xl text-white tracking-[0.15em] uppercase font-extrabold leading-tight">
              OPERATOR AUTHENTICATION
            </h2>
            <p className="font-code text-[11px] text-gray-400 mt-2 mb-6">
              Authenticate operator callsign credentials to access multiplayer competitive arenas.
            </p>

            {/* OAUTH BUTTONS */}
            <div className="w-full flex flex-col gap-3 mb-6">
              
              {/* GITHUB OAUTH */}
              <button
                onClick={loginWithGithub}
                className="login-oauth-btn btn-github-auth clip-tactical-btn w-full"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>CONTINUE WITH <strong className="text-[#06B6D4]">GITHUB</strong></span>
                </div>
                <ChevronRight size={16} className="text-[#06B6D4]" />
              </button>

              {/* GOOGLE OAUTH */}
              <button
                onClick={loginWithGoogle}
                className="login-oauth-btn btn-google-auth clip-tactical-btn w-full"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 fill-[#F59E0B]" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V13.4h6.86c-.277 1.56-1.602 4.585-6.86 4.585-4.54 0-8.24-3.765-8.24-8.4s3.7-8.4 8.24-8.4c2.58 0 4.307 1.095 5.298 2.045l2.465-2.37C18.251 1.21 15.497 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.185-1.925H12.24z"/>
                  </svg>
                  <span>CONTINUE WITH <strong className="text-[#F59E0B]">GOOGLE</strong></span>
                </div>
                <ChevronRight size={16} className="text-[#F59E0B]" />
              </button>

            </div>

            {/* Guest Form Expandable */}
            <div className="w-full flex flex-col items-center">
              <button 
                onClick={() => setShowGuestForm(!showGuestForm)}
                className="text-gray-400 hover:text-white font-code text-[10px] tracking-wider transition-all cursor-pointer bg-transparent border-none"
              >
                <span>{showGuestForm ? '[ COLLAPSE GUEST ACCESS ]' : '[ ACCESS AS GUEST OPERATOR ]'}</span>
              </button>

              {showGuestForm && (
                <form onSubmit={handleGuestSubmit} className="w-full flex flex-col gap-3 mt-3 pt-3 border-t border-white/10">
                  <input
                    type="text"
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    placeholder="OPERATOR_CALLSIGN"
                    className="w-full bg-black/60 border border-white/10 focus:border-[#06B6D4] text-white font-code text-xs p-3 clip-tactical-badge outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-3 bg-[#F59E0B] text-black font-header font-bold text-xs tracking-wider clip-tactical-btn cursor-pointer border-none flex items-center justify-center gap-2"
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

          </div>
        </div>

        {/* Right Diagnostic Column */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 font-code text-[10px] text-gray-400 text-right items-end">
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[#F59E0B] font-bold tracking-[0.18em] flex items-center gap-1.5">
              <Server size={12} /> BATTLE ENGINE
            </span>
            <div className="w-12 h-[1px] bg-white/10 my-1"></div>
            <span>- SERVER CLUSTER: ASIA-SOUTH-01</span>
            <span>- ENCRYPTION: QUANTUM AES-256</span>
            <span>- LATENCY: 14MS (OPTIMAL)</span>
          </div>
        </div>

      </main>

      {/* FOOTER BAR */}
      <footer className="relative z-10 px-8 py-4 text-[9px] font-code text-gray-400 flex justify-between uppercase border-t border-white/10">
        <span>ENCRYPTION: QUANTUM AES-256</span>
        <span>SERVER CLUSTER: ASIA-SOUTH-01</span>
      </footer>

    </div>
  );
}
