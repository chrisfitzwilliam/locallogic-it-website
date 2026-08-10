const ACCESS_KEY = "1121";

// CORS Response Helper
function corsResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Access-Key",
      ...extraHeaders
    }
  });
}

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight options request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Access-Key"
        }
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    let payload = {};
    if (request.method === "POST" && request.headers.get("content-type")?.includes("application/json")) {
      try {
        payload = await request.json();
      } catch (e) {}
    }

    // Extract access key
    const key = request.headers.get("x-access-key") || payload.key;

    if (key !== ACCESS_KEY) {
      return corsResponse({ error: "Unauthorized key" }, 401);
    }

    // 1. Status Check
    if (path === "/status" && request.method === "POST") {
      const data = await env.CLIP_KV.get("clipboard_text");
      return corsResponse({ empty: data === null });
    }

    // 2. Save Content
    if (path === "/save" && request.method === "POST") {
      const existing = await env.CLIP_KV.get("clipboard_text");
      if (existing !== null) {
        return corsResponse({ error: "Clipboard already occupied" }, 400);
      }
      if (!payload.text || typeof payload.text !== "string") {
        return corsResponse({ error: "Missing or invalid text" }, 400);
      }
      // Store in Cloudflare KV (never written to physical disk by us, managed in Cloudflare edge cache/storage)
      await env.CLIP_KV.put("clipboard_text", payload.text);
      return corsResponse({ success: true });
    }

    // 3. Retrieve and Destroy Content
    if (path === "/get" && request.method === "POST") {
      const data = await env.CLIP_KV.get("clipboard_text");
      if (data !== null) {
        // Immediately delete to ensure "destroy after first viewing"
        await env.CLIP_KV.delete("clipboard_text");
      }
      return corsResponse({ text: data });
    }

    return corsResponse({ error: "Not Found" }, 404);
  }
};
