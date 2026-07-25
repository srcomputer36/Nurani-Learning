/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string = 'UNKNOWN_ERROR',
    public originalError?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: any): AppError => {
  if (error instanceof AppError) return error;

  console.error('[ErrorHandler]', error);

  if (!navigator.onLine) {
    return new AppError('No internet connection. Please check your network.', 'NETWORK_ERROR');
  }

  if (error.response) {
    // Axios error
    const status = error.response.status;
    if (status === 401) return new AppError('Authentication failed. Please sign in again.', 'AUTH_ERROR');
    if (status === 403) return new AppError('Access denied. You do not have permission.', 'FORBIDDEN');
    if (status === 404) return new AppError('The requested resource was not found.', 'NOT_FOUND');
    return new AppError(`Server error (${status}). Please try again later.`, 'SERVER_ERROR', error);
  }

  return new AppError('An unexpected error occurred.', 'UNKNOWN_ERROR', error);
};
