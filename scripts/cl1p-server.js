import http from 'http';
import { URL } from 'url';

let clipboardData = null;
const ACCESS_KEY = "1121";
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Add CORS headers for local/cross-origin testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Access-Key');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const path = parsedUrl.pathname;

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    let payload = {};
    if (body) {
      try { payload = JSON.parse(body); } catch (e) {}
    }

    const key = req.headers['x-access-key'] || payload.key;

    if (key !== ACCESS_KEY) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized key' }));
      return;
    }

    if (path === '/status' && req.method === 'POST') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ empty: clipboardData === null }));
      return;
    }

    if (path === '/save' && req.method === 'POST') {
      if (clipboardData !== null) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Clipboard already occupied' }));
        return;
      }
      if (!payload.text || typeof payload.text !== 'string') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing or invalid text' }));
        return;
      }
      clipboardData = payload.text;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
      return;
    }

    if (path === '/get' && req.method === 'POST') {
      const data = clipboardData;
      clipboardData = null; // DESTROY immediately on read!
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ text: data }));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`cl1p server running on http://127.0.0.1:${PORT}`);
});
