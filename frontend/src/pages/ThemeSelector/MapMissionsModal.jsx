import React from 'react';
import { X, Check, Crosshair, Zap, Shield, ChevronRight, Award, AlertCircle } from 'lucide-react';
import './MapMissionsModal.css';

export default function MapMissionsModal({ isOpen, onClose, theme, mapData, onDeploy }) {
  if (!isOpen || !theme) return null;

  const mapName = theme.name || 'TACTICAL MAP';
  const total = mapData?.totalMissions || 5;
  const solved = mapData?.solvedMissions || 0;
  const percentage = Math.round((solved / total) * 100);

  return (
    <div className="missions-modal-overlay" onClick={onClose} data-lenis-prevent>
      <div 
        className="missions-modal-container" 
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Modal Header */}
        <div className="missions-modal-header">
          <div className="modal-title-box">
            <div className="modal-subtitle-badge">
              <Crosshair size={13} className="text-[#00ffcc]" />
              <span>TACTICAL MISSION DOSSIER</span>
            </div>
            <h2 className="modal-main-title">
              [{mapName}] - TACTICAL CODING OPERATIONS
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close Dossier">
            <X size={18} />
          </button>
        </div>

        {/* Header Stats Bar */}
        <div className="missions-modal-stats">
          <div className="flex items-center gap-2">
            <Award size={14} className="text-[#facc15]" />
            <span className="text-gray-300">
              MISSION PROGRESS: <strong className="text-[#00ffcc]">{solved} / {total} COMPLETED</strong> ({percentage}%)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="stats-progress-bar-bg">
              <div 
                className="stats-progress-bar-fill"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-[#facc15]">{percentage}%</span>
          </div>
        </div>

        {/* Modal Body - Level Tiers */}
        <div className="missions-modal-body custom-scrollbar" data-lenis-prevent>
          {mapData?.levels?.map((level) => (
            <div key={level.levelId} className="mission-tier-section">
              {/* Level Tier Header */}
              <div 
                className="tier-header"
                style={{ borderLeftColor: level.badgeColor || '#00ffcc' }}
              >
                <div className="tier-title-group">
                  <span 
                    className="tier-badge"
                    style={{ backgroundColor: level.badgeColor || '#00ffcc' }}
                  >
                    {level.title}
                  </span>
                  <span className="tier-subtitle">{level.desc}</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 uppercase">
                  {level.problems?.filter(p => p.solved).length} / {level.problems?.length} SOLVED
                </span>
              </div>

              {/* Problem Checklist Items (LeetCode Style) */}
              <div className="problems-checklist">
                {level.problems?.map((problem) => (
                  <div key={problem.id} className="problem-item-card">
                    <div className="problem-left-info">
                      {/* Solved / Unsolved Badge */}
                      <div className={`status-indicator-badge ${problem.solved ? 'status-solved' : 'status-unsolved'}`}>
                        {problem.solved ? (
                          <Check size={14} strokeWidth={3} />
                        ) : (
                          <X size={14} strokeWidth={3} />
                        )}
                      </div>

                      {/* Problem Meta */}
                      <div className="problem-meta">
                        <div className="flex items-center gap-2">
                          <span className="problem-name">{problem.name}</span>
                          <span className={`diff-pill ${
                            problem.difficulty === 'Easy' ? 'diff-easy' :
                            problem.difficulty === 'Medium' ? 'diff-medium' : 'diff-hard'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <div className="problem-tags-row">
                          <span className="category-tag">{problem.category}</span>
                          <span className="text-[10px] font-mono text-gray-500">
                            {problem.solved ? 'STATUS: VERIFIED SOLVED' : 'STATUS: PENDING DEPLOYMENT'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button: DEPLOY CODE */}
                    <button
                      onClick={() => onDeploy(problem.id, theme.id)}
                      className="deploy-code-btn"
                    >
                      <Zap size={13} className="fill-[#00ffcc]" />
                      <span>DEPLOY CODE</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
