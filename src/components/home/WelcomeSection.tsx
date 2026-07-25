/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Sun } from 'lucide-react';

import { useSettingsStore } from '../../providers/settings.store';

export const WelcomeSection = () => {
  const { darkMode } = useSettingsStore();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'শুভ সকাল';
    if (hour < 17) return 'শুভ দুপুর';
    return 'শুভ সন্ধ্যা';
  };

  return (
    <div className={`px-6 pt-12 pb-6 relative overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-gray-900 border-b border-gray-800' : 'bg-gradient-to-br from-primary/5 to-secondary/5'} rounded-b-[4rem]`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10"
      >
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{ 
              rotate: [0, 20, -20, 0],
              scale: [1, 1.2, 1.2, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`w-10 h-10 ${darkMode ? 'bg-accent/10' : 'bg-accent/20'} rounded-2xl flex items-center justify-center text-accent shadow-lg shadow-accent/10`}
          >
            <Sun size={24} fill="currentColor" />
          </motion.div>
          <div className="flex flex-col">
            <span className={`text-[10px] font-black ${darkMode ? 'text-secondary/80' : 'text-secondary'} uppercase tracking-[0.2em] font-bangla`}>
              {getTimeGreeting()}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-[0.2em] font-bangla">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              শেখার মোড চালু আছে
            </div>
          </div>
        </div>
        <h1 className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} leading-tight font-bangla mb-2`}>
          আসসালামু আলাইকুম, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">সোনামণি!</span>
        </h1>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} font-bold text-lg flex items-center gap-2 font-bangla`}>
          আজকে আমরা কী পড়ব?
          <motion.span
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles size={20} className="text-accent" />
          </motion.span>
        </p>
      </motion.div>

      {/* Decorative Floating Blobs */}
      <motion.div 
        animate={{ 
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 ${darkMode ? 'bg-primary/5' : 'bg-primary/10'} rounded-full blur-3xl`} 
      />
      <motion.div 
        animate={{ 
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 ${darkMode ? 'bg-secondary/5' : 'bg-secondary/10'} rounded-full blur-2xl`} 
      />
    </div>
  );
};
