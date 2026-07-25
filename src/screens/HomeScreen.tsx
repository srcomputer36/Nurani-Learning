/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WelcomeSection } from '../components/home/WelcomeSection';
import { SearchBar } from '../components/home/SearchBar';
import { CategoryList } from '../components/home/CategoryList';
import { ContinueReading } from '../components/home/ContinueReading';
import { BookCard } from '../components/common/BookCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { useBookStore } from '../providers/book.store';
import { useReadingStore } from '../providers/reading.store';
import { useNavigationStore } from '../providers/navigation.store';
import { useSettingsStore } from '../providers/settings.store';
import { Book } from '../models/book.model';
import { RefreshCw, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const HomeScreen = () => {
  const { getRecentProgress, history } = useReadingStore();
  const { openReader } = useNavigationStore();
  const { 
    filteredBooks, 
    books,
    isLoading, 
    error, 
    loadBooks, 
    syncWithSheet,
    categoryFilter
  } = useBookStore();

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleBookClick = (book: Book) => {
    openReader(book);
  };

  const progress = getRecentProgress();

  const { darkMode } = useSettingsStore();

  const SectionHeader = ({ title, showSeeAll = true }: { title: string, showSeeAll?: boolean }) => (
    <div className="px-6 mt-10 mb-5 flex items-center justify-between">
      <div className="flex flex-col">
        <h3 className={`text-2xl font-black ${darkMode ? 'text-gray-100' : 'text-gray-800'} font-bangla leading-tight tracking-tight`}>
          {title}
        </h3>
        <div className="w-12 h-1.5 bg-accent rounded-full mt-1.5" />
      </div>
      {showSeeAll && (
        <motion.button 
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-1.5 text-primary font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-2xl shadow-sm border font-bangla transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-50'}`}
        >
          সব দেখুন <ChevronRight size={14} />
        </motion.button>
      )}
    </div>
  );

  return (
    <div className={`pb-32 transition-colors duration-500 ${darkMode ? 'bg-gray-950' : 'bg-warm'} min-h-screen selection:bg-primary/20`}>
      <div className={`${darkMode ? 'bg-gray-900 shadow-gray-950/20' : 'bg-white shadow-primary/5'} rounded-b-[4rem] shadow-2xl pb-8 relative overflow-hidden transition-colors duration-500`}>
        {/* Background Decorative Elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
        
        <WelcomeSection />
        <SearchBar />
      </div>
      
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            {progress && books.some(b => b.fileId === progress.bookId) && (
              <div className="animate-float">
                <ContinueReading 
                  bookName={progress.bookName}
                  category={progress.category}
                  progress={progress.progress}
                  pageNumber={progress.pageNumber}
                  onContinue={() => {
                    const book = books.find(b => b.fileId === progress.bookId);
                    if (book) {
                      openReader(book);
                    }
                    toast.success('আবার পড়া শুরু হচ্ছে...');
                  }}
                />
              </div>
            )}

            <div className="mt-4">
              <CategoryList />
            </div>

            {filteredBooks.length > 0 && (
              <motion.div 
                layout
                className="mt-4"
              >
                <SectionHeader title={categoryFilter === 'All' ? 'মজার মজার সব বই' : `${categoryFilter} সংগ্রহ`} />
                <div className="px-6 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {filteredBooks.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <BookCard 
                        book={book} 
                        onClick={handleBookClick} 
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {filteredBooks.length === 0 && <EmptyState />}
            
            <div className="px-6 py-10 flex flex-col items-center gap-4">
               <button 
                onClick={() => syncWithSheet()}
                disabled={isLoading}
                className={`flex items-center gap-2 px-8 py-4 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'} rounded-2xl font-bold m3-shadow-lg active:scale-95 transition-all`}
              >
                <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                <span>Sync Library</span>
              </button>
              <p className={`text-[10px] uppercase tracking-widest font-black ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>
                Library managed by Nurani Learning
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
