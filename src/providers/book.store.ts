/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { Book } from '../models/book.model';
import { BookRepository } from '../repositories/book.repository';
import { CacheService } from '../services/cache.service';
import { APP_CONSTANTS } from '../core/constants/app.constants';
import { Logger } from '../utils/logger';

interface BookState {
  books: Book[];
  filteredBooks: Book[];
  isLoading: boolean;
  error: string | null;
  spreadsheetId: string | null;
  searchQuery: string;
  categoryFilter: string;
  _applyFilters: () => void;
  
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  loadBooks: (forceRefresh?: boolean) => Promise<void>;
  syncWithSheet: () => Promise<void>;
}

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  filteredBooks: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  categoryFilter: 'All',
  spreadsheetId: null, // Keep for type compatibility but unused

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get()._applyFilters();
  },

  setCategoryFilter: (category) => {
    set({ categoryFilter: category });
    get()._applyFilters();
  },

  _applyFilters: () => {
    const { books, searchQuery, categoryFilter } = get();
    let filtered = [...books];

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(b => b.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.bookName.toLowerCase().includes(q) || 
        b.category.toLowerCase().includes(q)
      );
    }

    set({ filteredBooks: filtered });
  },

  loadBooks: async (forceRefresh = false) => {
    set({ isLoading: true, error: null });
    
    try {
      // 1. Check cache first
      if (!forceRefresh) {
        const cached = CacheService.get<Book[]>(APP_CONSTANTS.CACHE_KEYS.BOOKS);
        if (cached && cached.length > 0) {
          set({ books: cached, filteredBooks: cached, isLoading: false });
          return;
        }
      }

      // 2. Sync with remote
      await get().syncWithSheet();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  syncWithSheet: async () => {
    set({ isLoading: true });
    try {
      const remoteBooks = await BookRepository.fetchBooks(APP_CONSTANTS.API_BASE_URL);
      
      // Save to cache
      CacheService.set(APP_CONSTANTS.CACHE_KEYS.BOOKS, remoteBooks);
      CacheService.setLastSync();
      
      set({ 
        books: remoteBooks, 
        filteredBooks: remoteBooks, 
        isLoading: false,
        error: null 
      });
      get()._applyFilters();
    } catch (error: any) {
      Logger.error('Sync error:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));
