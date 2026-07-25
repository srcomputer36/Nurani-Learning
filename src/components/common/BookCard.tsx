/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Heart, BookOpen } from 'lucide-react';
import { Book } from '../../models/book.model';
import { useReadingStore } from '../../providers/reading.store';
import { useFavoriteStore } from '../../providers/favorite.store';
import { useSettingsStore } from '../../providers/settings.store';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
  variant?: 'compact' | 'large';
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick, variant = 'compact' }) => {
  const { getProgress } = useReadingStore();
  const { favorites, toggleFavorite } = useFavoriteStore();
  const { darkMode } = useSettingsStore();

  const isFavorite = favorites.includes(book.fileId);
  
  // Get reading progress for this book
  const bookEntry = getProgress(book.fileId);
  const bookProgress = bookEntry ? bookEntry.progress : 0;
  
  // Google Drive Thumbnail
  const thumbnailUrl = `https://drive.google.com/thumbnail?id=${book.fileId}&sz=w400`;

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative group rounded-[2.5rem] overflow-hidden shadow-xl transition-all cursor-pointer flex-shrink-0 ${
        darkMode ? 'bg-gray-900 shadow-gray-950/50' : 'bg-white shadow-gray-100'
      } ${
        variant === 'large' ? 'w-56' : 'w-full'
      }`}
      onClick={() => onClick(book)}
    >
      {/* Book Cover */}
      <div className={`relative aspect-[3/4] overflow-hidden p-2 ${darkMode ? 'bg-gray-800' : 'bg-warm/30'}`}>
        <img 
          src={thumbnailUrl} 
          alt={book.bookName}
          className="w-full h-full object-cover rounded-[1.8rem] shadow-sm transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        <motion.button
          whileHover={{ scale: 1.2, rotate: 15 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(book);
          }}
          className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors z-10 ${
            darkMode ? 'bg-gray-900/80 text-gray-400' : 'bg-white/80 text-gray-500'
          } backdrop-blur-md`}
        >
          <Heart 
            size={20} 
            className={isFavorite ? 'text-pink-500 fill-current' : (darkMode ? 'text-gray-600' : 'text-gray-300')} 
          />
        </motion.button>

        {/* Progress Bar Overlay */}
        {bookProgress > 0 && (
          <div className={`absolute bottom-4 left-4 right-4 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-black/10'} backdrop-blur-sm`}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${bookProgress}%` }}
              className="h-full bg-primary"
            />
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className={`px-5 py-4 transition-colors ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="mb-2">
          <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1 rounded-full font-bangla ${
            darkMode ? 'bg-secondary/20 text-secondary-light' : 'bg-secondary/10 text-secondary'
          }`}>
            {book.category}
          </span>
        </div>
        <h3 className={`font-black text-sm line-clamp-2 leading-tight h-10 font-bangla ${
          darkMode ? 'text-gray-100' : 'text-gray-800'
        }`}>
          {book.bookName}
        </h3>
        
        <div className="mt-4 flex items-center justify-between">
          <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider font-bangla ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${bookProgress > 0 ? 'bg-primary animate-pulse' : (darkMode ? 'bg-gray-800' : 'bg-gray-200')}`} />
            <span>{bookProgress > 0 ? `${bookProgress}% পড়া হয়েছে` : 'পড়া শুরু কর'}</span>
          </div>
          <motion.div 
            whileHover={{ scale: 1.2 }}
            className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <BookOpen size={18} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
