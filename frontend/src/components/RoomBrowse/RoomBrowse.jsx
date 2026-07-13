import React, { useState } from 'react';
import { Search, Lock, Unlock, Users, Globe, Disc, RefreshCw } from 'lucide-react';
import GamerCard from '../../ui/GamerCard/GamerCard';
import GamerButton from '../../ui/GamerButton/GamerButton';
import './RoomBrowse.css';

export default function RoomBrowse({ rooms = [], onJoinRoom, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Default mock rooms if none are passed in
  const defaultRooms = [
    { id: 1, name: "CYBERPUNK DUELS", host: "NEON_VIPER", filled: 2, max: 3, locked: true, theme: "CYBERPUNK NEON" },
    { id: 2, name: "LOFI CODER CLUB", host: "CODE_REAPER", filled: 1, max: 3, locked: false, theme: "RETRO TERMINAL" },
    { id: 3, name: "METALHEAD COMPILE", host: "CYBER_ACE", filled: 3, max: 3, locked: false, theme: "WASTELAND STEEL" },
    { id: 4, name: "COSMIC CODE LOBBY", host: "ORBIT_RUNNER", filled: 1, max: 3, locked: true, theme: "COSMIC ORBIT" }
  ];

  const roomsToDisplay = rooms.length > 0 ? rooms : defaultRooms;

  const filteredRooms = roomsToDisplay.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.theme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCapacityColorClass = (filled, max) => {
    if (filled === max) return 'capacity-full';
    if (filled === max - 1) return 'capacity-warning';
    return 'capacity-open';
  };

  return (
    <GamerCard title="ACTIVE SQUAD LOBBIES" className="room-browse-card">
      
      {/* Search and Refresh Row */}
      <div className="browse-controls-row">
        <div className="search-hud-box">
          <Search size={16} className="search-icon text-gray-500" />
          <input 
            type="text" 
            placeholder="FILTER BY SQUAD NAME / HOST / THEME..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input font-mono-tactical"
          />
        </div>
        
        <button 
          type="button" 
          className="refresh-hud-btn tooltip-container" 
          onClick={onRefresh}
          title="REFRESH LIST"
        >
          <RefreshCw size={14} className="refresh-icon" />
        </button>
      </div>

      {/* Rooms List */}
      <div className="rooms-container-list">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => {
            const isFull = room.filled >= room.max;
            return (
              <div 
                key={room.id} 
                className={`room-item-card bg-brushed-steel-dark ${isFull ? 'room-card-full' : ''}`}
              >
                <div className="room-card-left">
                  {/* Lock/Unlock Symbol */}
                  <div className={`room-security-badge ${room.locked ? 'sec-locked' : 'sec-open'}`}>
                    {room.locked ? <Lock size={12} /> : <Unlock size={12} />}
                  </div>

                  <div className="room-meta-info">
                    <div className="room-name-row">
                      <span className="room-card-name font-military">{room.name}</span>
                    </div>
                    <div className="room-host-row font-mono-tactical">
                      <span className="host-label">HOST:</span>
                      <span className="host-value">{room.host}</span>
                    </div>
                    <div className="room-theme-badge font-mono-tactical">
                      <Disc size={10} className="theme-disc-icon" />
                      <span>{room.theme}</span>
                    </div>
                  </div>
                </div>

                <div className="room-card-right">
                  {/* Slots Filled Badge */}
                  <div className={`slots-filled-badge font-mono-tactical ${getCapacityColorClass(room.filled, room.max)}`}>
                    <Users size={12} />
                    <span>{room.filled} / {room.max}</span>
                  </div>

                  {/* Join Squad CTA */}
                  <GamerButton
                    variant={isFull ? "steel" : "primary"}
                    size="sm"
                    disabled={isFull}
                    onClick={() => !isFull && onJoinRoom(room)}
                    className="join-squad-btn"
                  >
                    {isFull ? "FULL" : "JOIN SQUAD"}
                  </GamerButton>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-rooms-fallback font-mono-tactical">
            <span className="text-hud-red animate-pulse">!</span>
            <span>NO ACTIVE SQUADS FOUND MATCHING FILTER CRYPTO</span>
          </div>
        )}
      </div>

    </GamerCard>
  );
}
