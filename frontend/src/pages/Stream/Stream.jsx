import React, { useState } from 'react';
import VideoPlayer from '../../components/VideoPlayer';
import LiveChat from '../../components/LiveChat';
import CommandHeader from '../../components/CommandHeader/CommandHeader';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import { Flame, Radio, Eye } from 'lucide-react';
import './Stream.css';

export default function Stream() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="stream-studio-viewport">
      {/* Shared Command Header */}
      <CommandHeader onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Broadcast Grid Layout */}
      <main className="stream-main-grid">
        
        {/* Left 75%: Live Match Code Execution View */}
        <section className="flex flex-col gap-4 min-h-0 overflow-y-auto custom-scrollbar pr-1">
          
          <div className="glass-panel-graphite p-3 px-5 flex items-center justify-between clip-tactical-card">
            <div className="flex items-center gap-3">
              <Radio size={16} className="text-[#FF3366] animate-pulse" />
              <span className="font-header text-sm font-bold text-white tracking-[0.15em]">
                ESPORTS BROADCAST STUDIO // LIVE MATCH ARENA
              </span>
            </div>

            <div className="flex items-center gap-2 font-code text-[10px] text-[#06B6D4]">
              <Eye size={13} />
              <span>SPECTATOR MODE (1,842 VIEWERS)</span>
            </div>
          </div>

          {/* Primary Stream Video Player */}
          <VideoPlayer />
        </section>

        {/* Right 25%: Tactical Kill Feed & Squad Comms */}
        <section className="flex flex-col gap-4 min-h-0 h-full">
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
