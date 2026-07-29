import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import Stream from '../pages/Stream/Stream';
import RoomLobby from '../pages/RoomLobby/RoomLobby';
import Arena from '../pages/Arena/Arena';
import ThemeSelector from '../pages/ThemeSelector/ThemeSelector';
import Analytics from '../pages/Analytics/Analytics';
import Landing from '../pages/Landing/Landing';
import Inventory from '../pages/Inventory/Inventory';
import Result from '../pages/Result/Result';
import Clan from '../pages/Clan/Clan';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Landing entryway page */}
        <Route path="/" element={<Landing />} />

        {/* Gaming theme dashboard lobby */}
        <Route path="/lobby" element={<Dashboard />} />
        
        {/* Custom Room Lobby page */}
        <Route path="/rooms" element={<RoomLobby />} />
        
        {/* Live stream section */}
        <Route path="/stream" element={<Stream />} />

        {/* Theme selection section */}
        <Route path="/theme" element={<ThemeSelector />} />

        {/* Player Analytics section */}
        <Route path="/analytics" element={<Analytics />} />

        {/* Collaborative Code Arena */}
        <Route path="/arena" element={<Arena />} />

        {/* Inventory & Locker Room */}
        <Route path="/inventory" element={<Inventory />} />

        {/* Match Settlement / Victory Result Screen */}
        <Route path="/result" element={<Result />} />

        {/* Clan Operations */}
        <Route path="/clan" element={<Clan />} />
        
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
