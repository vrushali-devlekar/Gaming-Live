import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Cpu, CheckCircle2, RotateCcw, Home, Award, Flame, ShieldCheck } from 'lucide-react';
import './VictoryModal.css';

export default function VictoryModal({ 
  isOpen = true,
  isVictory = true, 
  onReturnLobby, 
  onPlayAgain,
  stats = {
    executionTime: '24 ms',
    memoryUsed: '14.2 MB',
    testCasesPassed: '10 / 10',
    bpEarned: 450,
    expEarned: 850,
    rankPoints: '+32 RP'
  }
}) {
  const [expProgress, setExpProgress] = useState(40);

  // Animate EXP progress bar fill on mount
  useEffect(() => {
    if (isOpen) {
      setExpProgress(40);
      const timer = setTimeout(() => {
        setExpProgress(85);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="victory-modal-overlay flex items-center justify-center p-4 z-50 fixed inset-0 bg-black/90 backdrop-blur-md">
      
      {/* Central Modal Container */}
      <div className={`victory-modal-card w-full max-w-xl bg-[#0b0e14] border-2 ${isVictory ? 'border-[#facc15] shadow-[0_0_50px_rgba(250,204,21,0.3)]' : 'border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.3)]'} p-6 sm:p-8 clip-steel-widget relative flex flex-col items-center text-center overflow-hidden`}>
        
        {/* Top Metallic Accent Bar */}
        <div className={`absolute top-0 right-12 w-24 h-[3px] ${isVictory ? 'bg-[#facc15]' : 'bg-red-600'}`} />

        {/* Visual Victory / Defeat Header */}
        <div className="flex flex-col items-center mb-6">
          
          {/* Trophy / Defeat Icon Badge */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 border-2 ${
            isVictory 
              ? 'bg-[#facc15]/10 border-[#facc15] text-[#facc15] shadow-[0_0_30px_rgba(250,204,21,0.4)] animate-bounce' 
              : 'bg-red-950/40 border-red-600 text-red-500 shadow-[0_0_30px_rgba(220,38,38,0.4)]'
          }`}>
            {isVictory ? <Trophy size={42} /> : <Flame size={42} />}
          </div>

          {/* Banner Text */}
          <h1 className={`font-military text-2xl sm:text-3xl font-black tracking-widest leading-none ${
            isVictory ? 'text-[#facc15] drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]' : 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]'
          }`}>
            {isVictory ? 'WINNER WINNER CHICKEN DINNER!' : 'MISSION FAILED - DEFEATED!'}
          </h1>
          
          <span className="font-mono text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-1.5">
            {isVictory ? 'TACTICAL ARENA DOMINATION SECURED' : 'PERIMETER COMPILER BREACH ENCOUNTERED'}
          </span>
        </div>

        {/* Combat Statistics Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          
          {/* Execution Speed */}
          <div className="stat-card p-3 bg-black/50 border border-slate-800 clip-steel-sm flex flex-col items-center">
            <Zap size={18} className="text-cyan-400 mb-1" />
            <span className="text-[9px] font-mono text-gray-500 uppercase">EXECUTION SPEED</span>
            <span className="font-military text-sm text-white font-bold tracking-wide mt-0.5">{stats.executionTime}</span>
          </div>

          {/* Memory Efficiency */}
          <div className="stat-card p-3 bg-black/50 border border-slate-800 clip-steel-sm flex flex-col items-center">
            <Cpu size={18} className="text-[#00ffcc] mb-1" />
            <span className="text-[9px] font-mono text-gray-500 uppercase">MEMORY USAGE</span>
            <span className="font-military text-sm text-white font-bold tracking-wide mt-0.5">{stats.memoryUsed}</span>
          </div>

          {/* Test Cases Passed */}
          <div className="stat-card p-3 bg-black/50 border border-slate-800 clip-steel-sm flex flex-col items-center">
            <CheckCircle2 size={18} className="text-green-400 mb-1" />
            <span className="text-[9px] font-mono text-gray-500 uppercase">TESTS PASSED</span>
            <span className="font-military text-sm text-white font-bold tracking-wide mt-0.5">{stats.testCasesPassed}</span>
          </div>

          {/* Rank Points Delta */}
          <div className="stat-card p-3 bg-black/50 border border-slate-800 clip-steel-sm flex flex-col items-center">
            <Award size={18} className="text-[#facc15] mb-1" />
            <span className="text-[9px] font-mono text-gray-500 uppercase">RATING RATING</span>
            <span className="font-military text-sm text-[#facc15] font-bold tracking-wide mt-0.5">{stats.rankPoints}</span>
          </div>

        </div>

        {/* EXP Level Progression Section */}
        <div className="w-full bg-black/40 border border-slate-800 p-4 clip-steel-sm mb-6 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-gray-300 font-bold flex items-center gap-1.5 font-military">
              <ShieldCheck size={14} className="text-[#00ffcc]" />
              LEVEL 42 (COMMANDER)
            </span>
            <span className="text-[#00ffcc] font-bold">+{stats.expEarned} EXP</span>
          </div>

          {/* EXP Bar */}
          <div className="w-full h-3 bg-black border border-slate-800 rounded-sm overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-[#00ffcc] transition-all duration-1000 ease-out shadow-[0_0_10px_#00ffcc]"
              style={{ width: `${expProgress}%` }}
            />
          </div>

          <div className="flex justify-between text-[9px] font-mono text-gray-500">
            <span>REWARD BOUNTY: +{stats.bpEarned} BP</span>
            <span>NEXT LEVEL AT: 12,000 EXP</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          
          {/* RETURN TO LOBBY */}
          <button
            onClick={onReturnLobby}
            className="flex-1 py-3.5 bg-transparent border border-slate-700 hover:border-gray-400 text-gray-300 font-military text-sm tracking-widest clip-angular-btn transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={16} />
            <span>RETURN TO LOBBY</span>
          </button>

          {/* PLAY AGAIN */}
          <button
            onClick={onPlayAgain}
            className={`flex-1 py-3.5 ${
              isVictory 
                ? 'bg-[#facc15] hover:bg-[#ebd510] text-black' 
                : 'bg-red-600 hover:bg-red-500 text-white'
            } font-military font-black text-sm tracking-widest clip-angular-btn start-match-glow transition-all duration-300 flex items-center justify-center gap-2 border-none cursor-pointer`}
          >
            <RotateCcw size={16} />
            <span>PLAY AGAIN</span>
          </button>

        </div>

      </div>
    </div>
  );
}
