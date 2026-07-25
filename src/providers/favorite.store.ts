/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Book } from '../models/book.model';
import { APP_CONSTANTS } from '../core/constants/app.constants';

interface FavoriteState {
  favorites: string[]; // List of book fileIds
  toggleFavorite: (book: Book) => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (book) => {
        const { favorites } = get();
        if (favorites.includes(book.fileId)) {
          set({ favorites: favorites.filter(id => id !== book.fileId) });
        } else {
          set({ favorites: [...favorites, book.fileId] });
        }
      },
    }),
    {
      name: APP_CONSTANTS.CACHE_KEYS.FAVOURITES,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
