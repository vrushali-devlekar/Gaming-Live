import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Shield, Timer, Coins, Trophy, ArrowRight, Share2, Check } from 'lucide-react';
import ThreeCharacter from '../../components/ThreeCharacter/ThreeCharacter';
import { themeService } from '../../services/themeService';
import { audioService } from '../../services/audioService';
import './Result.css';

export default function Result() {
  const navigate = useNavigate();
  const activeTheme = themeService.getCurrentTheme();

  // Play a sniper shot sound on settlement mount for maximum impact!
  useEffect(() => {
    audioService.playSniper();
  }, []);

  const performanceStats = {
    testCases: "10 / 10 (100% SECURED)",
    executionTime: "18ms / 150ms limit",
    memoryUsage: "24.5 MB / 128 MB limit",
    algorithmRank: "S-GRADE (OPTIMAL)",
    complexity: "O(N) - Linear Time Complexity",
    expGained: "+1,420 XP",
    bpGained: "+280 BP CODES",
    rankGained: "+45 POINTS"
  };

  return (
    <div className="gaming-dashboard-page hud-grid hud-scanline flex flex-col justify-center items-center p-4 md:p-6 min-h-screen relative">
      
      {/* Giant Settlement Box Container */}
      <div className="result-settlement-card max-w-4xl w-full bg-iron-gray border-2 border-gold p-6 md:p-8 clip-industrial-card shadow-[0_0_60px_rgba(250,204,21,0.2)] flex flex-col lg:flex-row gap-8 items-stretch relative">
        <div className="absolute top-0 right-14 w-12 h-[3px] bg-gold"></div>

        {/* ================= LEFT HALF: WebGL WINNER EMOTE STAND (5 COLS) ================= */}
        <div className="flex-1 flex flex-col justify-between items-center text-center border-b lg:border-b-0 lg:border-r border-[#2d3142]/60 pb-6 lg:pb-0 lg:pr-8 min-h-[380px]">
          
          <div>
            <div className="flex justify-center mb-1">
              <Award className="text-[#FACC15] w-10 h-10 animate-bounce" />
            </div>
            <h1 className="font-military text-4xl text-[#FACC15] font-black tracking-widest leading-none drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]">
              VICTORY ROYALE!
            </h1>
            <span className="font-mono text-[9px] text-[#00ffcc] tracking-[0.25em] font-bold block mt-2 uppercase">
              Winner Winner Chicken Dinner!
            </span>
          </div>

          {/* Pedestal Stand Preview */}
          <div className="relative w-full flex-1 flex flex-col justify-center items-center my-4 min-h-[220px]">
            <div className="absolute w-44 h-44 rounded-full border border-yellow-500/10 pointer-events-none"></div>
            
            {/* Render ThreeCharacter standing proud */}
            <div className="w-full max-w-[260px]">
              <ThreeCharacter activeTheme={activeTheme} />
              
              {/* Stand platform */}
              <div className="w-[240px] h-7 bg-gradient-to-b from-[#1b1c28] to-[#0c0d12] border-t border-b border-[#2d3142] clip-hero-stand flex items-center justify-center relative -mt-3 shadow-lg mx-auto">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-yellow-400/40"></div>
                <span className="font-military text-[9px] text-[#FACC15] tracking-[0.2em] font-bold">CHAMPION STACK</span>
              </div>
            </div>
          </div>

          <div className="font-military text-xs text-gray-400 tracking-wider">
            SQUAD STATUS: <span className="text-[#00ffcc] font-bold">ALL MEMBERS SURVIVED</span>
          </div>

        </div>

        {/* ================= RIGHT HALF: DETAILED COMBAT REPORT ================= */}
        <div className="flex-1 flex flex-col justify-between gap-5 text-left">
          
          <div>
            <div className="flex items-center gap-2 border-b border-[#2d3142]/60 pb-2 mb-4">
              <Trophy className="text-[#FACC15] w-5 h-5" />
              <h2 className="font-military text-lg text-white tracking-widest">COMBAT ANALYSIS REPORT</h2>
            </div>

            {/* Stats list */}
            <div className="flex flex-col gap-2 font-mono text-xs text-gray-300">
              
              <div className="flex justify-between py-1.5 border-b border-[#2d3142]/30">
                <span className="text-gray-500">TEST CASES SOLVED:</span>
                <span className="text-green-400 font-bold">{performanceStats.testCases}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#2d3142]/30">
                <span className="text-gray-500">EXECUTION TIME:</span>
                <span className="text-white font-semibold">{performanceStats.executionTime}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#2d3142]/30">
                <span className="text-gray-500">MEMORY CAPACITY:</span>
                <span className="text-white font-semibold">{performanceStats.memoryUsage}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#2d3142]/30">
                <span className="text-gray-500">ALGORITHM COMPLEXITY:</span>
                <span className="text-[#FACC15] font-bold">{performanceStats.complexity}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#2d3142]/30">
                <span className="text-gray-500">COMPILER GRADE:</span>
                <span className="text-[#00ffcc] font-bold">{performanceStats.algorithmRank}</span>
              </div>

            </div>

            {/* Reward Increments list */}
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="bg-black/45 border border-[#2d3142]/50 p-2.5 rounded clip-steel-sm">
                <span className="text-[8px] font-mono text-gray-500 block uppercase">EXP EARNED</span>
                <span className="font-military text-sm text-[#00ffcc] font-bold block mt-1">{performanceStats.expGained}</span>
              </div>
              <div className="bg-black/45 border border-[#2d3142]/50 p-2.5 rounded clip-steel-sm">
                <span className="text-[8px] font-mono text-gray-500 block uppercase">BP EARNED</span>
                <span className="font-military text-sm text-[#FACC15] font-bold block mt-1">{performanceStats.bpGained}</span>
              </div>
              <div className="bg-black/45 border border-[#2d3142]/50 p-2.5 rounded clip-steel-sm">
                <span className="text-[8px] font-mono text-gray-500 block uppercase">RATING PTS</span>
                <span className="font-military text-sm text-green-400 font-bold block mt-1">{performanceStats.rankGained}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#2d3142]/60">
            <button
              onClick={() => navigate('/lobby')}
              className="flex-1 py-3.5 bg-[#FACC15] hover:bg-[#ebd510] text-black font-military font-black text-lg tracking-widest clip-angular-btn start-match-glow transition-all duration-300 flex items-center justify-center gap-1.5 border-none cursor-pointer"
            >
              <span>RETURN TO LOBBY</span>
              <ArrowRight size={16} fill="black" />
            </button>
            <button
              onClick={() => alert("SYNCHRONIZING COMBAT CARD GRID...")}
              className="py-3.5 px-6 bg-transparent border border-[#2d3142] hover:border-gray-500 text-gray-300 font-military text-sm tracking-widest clip-industrial-card transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Share2 size={14} />
              <span>SHARE RECORD</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
