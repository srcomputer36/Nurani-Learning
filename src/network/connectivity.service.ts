/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

interface ConnectivityState {
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
}

export const useConnectivityStore = create<ConnectivityState>((set) => ({
  isOnline: navigator.onLine,
  setIsOnline: (status) => set({ isOnline: status }),
}));

// Initialize listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useConnectivityStore.getState().setIsOnline(true));
  window.addEventListener('offline', () => useConnectivityStore.getState().setIsOnline(false));
}
