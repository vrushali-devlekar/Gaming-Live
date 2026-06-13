import React from 'react';
import { Check } from 'lucide-react';
import mockData from '../data/mockData.json';
import videoCyberpunk from '../assets/video_cyberpunk.png';
import videoEgypt from '../assets/video_egypt.png';
import videoPubg from '../assets/video_pubg.png';

const imageMap = {
  video_cyberpunk: videoCyberpunk,
  video_egypt: videoEgypt,
  video_pubg: videoPubg
};

const OtherVideos = () => {
  return (
    <div className="w-full flex flex-col gap-5 text-left">
      
      {/* Header section */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-bold text-white tracking-wide font-sans">
          Other videos
        </h2>
        <button className="px-5 py-2 rounded-full gradient-pink-purple text-xs font-bold text-white hover:opacity-95 hover:shadow-[0_0_12px_rgba(255,0,127,0.25)] transition-all">
          View all
        </button>
      </div>

      {/* Grid of video cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockData.otherVideos.map((video) => {
          const videoThumbnail = imageMap[video.imageKey];
          return (
            <div
              key={video.id}
              className="flex flex-col gap-3 group cursor-pointer"
            >
              {/* Video Thumbnail Wrapper */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-slate-800/60 shadow-md">
                <img
                  src={videoThumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Play Button Overlay (Micro-interaction) */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-pink-500/90 flex items-center justify-center text-white shadow-lg shadow-pink-500/40 scale-90 group-hover:scale-100 transition-transform duration-300">
                    <svg className="w-6 h-6 fill-current pl-1" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Info Row: Avatar, Streamer name, Verified, Category Tag */}
              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      src={video.streamerAvatar}
                      alt={video.streamer}
                      className="w-6 h-6 rounded-full object-cover border border-purple-500/30"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white rounded-full p-[1px] border border-dark-bg">
                      <Check size={5} strokeWidth={5} />
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                    {video.streamer}
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-bold text-purple-400 bg-purple-950/40 rounded border border-purple-800/30">
                  {video.tag}
                </span>
              </div>

              {/* Title & Metadata details */}
              <div className="flex flex-col text-left gap-1 px-1">
                <h4 className="text-sm font-bold text-slate-100 group-hover:text-pink-500 transition-colors line-clamp-1 leading-snug">
                  {video.title}
                </h4>
                <p className="text-[11px] font-semibold text-slate-400">
                  • {video.views} &nbsp;• {video.date}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default OtherVideos;
