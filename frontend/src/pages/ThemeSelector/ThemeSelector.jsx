import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Check, Volume2, ShieldAlert, Shield, Cpu, HardDrive, RefreshCw, Layers } from 'lucide-react';
import { themeService, THEMES } from '../../services/themeService';
import './ThemeSelector.css';

export default function ThemeSelector() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('classic'); // 'classic' or 'special'
  const [previewTheme, setPreviewTheme] = useState(themeService.getCurrentTheme());
  const [downloadedList, setDownloadedList] = useState(themeService.getDownloadedThemes());
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState('0.0 MB/s');
  
  // Settings options (simulated state)
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gridOverlay, setGridOverlay] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  // Tactical sync overlay modal state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);

  // Play a soft gaming beep sound using Web Audio API
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
    } catch (e) {
      console.warn("Web Audio API not supported/blocked by browser policies");
    }
  };

  // Simulate download speed fluctuations
  useEffect(() => {
    let speedInterval;
    if (downloadingId) {
      speedInterval = setInterval(() => {
        const speed = (Math.random() * 6 + 4).toFixed(1);
        setDownloadSpeed(`${speed} MB/s`);
      }, 500);
    } else {
      setDownloadSpeed('0.0 MB/s');
    }
    return () => clearInterval(speedInterval);
  }, [downloadingId]);

  // Handle Download trigger
  const handleDownload = (e, themeId) => {
    e.stopPropagation();
    if (downloadingId) return;

    playBeep(600, 0.15, 'triangle');
    setDownloadingId(themeId);
    setDownloadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          themeService.downloadTheme(themeId);
          setDownloadedList(themeService.getDownloadedThemes());
          setDownloadingId(null);
          playBeep(900, 0.25, 'sine');
          // Auto-select downloaded theme
          const downloadedTheme = THEMES.find(t => t.id === themeId);
          if (downloadedTheme) {
            setPreviewTheme(downloadedTheme);
          }
        }, 400);
      }
      setDownloadProgress(progress);
    }, 100);
  };

  const selectThemeToPreview = (theme) => {
    playBeep(700, 0.06, 'sine');
    // Only allow selecting preview
    setPreviewTheme(theme);
  };

  const handleConfirmSelection = () => {
    // If current preview is not downloaded, we shouldn't confirm
    if (!downloadedList.includes(previewTheme.id)) {
      playBeep(350, 0.2, 'sawtooth');
      return;
    }

    playBeep(1000, 0.2, 'sine');
    setIsSyncing(true);
    setSyncStep(1);

    // Simulated system logs sync sequences
    setTimeout(() => {
      setSyncStep(2);
      playBeep(750, 0.08, 'sine');
      setTimeout(() => {
        setSyncStep(3);
        playBeep(850, 0.08, 'sine');
        setTimeout(() => {
          // Commit theme update
          themeService.setCurrentTheme(previewTheme.id);
          setIsSyncing(false);
          navigate('/lobby');
        }, 1200);
      }, 1000);
    }, 800);
  };

  // Filter themes based on Category
  const filteredThemes = THEMES.filter((theme) => {
    if (activeTab === 'classic') {
      return theme.category === 'CLASSIC THEMES';
    }
    return theme.category === 'SPECIAL OPERATIONS';
  });

  return (
    <div className="theme-selector-page">
      {/* Background HUD Matrix styling */}
      <div className="theme-grid-matrix-bg"></div>
      <div className="theme-scanline-overlay"></div>

      {/* TACTICAL BAR HEADER */}
      <header className="theme-header relative z-10 flex items-center justify-between border-b border-[#2d3142] px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              playBeep(500, 0.1, 'sine');
              navigate('/lobby');
            }}
            className="back-btn flex items-center justify-center text-gray-400 hover:text-white border border-[#2d3142] hover:border-cyan-400/40 p-2 rounded transition-all clip-industrial-card cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="font-mono text-[9px] text-cyan-400 tracking-[0.25em]">CODE ARENA MODULE V4.2</span>
            </div>
            <h1 className="font-military text-2xl tracking-wider text-white">ARENA MAP & THEME SELECTOR</h1>
          </div>
        </div>

        {/* Global info indicators */}
        <div className="flex items-center gap-6 text-[10px] font-mono text-gray-500">
          <div className="flex items-center gap-1.5">
            <Cpu size={12} className="text-cyan-500" />
            <span>SYNC LEVEL: 100%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive size={12} className="text-yellow-500" />
            <span>CACHED THEMES: {downloadedList.length} / {THEMES.length}</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="theme-main relative z-10 grid grid-cols-1 lg:grid-cols-10 gap-6 p-6 flex-1 items-stretch">
        
        {/* ================= LEFT SECTION (7 COLLS): SELECTION PANEL ================= */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* BGMI TABS FOR CATEGORIES */}
          <div className="flex items-center justify-between border-b border-[#2d3142]/60 pb-1">
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setActiveTab('classic');
                  playBeep(650, 0.06, 'sine');
                }}
                className={`tab-btn font-military text-sm px-6 py-2 transition-all ${
                  activeTab === 'classic' 
                    ? 'active-tab text-[#FACC15] border-b-2 border-[#FACC15]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                CLASSIC MAP THEMES
              </button>
              <button 
                onClick={() => {
                  setActiveTab('special');
                  playBeep(650, 0.06, 'sine');
                }}
                className={`tab-btn font-military text-sm px-6 py-2 transition-all ${
                  activeTab === 'special' 
                    ? 'active-tab text-[#FACC15] border-b-2 border-[#FACC15]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                SPECIAL OPERATIONS
              </button>
            </div>
            
            <div className="font-mono text-[9px] text-gray-500 bg-black/30 px-3 py-1 border border-gray-900">
              DESCENT AREA CODE: TOKYO_SERVER_50
            </div>
          </div>

          {/* GRID OF THEME CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-y-auto max-h-[calc(100vh-220px)] pr-2 custom-scrollbar">
            {filteredThemes.map((theme) => {
              const isDownloaded = downloadedList.includes(theme.id);
              const isDownloading = downloadingId === theme.id;
              const isSelectedPreview = previewTheme.id === theme.id;
              const isActive = themeService.getCurrentTheme().id === theme.id;

              return (
                <div 
                  key={theme.id}
                  onClick={() => selectThemeToPreview(theme)}
                  className={`theme-card clip-industrial-card relative cursor-pointer bg-brushed-steel border transition-all duration-300 ${
                    isSelectedPreview 
                      ? 'border-[#FACC15] shadow-[0_0_15px_rgba(250,204,21,0.25)]' 
                      : 'border-[#2d3142] hover:border-gray-500'
                  }`}
                >
                  {/* Active Indicator Pin */}
                  {isActive && (
                    <div className="absolute top-2 left-2 z-20 bg-green-500 text-black font-military font-bold text-[9px] px-2 py-0.5 rounded flex items-center gap-1 shadow-md">
                      <Check size={8} strokeWidth={4} />
                      <span>IN USE</span>
                    </div>
                  )}

                  {/* Size metadata */}
                  <div className="absolute top-2 right-2 z-20 bg-black/85 text-[9px] font-mono text-gray-400 px-1.5 py-0.5 border border-gray-800">
                    {theme.size}
                  </div>

                  {/* Card Thumbnail Image */}
                  <div className="card-thumb-container relative h-32 overflow-hidden border-b border-[#2d3142]/60">
                    <img 
                      src={theme.image} 
                      alt={theme.name} 
                      className="w-full h-full object-cover transition-transform duration-500 card-image-scale" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent"></div>
                    <div className="absolute bottom-2 left-3">
                      <span className="font-mono text-[9px] text-[#FACC15] font-bold tracking-widest block uppercase">
                        {theme.category.split(' ')[0]}
                      </span>
                      <h3 className="font-military text-lg text-white leading-none tracking-wide">{theme.name}</h3>
                    </div>
                  </div>

                  {/* Details and Actions */}
                  <div className="p-3 bg-black/45 flex flex-col gap-2">
                    <p className="text-[10px] text-gray-400 font-mono line-clamp-2 h-7 leading-snug">
                      {theme.desc}
                    </p>

                    <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-900/60">
                      <span className="text-[9px] font-mono text-gray-500">TACTICAL DEPLOY</span>
                      
                      {isDownloaded ? (
                        <div className="flex items-center gap-1 text-[10px] font-military text-[#FACC15]">
                          <Check size={10} strokeWidth={3} />
                          <span>DOWNLOADED</span>
                        </div>
                      ) : isDownloading ? (
                        <div className="w-full flex flex-col gap-1 items-stretch">
                          <div className="flex justify-between text-[9px] font-mono text-cyan-400">
                            <span>DOWNLOADING...</span>
                            <span>{downloadProgress}%</span>
                          </div>
                          <div className="w-full h-1 bg-gray-950 rounded-sm overflow-hidden flex">
                            <div className="h-full bg-cyan-400 transition-all duration-100" style={{ width: `${downloadProgress}%` }}></div>
                          </div>
                          <span className="text-[8px] font-mono text-right text-gray-600 block">{downloadSpeed}</span>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleDownload(e, theme.id)}
                          className="download-btn flex items-center gap-1 text-[10px] font-military bg-[#2d3142] hover:bg-cyan-500 hover:text-black text-gray-300 px-3 py-1 border border-transparent rounded transition-all cursor-pointer select-none"
                        >
                          <Download size={11} />
                          <span>DOWNLOAD</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats bar */}
          <div className="bg-[#0f1016] border border-[#2d3142] p-3 clip-industrial-card flex items-center justify-between text-[10px] font-mono text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              <span>NETWORK STATUS: EXCELLENT LATENCY (12ms)</span>
            </div>
            <div>
              <span>ALLOCATED MEMORY SPACE: 104 MB</span>
            </div>
          </div>
        </section>

        {/* ================= RIGHT SECTION (3 COLLS): DETAILS PREVIEW ================= */}
        <section className="lg:col-span-3 flex flex-col justify-between">
          <div className="bg-iron-gray border border-[#2d3142] p-5 h-full flex flex-col justify-between clip-industrial-card relative">
            <div className="absolute top-0 left-6 w-12 h-[2px] bg-[#FACC15]"></div>
            
            {/* Top Details Header */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-[#2d3142]/60 pb-3">
                <Layers className="text-[#FACC15] w-5 h-5" />
                <h2 className="font-military text-lg tracking-wider text-white">THEME SPECS & INTEL</h2>
              </div>

              {/* Theme visual representation mockup */}
              <div className="relative group border border-[#2d3142] overflow-hidden bg-black/45 clip-industrial-card mb-4">
                <div className="h-32 w-full relative">
                  <img 
                    src={previewTheme.image} 
                    alt={previewTheme.name}
                    className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent"></div>
                  
                  {/* Glowing Grid layer */}
                  <div 
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{ 
                      backgroundImage: `linear-gradient(to right, ${previewTheme.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${previewTheme.gridColor} 1px, transparent 1px)`,
                      backgroundSize: '12px 12px'
                    }}
                  ></div>
                </div>

                <div className="absolute bottom-2 left-4">
                  <span className="block font-mono text-[8px] text-[#FACC15] font-bold tracking-widest">MAP PREVIEW</span>
                  <h3 className="font-military text-lg text-white tracking-wide">{previewTheme.name}</h3>
                </div>
              </div>

              {/* Details table */}
              <div className="flex flex-col gap-2.5 text-[10px] font-mono text-gray-400 mb-6 bg-black/30 p-3 border border-gray-900/60 rounded">
                <div className="flex justify-between border-b border-[#2d3142]/30 pb-1.5">
                  <span className="text-gray-500">INTERFACE ACCENT</span>
                  <span className="font-semibold" style={{ color: previewTheme.accentColor }}>
                    {previewTheme.accentColor.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#2d3142]/30 pb-1.5">
                  <span className="text-gray-500">SECONDARY PALETTE</span>
                  <span className="font-semibold" style={{ color: previewTheme.secondaryColor }}>
                    {previewTheme.secondaryColor.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#2d3142]/30 pb-1.5">
                  <span className="text-gray-500">EDITOR MATRIX BG</span>
                  <span className="font-semibold text-white">{previewTheme.editorBg.toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-b border-[#2d3142]/30 pb-1.5">
                  <span className="text-gray-500">FILE WEIGHT</span>
                  <span className="font-semibold text-white">{previewTheme.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">TACTICAL DEPLOY</span>
                  <span className="font-semibold text-green-400">OPTIMIZED</span>
                </div>
              </div>

              {/* Description box */}
              <div className="mb-4">
                <h4 className="font-military text-[11px] text-cyan-400 tracking-wider mb-1">INTEL DOSSIER</h4>
                <p className="text-[10px] text-gray-400 font-mono leading-relaxed bg-[#0b0c10] border border-gray-900/60 p-2.5 rounded h-24 overflow-y-auto custom-scrollbar">
                  {previewTheme.desc}
                </p>
              </div>

              {/* Theme Settings Options */}
              <div className="border-t border-[#2d3142]/60 pt-4 flex flex-col gap-2">
                <h4 className="font-military text-[11px] text-gray-400 tracking-wider mb-1">TACTICAL SYSTEM CONFIG</h4>
                
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={soundEnabled} 
                    onChange={(e) => {
                      setSoundEnabled(e.target.checked);
                      playBeep(450, 0.05, 'sine');
                    }}
                    className="accent-[#FACC15] rounded border-gray-700 bg-black w-3.5 h-3.5"
                  />
                  <span className="font-mono text-[9px] text-gray-400">ENABLE MODULE FEEDBACK SOUND</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={gridOverlay} 
                    onChange={(e) => {
                      setGridOverlay(e.target.checked);
                      playBeep(450, 0.05, 'sine');
                    }}
                    className="accent-[#FACC15] rounded border-gray-700 bg-black w-3.5 h-3.5"
                  />
                  <span className="font-mono text-[9px] text-gray-400">SHOW LOBBY GRID GRAPHICS</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={highContrast} 
                    onChange={(e) => {
                      setHighContrast(e.target.checked);
                      playBeep(450, 0.05, 'sine');
                    }}
                    className="accent-[#FACC15] rounded border-gray-700 bg-black w-3.5 h-3.5"
                  />
                  <span className="font-mono text-[9px] text-gray-400">ENABLE COMPILER EYE-PROTECTION HIGH CONTRAST</span>
                </label>
              </div>
            </div>

            {/* Bottom Confirm Action */}
            <div className="mt-8 border-t border-[#2d3142]/60 pt-4">
              {downloadedList.includes(previewTheme.id) ? (
                <button
                  onClick={handleConfirmSelection}
                  className="w-full py-3.5 bg-[#FACC15] hover:bg-[#ebd510] text-black font-military font-black text-lg tracking-widest clip-angular-btn start-match-glow transition-all duration-300 flex flex-col items-center justify-center border-none cursor-pointer select-none relative"
                >
                  <div className="btn-inner-border"></div>
                  <div className="absolute top-1 left-4 w-4 h-[1px] bg-black/45"></div>
                  <div className="absolute bottom-1 right-4 w-4 h-[1px] bg-black/45"></div>
                  <span>CONFIRM SELECTION</span>
                </button>
              ) : (
                <button
                  onClick={(e) => handleDownload(e, previewTheme.id)}
                  disabled={downloadingId === previewTheme.id}
                  className={`w-full py-3.5 ${
                    downloadingId === previewTheme.id ? 'bg-[#2d3142]/50 text-gray-500' : 'bg-cyan-500 hover:bg-cyan-400'
                  } text-black font-military font-black text-lg tracking-widest clip-angular-btn transition-all duration-300 flex items-center justify-center gap-2 border-none cursor-pointer select-none relative`}
                >
                  <Download size={16} />
                  <span>{downloadingId === previewTheme.id ? 'DOWNLOADING MODULE...' : 'DOWNLOAD MODULE'}</span>
                </button>
              )}
            </div>

          </div>
        </section>

      </main>

      {/* SYNCING TACTICAL ENVIRONMENT MODAL */}
      {isSyncing && (
        <div className="sync-modal-overlay">
          <div className="sync-modal-container bg-iron-gray border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.35)] p-8 text-center max-w-md w-full relative">
            <div className="absolute top-0 right-10 w-8 h-[3px] bg-cyan-400"></div>
            
            <div className="flex flex-col items-center justify-center gap-5">
              <RefreshCw className="animate-spin text-cyan-400 w-12 h-12 mb-2" />
              
              <div>
                <h3 className="font-military text-2xl text-white tracking-widest mb-1">SYNCING ENVIRONMENT</h3>
                <span className="font-mono text-[9px] text-[#FACC15] tracking-[0.2em] font-bold">TACTICAL RELOAD PROTOCOL ACTIVE</span>
              </div>

              {/* Simulated logs sequence */}
              <div className="sync-terminal-logs font-mono text-[10px] text-gray-500 text-left bg-black/60 p-4 border border-gray-900 w-full h-32 flex flex-col justify-start gap-1 overflow-hidden select-none rounded">
                <p className="text-cyan-400 font-bold">&gt; INITIALIZING MODULE SYNC: {previewTheme.id.toUpperCase()}</p>
                {syncStep >= 1 && <p className="text-gray-400">&gt; Allocating system grid buffers... DONE</p>}
                {syncStep >= 2 && <p className="text-gray-400">&gt; Remapping editor color schemes... DONE</p>}
                {syncStep >= 3 && <p className="text-green-400 font-bold">&gt; COMPILER SYNC COMPLETE. REDIRECTING...</p>}
              </div>

              <div className="font-military text-[11px] text-cyan-400/70 tracking-widest">
                DO NOT DISCONNECT FROM PORT_5005
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
