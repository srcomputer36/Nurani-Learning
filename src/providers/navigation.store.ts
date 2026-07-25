/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export type TabType = 'home' | 'books' | 'exam' | 'settings' | 'reader';

interface NavigationState {
  activeTab: TabType;
  currentBook: any | null;
  setActiveTab: (tab: TabType) => void;
  openReader: (book: any) => void;
  closeReader: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeTab: 'home',
  currentBook: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  openReader: (book) => set({ activeTab: 'reader', currentBook: book }),
  closeReader: ( ) => set({ activeTab: 'home', currentBook: null }),
}));
