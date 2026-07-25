/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { SearchX } from 'lucide-react';

export const EmptyState = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-10 text-center"
    >
      <div className="relative">
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-32 h-32 bg-white text-primary rounded-[3rem] flex items-center justify-center mb-8 shadow-2xl shadow-primary/10 relative z-10 border-4 border-primary/5"
        >
          <SearchX size={56} />
        </motion.div>
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent/20 rounded-2xl blur-xl" />
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary/20 rounded-2xl blur-xl" />
      </div>
      
      <h3 className="text-3xl font-black text-gray-800 mb-3 font-bangla tracking-tight">ওহ! সব খালি!</h3>
      <p className="text-gray-400 font-bold text-base max-w-[240px] font-bangla leading-relaxed">
        আমরা কোনো বই খুঁজে পাইনি। অন্য কিছু লিখে খুঁজুন!
      </p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.reload()}
        className="mt-8 px-8 py-3 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-2 font-bangla"
      >
        রিফ্রেশ করুন
      </motion.button>
    </motion.div>
  );
};
