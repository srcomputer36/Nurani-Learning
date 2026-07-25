/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, Settings, BookOpen } from 'lucide-react';
import { useNavigationStore } from '../../providers/navigation.store';

export const Header = () => {
  const { setActiveTab } = useNavigationStore();

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md z-40 px-6 py-4 flex items-center justify-between border-b border-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#2E7D32] rounded-xl flex items-center justify-center shadow-sm">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-[#2E7D32] tracking-tight">
          Nurani Learning
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={22} />
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Settings size={22} />
        </button>
      </div>
    </header>
  );
};
