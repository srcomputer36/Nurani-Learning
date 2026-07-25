/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { APP_CONSTANTS } from '../core/constants/app.constants';

export interface ReadingProgress {
  bookId: string;
  bookName: string;
  category: string;
  pageNumber: number;
  progress: number;
  lastRead: number;
  openCount: number;
}

interface ReadingState {
  recentBookId: string | null;
  history: Record<string, ReadingProgress>;
  updateProgress: (data: Omit<ReadingProgress, 'lastRead' | 'openCount'>) => void;
  incrementOpenCount: (bookId: string) => void;
  getProgress: (bookId: string) => ReadingProgress | undefined;
  getRecentProgress: () => ReadingProgress | null;
  clearHistory: () => void;
}

export const useReadingStore = create<ReadingState>()(
  persist(
    (set, get) => ({
      recentBookId: null,
      history: {},
      updateProgress: (data) => {
        const { history } = get();
        const existing = history[data.bookId] || { openCount: 0 };
        
        const updatedEntry: ReadingProgress = {
          ...data,
          lastRead: Date.now(),
          openCount: existing.openCount || 1,
        };

        set({
          recentBookId: data.bookId,
          history: {
            ...history,
            [data.bookId]: updatedEntry
          }
        });
      },
      incrementOpenCount: (bookId) => {
        const { history } = get();
        const existing = history[bookId];
        if (existing) {
          set({
            history: {
              ...history,
              [bookId]: { ...existing, openCount: (existing.openCount || 0) + 1 }
            }
          });
        }
      },
      getProgress: (bookId) => get().history[bookId],
      getRecentProgress: () => {
        const { recentBookId, history } = get();
        return recentBookId ? history[recentBookId] : null;
      },
      clearHistory: () => set({ history: {}, recentBookId: null }),
    }),
    {
      name: APP_CONSTANTS.CACHE_KEYS.CONTINUE_READING,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
