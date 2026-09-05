import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Volume2, 
  Cpu, 
  HardDrive, 
  RefreshCw, 
  Layers, 
  ChevronRight, 
  Zap, 
  Award,
  Shield,
  Target,
  Terminal,
  Activity,
  Sliders
} from 'lucide-react';
import CommandHeader from '../../components/CommandHeader/CommandHeader';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import MapMissionsModal from './MapMissionsModal';
import { themeService, THEMES } from '../../services/themeService';
import './ThemeSelector.css';

// LeetCode-style tactical missions dataset per original sector theme
export const MAP_MISSIONS = {
  sanhok: {
    mapName: 'KRONOS PERIMETER',
    sectorCode: 'SEC//01',
    totalMissions: 5,
    solvedMissions: 4,
    levels: [
      {
        levelId: 1,
        title: 'LEVEL 1: RECONNAISSANCE',
        desc: 'Arrays & String Manipulation Protocols',
        badgeColor: '#00F5D4',
        problems: [
          { id: 'contains-duplicate', name: 'Contains Duplicate', category: 'Arrays', difficulty: 'Easy', solved: true },
          { id: 'valid-palindrome', name: 'Valid Palindrome', category: 'Strings', difficulty: 'Easy', solved: true }
        ]
      },
      {
        levelId: 2,
        title: 'LEVEL 2: INFILTRATION',
        desc: 'HashMaps, Recursion & Two-Pointers',
        badgeColor: '#F59E0B',
        problems: [
          { id: '3sum', name: '3Sum', category: 'Two Pointers', difficulty: 'Medium', solved: true },
          { id: 'container-water', name: 'Container With Most Water', category: 'Two Pointers', difficulty: 'Medium', solved: true }
        ]
      },
      {
        levelId: 3,
        title: 'LEVEL 3: EXTRACTION',
        desc: 'Graph Theory & Advanced Algorithms',
        badgeColor: '#EF4444',
        problems: [
          { id: 'word-ladder', name: 'Word Ladder', category: 'Graph Theory', difficulty: 'Hard', solved: false }
        ]
      }
    ]
  },
  miramar: {
    mapName: 'DUSTLINE RUNTIME',
    sectorCode: 'SEC//02',
    totalMissions: 5,
    solvedMissions: 3,
    levels: [
      {
        levelId: 1,
        title: 'LEVEL 1: RECONNAISSANCE',
        desc: 'Greedy & Sorting Algorithms',
        badgeColor: '#00F5D4',
        problems: [
          { id: 'binary-search', name: 'Binary Search', category: 'Binary Search', difficulty: 'Easy', solved: true },
          { id: 'climbing-stairs', name: 'Climbing Stairs', category: 'Dynamic Programming', difficulty: 'Easy', solved: true }
        ]
      },
      {
        levelId: 2,
        title: 'LEVEL 2: INFILTRATION',
        desc: 'Two Pointers & Binary Search Trees',
        badgeColor: '#F59E0B',
        problems: [
          { id: 'search-rotated-array', name: 'Search in Rotated Sorted Array', category: 'Binary Search', difficulty: 'Medium', solved: true },
          { id: 'validate-bst', name: 'Validate Binary Search Tree', category: 'Trees', difficulty: 'Medium', solved: false }
        ]
      },
      {
        levelId: 3,
        title: 'LEVEL 3: EXTRACTION',
        desc: 'Advanced Sorting & Median Computations',
        badgeColor: '#EF4444',
        problems: [
          { id: 'median-two-arrays', name: 'Median of Two Sorted Arrays', category: 'Binary Search', difficulty: 'Hard', solved: false }
        ]
      }
    ]
  },
  vikendi: {
    mapName: 'CRYONIC TERMINUS',
    sectorCode: 'SEC//03',
    totalMissions: 5,
    solvedMissions: 5,
    levels: [
      {
        levelId: 1,
        title: 'LEVEL 1: RECONNAISSANCE',
        desc: 'Trees & Bit Manipulation',
        badgeColor: '#00F5D4',
        problems: [
          { id: 'single-number', name: 'Single Number', category: 'Bit Manipulation', difficulty: 'Easy', solved: true },
          { id: 'invert-binary-tree', name: 'Invert Binary Tree', category: 'Trees', difficulty: 'Easy', solved: true }
        ]
      },
      {
        levelId: 2,
        title: 'LEVEL 2: INFILTRATION',
        desc: 'Heaps & Concurrency Traversals',
        badgeColor: '#F59E0B',
        problems: [
          { id: 'number-of-islands', name: 'Number of Islands', category: 'BFS / DFS', difficulty: 'Medium', solved: true },
          { id: 'course-schedule', name: 'Course Schedule', category: 'Graph', difficulty: 'Medium', solved: true }
        ]
      },
      {
        levelId: 3,
        title: 'LEVEL 3: EXTRACTION',
        desc: 'Sub-Zero Heap & Priority Queue Merge',
        badgeColor: '#EF4444',
        problems: [
          { id: 'merge-k-lists', name: 'Merge k Sorted Lists', category: 'Heap / Linked List', difficulty: 'Hard', solved: true }
        ]
      }
    ]
  },
  cyberpunk: {
    mapName: 'NEO-SHIBUYA MATRIX',
    sectorCode: 'SEC//04',
    totalMissions: 5,
    solvedMissions: 2,
    levels: [
      {
        levelId: 1,
        title: 'LEVEL 1: RECONNAISSANCE',
        desc: 'String Reversals & Array Scans',
        badgeColor: '#00F5D4',
        problems: [
          { id: 'reverse-string', name: 'Reverse String', category: 'Strings', difficulty: 'Easy', solved: true },
          { id: 'fizz-buzz', name: 'Fizz Buzz', category: 'Arrays', difficulty: 'Easy', solved: true }
        ]
      },
      {
        levelId: 2,
        title: 'LEVEL 2: INFILTRATION',
        desc: 'Dynamic Programming & Sliding Windows',
        badgeColor: '#F59E0B',
        problems: [
          { id: 'longest-substring', name: 'Longest Substring Without Repeating Characters', category: 'Sliding Window', difficulty: 'Medium', solved: false },
          { id: 'top-k-frequent', name: 'Top K Frequent Elements', category: 'Heap', difficulty: 'Medium', solved: false }
        ]
      },
      {
        levelId: 3,
        title: 'LEVEL 3: EXTRACTION',
        desc: 'Matrix Traversal & Trapping Rain Water',
        badgeColor: '#EF4444',
        problems: [
          { id: 'trapping-rain-water', name: 'Trapping Rain Water', category: 'Two Pointers', difficulty: 'Hard', solved: false }
        ]
      }
    ]
  },
  erangel: {
    mapName: 'FORTRESS COMMAND',
    sectorCode: 'SEC//05',
    totalMissions: 5,
    solvedMissions: 4,
    levels: [
      {
        levelId: 1,
        title: 'LEVEL 1: RECONNAISSANCE',
        desc: 'Array Hashing & Subsets',
        badgeColor: '#00F5D4',
        problems: [
          { id: 'two-sum', name: 'Two Sum', category: 'Arrays & Hashing', difficulty: 'Easy', solved: true },
          { id: 'valid-anagram', name: 'Valid Anagram', category: 'Strings', difficulty: 'Easy', solved: true }
        ]
      },
      {
        levelId: 2,
        title: 'LEVEL 2: INFILTRATION',
        desc: 'HashMaps, Dynamic Programming, Trees',
        badgeColor: '#F59E0B',
        problems: [
          { id: 'group-anagrams', name: 'Group Anagrams', category: 'HashMaps', difficulty: 'Medium', solved: true },
          { id: 'coin-change', name: 'Coin Change', category: 'Dynamic Programming', difficulty: 'Medium', solved: true }
        ]
      },
      {
        levelId: 3,
        title: 'LEVEL 3: EXTRACTION',
        desc: 'Graph Theory & Priority Queues',
        badgeColor: '#EF4444',
        problems: [
          { id: 'sliding-window-max', name: 'Sliding Window Maximum', category: 'Heap / Priority Queue', difficulty: 'Hard', solved: false }
        ]
      }
    ]
  }
};

