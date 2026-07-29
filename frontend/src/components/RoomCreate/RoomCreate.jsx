import React, { useState } from 'react';
import { 
  Shield, Users, User, Flame, MapPin, Key, Lock, Check, 
  X, RefreshCw, Cpu, Zap, CreditCard, ToggleLeft, ToggleRight 
} from 'lucide-react';
import './RoomCreate.css';

export default function RoomCreate({ 
  isOpen = true, 
  onClose, 
  onCreateRoom 
}) {
  // 1. Game Mode State
  const [selectedMode, setSelectedMode] = useState('1v1'); // '1v1', '4v4', '100-royale'
  
  // 2. Map Theme State
  const [selectedMap, setSelectedMap] = useState('sanhok'); // 'sanhok', 'erangel', 'ruins'
  
  // 3. Ruleset Toggles
  const [rules, setRules] = useState({
    shrinkingZone: true,
    noAutoComplete: false,
    restrictLanguage: 'all' // 'all', 'cpp', 'python', 'js'
  });

  // 4. Room Credentials
  const generateRoomId = () => Math.floor(100000 + Math.random() * 900000).toString();
  const [roomId, setRoomId] = useState(generateRoomId());
  const [roomPassword, setRoomPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      if (onCreateRoom) {
        onCreateRoom({
          roomId,
          roomPassword,
          selectedMode,
          selectedMap,
          rules,
          roomCardCost: 1
        });
      }
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <div className="room-create-overlay fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      
      {/* Modal Container */}
      <div className="room-create-card w-full max-w-2xl bg-[#0b0e14] border-2 border-[#00ffcc] p-6 sm:p-8 clip-steel-widget relative shadow-[0_0_50px_rgba(0,255,204,0.25)] flex flex-col gap-6 overflow-hidden">
        
        {/* Top Metallic Accent Bar */}
        <div className="absolute top-0 right-14 w-20 h-[3px] bg-[#00ffcc]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#2d3142]/60 pb-3">
          <div className="flex items-center gap-2.5">
            <Shield className="text-[#00ffcc] w-5 h-5" />
            <h2 className="font-military text-xl text-[#00ffcc] tracking-widest font-black">
              CREATE TACTICAL ROOM
            </h2>
          </div>

          {/* Close button */}
          {onClose && (
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/5 transition-colors cursor-pointer border-none bg-transparent"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN: GAME MODES & MAP THEMES */}
          <div className="flex flex-col gap-4">
            
            {/* 1. Game Mode Selector */}
            <div>
              <label className="text-[10px] font-mono text-gray-400 block mb-2 uppercase">
                1. Select Tactical Game Mode:
              </label>
              <div className="flex flex-col gap-2">
                
                {/* 1v1 Solo Duel */}
                <div 
                  onClick={() => setSelectedMode('1v1')}
                  className={`p-3 border clip-steel-sm cursor-pointer flex items-center justify-between transition-all ${
                    selectedMode === '1v1' 
                      ? 'border-[#00ffcc] bg-[#00ffcc]/10 text-white' 
                      : 'border-slate-800 bg-black/40 text-gray-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User size={16} className={selectedMode === '1v1' ? 'text-[#00ffcc]' : 'text-gray-500'} />
                    <div>
                      <span className="font-military text-xs font-bold block">1V1 SOLO DUEL</span>
                      <span className="text-[9px] font-mono text-gray-500 block">Direct 1-on-1 head-to-head algorithm combat</span>
                    </div>
                  </div>
                  {selectedMode === '1v1' && <Check size={16} className="text-[#00ffcc]" />}
                </div>

                {/* 4v4 Squad Battle */}
                <div 
                  onClick={() => setSelectedMode('4v4')}
                  className={`p-3 border clip-steel-sm cursor-pointer flex items-center justify-between transition-all ${
                    selectedMode === '4v4' 
                      ? 'border-[#00ffcc] bg-[#00ffcc]/10 text-white' 
                      : 'border-slate-800 bg-black/40 text-gray-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users size={16} className={selectedMode === '4v4' ? 'text-[#00ffcc]' : 'text-gray-500'} />
                    <div>
                      <span className="font-military text-xs font-bold block">4V4 SQUAD BATTLE</span>
                      <span className="text-[9px] font-mono text-gray-500 block">Team perimeter hacking & code relay</span>
                    </div>
                  </div>
                  {selectedMode === '4v4' && <Check size={16} className="text-[#00ffcc]" />}
                </div>

                {/* 100-Coder Royale */}
                <div 
                  onClick={() => setSelectedMode('100-royale')}
                  className={`p-3 border clip-steel-sm cursor-pointer flex items-center justify-between transition-all ${
                    selectedMode === '100-royale' 
                      ? 'border-[#00ffcc] bg-[#00ffcc]/10 text-white' 
                      : 'border-slate-800 bg-black/40 text-gray-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Flame size={16} className={selectedMode === '100-royale' ? 'text-yellow-400' : 'text-gray-500'} />
                    <div>
                      <span className="font-military text-xs font-bold block">100-CODER ROYALE</span>
                      <span className="text-[9px] font-mono text-gray-500 block">Massive battle-royale survival elimination</span>
                    </div>
                  </div>
                  {selectedMode === '100-royale' && <Check size={16} className="text-[#00ffcc]" />}
                </div>

              </div>
            </div>

            {/* 2. Map Theme Selector */}
            <div>
              <label className="text-[10px] font-mono text-gray-400 block mb-2 uppercase">
                2. Select Tactical Map Theme:
              </label>
              <div className="grid grid-cols-3 gap-2">
                
                <div 
                  onClick={() => setSelectedMap('sanhok')}
                  className={`p-2.5 border text-center clip-steel-sm cursor-pointer transition-all ${
                    selectedMap === 'sanhok' 
                      ? 'border-[#00ffcc] bg-black/60 text-white' 
                      : 'border-slate-800 bg-black/30 text-gray-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-military text-[11px] font-bold block text-[#00ffcc]">SANHOK</span>
                  <span className="text-[8px] font-mono text-gray-500">Jungle Neon</span>
                </div>

                <div 
                  onClick={() => setSelectedMap('erangel')}
                  className={`p-2.5 border text-center clip-steel-sm cursor-pointer transition-all ${
                    selectedMap === 'erangel' 
                      ? 'border-[#00e5ff] bg-black/60 text-white' 
                      : 'border-slate-800 bg-black/30 text-gray-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-military text-[11px] font-bold block text-[#00e5ff]">ERANGEL</span>
                  <span className="text-[8px] font-mono text-gray-500">Cyber Grid</span>
                </div>

                <div 
                  onClick={() => setSelectedMap('ruins')}
                  className={`p-2.5 border text-center clip-steel-sm cursor-pointer transition-all ${
                    selectedMap === 'ruins' 
                      ? 'border-yellow-400 bg-black/60 text-white' 
                      : 'border-slate-800 bg-black/30 text-gray-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-military text-[11px] font-bold block text-yellow-400">EGYPT</span>
                  <span className="text-[8px] font-mono text-gray-500">Ancient Ruins</span>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: RULESETS & ROOM CREDENTIALS */}
          <div className="flex flex-col gap-4">
            
            {/* 3. Ruleset Toggles */}
            <div>
              <label className="text-[10px] font-mono text-gray-400 block mb-2 uppercase">
                3. Configure Match Rulesets:
              </label>
              
              <div className="flex flex-col gap-2.5 bg-black/40 border border-slate-800 p-3 clip-steel-sm">
                
                {/* Shrinking Playzone Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-yellow-400" />
                    <span className="text-xs font-mono text-gray-300">Shrinking Playzone (Time Attack)</span>
                  </div>
                  <button 
                    onClick={() => setRules(prev => ({ ...prev, shrinkingZone: !prev.shrinkingZone }))}
                    className="bg-transparent border-none cursor-pointer text-gray-400 hover:text-white"
                  >
                    {rules.shrinkingZone ? <ToggleRight size={22} className="text-[#00ffcc]" /> : <ToggleLeft size={22} />}
                  </button>
                </div>

                {/* No Auto-Complete Toggle */}
                <div className="flex items-center justify-between border-t border-slate-900 pt-2">
                  <div className="flex items-center gap-2">
                    <Cpu size={14} className="text-red-400" />
                    <span className="text-xs font-mono text-gray-300">No IDE Auto-Complete</span>
                  </div>
                  <button 
                    onClick={() => setRules(prev => ({ ...prev, noAutoComplete: !prev.noAutoComplete }))}
                    className="bg-transparent border-none cursor-pointer text-gray-400 hover:text-white"
                  >
                    {rules.noAutoComplete ? <ToggleRight size={22} className="text-[#00ffcc]" /> : <ToggleLeft size={22} />}
                  </button>
                </div>

                {/* Language Restrictions */}
                <div className="flex flex-col gap-1 border-t border-slate-900 pt-2">
                  <label className="text-[9px] font-mono text-gray-500 uppercase">Restricted Compiler Language:</label>
                  <select
                    value={rules.restrictLanguage}
                    onChange={(e) => setRules(prev => ({ ...prev, restrictLanguage: e.target.value }))}
                    className="w-full bg-[#121620] border border-[#252e3d] text-white font-mono text-xs p-2 rounded focus:outline-none focus:border-[#00ffcc] cursor-pointer"
                  >
                    <option value="all">ALLOW ALL (JS, Python, C++, Java)</option>
                    <option value="js">JavaScript (Node.js) ONLY</option>
                    <option value="python">Python (v3.11) ONLY</option>
                    <option value="cpp">C++ (GCC 12) ONLY</option>
                  </select>
                </div>

              </div>
            </div>

            {/* 4. Room Credentials */}
            <div className="flex flex-col gap-3">
              
              {/* Room ID */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                  <span className="uppercase">Tactical Room ID (6-Digit):</span>
                  <button 
                    onClick={() => setRoomId(generateRoomId())}
                    className="text-[#00ffcc] hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer p-0"
                  >
                    <RefreshCw size={10} />
                    <span>RE-GENERATE</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={roomId}
                    className="w-full bg-[#121620] border border-[#252e3d] text-[#00ffcc] font-military font-bold text-base p-2.5 rounded tracking-widest text-center"
                  />
                  <Key size={14} className="absolute left-3 top-3.5 text-gray-500" />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Room Passcode (Optional):</label>
                <div className="relative">
                  <input
                    type="password"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    placeholder="Leave empty for public room"
                    className="w-full bg-[#121620] border border-[#252e3d] text-white font-mono text-xs p-2.5 pl-9 rounded focus:outline-none focus:border-[#00ffcc]"
                  />
                  <Lock size={14} className="absolute left-3 top-3 text-gray-500" />
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Room Card Confirmation Badge */}
        <div className="bg-yellow-950/30 border border-yellow-500/30 p-3 clip-steel-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-yellow-400" />
            <span className="font-military text-xs text-yellow-400 tracking-wider">ROOM INVENTORY BALANCE: 5 CARDS</span>
          </div>
          <span className="px-2.5 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-[10px] font-mono font-bold rounded">
            CONSUMES 1 ROOM CARD
          </span>
        </div>

        {/* Action Row */}
        <div className="flex gap-3 pt-2 border-t border-[#2d3142]/60">
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="flex-1 py-3.5 bg-[#00ffcc] hover:bg-[#00cca3] text-black font-military font-black text-sm tracking-widest clip-angular-btn transition-all duration-300 border-none cursor-pointer flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>ALLOCATING ROOM PERIMETER...</span>
              </>
            ) : (
              <span>CREATE TACTICAL ROOM</span>
            )}
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="py-3.5 px-6 bg-transparent border border-slate-700 hover:border-gray-500 text-gray-300 font-military text-xs tracking-widest clip-industrial-card transition-colors cursor-pointer"
            >
              CANCEL
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
