import React from 'react';
import { Trophy, ShieldCheck, Flame } from 'lucide-react';
import GamerCard from '../../ui/GamerCard/GamerCard';
import './LeaderboardPreview.css';

export default function LeaderboardPreview() {
  const topPlayers = [
    { rank: 1, name: "HEX_SHADOW", tier: "CONQUEROR", points: 4890, active: true },
    { rank: 2, name: "CYBER_ACE", tier: "ACE MASTER", points: 4620, active: false },
    { rank: 3, name: "CODE_REAPER", tier: "CROWN I", points: 4350, active: false }
  ];

  const getTierColorClass = (tier) => {
    if (tier.includes('CONQUEROR')) return 'tier-conqueror';
    if (tier.includes('ACE')) return 'tier-ace';
    return 'tier-crown';
  };

  return (
    <GamerCard title="TOP RANKINGS PREVIEW" className="leaderboard-preview-card">
      <div className="leaderboard-header font-military">
        <span>PLAYER</span>
        <span>RATING</span>
      </div>

      <div className="leaderboard-list">
        {topPlayers.map((player) => (
          <div 
            key={player.rank} 
            className={`leaderboard-item ${player.active ? 'item-active' : ''}`}
          >
            <div className="item-left">
              {/* Rank Badge */}
              <div className={`rank-number-badge rank-${player.rank} font-military`}>
                {player.rank === 1 ? (
                  <Trophy size={14} className="trophy-first" />
                ) : (
                  <span>0{player.rank}</span>
                )}
              </div>
              
              <div className="player-meta">
                <span className="player-preview-name font-military">{player.name}</span>
                <span className={`player-preview-tier font-military ${getTierColorClass(player.tier)}`}>
                  {player.tier}
                </span>
              </div>
            </div>
            
            <div className="item-right font-mono-tactical">
              <div className="rating-points">
                <Flame size={12} className="points-icon" />
                <span>{player.points}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="leaderboard-footer font-military">
        <button className="view-more-btn font-military">VIEW FULL LEADERBOARD</button>
      </div>
    </GamerCard>
  );
}