export default function ThemeSelector() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ACTIVE DEPLOYMENT SECTORS');
  const [previewTheme, setPreviewTheme] = useState(themeService.getCurrentTheme());
  
  // Tactical Missions & Settings Modals state
  const [isMissionsModalOpen, setIsMissionsModalOpen] = useState(false);
  const [selectedMapForModal, setSelectedMapForModal] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings options state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gridOverlay, setGridOverlay] = useState(true);

  // Tactical sync overlay modal state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);

  // Synthesized Web Audio feedback
  const playBeep = (freq = 800, duration = 0.08, type = 'sine') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  };

  const handleMapCardClick = (theme) => {
    playBeep(700, 0.08, 'sine');
    setPreviewTheme(theme);
  };

  const handleOpenMissionsModal = (e, theme) => {
    e.stopPropagation();
    playBeep(750, 0.08, 'sine');
    setPreviewTheme(theme);
    setSelectedMapForModal(theme);
    setIsMissionsModalOpen(true);
  };

  const handleDeployCode = (problemId, mapThemeId) => {
    playBeep(950, 0.15, 'sine');
    setIsMissionsModalOpen(false);
    navigate(`/arena?problemId=${problemId}&mapTheme=${mapThemeId}`);
  };

  const handleConfirmSelection = () => {
    playBeep(1000, 0.15, 'sine');
    setIsSyncing(true);
    setSyncStep(1);

    setTimeout(() => {
      setSyncStep(2);
      playBeep(750, 0.08, 'sine');
      setTimeout(() => {
        setSyncStep(3);
        playBeep(850, 0.08, 'sine');
        setTimeout(() => {
          themeService.setCurrentTheme(previewTheme.id);
          setIsSyncing(false);
          navigate('/lobby');
        }, 1000);
      }, 800);
    }, 600);
  };

  const filteredThemes = THEMES.filter((theme) => {
    if (activeTab === 'ACTIVE DEPLOYMENT SECTORS') {
      return theme.category === 'ACTIVE DEPLOYMENT SECTORS';
    }
    return theme.category === 'SPECIAL OPERATIONS';
  });

  const currentMapData = MAP_MISSIONS[previewTheme?.id] || { totalMissions: 5, solvedMissions: 0 };
  const solvedPercentage = Math.round((currentMapData.solvedMissions / currentMapData.totalMissions) * 100);

  return (
    <div className="theme-selector-page">
      {/* Universal Command Header */}
      <CommandHeader onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Background Matrix Grid & Scanlines */}
      <div className="theme-grid-matrix-bg"></div>
      {gridOverlay && <div className="theme-scanline-overlay"></div>}

      {/* SUB-HEADER INFOBAR */}
      <div className="sub-header-infobar flex items-center justify-between border-b border-white/10 px-8 py-3 bg-black/40">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse"></span>
          <span className="font-mono text-xs text-[#06B6D4] tracking-widest uppercase">
            TACTICAL SECTOR DEPLOYMENT MATRIX // SYSTEM READY
          </span>
        </div>

        <div className="flex items-center gap-6 text-[10px] font-mono text-gray-400">
          <div className="flex items-center gap-1.5">
            <Cpu size={13} className="text-[#06B6D4]" />
            <span>SYNC STATUS: 100%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive size={13} className="text-[#F59E0B]" />
            <span>TOTAL SECTORS: {THEMES.length}</span>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT GRID */}
      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-10 gap-6 p-8 flex-1 items-stretch max-w-[1600px] mx-auto w-full">
        
        {/* ================= LEFT SECTION (7 COLS): SECTOR CARDS GRID ================= */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* CATEGORIES TABS */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setActiveTab('ACTIVE DEPLOYMENT SECTORS');
                  playBeep(650, 0.06, 'sine');
                }}
                className={`sector-tab-btn clip-tactical-badge ${
                  activeTab === 'ACTIVE DEPLOYMENT SECTORS' ? 'active-tab' : ''
                }`}
              >
                ACTIVE DEPLOYMENT SECTORS
              </button>
              <button 
                onClick={() => {
                  setActiveTab('SPECIAL OPERATIONS');
                  playBeep(650, 0.06, 'sine');
                }}
                className={`sector-tab-btn clip-tactical-badge ${
                  activeTab === 'SPECIAL OPERATIONS' ? 'active-tab' : ''
                }`}
              >
                SPECIAL OPERATIONS
              </button>
            </div>
            
            <div className="font-mono text-[9px] text-gray-400 bg-black/60 px-3 py-1 border border-white/10 clip-tactical-badge">
              SEC.SERVER: ASIA_SOUTH_01
            </div>
          </div>

          {/* GRID OF SECTOR CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
            {filteredThemes.map((theme) => {
              const isSelectedPreview = previewTheme.id === theme.id;
              const isActiveDeployment = themeService.getCurrentTheme().id === theme.id;
              const mapInfo = MAP_MISSIONS[theme.id] || { totalMissions: 5, solvedMissions: 0 };
              const cardProgressPct = Math.round((mapInfo.solvedMissions / mapInfo.totalMissions) * 100);

              return (
                <div 
                  key={theme.id}
                  onClick={() => handleMapCardClick(theme)}
                  className={`sector-card-item clip-tactical-card relative cursor-pointer ${
                    isSelectedPreview 
                      ? 'border-[#F59E0B] shadow-[0_0_20px_rgba(245,158,11,0.25)]' 
                      : 'border-white/10 hover:border-[#06B6D4]'
                  }`}
                >
                  {/* Active Deployment Badge */}
                  {isActiveDeployment && (
                    <div className="absolute top-2.5 left-2.5 z-20 bg-[#06B6D4] text-black font-header font-bold text-[9px] tracking-wider px-2 py-0.5 clip-tactical-badge flex items-center gap-1 shadow-md">
                      <Check size={10} strokeWidth={3} />
                      <span>ACTIVE DEPLOYMENT</span>
                    </div>
                  )}

                  {/* Sector Identifier Badge */}
                  <div className="absolute top-2.5 right-2.5 z-20 bg-black/90 text-[9px] font-mono text-[#F59E0B] font-bold px-2 py-0.5 border border-[#F59E0B]/30 clip-tactical-badge">
                    {theme.code || 'SEC//01'}
                  </div>

                  {/* Card Thumbnail Image */}
                  <div className="card-thumb-container relative h-36 overflow-hidden">
                    <img 
                      src={theme.image} 
                      alt={theme.name} 
                      className="w-full h-full object-cover card-image-scale" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-[#080B11]/40 to-transparent"></div>
                    
                    <div className="absolute bottom-2.5 left-3">
                      <span className="font-mono text-[9px] text-[#06B6D4] font-bold tracking-widest block uppercase">
                        {theme.domain || 'ALGORITHMIC DOMAIN'}
                      </span>
                      <h3 className="font-header text-lg text-white font-extrabold tracking-wider">{theme.name}</h3>
                    </div>
                  </div>

                  {/* Details & Mission Progress */}
                  <div className="p-3.5 bg-black/60 flex flex-col gap-3">
                    <p className="text-[10px] text-gray-400 font-mono line-clamp-2 h-7 leading-relaxed">
                      {theme.desc}
                    </p>

                    {/* Micro-Progress Bar */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between font-mono text-[9px]">
                        <span className="text-gray-400">PROTOCOLS SECURED</span>
                        <span className="text-[#F59E0B] font-bold">{mapInfo.solvedMissions}/{mapInfo.totalMissions} ({cardProgressPct}%)</span>
                      </div>
                      <div className="micro-progress-track">
                        <div 
                          className="micro-progress-fill"
                          style={{ width: `${cardProgressPct}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Button: ENTER MISSIONS */}
                    <button
                      onClick={(e) => handleOpenMissionsModal(e, theme)}
                      className="enter-missions-btn flex items-center justify-between px-3 py-2 text-gray-300 font-header text-[11px] font-bold tracking-wider clip-tactical-badge cursor-pointer"
                    >
                      <span>ENTER MISSIONS</span>
                      <ChevronRight size={14} className="text-[#06B6D4]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Engine Status Bar */}
          <div className="glass-panel-graphite p-3 clip-tactical-card flex items-center justify-between text-[10px] font-mono text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping"></span>
              <span>COMPILER ARENA MATRIX // OPERATIONAL</span>
            </div>
            <div>
              <span className="text-[#F59E0B]">DEPLOYMENT STATUS: READY</span>
            </div>
          </div>
        </section>

        {/* ================= RIGHT SECTION (3 COLS): SECTOR TELEMETRY & INTEL ================= */}
        <section className="lg:col-span-3 flex flex-col justify-between">
          <div className="glass-panel-graphite p-5 h-full flex flex-col justify-between clip-tactical-card relative">
            <div className="absolute top-0 left-6 w-12 h-[2px] bg-[#F59E0B]"></div>
            
            {/* Top Dossier Header */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <Layers className="text-[#F59E0B] w-5 h-5" />
                <h2 className="font-header text-base tracking-[0.15em] text-white font-bold">SECTOR TELEMETRY & INTEL</h2>
              </div>

              {/* Sector Thumbnail Preview */}
              <div className="relative group border border-white/10 overflow-hidden bg-black/60 clip-tactical-card mb-4">
                <div className="h-32 w-full relative">
                  <img 
                    src={previewTheme.image} 
                    alt={previewTheme.name}
                    className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-[#080B11]/40 to-transparent"></div>
                </div>

                <div className="absolute bottom-2.5 left-4">
                  <span className="block font-mono text-[8px] text-[#F59E0B] font-bold tracking-widest">{previewTheme.code} // SECTOR PREVIEW</span>
                  <h3 className="font-header text-lg text-white font-extrabold tracking-wider">{previewTheme.name}</h3>
                </div>
              </div>

              {/* Telemetry Specs Table */}
              <div className="flex flex-col gap-2.5 text-[10px] font-mono text-gray-400 mb-5 bg-black/50 p-3.5 border border-white/10 clip-tactical-badge">
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">INTERFACE PRIMARY ACCENT</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: previewTheme.accentColor }}></span>
                    <span className="font-semibold" style={{ color: previewTheme.accentColor }}>
                      {previewTheme.accentColor.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">SECONDARY PALETTE</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: previewTheme.secondaryColor }}></span>
                    <span className="font-semibold" style={{ color: previewTheme.secondaryColor }}>
                      {previewTheme.secondaryColor.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">EDITOR MATRIX BG</span>
                  <span className="font-semibold text-white">{previewTheme.editorBg.toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">TOTAL MISSIONS</span>
                  <span className="font-semibold text-[#F59E0B]">{currentMapData.totalMissions} MISSIONS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">PROGRESS RATIO</span>
                  <span className="font-semibold text-[#06B6D4]">
                    {currentMapData.solvedMissions} / {currentMapData.totalMissions} ({solvedPercentage}%)
                  </span>
                </div>
              </div>

              {/* Dossier Text */}
              <div className="mb-4">
                <h4 className="font-header text-[11px] text-[#06B6D4] tracking-wider mb-1.5 font-bold">MISSION BRIEFING DOSSIER</h4>
                <p className="text-[10px] text-gray-400 font-mono leading-relaxed bg-black/60 border border-white/10 p-3 clip-tactical-badge h-20 overflow-y-auto custom-scrollbar">
                  {previewTheme.desc}
                </p>
              </div>

              {/* System Config Toggles */}
              <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
                <h4 className="font-header text-[11px] text-gray-400 tracking-wider mb-1 font-bold">TACTICAL SYSTEM CONFIG</h4>
                
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={soundEnabled} 
                    onChange={(e) => {
                      setSoundEnabled(e.target.checked);
                      playBeep(450, 0.05, 'sine');
                    }}
                    className="accent-[#F59E0B] rounded border-gray-700 bg-black w-3.5 h-3.5"
                  />
                  <span className="font-mono text-[9px] text-gray-400">AUDIO FEEDBACK SYNTHESIS</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={gridOverlay} 
                    onChange={(e) => {
                      setGridOverlay(e.target.checked);
                      playBeep(450, 0.05, 'sine');
                    }}
                    className="accent-[#F59E0B] rounded border-gray-700 bg-black w-3.5 h-3.5"
                  />
                  <span className="font-mono text-[9px] text-gray-400">HUD SCANLINE GRAPHICS</span>
                </label>
              </div>
            </div>

            {/* Confirm & Apply Theme CTA */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <button
                onClick={handleConfirmSelection}
                className="w-full precision-confirm-btn clip-tactical-btn"
              >
                <span>CONFIRM & APPLY THEME</span>
              </button>
            </div>

          </div>
        </section>

      </main>

      {/* TACTICAL MISSIONS MODAL */}
      <MapMissionsModal
        isOpen={isMissionsModalOpen}
        onClose={() => setIsMissionsModalOpen(false)}
        theme={selectedMapForModal}
        mapData={MAP_MISSIONS[selectedMapForModal?.id]}
        onDeploy={handleDeployCode}
      />

      {/* SETTINGS MODAL */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* SYNCING ENVIRONMENT MODAL */}
      {isSyncing && (
        <div className="sync-modal-overlay">
          <div className="sync-modal-container p-8 text-center max-w-md w-full clip-tactical-card relative">
            <div className="flex flex-col items-center justify-center gap-5">
              <RefreshCw className="animate-spin text-[#06B6D4] w-12 h-12 mb-1" />
              
              <div>
                <h3 className="font-header text-xl text-white tracking-widest mb-1 font-bold">SYNCING SECTOR PROTOCOLS</h3>
                <span className="font-mono text-[9px] text-[#F59E0B] tracking-[0.2em] font-bold">TACTICAL ENVIRONMENT RELOAD ACTIVE</span>
              </div>

              {/* Terminal Logs */}
              <div className="font-mono text-[10px] text-gray-400 text-left bg-black/70 p-4 border border-white/10 w-full h-32 flex flex-col justify-start gap-1 clip-tactical-badge">
                <p className="text-[#06B6D4] font-bold">&gt; INITIALIZING SECTOR SYNC: {previewTheme.code || 'SEC//01'}</p>
                {syncStep >= 1 && <p className="text-gray-400">&gt; Allocating grid buffer nodes... DONE</p>}
                {syncStep >= 2 && <p className="text-gray-400">&gt; Applying color parameters... DONE</p>}
                {syncStep >= 3 && <p className="text-emerald-400 font-bold">&gt; COMPILER SYNC COMPLETE. REDIRECTING...</p>}
              </div>

              <div className="font-header text-[10px] text-[#06B6D4] tracking-widest">
                DO NOT DISCONNECT FROM ARENA NODE
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
