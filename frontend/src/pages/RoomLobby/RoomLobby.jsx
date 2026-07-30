import React, { useState } from 'react';
import { ArrowLeft, ShieldAlert, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GamerHeader from '../../components/GamerHeader/GamerHeader';
import RoomCreate from '../../components/RoomCreate/RoomCreate';
import RoomBrowse from '../../components/RoomBrowse/RoomBrowse';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import { useAuth } from '../../context/AuthContext';
import './RoomLobby.css';

export default function RoomLobby() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success'|'info'|'error', message: '' }

  // Initial list of active rooms
  const [rooms, setRooms] = useState([
    { id: 1, name: "CYBERPUNK DUELS", host: "NEON_VIPER", filled: 2, max: 3, locked: true, theme: "CYBERPUNK NEON" },
    { id: 2, name: "LOFI CODER CLUB", host: "CODE_REAPER", filled: 1, max: 3, locked: false, theme: "RETRO TERMINAL" },
    { id: 3, name: "METALHEAD COMPILE", host: "CYBER_ACE", filled: 3, max: 3, locked: false, theme: "WASTELAND STEEL" },
    { id: 4, name: "COSMIC CODE LOBBY", host: "ORBIT_RUNNER", filled: 1, max: 3, locked: true, theme: "COSMIC ORBIT" }
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
      name: `SQUAD ROOM #${roomId}`,
      host: user?.username || "GHOST_CODER",
      filled: 1,
      max: newRoomData.selectedMode === '4v4' ? 8 : newRoomData.selectedMode === '100-royale' ? 100 : 2,
      locked: Boolean(newRoomData.roomPassword && newRoomData.roomPassword.length > 0),
      theme: (newRoomData.selectedMap || 'SANHOK').toUpperCase()
    };

    setRooms(prev => [newRoom, ...prev]);
    triggerAlert('success', `TACTICAL ROOM #${roomId} REGISTERED! (1 ROOM CARD CONSUMED)`);
  };

  const handleJoinRoom = (room) => {
    triggerAlert('info', `DEPLOYING COMPILER INTRUSION FOR SQUAD "${room.name}"...`);
  };

  const handleRefresh = () => {
    triggerAlert('success', 'SYNCHRONIZING ACTIVE LOBBY DIRECTORIES...');
  };

  return (
    <div className="gaming-dashboard-page hud-grid hud-scanline">
      
      {/* Top Header Profile bar */}
      <GamerHeader 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        username={user?.username || "GHOST_CODER"} 
        currentXP={2840} 
        maxXP={5000} 
      />

      {/* Breadcrumb Exit row */}
      <div className="lobby-navigation-row">
        <button 
          onClick={() => navigate('/')} 
          className="exit-lobby-btn font-military"
        >
          <ArrowLeft size={16} />
          <span>RETURN TO LOBBY</span>
        </button>
        <span className="lobby-breadcrumbs font-mono-tactical">
          SYSTEM_CONSOLE / CUSTOM_SQUADS / LISTING
        </span>
      </div>

      {/* Main Split Grid */}
      <main className="room-lobby-grid">
        
        {/* Left Side: Create Squad */}
        <section className="room-lobby-left">
          <RoomCreate onCreateRoom={handleCreateRoom} />
        </section>

        {/* Right Side: Browse Squads */}
        <section className="room-lobby-right">
          <RoomBrowse 
            rooms={rooms} 
            onJoinRoom={handleJoinRoom} 
            onRefresh={handleRefresh}
          />
        </section>

      </main>

      {/* Active Alert Overlay Indicator */}
      {alert && (
        <div className={`hud-alert-message alert-type-${alert.type} font-mono-tactical`}>
          {alert.type === 'success' ? (
            <CheckCircle size={16} className="alert-icon" />
          ) : (
            <ShieldAlert size={16} className="alert-icon animate-pulse" />
          )}
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
