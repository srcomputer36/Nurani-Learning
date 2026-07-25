/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { APP_CONSTANTS } from '../core/constants/app.constants';

export interface Bookmark {
  bookId: string;
  bookName: string;
  page: number;
  timestamp: number;
}

interface BookmarkState {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'timestamp'>) => void;
  removeBookmark: (bookId: string, page: number) => void;
  getBookmarks: (bookId: string) => Bookmark[];
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (bookmark) => {
        const newBookmark: Bookmark = { ...bookmark, timestamp: Date.now() };
        // Avoid duplicates for same page
        const exists = get().bookmarks.some(b => b.bookId === bookmark.bookId && b.page === bookmark.page);
        if (!exists) {
          set({ bookmarks: [newBookmark, ...get().bookmarks] });
        }
      },
      removeBookmark: (bookId, page) => {
        set({ 
          bookmarks: get().bookmarks.filter(b => !(b.bookId === bookId && b.page === page)) 
        });
      },
      getBookmarks: (bookId) => get().bookmarks.filter(b => b.bookId === bookId),
    }),
    {
      name: APP_CONSTANTS.CACHE_KEYS.BOOKMARKS,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
