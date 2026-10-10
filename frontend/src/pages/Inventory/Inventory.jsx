import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Eye, 
  LayoutGrid, 
  Shield, 
  Sparkles, 
  Award, 
  Zap, 
  RotateCcw,
  Palette
} from 'lucide-react';
import CommandHeader from '../../components/CommandHeader/CommandHeader';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import ThreeCharacter from '../../components/ThreeCharacter/ThreeCharacter';
import { themeService } from '../../services/themeService';
import './Inventory.css';

export default function Inventory() {
  const navigate = useNavigate();
  const activeTheme = themeService.getCurrentTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const [activeSkin, setActiveSkin] = useState(localStorage.getItem('gaming_live_player_skin') || 'mummy');

  const skinsList = [
    { 
      id: 'mummy', 
      name: 'CYBER WRAP MUMMY OUTFIT', 
      category: 'outfit',
      tier: 'LEGENDARY', 
      color: '#f59e0b', 
      desc: 'The legendary cybernetic bandage wrap set for elite competitive dueling coders.',
      equippedBonus: '+15% XP Multiplier'
    },
    { 
      id: 'glacier', 
      name: 'M416 GLACIER WEAPON FINISH', 
      category: 'weapon',
      tier: 'LEGENDARY', 
      color: '#f59e0b', 
      desc: 'Ice-crystallized code compiler weapon skin with custom elimination broadcast effect.',
      equippedBonus: 'Custom Killfeed Glow'
    },
    { 
      id: 'spetsnaz', 
      name: 'SPETSNAZ TITANIUM LEVEL 3 HELMET', 
      category: 'gear',
      tier: 'EPIC', 
      color: '#38bdf8', 
      desc: 'Heavy titanium armor helmet providing one-time HP penalty deflection.',
      equippedBonus: 'Damage Recoil Shield'
    },
    { 
      id: 'booster', 
      name: '2.5X ALGORITHM XP BOOST CARD', 
      category: 'booster',
      tier: 'RARE', 
      color: '#a3e635', 
      desc: 'Consumable boost card granting x2.5 battle points and MMR multiplier for 24 hours.',
      equippedBonus: 'Active 24h'
    },
    { 
      id: 'neon-katana', 
      name: 'LIME MATRIX MONOFILAMENT BLADE', 
      category: 'weapon',
      tier: 'EPIC', 
      color: '#38bdf8', 
      desc: 'Acid-lime glowing monofilament melee blade with reactive syntax pulses.',
      equippedBonus: '+5 Battle Points/Duel'
    },
    { 
      id: 'cyber-hood', 
      name: 'TACTICAL CYBERNETIC HOOD', 
      category: 'outfit',
      tier: 'RARE', 
      color: '#a3e635', 
      desc: 'Lightweight stealth hood for low-latency coding infiltration.',
      equippedBonus: 'Cosmetic Flair'
    }
  ];

  const selectSkin = (id) => {
    localStorage.setItem('gaming_live_player_skin', id);
    setActiveSkin(id);
  };

  const filteredSkins = activeTab === 'all' 
    ? skinsList 
    : skinsList.filter(s => s.category === activeTab);

  const currentEquippedSkin = skinsList.find(s => s.id === activeSkin) || skinsList[0];

  return (
    <div className="cyber-inventory-viewport">
      {/* Shared Command Header */}
      <CommandHeader onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="inventory-main-grid">
        
        {/* ================= LEFT SIDE: 3D THREE.JS OPERATOR PREVIEW ================= */}
        <section className="inventory-3d-preview-card">
          <div className="preview-top-bar">
            <div className="flex items-center gap-2">
              <Eye size={15} className="text-lime" />
              <span className="font-header font-bold text-sm text-white tracking-wider">
                3D OPERATOR LOCKER
              </span>
            </div>
            <span className="text-[10px] font-mono text-lime px-2 py-0.5 bg-[#a3e635]/10 rounded border border-[#a3e635]/25">
              WEBGL REALTIME
            </span>
          </div>

          <div className="three-character-stage">
            <ThreeCharacter activeTheme={activeTheme} key={activeSkin} />
          </div>

          <div className="equipped-dossier-box">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-lime font-bold">EQUIPPED ITEM:</span>
              <span className="text-[10px] font-mono text-amber">{currentEquippedSkin.equippedBonus}</span>
            </div>
            <h4 className="font-header text-sm font-bold text-white mb-1">{currentEquippedSkin.name}</h4>
            <p className="text-xs text-muted leading-relaxed">{currentEquippedSkin.desc}</p>
          </div>
        </section>

        {/* ================= RIGHT SIDE: COSMETIC ITEMS & SKINS ================= */}
        <section className="inventory-armory-section">
          
          <div className="armory-panel">
            <div className="armory-panel-header">
              <div className="flex items-center gap-2">
                <LayoutGrid size={16} className="text-lime" />
                <h2 className="font-header text-base font-bold text-white tracking-wider">
                  ARMORY SKINS & COSMETICS
                </h2>
              </div>

              {/* Category Filter Tabs */}
              <div className="category-filter-tabs">
                {['all', 'outfit', 'weapon', 'gear', 'booster'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`cat-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="inventory-items-grid custom-scrollbar">
              {filteredSkins.map((skin) => {
                const isEquipped = activeSkin === skin.id;
                return (
                  <div
                    key={skin.id}
                    onClick={() => selectSkin(skin.id)}
                    className={`inventory-item-card ${isEquipped ? 'equipped' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span 
                        className="rarity-badge"
                        style={{ 
                          backgroundColor: `${skin.color}15`, 
                          color: skin.color, 
                          border: `1px solid ${skin.color}40` 
                        }}
                      >
                        {skin.tier}
                      </span>
                      {isEquipped && (
                        <span className="equipped-pill">
                          <Check size={12} />
                          <span>EQUIPPED</span>
                        </span>
                      )}
                    </div>

                    <h3 className="item-name">{skin.name}</h3>
                    <p className="item-desc">{skin.desc}</p>

                    <div className="item-card-footer">
                      <span className="text-[10px] font-mono text-lime">{skin.equippedBonus}</span>
                      <button className="btn-equip-action">
                        {isEquipped ? 'IN USE' : 'EQUIP'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
