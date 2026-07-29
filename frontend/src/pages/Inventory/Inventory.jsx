import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Award, Eye, LayoutGrid, Palette, ShieldAlert } from 'lucide-react';
import GamerHeader from '../../components/GamerHeader/GamerHeader';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import ThreeCharacter from '../../components/ThreeCharacter/ThreeCharacter';
import { themeService } from '../../services/themeService';
import './Inventory.css';

export default function Inventory() {
  const navigate = useNavigate();
  const activeTheme = themeService.getCurrentTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Read saved customize assets
  const [activeSkin, setActiveSkin] = useState(localStorage.getItem('gaming_live_player_skin') || 'mummy');
  const [activeThemeName, setActiveThemeName] = useState(localStorage.getItem('gaming_live_editor_theme') || 'm416');
  const [activeEmote, setActiveEmote] = useState(localStorage.getItem('gaming_live_victory_emote') || 'spin');

  const skinsList = [
    { id: 'mummy', name: 'WHITE MUMMY SET', tier: 'MYTHIC', color: '#facc15', desc: 'The legendary off-white bandage wrap set. A classic standard-issue for elite competitive coders.' },
    { id: 'samurai', name: 'CYBER SAMURAI', tier: 'LEGENDARY', color: '#ff007f', desc: 'Dark carbon-plating wrapped in high-voltage magenta synthetic straps. Bypasses security with style.' },
    { id: 'recon', name: 'TACTICAL RECON', tier: 'EPIC', color: '#a855f7', desc: 'Olive-drab jungle camouflage threads paired with military tactical plating for maximum stealth.' }
  ];

  const editorThemes = [
    { id: 'm416', name: 'M416 NEON ACCENT', desc: 'Sleek dark editor layout embedded with glowing cyan syntax highlighting lines.' },
    { id: 'awm', name: 'AWM DARK SNIPER', desc: 'A high-contrast deep forest green theme crafted for precise syntax visibility.' },
    { id: 'kar98', name: 'KAR98 GOLD CODES', desc: 'Warm desert sand yellow hues featuring antique gold highlight tags.' }
  ];

  const emotesList = [
    { id: 'spin', name: 'GLACIER EMOTE SPIN', desc: 'The 3D model performs a rapid orbital spin standing atop the circular pedestal.' },
    { id: 'salute', name: 'VICTORY MILITARY SALUTE', desc: 'A formal tactical military salute indicating code deployment compliance.' }
  ];

  const selectSkin = (id) => {
    localStorage.setItem('gaming_live_player_skin', id);
    setActiveSkin(id);
  };

  const selectEditorTheme = (id) => {
    localStorage.setItem('gaming_live_editor_theme', id);
    setActiveThemeName(id);
  };

  const selectEmote = (id) => {
    localStorage.setItem('gaming_live_victory_emote', id);
    setActiveEmote(id);
  };

  return (
    <div className="gaming-dashboard-page hud-grid hud-scanline">
      
      {/* Top Header */}
      <GamerHeader 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        username="GHOST_CODER" 
        currentXP={2840} 
        maxXP={5000} 
      />

      {/* Navigation Row */}
      <div className="lobby-navigation-row pb-2">
        <button 
          onClick={() => navigate('/lobby')} 
          className="exit-lobby-btn font-military"
        >
          <ArrowLeft size={16} />
          <span>RETURN TO LOBBY</span>
        </button>
        <span className="lobby-breadcrumbs font-mono-tactical">
          SYSTEM_CONSOLE / PLAYER_INVENTORY / LOCKER_ROOM
        </span>
      </div>

      {/* Main Grid Locker Content */}
      <main className="inventory-main-grid p-6 max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20 md:pb-6">
        
        {/* ================= LEFT SIDE: WebGL LIVE PREVIEW (5 COLS) ================= */}
        <section className="lg:col-span-5 bg-iron-gray border border-[#2d3142] p-5 clip-industrial-card relative flex flex-col justify-between items-center min-h-[500px]">
          <div className="absolute top-0 right-10 w-12 h-[2px]" style={{ backgroundColor: activeTheme.accentColor }}></div>
          
          <div className="w-full border-b border-[#2d3142]/60 pb-3 flex justify-between items-center">
            <span className="font-military text-sm text-white tracking-widest flex items-center gap-1.5">
              <Eye size={14} className="text-[#00ffcc]" />
              SQUAD STAND PREVIEW
            </span>
            <span className="text-[9px] font-mono text-gray-500 uppercase">3D HUD RENDERER v2.0</span>
          </div>

          {/* WebGL Avatar pedestal container */}
          <div className="w-full flex-1 flex flex-col justify-center items-center relative py-4">
            <div className="absolute w-64 h-64 rounded-full border border-[#00ffcc]/5 animate-pulse flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border border-[#00ffcc]/10"></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-[320px]">
              {/* Force rendering a re-constructed ThreeCharacter reading dynamic skin state */}
              <ThreeCharacter activeTheme={activeTheme} key={activeSkin} />
              
              {/* Pedestal Deck */}
              <div className="w-[300px] h-8 bg-gradient-to-b from-[#1b1c28] to-[#0c0d12] border-t border-b border-[#2d3142] clip-hero-stand flex items-center justify-center relative -mt-3 shadow-lg">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#00ffcc]/40"></div>
                <span className="font-military text-[10px] text-[#00ffcc] tracking-[0.2em] font-bold">
                  {skinsList.find(s => s.id === activeSkin)?.name}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full bg-black/40 border border-gray-900 p-3 text-[10px] font-mono text-gray-400">
            <span className="text-[#00ffcc] font-bold block mb-1 uppercase">GEAR STATUS DOSSIER:</span>
            {skinsList.find(s => s.id === activeSkin)?.desc}
          </div>

        </section>

        {/* ================= RIGHT SIDE: CUSTOMIZATION TABS (7 COLS) ================= */}
        <section className="lg:col-span-7 flex flex-col gap-5">
          
          {/* SKIN SELECTION CARD */}
          <div className="bg-iron-gray border border-[#2d3142] p-5 clip-industrial-card flex flex-col gap-4 relative">
            <div className="absolute top-0 left-10 w-12 h-[2px] bg-yellow-400"></div>

            <div className="border-b border-[#2d3142]/60 pb-2.5 flex items-center gap-2">
              <LayoutGrid className="text-yellow-400 w-5 h-5" />
              <h2 className="font-military text-lg text-white tracking-widest">CHARACTER SKIN CONFIG</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {skinsList.map((skin) => (
                <div
                  key={skin.id}
                  onClick={() => selectSkin(skin.id)}
                  className={`p-4 bg-black/45 border relative cursor-pointer clip-steel-sm transition-all duration-200 ${
                    activeSkin === skin.id 
                      ? 'border-[#00ffcc] shadow-[0_0_12px_rgba(0,255,204,0.15)]' 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span 
                      className="font-military text-[9px] px-2 py-0.5 rounded font-black tracking-widest"
                      style={{ backgroundColor: `${skin.color}20`, color: skin.color, border: `1px solid ${skin.color}40` }}
                    >
                      {skin.tier}
                    </span>
                    {activeSkin === skin.id && <Check size={14} className="text-[#00ffcc]" />}
                  </div>
                  <h3 className="font-military text-sm font-bold text-white tracking-wide">{skin.name}</h3>
                  <span className="text-[9px] font-mono text-gray-500 block mt-2">COSTUME SUITE</span>
                </div>
              ))}
            </div>
          </div>

          {/* THEMES & EMOTES SECTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Editor Themes Locker */}
            <div className="bg-iron-gray border border-[#2d3142] p-5 clip-industrial-card flex flex-col gap-3">
              <div className="border-b border-[#2d3142]/60 pb-2 flex items-center gap-1.5">
                <Palette className="text-[#00ffcc] w-4.5 h-4.5" />
                <h3 className="font-military text-sm text-white tracking-widest">EDITOR SYNTAX THEMES</h3>
              </div>

              <div className="flex flex-col gap-2.5">
                {editorThemes.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => selectEditorTheme(theme.id)}
                    className={`p-3 bg-black/40 border cursor-pointer clip-steel-sm flex items-center justify-between transition-colors ${
                      activeThemeName === theme.id 
                        ? 'border-[#00ffcc] bg-black/60' 
                        : 'border-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <h4 className="font-military text-xs text-white tracking-wide">{theme.name}</h4>
                      <p className="text-[8.5px] font-mono text-gray-500 mt-1">{theme.desc}</p>
                    </div>
                    {activeThemeName === theme.id && <Check size={12} className="text-[#00ffcc] flex-shrink-0 ml-2" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Victory Emotes Locker */}
            <div className="bg-iron-gray border border-[#2d3142] p-5 clip-industrial-card flex flex-col gap-3">
              <div className="border-b border-[#2d3142]/60 pb-2 flex items-center gap-1.5">
                <Award className="text-[#00ffcc] w-4.5 h-4.5" />
                <h3 className="font-military text-sm text-white tracking-widest">VICTORY EMOTES</h3>
              </div>

              <div className="flex flex-col gap-2.5">
                {emotesList.map((emote) => (
                  <div
                    key={emote.id}
                    onClick={() => selectEmote(emote.id)}
                    className={`p-3 bg-black/40 border cursor-pointer clip-steel-sm flex items-center justify-between transition-colors ${
                      activeEmote === emote.id 
                        ? 'border-[#00ffcc] bg-black/60' 
                        : 'border-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <h4 className="font-military text-xs text-white tracking-wide">{emote.name}</h4>
                      <p className="text-[8.5px] font-mono text-gray-500 mt-1">{emote.desc}</p>
                    </div>
                    {activeEmote === emote.id && <Check size={12} className="text-[#00ffcc] flex-shrink-0 ml-2" />}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

    </div>
  );
}
