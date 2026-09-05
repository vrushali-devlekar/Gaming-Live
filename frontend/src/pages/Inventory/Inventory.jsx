import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Award, Eye, LayoutGrid, Palette, Shield } from 'lucide-react';
import CommandHeader from '../../components/CommandHeader/CommandHeader';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import ThreeCharacter from '../../components/ThreeCharacter/ThreeCharacter';
import { themeService } from '../../services/themeService';
import './Inventory.css';

export default function Inventory() {
  const navigate = useNavigate();
  const activeTheme = themeService.getCurrentTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [activeSkin, setActiveSkin] = useState(localStorage.getItem('gaming_live_player_skin') || 'mummy');

  const skinsList = [
    { id: 'mummy', name: 'WHITE MUMMY OUTFIT', tier: 'CONQUEROR LEGENDARY', color: '#F59E0B', desc: 'The legendary off-white bandage wrap set for elite competitive coders.' },
    { id: 'glacier', name: 'M416 GLACIER WEAPON SKIN', tier: 'CONQUEROR LEGENDARY', color: '#F59E0B', desc: 'Ice-crystallized M416 skin with custom elimination broadcast effect.' },
    { id: 'spetsnaz', name: 'SPETSNAZ LEVEL 3 HELMET', tier: 'RARE', color: '#06B6D4', desc: 'Titanium armor helmet with dark visor protection.' },
    { id: 'booster', name: '2.5X ALGORITHM XP BOOST', tier: 'COMMON', color: '#64748B', desc: 'Consumable boost card granting x2.5 XP multiplier for 24 hours.' }
  ];

  const selectSkin = (id) => {
    localStorage.setItem('gaming_live_player_skin', id);
    setActiveSkin(id);
  };

  return (
    <div className="inventory-locker-viewport">
      {/* Shared Command Header */}
      <CommandHeader onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Locker Grid */}
      <main className="inventory-main-grid">
        
        {/* Left Side: 3D Render Preview */}
        <section className="glass-panel-graphite p-5 clip-tactical-card flex flex-col justify-between items-center relative">
          <div className="w-full border-b border-white/10 pb-3 flex justify-between items-center">
            <span className="font-header text-sm text-white font-bold tracking-wider flex items-center gap-2">
              <Eye size={14} className="text-[#06B6D4]" />
              3D OPERATOR LOCKER
            </span>
            <span className="text-[9px] font-code text-gray-400">3D HUD RENDERER</span>
          </div>

          <div className="w-full flex-1 flex flex-col justify-center items-center relative my-4">
            <div className="w-full max-w-[280px]">
              <ThreeCharacter activeTheme={activeTheme} key={activeSkin} />
            </div>
          </div>

          <div className="w-full bg-black/60 border border-white/10 p-3 clip-tactical-badge font-code text-[10px] text-gray-400">
            <span className="text-[#F59E0B] font-bold block mb-1">EQUIPPED LOCKER DOSSIER:</span>
            {skinsList.find(s => s.id === activeSkin)?.desc}
          </div>
        </section>

        {/* Right Side: Locker Grid Cards */}
        <section className="flex flex-col gap-4 min-h-0 overflow-y-auto custom-scrollbar pr-1">
          <div className="glass-panel-graphite p-5 clip-tactical-card">
            <h2 className="font-header text-sm font-bold text-white tracking-[0.15em] border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
              <LayoutGrid size={16} className="text-[#F59E0B]" />
              TACTICAL WEAPON SKINS & BOOSTERS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skinsList.map((skin) => (
                <div
                  key={skin.id}
                  onClick={() => selectSkin(skin.id)}
                  className={`p-4 bg-black/50 border relative cursor-pointer clip-tactical-card transition-all ${
                    activeSkin === skin.id 
                      ? 'border-[#F59E0B] shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                      : 'border-white/10 hover:border-[#06B6D4]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span 
                      className="font-code text-[9px] px-2 py-0.5 font-bold tracking-wider clip-tactical-badge"
                      style={{ backgroundColor: `${skin.color}15`, color: skin.color, border: `1px solid ${skin.color}40` }}
                    >
                      {skin.tier}
                    </span>
                    {activeSkin === skin.id && <Check size={15} className="text-[#F59E0B]" />}
                  </div>

                  <h3 className="font-header text-sm font-bold text-white tracking-wide mt-1">{skin.name}</h3>
                  <p className="text-[9.5px] font-code text-gray-400 mt-2 leading-relaxed">{skin.desc}</p>
                </div>
              ))}
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
