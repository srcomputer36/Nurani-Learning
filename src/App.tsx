/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigationStore } from './providers/navigation.store';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { HomeScreen } from './screens/HomeScreen';
import { BooksScreen } from './screens/BooksScreen';
import { ExamScreen } from './screens/ExamScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PdfReaderScreen } from './screens/PdfReaderScreen';
import { Toaster } from 'react-hot-toast';
import { useSettingsStore } from './providers/settings.store';
import { useEffect } from 'react';

export default function App() {
  const { activeTab } = useNavigationStore();
  const { darkMode } = useSettingsStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-warm text-gray-900'} font-sans selection:bg-primary/20 selection:text-primary`}>
      <Toaster position="top-center" />
      
      <main className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <HomeScreen />
            </motion.div>
          )}

          {activeTab === 'books' && (
            <motion.div
              key="books"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <BooksScreen />
            </motion.div>
          )}

          {activeTab === 'exam' && (
            <motion.div
              key="exam"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <ExamScreen />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <SettingsScreen />
            </motion.div>
          )}

          {activeTab === 'reader' && (
            <motion.div
              key="reader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PdfReaderScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Navbar />
    </div>
  );
}
