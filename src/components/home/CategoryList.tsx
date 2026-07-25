/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useBookStore } from '../../providers/book.store';
import { useSettingsStore } from '../../providers/settings.store';
import { CategoryChip } from '../common/CategoryChip';
import { motion } from 'motion/react';

export const CategoryList = () => {
  const { books, categoryFilter, setCategoryFilter } = useBookStore();
  const { darkMode } = useSettingsStore();

  const categories = Array.from(new Set(books.map(b => b.category))).filter(Boolean);

  const categoryColors = ['bg-primary/20 text-primary', 'bg-secondary/20 text-secondary', 'bg-accent/20 text-accent', 'bg-pink-500/20 text-pink-500'];

  return (
    <div className="py-2">
      <div className="px-6 mb-4 flex items-center justify-between">
        <h3 className={`text-xl font-black ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-bangla flex items-center gap-2`}>
          <div className="w-2 h-6 bg-accent rounded-full" />
          বিভাগসমূহ
        </h3>
      </div>
      
      <div className="flex overflow-x-auto gap-4 px-6 pb-4 no-scrollbar">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCategoryFilter('All')}
          className={`px-6 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all shadow-lg font-bangla ${
            categoryFilter === 'All' 
              ? 'bg-primary text-white shadow-primary/20 ring-4 ring-primary/10' 
              : `${darkMode ? 'bg-gray-900 text-gray-500 shadow-gray-950/50 hover:text-gray-300' : 'bg-white text-gray-400 shadow-gray-100 hover:shadow-gray-200'}`
          }`}
        >
          সব মজার বই
        </motion.button>

        {categories.map((category, index) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCategoryFilter(category)}
            className={`px-6 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all shadow-lg ${
              categoryFilter === category 
                ? 'bg-secondary text-white shadow-secondary/20 ring-4 ring-secondary/10' 
                : `${darkMode ? 'bg-gray-900 text-gray-500 shadow-gray-950/50 hover:text-gray-300' : 'bg-white text-gray-400 shadow-gray-100 hover:shadow-gray-200'}`
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
