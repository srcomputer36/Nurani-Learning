/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useBookStore } from '../../providers/book.store';
import { useSettingsStore } from '../../providers/settings.store';
import { motion } from 'motion/react';

export const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useBookStore();
  const { darkMode } = useSettingsStore();

  return (
    <div className="px-6 py-4 relative z-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex items-center gap-3"
      >
        <div className="relative flex-1 group">
          <div className={`absolute inset-y-0 left-6 flex items-center pointer-events-none ${darkMode ? 'text-gray-600' : 'text-gray-300'} group-focus-within:text-primary transition-colors`}>
            <Search size={24} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বই, গল্প বা পড়া খুঁজুন..."
            className={`w-full ${darkMode ? 'bg-gray-900 border-gray-800 text-white placeholder:text-gray-700 shadow-gray-950/50' : 'bg-white border-gray-50 shadow-gray-100'} border-2 rounded-[2rem] py-5 pl-16 pr-6 text-base font-black font-bangla focus:border-primary/30 focus:ring-8 focus:ring-primary/5 transition-all shadow-xl group-hover:shadow-gray-200 outline-none`}
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className={`w-16 h-16 ${darkMode ? 'bg-gray-900 border-gray-800 text-primary shadow-gray-950/50' : 'bg-white border-gray-50 text-primary shadow-gray-100'} border-2 rounded-[1.8rem] flex items-center justify-center transition-all`}
        >
          <SlidersHorizontal size={24} />
        </motion.button>
      </motion.div>
    </div>
  );
};
