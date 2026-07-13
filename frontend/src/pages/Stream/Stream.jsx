import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import VideoPlayer from '../../components/VideoPlayer';
import FeaturedCategories from '../../components/FeaturedCategories';
import OtherVideos from '../../components/OtherVideos';
import LiveChat from '../../components/LiveChat';

export default function Stream() {
  return (
    <div className="flex min-h-screen bg-dark-bg text-slate-100 font-sans select-none antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <Header />

        {/* Dash Grid Dashboard Layout */}
        <main className="p-6 flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 max-w-[1600px] mx-auto w-full">
          
          {/* Main Video & Content Column */}
          <section className="xl:col-span-3 flex flex-col gap-6">
            
            {/* Primary Live Stream Player */}
            <VideoPlayer />
            
            {/* Featured Categories Side-by-Side Cards */}
            <FeaturedCategories />
            
            {/* Additional Videos List Grid */}
            <OtherVideos />

          </section>

          {/* Sticky Live Chat Column */}
          <section className="xl:col-span-1 h-full">
            <LiveChat />
          </section>

        </main>
      </div>
    </div>
  );
}
