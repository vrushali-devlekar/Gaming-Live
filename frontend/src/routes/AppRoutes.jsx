import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import Stream from '../pages/Stream/Stream';
import RoomLobby from '../pages/RoomLobby/RoomLobby';
import Arena from '../pages/Arena/Arena';
import ThemeSelector from '../pages/ThemeSelector/ThemeSelector';
import Analytics from '../pages/Analytics/Analytics';
import Landing from '../pages/Landing/Landing';

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
        
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
