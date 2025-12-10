"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const FocusArea = ({ delay = 0, data }: any) => {
  // Safe defaults
  const strength = data?.strength || { area: "General", score: 0 };
  const weakness = data?.weakness || { area: "General", score: 0 };

  return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
        className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-white border border-neutral-200 rounded-3xl shadow-sm hover:shadow-lg hover:border-neutral-400 relative overflow-hidden flex flex-col group transition-all duration-300"
      >
          {/* Extremely subtle purple blur glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-50/10 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="px-4 py-3 border-b border-neutral-100 bg-white/80 backdrop-blur-md flex items-center gap-2 relative z-10">
              <div className="p-1.5 bg-neutral-100 border border-neutral-200 rounded-lg text-black">
                  <Sparkles size={14} />
              </div>
              <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Analysis</h3>
          </div>
          
          {/* Content */}
          <div className="p-4 flex-1 relative z-10 flex flex-col justify-center gap-5">
              
              {/* STRENGTH SECTION */}
              <div>
                  <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Key Strength</span>
                      <span className="text-sm font-black text-black">{strength.score}%</span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 mb-2">{strength.area}</h4>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                      {/* Black Bar */}
                      <div className="h-full bg-black rounded-full" style={{width: `${strength.score}%`}}></div>
                  </div>
              </div>

              {/* WEAKNESS SECTION */}
              <div>
                  <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Improvement Zone</span>
                      <span className="text-sm font-black text-black">{weakness.score}%</span>
                  </div>
                   <h4 className="text-sm font-bold text-neutral-900 mb-2">{weakness.area}</h4>
                   <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                      {/* Gray Bar */}
                      <div className="h-full bg-neutral-400 rounded-full" style={{width: `${weakness.score}%`}}></div>
                  </div>
              </div>

          </div>
      </motion.div>
  );
};

export default FocusArea;