/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { useBookStore } from '../providers/book.store';
import { useNavigationStore } from '../providers/navigation.store';
import { BookCard } from '../components/common/BookCard';
import { SearchBar } from '../components/home/SearchBar';
import { CategoryList } from '../components/home/CategoryList';
import { useSettingsStore } from '../providers/settings.store';
import { Book } from '../models/book.model';
import { Library } from 'lucide-react';

export const BooksScreen = () => {
  const { openReader } = useNavigationStore();
  const { filteredBooks, isLoading, error, syncWithSheet } = useBookStore();
  const { darkMode } = useSettingsStore();

  const handleBookClick = (book: Book) => {
    openReader(book);
  };

  return (
    <div className={`pb-32 transition-colors duration-500 ${darkMode ? 'bg-gray-950' : 'bg-warm'} min-h-screen`}>
      <div className={`${darkMode ? 'bg-gray-900 shadow-gray-950/50' : 'bg-white shadow-gray-200/50'} rounded-b-[3rem] shadow-xl px-6 py-12 mb-2 transition-colors duration-500`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
            <Library size={22} fill="currentColor" />
          </div>
          <span className="text-xs font-black text-primary uppercase tracking-[0.2em] font-bangla">লাইব্রেরি তালিকা</span>
        </div>
        <h1 className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} font-bangla`}>সব বই</h1>
        <p className="text-gray-500 font-bold mt-2 font-bangla">ইসলামী জ্ঞানের ভাণ্ডার ঘুরে দেখুন</p>
      </div>

      <SearchBar />
      <CategoryList />

      <div className="px-6 mt-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingSkeleton />
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ErrorState message={error} onRetry={syncWithSheet} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-6"
            >
              {filteredBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onClick={handleBookClick} 
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoading && filteredBooks.length === 0 && <EmptyState />}
      </div>
    </div>
  );
};
