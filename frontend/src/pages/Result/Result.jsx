import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Trophy, ArrowRight, Check, Zap, ArrowLeft, Swords } from 'lucide-react';
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
    <div className="cyber-result-viewport p-6">
      <div className="theme-grid-matrix-bg" />
      <div className="theme-scanline-overlay" />

      {/* Main Result Settlement Card */}
      <div className="result-settlement-card">
        
        {/* Left: 3D Champion Winner Stand */}
        <div className="result-left-podium">
          <div className="text-center">
            <div className="winner-trophy-box">
              <Trophy className="text-lime w-7 h-7" />
            </div>
            <h1 className="font-header text-3xl text-lime font-black tracking-wider leading-none mb-1">
              SECTOR DOMINATED
            </h1>
            <span className="font-mono text-xs text-muted tracking-widest block uppercase">
              // 1V1 DUEL VICTORY SETTLEMENT
            </span>
          </div>

          <div className="result-three-character-stage">
            <ThreeCharacter activeTheme={activeTheme} />
          </div>

          <div className="font-mono text-xs text-muted">
            OPERATOR STATUS: <span className="text-lime font-bold">100% SECURED</span>
          </div>
        </div>

        {/* Right: Detailed Combat Telemetry Analysis */}
        <div className="result-right-telemetry">
          <div>
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
              <Award className="text-lime w-5 h-5" />
              <h2 className="font-header text-base text-white font-bold tracking-wider">
                EXTRACTION TELEMETRY ANALYSIS
              </h2>
            </div>

            {/* Stats List */}
            <div className="flex flex-col gap-2.5 font-mono text-xs text-secondary">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-muted">TEST CASES PASSED:</span>
                <span className="text-lime font-bold">{performanceStats.testCases}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-muted">EXECUTION TIME:</span>
                <span className="text-white font-semibold">{performanceStats.executionTime}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-muted">TIME COMPLEXITY:</span>
                <span className="text-cyan font-semibold">{performanceStats.complexity}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-muted">MMR GAINED:</span>
                <span className="text-lime font-bold">{performanceStats.rankGained}</span>
              </div>
            </div>

            {/* Reward Badges */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="reward-chip-box">
                <span className="text-[10px] font-mono text-muted block uppercase">EXP EARNED</span>
                <span className="font-header text-base text-cyan font-bold block mt-1">{performanceStats.expGained}</span>
              </div>
              <div className="reward-chip-box">
                <span className="text-[10px] font-mono text-muted block uppercase">BP REWARD</span>
                <span className="font-header text-base text-amber font-bold block mt-1">{performanceStats.bpGained}</span>
              </div>
              <div className="reward-chip-box">
                <span className="text-[10px] font-mono text-muted block uppercase">RATING MMR</span>
                <span className="font-header text-base text-lime font-bold block mt-1">{performanceStats.rankGained}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-3 pt-6 border-t border-white/10 mt-6">
            <button
              onClick={() => navigate('/arena')}
              className="btn-cyber-secondary flex-1 py-3"
            >
              <Swords size={16} />
              <span>PLAY AGAIN</span>
            </button>
            <button
              onClick={() => navigate('/lobby')}
              className="btn-cyber-primary flex-1 py-3"
            >
              <span>COMMAND DECK</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
