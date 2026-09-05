import React, { useState } from 'react';
import { ArrowLeft, ShieldAlert, CheckCircle, Users, Lock, Unlock, Wifi, Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CommandHeader from '../../components/CommandHeader/CommandHeader';
import RoomCreate from '../../components/RoomCreate/RoomCreate';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import { useAuth } from '../../context/AuthContext';
import './RoomLobby.css';

export default function RoomLobby() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [alert, setAlert] = useState(null);

  // Active custom duel rooms
  const [rooms, setRooms] = useState([
    { id: 1, name: "NEO-SHIBUYA DUEL #8901", host: "NEON_VIPER", filled: 1, max: 2, locked: true, ping: "14ms", theme: "NEO-SHIBUYA MATRIX" },
    { id: 2, name: "KRONOS RECON ARENA", host: "CODE_REAPER", filled: 1, max: 2, locked: false, ping: "18ms", theme: "KRONOS PERIMETER" },
    { id: 3, name: "CRYONIC SUB-ZERO VAULT", host: "CYBER_ACE", filled: 2, max: 2, locked: false, ping: "22ms", theme: "CRYONIC TERMINUS" },
    { id: 4, name: "DUSTLINE RUNTIME MATCH", host: "ORBIT_RUNNER", filled: 1, max: 2, locked: true, ping: "16ms", theme: "DUSTLINE RUNTIME" }
  ]);

  const triggerAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const handleCreateRoom = (newRoomData) => {
    const roomId = newRoomData.roomId || '849201';
    const newRoom = {
      id: Date.now(),
      name: `SECTOR ROOM #${roomId}`,
      host: user?.username || "GHOST_CODER",
      filled: 1,
      max: newRoomData.selectedMode === '4v4' ? 8 : 2,
      locked: Boolean(newRoomData.roomPassword && newRoomData.roomPassword.length > 0),
      ping: "12ms",
      theme: (newRoomData.selectedMap || 'SANHOK').toUpperCase()
    };

    setRooms(prev => [newRoom, ...prev]);
    triggerAlert('success', `TACTICAL SECTOR #${roomId} INITIALIZED! (1 ROOM CARD CONSUMED)`);
  };

  const handleJoinRoom = (room) => {
    triggerAlert('info', `DEPLOYING COMPILER INTRUSION FOR SECTOR "${room.name}"...`);
    setTimeout(() => {
      navigate('/arena');
    }, 1200);
  };

  return (
    <div className="room-lobby-viewport">
      {/* Shared Command Header */}
      <CommandHeader onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main 2-Column Split Grid */}
      <main className="room-lobby-main">
        
        {/* Left Column: Active Custom Duel Rooms List */}
        <section className="flex flex-col gap-4 min-h-0">
          <div className="glass-panel-graphite p-5 flex items-center justify-between clip-tactical-card">
            <div className="flex items-center gap-3">
              <Users className="text-[#06B6D4] w-5 h-5" />
              <div>
                <h2 className="font-header text-base font-bold text-white tracking-[0.15em]">
                  ACTIVE CUSTOM SECTOR ROOMS
                </h2>
                <span className="font-code text-[10px] text-gray-400">
                  {rooms.length} ACTIVE ROOMS AVAILABLE
                </span>
              </div>
            </div>

            <button 
              onClick={() => triggerAlert('success', 'SYNCHRONIZING ACTIVE ROOM DIRECTORIES...')}
              className="p-2 bg-white/5 border border-white/10 hover:border-[#06B6D4] text-gray-300 hover:text-[#06B6D4] clip-tactical-badge cursor-pointer"
              title="Refresh Directory"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Rooms List */}
          <div className="flex flex-col gap-3 overflow-y-auto flex-1 custom-scrollbar pr-1">
            {rooms.map((room) => (
              <div key={room.id} className="room-item-card clip-tactical-card">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black/60 border border-white/10 flex items-center justify-center font-code text-[11px] font-bold text-[#F59E0B] clip-tactical-badge">
                    {room.filled}/{room.max}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-header text-sm font-bold text-white tracking-wide">{room.name}</span>
                      {room.locked ? <Lock size={12} className="text-[#F59E0B]" /> : <Unlock size={12} className="text-gray-500" />}
                    </div>
                    <span className="font-code text-[9.5px] text-gray-400">
                      HOST: {room.host} • MAP: {room.theme} • <span className="text-[#06B6D4]">{room.ping}</span>
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => handleJoinRoom(room)}
                  className="btn-join-room clip-tactical-btn"
                >
                  JOIN ROOM
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Initialize Custom Sector Creation Form */}
        <section className="flex flex-col gap-4">
          <div className="glass-panel-graphite p-5 clip-tactical-card h-full">
            <h2 className="font-header text-sm font-bold text-white tracking-[0.15em] border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
              <Plus size={16} className="text-[#F59E0B]" />
              INITIALIZE CUSTOM SECTOR
            </h2>

            <RoomCreate onCreateRoom={handleCreateRoom} />
          </div>
        </section>

      </main>

      {/* Alert Overlay */}
      {alert && (
        <div className="absolute bottom-6 left-8 z-50 bg-black/90 border border-[#06B6D4] p-3 px-5 clip-tactical-card text-xs font-code text-[#06B6D4] flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <CheckCircle size={15} />
          <span>{alert.message}</span>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
