/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import axios from "axios";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy for Google Drive PDF files to bypass CORS
  app.get("/api/proxy/pdf/:fileId", async (req, res) => {
    try {
      const { fileId } = req.params;
      const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
      
      console.log(`Proxying PDF request for fileId: ${fileId}`);
      
      const response = await axios.get(url, {
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      // Forward relevant headers
      res.setHeader('Content-Type', 'application/pdf');
      
      response.data.pipe(res);
    } catch (error: any) {
      console.error('Proxy error:', error.message);
      res.status(500).json({ error: 'Failed to fetch PDF' });
    }
  });

  // Proxy for Google Apps Script to bypass CORS
  app.get("/api/books", async (req, res) => {
    try {
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbzpPv4xrFrVi0CzpQgqB_30aV2wVlZEakTAmGF1soKFMz9d6lHuu8NCqHIzqNBV8OSzgQ/exec';
      console.log('Proxying book list request');
      
      const response = await axios.get(scriptUrl, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      res.json(response.data);
    } catch (error: any) {
      console.error('Book proxy error:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch book list from remote server' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
