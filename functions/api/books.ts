export async function onRequestGet() {
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbzpPv4xrFrVi0CzpQgqB_30aV2wVlZEakTAmGF1soKFMz9d6lHuu8NCqHIzqNBV8OSzgQ/exec';
  
  try {
    const response = await fetch(scriptUrl, {
      redirect: 'follow',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      return new Response(JSON.stringify({ success: false, message: 'Remote server error' }), {
        status: response.status,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    const data = await response.json();
    
    // Transform the Apps Script data to the format expected by the frontend
    // This ensures that even if the Apps Script structure changes slightly, 
    // the frontend receives a consistent structure.
    const rawData = data.data || [];
    const books = rawData.map((item: any) => ({
      id: String(item.id || item.ID || Math.random().toString(36).substr(2, 9)),
      bookName: String(item.bookName || item['Book Name'] || item.BookName || 'Untitled Book'),
      fileId: String(item.fileId || item['File ID'] || item.FileId || ''),
      category: String(item.category || item.Category || 'General'),
      status: (item.status || item.Status || 'active').toLowerCase(),
      order: parseInt(item.order || item.Order || '0', 10)
    }));

    return new Response(JSON.stringify({ success: true, data: books }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Failed to fetch book list',
      error: error.message 
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
