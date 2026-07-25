/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

interface SettingsState {
  darkMode: boolean;
  notifications: boolean;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  darkMode: JSON.parse(localStorage.getItem('settings_dark_mode') || 'false'),
  notifications: JSON.parse(localStorage.getItem('settings_notifications') || 'true'),
  
  toggleDarkMode: () => set((state) => {
    const newVal = !state.darkMode;
    localStorage.setItem('settings_dark_mode', JSON.stringify(newVal));
    if (newVal) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { darkMode: newVal };
  }),
  
  toggleNotifications: () => set((state) => {
    const newVal = !state.notifications;
    localStorage.setItem('settings_notifications', JSON.stringify(newVal));
    return { notifications: newVal };
  }),
}));
