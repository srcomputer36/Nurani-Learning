/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';
import { Logger } from '../utils/logger';

const api = axios.create({
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    Logger.error('API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default api;
