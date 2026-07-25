/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface CategoryChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  color?: string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ label, isActive, onClick, color = 'primary' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap m3-shadow ${
        isActive 
          ? `bg-${color} text-white shadow-lg shadow-${color}/20` 
          : 'bg-white text-gray-500 hover:bg-gray-50'
      }`}
    >
      {label}
    </motion.button>
  );
};
