import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Trophy, ArrowRight, Share2, Check, AlertTriangle, Clock, Zap } from 'lucide-react';
import ThreeCharacter from '../../components/ThreeCharacter/ThreeCharacter';
import { themeService } from '../../services/themeService';
import { audioService } from '../../services/audioService';
import './Result.css';

export default function Result() {
  const navigate = useNavigate();
  const activeTheme = themeService.getCurrentTheme();

  useEffect(() => {
    try { audioService.playSniper(); } catch(e) {}
  }, []);

  const performanceStats = {
    testCases: "10 / 10 (100% SECURED)",
    executionTime: "0.04ms / 150ms limit",
    memoryUsage: "24.5 MB / 128 MB limit",
    algorithmRank: "S-GRADE (OPTIMAL)",
    complexity: "O(N) - Linear Time",
    expGained: "+1,420 XP",
    bpGained: "+280 BP",
    rankGained: "+45 MMR"
  };

  return (
    <div className="result-extraction-viewport p-6">
      <div className="theme-grid-matrix-bg" />
      <div className="theme-scanline-overlay" />

      {/* Main Result Settlement Card */}
      <div className="result-card-container relative z-10 max-w-4xl w-full p-8 clip-tactical-card flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Left: 3D Champion Winner Stand */}
        <div className="flex-1 flex flex-col justify-between items-center text-center border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
          <div>
            <Award className="text-[#F59E0B] w-10 h-10 mb-2 animate-bounce mx-auto" />
            <h1 className="font-header text-3xl text-[#F59E0B] font-extrabold tracking-[0.15em] leading-none">
              SECTOR DOMINATED
            </h1>
            <span className="font-code text-[10px] text-[#06B6D4] tracking-[0.25em] font-bold block mt-2 uppercase">
              // WINNER WINNER CHICKEN DINNER
            </span>
          </div>

          <div className="relative w-full flex-1 flex flex-col justify-center items-center my-4">
            <div className="w-full max-w-[240px]">
              <ThreeCharacter activeTheme={activeTheme} />
            </div>
          </div>

          <div className="font-code text-xs text-gray-400">
            SQUAD STATUS: <span className="text-[#06B6D4] font-bold">100% OPERATIONAL</span>
          </div>
        </div>

        {/* Right: Detailed Combat Telemetry Analysis */}
        <div className="flex-1 flex flex-col justify-between gap-5 text-left">
          <div>
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-4">
              <Trophy className="text-[#F59E0B] w-5 h-5" />
              <h2 className="font-header text-base text-white font-bold tracking-[0.15em]">
                EXTRACTION TELEMETRY ANALYSIS
              </h2>
            </div>

            {/* Stats List */}
            <div className="flex flex-col gap-2 font-code text-xs text-gray-300">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">TEST CASES PASSED:</span>
                <span className="text-[#06B6D4] font-bold">{performanceStats.testCases}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">EXECUTION TIME:</span>
                <span className="text-white font-semibold">{performanceStats.executionTime}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">MEMORY DELTA:</span>
                <span className="text-white font-semibold">{performanceStats.memoryUsage}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">MMR GAINED:</span>
                <span className="text-[#F59E0B] font-bold">{performanceStats.rankGained}</span>
              </div>
            </div>

            {/* Reward Badges */}
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="bg-black/60 border border-white/10 p-2.5 clip-tactical-badge">
                <span className="text-[8px] font-code text-gray-400 block uppercase">EXP EARNED</span>
                <span className="font-header text-sm text-[#06B6D4] font-bold block mt-1">{performanceStats.expGained}</span>
              </div>
              <div className="bg-black/60 border border-white/10 p-2.5 clip-tactical-badge">
                <span className="text-[8px] font-code text-gray-400 block uppercase">BP REWARD</span>
                <span className="font-header text-sm text-[#F59E0B] font-bold block mt-1">{performanceStats.bpGained}</span>
              </div>
              <div className="bg-black/60 border border-white/10 p-2.5 clip-tactical-badge">
                <span className="text-[8px] font-code text-gray-400 block uppercase">MMR DELTA</span>
                <span className="font-header text-sm text-emerald-400 font-bold block mt-1">{performanceStats.rankGained}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => navigate('/lobby')}
              className="flex-1 py-3 bg-[#F59E0B] hover:bg-[#FFB703] text-black font-header font-bold text-sm tracking-wider clip-tactical-btn transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              <span>RETURN TO COMMAND DECK</span>
              <ArrowRight size={16} fill="black" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
