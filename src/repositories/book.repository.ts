/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import api from '../network/api.service';
import { Book } from '../models/book.model';
import { Logger } from '../utils/logger';
import { AppError } from '../utils/error.handler';
import { APP_CONSTANTS } from '../core/constants/app.constants';

export const BookRepository = {
  /**
   * Fetches books from the Google Apps Script REST API.
   */
  fetchBooks: async (apiUrl: string): Promise<Book[]> => {
    try {
      if (!apiUrl || apiUrl === 'YOUR_GOOGLE_APPS_SCRIPT_URL' || apiUrl === '') {
        throw new AppError(
          'API URL is not configured. Please provide a valid Google Apps Script URL.',
          'CONFIG_ERROR'
        );
      }

      Logger.info('Fetching books from REST API:', apiUrl);
      
      const response = await api.get(apiUrl);

      if (!response.data.success) {
        throw new AppError(response.data.message || 'Server returned an error.', 'API_ERROR');
      }

      const booksData = response.data.data;

      if (!Array.isArray(booksData)) {
        Logger.warn('Invalid response format from API:', response.data);
        return [];
      }
      
      const books: Book[] = booksData
        .map((item: any) => ({
          id: String(item.ID || item.id || ''),
          bookName: String(item['Book Name'] || item.bookName || ''),
          fileId: String(item['File ID'] || item.fileId || ''),
          category: String(item.Category || item.category || ''),
          status: String(item.Status || item.status || '').toLowerCase() as any,
          order: parseInt(item.Order || item.order || '0', 10),
        }))
        .filter((book: Book) => book.status === 'active')
        .sort((a: Book, b: Book) => a.order - b.order);

      return books;
    } catch (error: any) {
      Logger.error('Error fetching books from REST API:', error);
      throw new AppError('Failed to load books from the server.', 'API_FETCH_ERROR', error);
    }
  }
};
