/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Home, Library, Settings, GraduationCap } from 'lucide-react';
import { useNavigationStore, TabType } from '../../providers/navigation.store';
import { useSettingsStore } from '../../providers/settings.store';

const NavItem = ({ 
  tab, 
  activeTab, 
  onClick, 
  icon: Icon, 
  label 
}: { 
  tab: TabType, 
  activeTab: TabType, 
  onClick: (tab: TabType) => void, 
  icon: any, 
  label: string 
}) => {
  const isActive = activeTab === tab;
  
  const { darkMode } = useSettingsStore();
  
  return (
    <button
      onClick={() => onClick(tab)}
      className="flex flex-col items-center justify-center flex-1 py-3 relative group"
    >
      <motion.div 
        animate={{ 
          scale: isActive ? 1.15 : 1,
          y: isActive ? -4 : 0,
          backgroundColor: isActive ? (darkMode ? '#1f2937' : 'white') : 'transparent'
        }}
        className={`w-12 h-12 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 ${isActive ? 'text-primary shadow-xl shadow-primary/10' : 'text-gray-400 group-hover:text-primary/60'}`}
      >
        <Icon size={24} strokeWidth={isActive ? 3 : 2} />
      </motion.div>
      <span className={`text-[9px] font-black mt-2 uppercase tracking-[0.2em] font-bangla transition-colors duration-300 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
        {label}
      </span>
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-1 w-6 h-1.5 bg-primary rounded-full shadow-lg shadow-primary/30"
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      )}
    </button>
  );
};

export const Navbar = () => {
  const { activeTab, setActiveTab } = useNavigationStore();
  const { darkMode } = useSettingsStore();

  if (activeTab === 'reader') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pointer-events-none">
      <nav className={`max-w-md mx-auto backdrop-blur-2xl rounded-[3rem] px-4 py-2 flex justify-around items-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] border pointer-events-auto transition-colors duration-500 ${darkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-white'}`}>
        <NavItem tab="home" activeTab={activeTab} onClick={setActiveTab} icon={Home} label="হোম" />
        <NavItem tab="books" activeTab={activeTab} onClick={setActiveTab} icon={Library} label="লাইব্রেরি" />
        <NavItem tab="exam" activeTab={activeTab} onClick={setActiveTab} icon={GraduationCap} label="পরিক্ষা" />
        <NavItem tab="settings" activeTab={activeTab} onClick={setActiveTab} icon={Settings} label="সেটিংস" />
      </nav>
    </div>
  );
};
