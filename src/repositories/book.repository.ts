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
      const responseData = response.data;

      // Handle both {success: true, data: []} and direct array response
      const success = responseData.success !== undefined ? responseData.success : true;
      if (!success) {
        throw new AppError(responseData.message || 'Server returned an error.', 'API_ERROR');
      }

      const booksData = responseData.data !== undefined ? responseData.data : (Array.isArray(responseData) ? responseData : null);

      if (!booksData || !Array.isArray(booksData)) {
        Logger.warn('Invalid response format from API:', responseData);
        return [];
      }
      
      const books: Book[] = booksData
        .map((item: any) => {
          // Robust mapping for both camelCase and PascalCase
          const id = item.id || item.ID || item.Id;
          const bookName = item.bookName || item['Book Name'] || item.BookName || item.name;
          const fileId = item.fileId || item['File ID'] || item.FileId || item.file_id;
          const category = item.category || item.Category || 'General';
          const status = (item.status || item.Status || 'active').toLowerCase();
          const order = parseInt(item.order || item.Order || '0', 10);

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
