/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CloudOff, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-10 text-center"
    >
      <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mb-6 m3-shadow-lg">
        <CloudOff size={48} />
      </div>
      <h3 className="text-2xl font-black text-gray-800 mb-2 font-bangla">
        {message?.includes('configured') ? 'সেটআপ প্রয়োজন' : 'কানেকশন সমস্যা'}
      </h3>
      <p className="text-gray-500 font-bold text-sm max-w-[250px] mb-8 font-bangla leading-relaxed">
        {message || "বইগুলো লোড করা সম্ভব হয়নি। দয়া করে আপনার ইন্টারনেট কানেকশন চেক করে আবার চেষ্টা করুন।"}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-[1.5rem] font-black shadow-xl shadow-primary/20 transition-all font-bangla tracking-wider"
      >
        <RefreshCw size={20} />
        <span>আবার চেষ্টা করুন</span>
      </motion.button>
    </motion.div>
  );
};
