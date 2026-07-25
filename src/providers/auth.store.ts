/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: { displayName: 'Guest Student', email: 'public@nurani.learning' },
  isAuthenticated: true,
  isLoading: false,

  setLoading: (loading) => set({ isLoading: loading }),

  signIn: async () => {
    set({ isAuthenticated: true });
  },

  signOut: async () => {
    set({ isAuthenticated: true }); // Guest cannot sign out
  }
}));
