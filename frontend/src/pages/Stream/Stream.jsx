import React, { useState } from 'react';
import VideoPlayer from '../../components/VideoPlayer';
import LiveChat from '../../components/LiveChat';
import CommandHeader from '../../components/CommandHeader/CommandHeader';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import { Radio, Eye, Sparkles, Activity } from 'lucide-react';
import './Stream.css';

export default function Stream() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="cyber-stream-viewport">
      {/* Shared Command Header */}
      <CommandHeader onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Broadcast Grid Layout */}
      <main className="stream-main-grid">
        
        {/* Left 75%: Live Match Code Execution View */}
        <section className="stream-video-col custom-scrollbar">
          
          <div className="stream-broadcast-header">
            <div className="flex items-center gap-3">
              <span className="live-pill">
                <Radio size={14} className="animate-pulse" />
                <span>LIVE ESPORTS FEED</span>
              </span>
              <span className="font-header text-sm font-bold text-white tracking-wider">
                ESPORTS BROADCAST STUDIO // MATCH ARENA
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-lime">
              <Eye size={14} />
              <span>1,842 SPECTATORS ONLINE</span>
            </div>
          </div>

          {/* Primary Stream Video Player */}
          <div className="video-player-wrapper">
            <VideoPlayer />
          </div>
        </section>

        {/* Right 25%: Tactical Kill Feed & Squad Comms */}
        <section className="stream-chat-col">
          <LiveChat />
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
