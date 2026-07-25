/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldCheck, 
  User,
  Info, 
  Share2, 
  ChevronRight,
  Mail,
  Moon,
  Palette,
  Type,
  Bell,
  Globe,
  Star
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';

const SettingItem = ({ icon: Icon, label, value, onClick, color = "bg-primary/10 text-primary", darkMode }: any) => (
  <motion.button
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} px-6 py-5 rounded-[2rem] flex items-center justify-between m3-shadow group transition-all`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}>
        <Icon size={22} />
      </div>
      <div className="text-left">
        <h4 className={`font-black ${darkMode ? 'text-gray-100' : 'text-gray-800'} font-bangla`}>{label}</h4>
        {value && <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} font-black uppercase tracking-widest mt-0.5 font-bangla`}>{value}</p>}
      </div>
    </div>
    <ChevronRight size={20} className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} group-hover:text-primary transition-colors`} />
  </motion.button>
);

const SettingSection = ({ title, children, darkMode }: any) => (
  <div className="px-6 mb-8">
    <h3 className={`text-sm font-black ${darkMode ? 'text-gray-600' : 'text-gray-400'} uppercase tracking-[0.2em] mb-4 ml-2 font-bangla`}>{title}</h3>
    <div className="space-y-3">
      {React.Children.map(children, child => 
        React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<any>, { darkMode }) : child
      )}
    </div>
  </div>
);

import { useSettingsStore } from '../providers/settings.store';

export const SettingsScreen = () => {
  const { darkMode, notifications, toggleDarkMode, toggleNotifications } = useSettingsStore();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'নুরানী লাইব্রেরি',
        text: 'নুরানী শিক্ষার্থীদের জন্য একটি অসাধারণ অ্যাপ।',
        url: window.location.href
      }).catch(() => toast.error('শেয়ার করতে সমস্যা হয়েছে'));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('লিঙ্ক কপি করা হয়েছে');
    }
  };

  return (
    <div className={`pb-32 min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-950' : 'bg-warm'}`}>
      <div className={`${darkMode ? 'bg-gray-900 shadow-gray-950/50' : 'bg-white shadow-gray-200/50'} rounded-b-[3rem] shadow-xl px-6 py-12 mb-8`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary">
            <Palette size={22} fill="currentColor" />
          </div>
          <span className="text-xs font-black text-secondary uppercase tracking-[0.2em] font-bangla">অ্যাপ অভিজ্ঞতা</span>
        </div>
        <h1 className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} font-bangla`}>সেটিংস</h1>
        <p className="text-gray-500 font-bold mt-2 font-bangla">আপনার পড়ার অভিজ্ঞতা সাজিয়ে নিন</p>
      </div>

      <SettingSection title="পছন্দসমূহ" darkMode={darkMode}>
        <SettingItem 
          icon={Moon} 
          label="ডার্ক মোড" 
          value={darkMode ? "চালু" : "বন্ধ"} 
          onClick={toggleDarkMode}
          color={darkMode ? "bg-purple-900 text-purple-200" : "bg-purple-100 text-purple-600"}
        />
      </SettingSection>

      <SettingSection title="ডেভোলাপার" darkMode={darkMode}>
        <SettingItem 
          icon={User} 
          label="Ahmed Samim" 
          value="01611532283" 
          onClick={() => window.location.href = 'tel:01611532283'}
          color="bg-blue-100 text-blue-600"
        />
      </SettingSection>
      
      <div className="px-6 pb-10 text-center font-bangla">
        <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest">
          নুরানী শিক্ষার্থীদের জন্য ভালোবাসা দিয়ে তৈরি
        </p>
      </div>
    </div>
  );
};
