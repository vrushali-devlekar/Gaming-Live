import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RefreshCw } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-[#0b0e14] flex flex-col items-center justify-center text-center p-6">
        <RefreshCw className="animate-spin text-[#00ffcc] w-10 h-10 mb-4" />
        <span className="font-military text-sm text-[#00ffcc] tracking-widest font-bold animate-pulse">
          VERIFYING TACTICAL AUTHENTICATION CREDENTIALS...
        </span>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
