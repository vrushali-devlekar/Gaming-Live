import React, { useState } from 'react';
import { ArrowLeft, ShieldAlert, CheckCircle, Users, Lock, Unlock, Wifi, Plus, RefreshCw, Swords, DoorOpen, Radio } from 'lucide-react';
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
      host: user?.username || "GHOST_OPERATOR",
      filled: 1,
      max: newRoomData.selectedMode === '4v4' ? 8 : 2,
      locked: Boolean(newRoomData.roomPassword && newRoomData.roomPassword.length > 0),
      ping: "12ms",
      theme: (newRoomData.selectedMap || 'SANHOK').toUpperCase()
    };

    setRooms(prev => [newRoom, ...prev]);
    setIsCreateModalOpen(false);
    triggerAlert('success', `TACTICAL SECTOR #${roomId} INITIALIZED! (1 ROOM CARD CONSUMED)`);
  };

  const handleJoinRoom = (room) => {
    triggerAlert('info', `DEPLOYING COMPILER INTRUSION FOR SECTOR "${room.name}"...`);
    setTimeout(() => {
      navigate('/arena');
    }, 1000);
  };

  return (
    <div className="cyber-room-lobby-viewport">
      {/* Shared Command Header */}
      <CommandHeader onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main 2-Column Split Grid */}
      <main className="room-lobby-main">
        
        {/* Left Column: Active Custom Duel Rooms List */}
        <section className="rooms-list-section">
          <div className="rooms-panel-header">
            <div className="flex items-center gap-3">
              <DoorOpen className="text-lime w-5 h-5" />
              <div>
                <h2 className="font-header text-base font-bold text-white tracking-wider">
                  ACTIVE CUSTOM SECTOR ROOMS
                </h2>
                <span className="font-mono text-xs text-muted">
                  {rooms.length} SECTORS ONLINE • REALTIME SYNC
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => triggerAlert('success', 'SYNCHRONIZING ACTIVE ROOM DIRECTORIES...')}
                className="btn-cyber-ghost p-2"
                title="Refresh Directory"
              >
                <RefreshCw size={14} />
              </button>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-cyber-primary"
              >
                <Plus size={14} />
                <span>CREATE SECTOR ROOM</span>
              </button>
            </div>
          </div>

          {/* Rooms Grid / List */}
          <div className="rooms-scroll-list custom-scrollbar">
            {rooms.map((room) => (
              <div key={room.id} className="room-item-card">
                <div className="flex items-center gap-4">
                  <div className="room-slot-badge">
                    <span className="text-lime font-mono font-bold text-sm">{room.filled}/{room.max}</span>
                    <span className="text-[9px] font-mono text-muted">SLOTS</span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-header text-base font-bold text-white tracking-wide">{room.name}</span>
                      {room.locked ? <Lock size={13} className="text-amber" /> : <Unlock size={13} className="text-muted" />}
                    </div>
                    <span className="font-mono text-xs text-muted mt-0.5">
                      HOST: <strong className="text-white">@{room.host}</strong> • THEME: <span className="text-cyan">{room.theme}</span> • <span className="text-lime">{room.ping}</span>
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => handleJoinRoom(room)}
                  className="btn-cyber-primary py-2 px-4"
                >
                  <Swords size={13} />
                  <span>JOIN DUEL</span>
                </button>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Alert Overlay */}
      {alert && (
        <div className="room-alert-toast">
          <CheckCircle size={16} className="text-lime" />
          <span>{alert.message}</span>
        </div>
      )}

      {/* Room Create Modal */}
      {isCreateModalOpen && (
        <RoomCreate 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateRoom={handleCreateRoom}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
