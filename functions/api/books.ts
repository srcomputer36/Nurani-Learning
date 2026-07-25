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
    return new Response(JSON.stringify(data), {
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
