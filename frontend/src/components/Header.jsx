import React from 'react';
import { Search, Mic, Video, Bell, ChevronDown } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-20 w-full bg-dark-bg/80 backdrop-blur-md px-6 flex items-center justify-between border-b border-card-bg/50 sticky top-0 z-40">
      
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl gradient-pink-purple flex items-center justify-center shadow-lg shadow-purple-500/20">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 18.5C8.41 18.5 5.5 15.59 5.5 12C5.5 8.41 8.41 5.5 12 5.5C15.59 5.5 18.5 8.41 18.5 12C18.5 15.59 15.59 18.5 12 18.5Z" fill="currentColor"/>
            <path d="M12 7.5C9.51 7.5 7.5 9.51 7.5 12C7.5 14.49 9.51 16.5 12 16.5C14.49 16.5 16.5 14.49 16.5 12C16.5 9.51 14.49 7.5 12 7.5Z" fill="currentColor"/>
          </svg>
        </div>
        <span className="text-xl font-bold text-white tracking-wide font-sans">Orizon</span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-8 relative">
        <div className="relative flex items-center w-full bg-[#13112a] rounded-full border border-slate-800 focus-within:border-purple-500/60 focus-within:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all duration-300">
          <div className="pl-4 text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search streams"
            className="w-full bg-transparent py-2.5 pl-3 pr-10 text-sm text-slate-200 outline-none placeholder:text-slate-500 font-sans"
          />
          <button className="absolute right-3.5 text-slate-400 hover:text-white transition-colors">
            <Mic size={18} />
          </button>
        </div>
      </div>

      {/* Header Actions & Profile */}
      <div className="flex items-center gap-5">
        
        {/* Start Stream CTA */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-full gradient-pink-purple hover:opacity-95 hover:scale-102 active:scale-98 transition-all duration-200 shadow-md shadow-pink-500/10 text-sm font-semibold text-white">
          <Video size={16} />
          <span>Start Stream</span>
        </button>

        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-full bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800/80 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-pink-500 rounded-full border border-[#0d0c1d] flex items-center justify-center text-[8px] text-white font-bold p-1 animate-pulse">
            2
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800 cursor-pointer group">
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 to-purple-500">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              alt="User profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
              Galibe Hasan J.
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              10K Followers
            </span>
          </div>
          <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-200 transition-colors" />
        </div>

      </div>

    </header>
  );
};

export default Header;
