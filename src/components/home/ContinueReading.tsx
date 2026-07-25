/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Play, BookOpen } from 'lucide-react';

interface ContinueReadingProps {
  bookName: string;
  category: string;
  progress: number;
  pageNumber: number;
  onContinue: () => void;
}

export const ContinueReading: React.FC<ContinueReadingProps> = ({ 
  bookName, 
  category, 
  progress, 
  pageNumber, 
  onContinue 
}) => {
  return (
    <div className="px-6 py-4">
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
        className="bg-gradient-to-br from-primary to-emerald-500 rounded-[3rem] p-8 text-white shadow-2xl shadow-primary/20 relative overflow-hidden cursor-pointer"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-white/20 backdrop-blur-md p-2 rounded-2xl"
            >
              <BookOpen size={20} />
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90 font-bangla">যেখান থেকে শেষ করেছিলে!</span>
          </div>
          
          <h2 className="text-3xl font-black mb-1 line-clamp-1 font-bangla tracking-tight">{bookName}</h2>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <p className="text-white/80 font-black text-[10px] uppercase tracking-[0.2em] font-bangla">{category}</p>
          </div>
          
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest text-white/60 font-bangla">
                <span>পড়ার অগ্রগতি</span>
                <span>{progress}%</span>
              </div>
              <div className="h-4 bg-white/20 rounded-full overflow-hidden p-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-accent rounded-full shadow-sm"
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="bg-white/10 px-3 py-1 rounded-full">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/80 font-bangla">
                    পৃষ্ঠা {pageNumber}
                  </p>
                </div>
              </div>
            </div>
            
            <motion.div 
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-white rounded-[1.8rem] flex items-center justify-center text-primary shadow-xl"
            >
              <Play size={32} fill="currentColor" className="ml-1" />
            </motion.div>
          </div>
        </div>

        {/* Playful Decorative Elements */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full border-8 border-dashed border-white/10" 
        />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-20 w-4 h-4 bg-white/20 rounded-full animate-ping" />
      </motion.div>
    </div>
  );
};
