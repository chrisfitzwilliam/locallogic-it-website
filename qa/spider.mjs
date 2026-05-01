import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const ASSET_EXTENSIONS = new Set([
  '.css', '.js', '.mjs', '.json', '.xml', '.txt', '.png', '.jpg', '.jpeg',
  '.webp', '.gif', '.svg', '.ico', '.avif', '.woff', '.woff2', '.ttf',
  '.pdf', '.zip', '.mp4', '.webm'
]);

function parseArgs(argv) {
  const args = { base: 'http://127.0.0.1:4173', out: 'qa-tmp/baseline', limit: 250 };
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === '--base' || key === '--base-url') {
      args.base = value;
      i += 1;
    } else if (key === '--out') {
      args.out = value;
      i += 1;
    } else if (key === '--limit') {
      args.limit = Number.parseInt(value, 10);
      i += 1;
    }
  }
  return args;
}

function normalizeUrl(raw, baseUrl) {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    lower.startsWith('sms:') ||
    lower.startsWith('javascript:')
  ) {
    return null;
  }

  let url;
  try {
    url = new URL(trimmed, baseUrl);
  } catch {
    return null;
  }

  const base = new URL(baseUrl);
  if (url.origin !== base.origin) return null;
  url.hash = '';
  url.search = '';

  const ext = path.extname(url.pathname).toLowerCase();
  if (ASSET_EXTENSIONS.has(ext)) return null;
  if (ext && ext !== '.html') return null;

  if (url.pathname.endsWith('/index.html')) {
    url.pathname = url.pathname.slice(0, -'index.html'.length);
  }
  return url.toString();
}

async function discover(base, limit) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const start = normalizeUrl(base, base) || base;
  const queue = [start];
  const seen = new Set();
  const pages = [];
  const failures = [];

  while (queue.length > 0 && pages.length < limit) {
    const url = queue.shift();
    if (!url || seen.has(url)) continue;
    seen.add(url);

    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const status = response ? response.status() : 0;
      const contentType = response ? response.headers()['content-type'] || '' : '';
      if (status >= 400 || !contentType.includes('text/html')) {
        failures.push({ url, status, reason: 'not-html-or-error' });
        continue;
      }

      const title = await page.title();
      const links = await page.$$eval('a[href], [data-href]', (nodes) =>
        nodes.map((node) => node.getAttribute('href') || node.getAttribute('data-href'))
      );

      pages.push({
        url,
        path: new URL(url).pathname,
        title,
        status,
        depth: 0
      });

      for (const link of links) {
        const next = normalizeUrl(link, url);
        if (next && !seen.has(next) && !queue.includes(next)) queue.push(next);
      }
    } catch (error) {
      failures.push({ url, reason: error.message });
    }
  }

  await browser.close();
  pages.sort((a, b) => a.url.localeCompare(b.url));
  return { base: start, generatedAt: new Date().toISOString(), pages, failures };
}

async function main() {
  const args = parseArgs(process.argv);
  await fs.mkdir(args.out, { recursive: true });
  const report = await discover(args.base, args.limit);
  await fs.writeFile(path.join(args.out, 'pages.json'), JSON.stringify(report.pages, null, 2));
  await fs.writeFile(path.join(args.out, 'crawl-report.json'), JSON.stringify(report, null, 2));
  console.log(`spider: discovered ${report.pages.length} HTML pages, ${report.failures.length} failures`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
