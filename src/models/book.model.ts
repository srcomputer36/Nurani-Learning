/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BookStatus = 'active' | 'inactive';

export interface Book {
  id: string;
  bookName: string;
  fileId: string;
  category: string;
  status: BookStatus;
  order: number;
}

export interface BookCache {
  books: Book[];
  lastSync: number;
}
