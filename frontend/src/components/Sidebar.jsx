import React from 'react';
import { Home, Compass, Users, Clock, FolderHeart } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Compass, label: 'Discover', active: false },
    { icon: Users, label: 'Community', active: false },
    { icon: Clock, label: 'History', active: false },
    { icon: FolderHeart, label: 'Library', active: false },
  ];

  const followingStreamers = [
    {
      id: 1,
      name: 'Alpha Strike',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      online: true
    },
    {
      id: 2,
      name: 'CyberVixen',
      avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      online: true
    },
    {
      id: 3,
      name: 'PixelKnight',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      online: true
    },
    {
      id: 4,
      name: 'NeonPulse',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      online: true
    },
    {
      id: 5,
      name: 'GamerGlint',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      online: true
    }
  ];

  return (
    <>
      <aside className="hidden md:flex w-20 min-h-screen bg-card-bg/60 border-r border-card-bg/85 flex-col items-center py-6 gap-8 flex-shrink-0">
        {/* Brand Icon (Duplicate of logo shape for branding consistency in sidebar, but simplified) */}
        <div className="relative group cursor-pointer mb-2">
          <div className="w-10 h-10 rounded-xl gradient-pink-purple flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <div className="absolute left-14 top-2 bg-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
            Orizon Home
          </div>
        </div>

        {/* Menu Label */}
        <div className="w-full px-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block text-center mb-4">Menu</span>
          
          {/* Menu Items */}
          <div className="flex flex-col gap-5 items-center w-full">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center relative group transition-all duration-300 ${
                    item.active 
                      ? 'gradient-pink-purple text-white shadow-lg shadow-pink-500/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon size={20} className={item.active ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' : ''} />
                  
                  {/* Tooltip */}
                  <div className="absolute left-16 bg-slate-900 text-xs text-slate-200 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap shadow-xl border border-slate-800 z-50">
                    {item.label}
                  </div>
                  
                  {/* Active side indicator */}
                  {item.active && (
                    <div className="absolute right-0 w-1 h-6 bg-pink-500 rounded-l-md" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="w-8 h-[1px] bg-slate-800 my-2" />

        {/* Following Section */}
        <div className="w-full px-2 flex flex-col items-center flex-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block text-center mb-4">Following</span>
          
          <div className="flex flex-col gap-4 items-center">
            {followingStreamers.map((streamer) => (
              <div key={streamer.id} className="relative group cursor-pointer">
                <div className="w-10 h-10 rounded-full p-[2px] bg-slate-800 hover:bg-gradient-to-tr hover:from-pink-500 hover:to-purple-500 transition-all duration-300">
                  <img
                    src={streamer.avatar}
                    alt={streamer.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                
                {/* Online Indicator Badge */}
                {streamer.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-dark-bg rounded-full shadow-sm shadow-green-500/50 animate-pulse" />
                )}
                
                {/* Tooltip */}
                <div className="absolute left-16 top-1 bg-slate-900 text-xs text-slate-200 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap shadow-xl border border-slate-800 z-50">
                  <div className="font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {streamer.name}
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Streaming Cyberpunk</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#151722]/95 border-t border-[#2d3142]/60 flex items-center justify-around px-4 z-40 backdrop-blur-md shadow-2xl">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className={`p-2.5 rounded-xl flex flex-col items-center justify-center relative transition-all duration-300 ${
                item.active 
                  ? 'text-pink-500' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={20} className={item.active ? 'drop-shadow-[0_0_8px_rgba(239,70,111,0.4)]' : ''} />
              
              {/* Active bottom indicator dot */}
              {item.active && (
                <div className="absolute bottom-1 w-1.5 h-1.5 bg-pink-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
