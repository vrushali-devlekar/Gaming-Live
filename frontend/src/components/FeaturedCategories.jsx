import React from 'react';
import mockData from '../data/mockData.json';
import callOfDutyImg from '../assets/call_of_duty.png';
import nfsPaybackImg from '../assets/nfs_payback.png';

const imageMap = {
  call_of_duty: callOfDutyImg,
  nfs_payback: nfsPaybackImg
};

const FeaturedCategories = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
      {mockData.categories.map((category) => {
        const categoryImage = imageMap[category.imageKey];
        return (
          <div
            key={category.id}
            className="gradient-dark-card border border-slate-800/80 hover:border-purple-500/30 rounded-2xl p-4 flex gap-4 items-center shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.1)] group cursor-pointer"
          >
            {/* Cover Art Image */}
            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-md border border-slate-800/50">
              <img
                src={categoryImage}
                alt={category.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col text-left gap-1.5">
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-pink-500 transition-colors duration-300 tracking-wide">
                {category.title}
              </h3>
              <span className="text-xs text-slate-400 font-medium tracking-wide">
                {category.followers}
              </span>
              <div className="flex gap-2 mt-1">
                {category.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-[10px] font-bold text-purple-400 bg-purple-950/40 rounded-full border border-purple-800/30 group-hover:border-purple-500/40 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedCategories;
