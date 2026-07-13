import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import Stream from '../pages/Stream/Stream';
import RoomLobby from '../pages/RoomLobby/RoomLobby';
import Arena from '../pages/Arena/Arena';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Gaming theme dashboard lobby */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Custom Room Lobby page */}
        <Route path="/rooms" element={<RoomLobby />} />
        
        {/* Live stream section */}
        <Route path="/stream" element={<Stream />} />

        {/* Collaborative Code Arena */}
        <Route path="/arena" element={<Arena />} />
        
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
