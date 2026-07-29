import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../pages/Dashboard/Dashboard';
import Stream from '../pages/Stream/Stream';
import RoomLobby from '../pages/RoomLobby/RoomLobby';
import Arena from '../pages/Arena/Arena';
import ThemeSelector from '../pages/ThemeSelector/ThemeSelector';
import Analytics from '../pages/Analytics/Analytics';
import Landing from '../pages/Landing/Landing';
import Login from '../pages/Login/Login';
import Inventory from '../pages/Inventory/Inventory';
import Result from '../pages/Result/Result';
import Clan from '../pages/Clan/Clan';

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing entryway page */}
          <Route path="/" element={<Landing />} />

          {/* Authentication Login page */}
          <Route path="/login" element={<Login />} />

          {/* Protected Gaming theme dashboard lobby */}
          <Route 
            path="/lobby" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Custom Room Lobby page */}
          <Route 
            path="/rooms" 
            element={
              <ProtectedRoute>
                <RoomLobby />
              </ProtectedRoute>
            } 
          />
          
          {/* Live stream section */}
          <Route path="/stream" element={<Stream />} />

          {/* Theme selection section */}
          <Route path="/theme" element={<ThemeSelector />} />

          {/* Player Analytics section */}
          <Route path="/analytics" element={<Analytics />} />

          {/* Protected Collaborative Code Arena */}
          <Route 
            path="/arena" 
            element={
              <ProtectedRoute>
                <Arena />
              </ProtectedRoute>
            } 
          />

          {/* Protected Inventory & Locker Room */}
          <Route 
            path="/inventory" 
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            } 
          />

          {/* Protected Match Settlement / Victory Result Screen */}
          <Route 
            path="/result" 
            element={
              <ProtectedRoute>
                <Result />
              </ProtectedRoute>
            } 
          />

          {/* Protected Clan Operations */}
          <Route 
            path="/clan" 
            element={
              <ProtectedRoute>
                <Clan />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
