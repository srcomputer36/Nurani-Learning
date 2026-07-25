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
        .map((item: any) => {
          // Robust mapping for both camelCase and PascalCase
          const id = item.ID || item.id || item.Id;
          const bookName = item['Book Name'] || item.bookName || item.BookName || item.name;
          const fileId = item['File ID'] || item.fileId || item.FileId || item.file_id;
          const category = item.Category || item.category || 'General';
          const status = (item.Status || item.status || 'active').toLowerCase();
          const order = parseInt(item.Order || item.order || '0', 10);

          return {
            id: String(id || Math.random().toString(36).substr(2, 9)),
            bookName: String(bookName || 'Untitled Book'),
            fileId: String(fileId || ''),
            category: String(category),
            status: status as any,
            order: isNaN(order) ? 0 : order,
          };
        })
        .filter((book: Book) => book.status === 'active' && book.fileId)
        .sort((a: Book, b: Book) => a.order - b.order);

      return books;
    } catch (error: any) {
      Logger.error('Error fetching books from REST API:', error);
      throw new AppError('Failed to load books from the server.', 'API_FETCH_ERROR', error);
    }
  }
};
