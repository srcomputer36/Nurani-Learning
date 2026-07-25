/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const isDev = process.env.NODE_ENV !== 'production';

export const Logger = {
  log: (...args: any[]) => {
    if (isDev) console.log('[LOG]', ...args);
  },
  info: (...args: any[]) => {
    if (isDev) console.info('[INFO]', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};
