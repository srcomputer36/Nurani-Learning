export async function onRequestGet() {
  return new Response(JSON.stringify({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    platform: "Cloudflare Pages Functions"
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
