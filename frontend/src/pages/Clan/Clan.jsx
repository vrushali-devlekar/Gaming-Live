import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Shield, Swords, PlusCircle } from 'lucide-react';
import GamerHeader from '../../components/GamerHeader/GamerHeader';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import GamerCard from '../../ui/GamerCard/GamerCard';
import GamerButton from '../../ui/GamerButton/GamerButton';
import './Clan.css';

export default function Clan() {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const squadTasks = [
    { id: 1, name: 'FIREWALL BYPASS ROUTINE', assignee: 'GHOST_CODER', status: 'COMPILED' },
    { id: 2, name: 'BUFFER OVERFLOW SHIELD', assignee: 'NEON_VIPER', status: 'IN PROGRESS' },
    { id: 3, name: 'DNS INFILTRATION EVASION', assignee: 'CYBER_ACE', status: 'READY' },
    { id: 4, name: 'SSL SOCKETS HANDSHAKE', assignee: 'WAITING FOR SQUAD MATE...', status: 'OPEN SLOT' }
  ];

  const clanLeaderboard = [
    { rank: 1, name: 'APEX_CODERS', leader: 'ApexMaster', rating: 24850, size: '48 / 50' },
    { rank: 2, name: 'STACK_BREACHERS', leader: 'HeapOverflow', rating: 22100, size: '45 / 50' },
    { rank: 3, name: 'RECOIL_SQUAD', leader: 'ZeroGrip', rating: 19420, size: '50 / 50' },
    { rank: 4, name: 'CYBER_INTEGRATORS', leader: 'WebSockets', rating: 17200, size: '39 / 50' }
  ];

  return (
    <div className="gaming-dashboard-page hud-grid hud-scanline">
      
      {/* Gamer Header */}
      <GamerHeader 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        username="GHOST_CODER" 
        currentXP={2840} 
        maxXP={5000} 
      />

      {/* Breadcrumb Exit row */}
      <div className="lobby-navigation-row pb-2">
        <button 
          onClick={() => navigate('/lobby')} 
          className="exit-lobby-btn font-military"
        >
          <ArrowLeft size={16} />
          <span>RETURN TO LOBBY</span>
        </button>
        <span className="lobby-breadcrumbs font-mono-tactical">
          SYSTEM_CONSOLE / CLAN_OPERATIONS / DIRECTORY
        </span>
      </div>

      {/* Main Content Grid */}
      <main className="clan-main-grid p-6 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20 md:pb-6">
        
        {/* ================= LEFT COLUMN: SQUAD BATTLES 4v4 (6 COLS) ================= */}
        <section className="lg:col-span-6 flex flex-col gap-4">
          <GamerCard title="4V4 SQUAD BATTLES - ACTIVE OPER." highlight={true}>
            <div className="flex flex-col gap-4">
              
              <div className="bg-[#0f1016] border border-[#254a34] p-3 text-[10px] font-mono text-[#00ffcc] leading-relaxed">
                <span className="font-bold block uppercase mb-1">TACTICAL COOPERATIVE MISSION:</span>
                Assemble your squad to construct the Secure Perimeter firewall array. Each member compiles one sub-system routine. Unlocking all modules triggers full squad integration!
              </div>

              {/* Tasks List */}
              <div className="flex flex-col gap-3">
                {squadTasks.map((task) => (
                  <div 
                    key={task.id}
                    className={`p-3 bg-black/40 border clip-steel-sm flex items-center justify-between transition-colors ${
                      task.status === 'COMPILED' ? 'border-[#00ffcc]/40 bg-[#00ffcc]/5' :
                      task.status === 'OPEN SLOT' ? 'border-dashed border-slate-700/60' : 'border-[#2d3142]/60'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 block">MODULE 0{task.id}</span>
                      <h4 className="font-military text-sm text-white tracking-wide">{task.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1 text-[9px] font-mono text-gray-400">
                        <span>OPERATOR:</span>
                        <span className={task.status === 'OPEN SLOT' ? 'text-yellow-500' : 'text-[#00ffcc] font-bold'}>
                          {task.assignee}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {task.status === 'OPEN SLOT' ? (
                        <GamerButton variant="primary" size="sm" onClick={() => alert("INVITING PLAYERS TO SQUAD...")}>
                          INVITE
                        </GamerButton>
                      ) : (
                        <span 
                          className={`font-military text-[10px] px-2 py-0.5 rounded font-black tracking-widest ${
                            task.status === 'COMPILED' ? 'bg-[#00ffcc] text-black' :
                            task.status === 'READY' ? 'bg-[#FACC15] text-black' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {task.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </GamerCard>
        </section>

        {/* ================= RIGHT COLUMN: CLAN LEADERBOARD (6 COLS) ================= */}
        <section className="lg:col-span-6 flex flex-col gap-4">
          <GamerCard title="GLOBAL REGIONAL CLAN STANDINGS">
            <div className="flex flex-col gap-4">
              
              {/* Leaderboard Table */}
              <div className="flex flex-col gap-2.5">
                {clanLeaderboard.map((clan) => (
                  <div 
                    key={clan.rank}
                    className="p-3.5 bg-black/45 border border-[#2d3142] clip-steel-sm flex items-center justify-between hover:border-yellow-400/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-military font-bold text-white border border-[#2d3142]">
                        0{clan.rank}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-military text-sm font-bold text-white tracking-wide">{clan.name}</span>
                          <span className="text-[9px] font-mono text-gray-500">LEADER: {clan.leader}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[9px] font-mono text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users size={10} className="text-[#00ffcc]" />
                            {clan.size} MEMBERS
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block font-mono text-xs text-yellow-400 font-bold">{clan.rating}</span>
                      <span className="text-[8px] font-mono text-gray-500 tracking-wider">CLAN POINTS</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action bar */}
              <div className="pt-2 border-t border-[#2d3142]/60 flex gap-3">
                <GamerButton variant="steel" className="flex-1" onClick={() => alert("INITIALIZING NEW CLAN OPERATIONS...")}>
                  CREATE NEW CLAN
                </GamerButton>
              </div>

            </div>
          </GamerCard>
        </section>

      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

    </div>
  );
}
