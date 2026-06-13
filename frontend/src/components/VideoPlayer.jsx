import React, { useState } from 'react';
import { Heart, Share2, MoreHorizontal, Check } from 'lucide-react';
import ReactPlayer from 'react-player';

const VideoPlayer = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="gradient-dark-card border border-slate-800/80 rounded-3xl p-5 flex flex-col gap-4 shadow-xl neon-border-glow">
      
      {/* Video Screen Container */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden group shadow-2xl border border-slate-800/40 bg-slate-950">
        
        {/* React Player embedding a live walktrough loop */}
        <div className="absolute inset-0 w-full h-full">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=L8XMRyL8Rrs"
            playing={true}
            loop={true}
            muted={true}
            width="100%"
            height="100%"
            config={{
              youtube: {
                playerVars: { 
                  showinfo: 0, 
                  controls: 0, 
                  rel: 0, 
                  iv_load_policy: 3, 
                  modestbranding: 1,
                  autoplay: 1
                }
              }
            }}
          />
        </div>

        {/* Neon HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-10">
          {/* Top Edge Neon Accents */}
          <div className="flex justify-between items-start">
            <svg className="w-24 h-8 text-pink-500/40" viewBox="0 0 100 30" fill="none">
              <path d="M0 0 H90 L100 15 V30" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            
            {/* Cute Neon Head Outline Overlay */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-70">
              <svg className="w-16 h-16 text-pink-500/60 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 50 C20 30 35 15 50 15 C65 15 80 30 80 50 C80 62 72 75 65 82 L50 95 L35 82 C28 75 20 62 20 50 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M30 45 C35 45 35 40 40 40 C45 40 45 45 50 45" stroke="currentColor" strokeWidth="2"/>
                <path d="M50 45 C55 45 55 40 60 40 C65 40 65 45 70 45" stroke="currentColor" strokeWidth="2"/>
                <path d="M40 65 Q50 75 60 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M25 25 L35 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M75 25 L65 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Bottom Edge Neon Accents */}
          <div className="flex justify-between items-end">
            <svg className="w-28 h-8 text-purple-500/40" viewBox="0 0 120 30" fill="none">
              <path d="M0 30 H110 L120 10 V0" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* "Live" Badge */}
        <div className="absolute top-4 right-4 bg-pink-600/95 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-pink-500/30 border border-pink-400/30 z-20">
          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
          <span className="w-2 h-2 bg-white rounded-full absolute left-[14px]" />
          <span className="text-[10px] font-bold tracking-wider text-white uppercase">Live</span>
        </div>

        {/* Small Gamer PiP Cam */}
        <div className="absolute bottom-4 right-4 w-32 aspect-video rounded-lg overflow-hidden border border-purple-500/50 shadow-lg shadow-purple-500/20 bg-slate-950/90 group-hover:scale-102 transition-transform duration-300 z-20">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=60"
            alt="Streamer Facecam"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1 left-1 bg-black/60 px-1 py-0.5 rounded text-[8px] font-semibold text-slate-300">
            Alpha Cam
          </div>
        </div>

      </div>

      {/* Tags and Watchers Count */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          {['Cyber Punk', 'Survival', 'Action'].map((tag) => (
            <span
              key={tag}
              className="px-3.5 py-1.5 text-xs font-semibold text-purple-400 bg-purple-950/40 rounded-full border border-purple-800/30 hover:border-purple-500/50 transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="text-slate-400 text-sm font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
          <span>1,647,514 watching</span>
        </div>
      </div>

      {/* Main Title Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide font-sans hover:text-pink-500 transition-colors duration-300 cursor-pointer">
          Cyberpunk 2077 drive mission
        </h1>
        <button
          onClick={() => setIsSubscribed(!isSubscribed)}
          className={`px-6 py-2.5 rounded-full transition-all duration-300 font-bold text-sm select-none cursor-pointer ${
            isSubscribed
              ? 'bg-slate-800 text-slate-300 border border-slate-700/80 hover:bg-slate-700/50'
              : 'gradient-pink-purple text-white hover:opacity-90 hover:shadow-[0_0_15px_rgba(255,0,127,0.3)] hover:scale-102 active:scale-98'
          }`}
        >
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>

      {/* Streamer Detail Bar */}
      <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-1 flex-wrap gap-4">
        {/* Streamer Profile */}
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer">
            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 to-purple-500 shadow-md shadow-purple-500/10">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60"
                alt="Alpha Strike"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {/* Verified badge */}
            <span className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white rounded-full p-0.5 border-2 border-dark-bg">
              <Check size={8} strokeWidth={4} />
            </span>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-slate-100 hover:text-white transition-colors cursor-pointer">
                Alpha Strike
              </span>
            </div>
            <span className="text-xs text-purple-400/80 font-semibold">
              7.8M followers
            </span>
          </div>
        </div>

        {/* Streamer Social Actions */}
        <div className="flex items-center gap-3">
          {/* Favorite Heart Button */}
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
              isFavorited
                ? 'bg-gradient-to-tr from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30 scale-105'
                : 'bg-slate-800/70 hover:bg-slate-800 border border-slate-700/40 text-slate-300 hover:text-pink-500'
            }`}
          >
            <Heart
              size={18}
              fill={isFavorited ? 'currentColor' : 'none'}
              className={isFavorited ? 'scale-110 transition-transform duration-300' : ''}
            />
          </button>
          
          {/* Share Button */}
          <button className="w-10 h-10 rounded-full bg-slate-800/70 hover:bg-slate-800 hover:text-white border border-slate-700/40 text-slate-300 flex items-center justify-center transition-all cursor-pointer">
            <Share2 size={16} />
          </button>

          {/* More options Button */}
          <button className="w-10 h-10 rounded-full bg-slate-800/70 hover:bg-slate-800 hover:text-white border border-slate-700/40 text-slate-300 flex items-center justify-center transition-all cursor-pointer">
            <MoreHorizontal size={18} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default VideoPlayer;
