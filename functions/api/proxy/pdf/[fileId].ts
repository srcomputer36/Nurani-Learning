export async function onRequestGet(context: { params: { fileId: string } }) {
  const fileId = context.params.fileId;
  if (!fileId) {
    return new Response('Missing file ID', { status: 400 });
  }

  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
  
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return new Response(`Failed to fetch PDF: ${response.statusText}`, { status: response.status });
    }

    // Create new headers to bypass security restrictions and allow embedding
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Content-Type', 'application/pdf');
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Content-Disposition', 'inline');
    
    // Remove headers that might prevent embedding in an iframe
    newHeaders.delete('X-Frame-Options');
    newHeaders.delete('Content-Security-Policy');

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders
    });
  } catch (error: any) {
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
}
