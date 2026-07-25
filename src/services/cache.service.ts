/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { APP_CONSTANTS } from '../core/constants/app.constants';
import { Logger } from '../utils/logger';

export const CacheService = {
  get: <T>(key: string): T | null => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      Logger.error(`Error reading cache key: ${key}`, e);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      Logger.error(`Error setting cache key: ${key}`, e);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  },

  setLastSync: () => {
    localStorage.setItem(APP_CONSTANTS.CACHE_KEYS.LAST_SYNC, Date.now().toString());
  },

  getLastSync: (): number => {
    const sync = localStorage.getItem(APP_CONSTANTS.CACHE_KEYS.LAST_SYNC);
    return sync ? parseInt(sync, 10) : 0;
  }
};
