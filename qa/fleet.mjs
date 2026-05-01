import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { spawn } from 'node:child_process';

const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 }
];

function parseArgs(argv) {
  const args = { base: 'http://127.0.0.1:4173', out: 'qa-tmp/baseline', pages: '' };
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === '--base' || key === '--base-url') {
      args.base = value;
      i += 1;
    } else if (key === '--out') {
      args.out = value;
      i += 1;
    } else if (key === '--pages') {
      args.pages = value;
      i += 1;
    }
  }
  return args;
}

function runNodeScript(script, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], { stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`))));
  });
}

function slugFor(url) {
  const parsed = new URL(url);
  const cleaned = parsed.pathname === '/' ? 'index' : parsed.pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/i, '');
  return cleaned.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'index';
}

async function loadPages(base, out) {
  const pagesPath = path.join(out, 'pages.json');
  try {
    const raw = await fs.readFile(pagesPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    await runNodeScript('qa/spider.mjs', ['--base', base, '--out', out]);
    const raw = await fs.readFile(pagesPath, 'utf8');
    return JSON.parse(raw);
  }
}

function scopedPages(base, pagesArg) {
  if (!pagesArg) return null;
  const baseUrl = new URL(base);
  return pagesArg.split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const url = new URL(item, baseUrl);
      return {
        url: url.toString(),
        path: url.pathname,
        title: item,
        status: 200
      };
    });
}

function pageMetricsScript() {
  const visible = (element) => {
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom >= 0 && rect.right >= 0 &&
      rect.top <= window.innerHeight && rect.left <= window.innerWidth;
  };

  const selectorFor = (element) => {
    if (element.id) return `#${element.id}`;
    const cls = [...element.classList].slice(0, 3).join('.');
    const name = element.tagName.toLowerCase();
    return cls ? `${name}.${cls}` : name;
  };

  const horizontalOverflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth;
  const overflowElements = [];
  const clippedElements = [];
  const smallTapTargets = [];
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  for (const element of document.querySelectorAll('body *')) {
    if (!visible(element)) continue;
    const rect = element.getBoundingClientRect();
    const selector = selectorFor(element);
    if (rect.left < -2 || rect.right > vw + 2) {
      overflowElements.push({
        selector,
        text: (element.textContent || '').trim().slice(0, 80),
        rect: {
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width)
        }
      });
    }

    const style = window.getComputedStyle(element);
    if (/(hidden|clip|auto|scroll)/.test(`${style.overflow}${style.overflowX}${style.overflowY}`)) {
      for (const child of element.children) {
        if (!visible(child)) continue;
        const childRect = child.getBoundingClientRect();
        if (childRect.right > rect.right + 3 || childRect.left < rect.left - 3 || childRect.bottom > rect.bottom + 3) {
          clippedElements.push({
            selector,
            child: selectorFor(child),
            rect: {
              width: Math.round(rect.width),
              height: Math.round(rect.height)
            }
          });
          break;
        }
      }
    }
  }

  for (const element of document.querySelectorAll('a[href], button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])')) {
    if (!visible(element)) continue;
    const rect = element.getBoundingClientRect();
    const text = (element.textContent || element.getAttribute('aria-label') || element.getAttribute('title') || '').trim();
    if ((rect.width < 44 || rect.height < 44) && rect.width > 0 && rect.height > 0) {
      smallTapTargets.push({
        selector: selectorFor(element),
        text: text.slice(0, 80),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      });
    }
  }

  return {
    url: location.href,
    viewport: { width: vw, height: vh },
    document: {
      scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      scrollHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
    },
    issues: {
      horizontalScroll: horizontalOverflow > 1 ? Math.round(horizontalOverflow) : 0,
      overflowElements: overflowElements.slice(0, 50),
      clippedElements: clippedElements.slice(0, 50),
      smallTapTargets: smallTapTargets.slice(0, 100)
    }
  };
}

async function isBlankImage(file) {
  const stats = await sharp(file).stats();
  const visibleChannels = stats.channels.slice(0, 3);
  const maxStdev = Math.max(...visibleChannels.map((channel) => channel.stdev || 0));
  return maxStdev < 1;
}

async function buildContactSheets(screenshotsDir, contactDir, captures) {
  await fs.mkdir(contactDir, { recursive: true });
  for (const viewport of VIEWPORTS) {
    const items = captures.filter((capture) => capture.viewport === `${viewport.width}x${viewport.height}`);
    if (!items.length) continue;
    const thumbs = [];
    for (const item of items) {
      const buffer = await sharp(item.screenshot).resize({ width: 240, withoutEnlargement: true }).jpeg({ quality: 72 }).toBuffer();
      const meta = await sharp(buffer).metadata();
      thumbs.push({ input: buffer, width: meta.width || 240, height: meta.height || 180 });
    }
    const columns = Math.min(4, thumbs.length);
    const cellW = 240;
    const cellH = Math.max(...thumbs.map((thumb) => thumb.height));
    const rows = Math.ceil(thumbs.length / columns);
    const composite = thumbs.map((thumb, index) => ({
      input: thumb.input,
      left: (index % columns) * cellW,
      top: Math.floor(index / columns) * cellH
    }));
    await sharp({
      create: {
        width: columns * cellW,
        height: rows * cellH,
        channels: 3,
        background: '#10131b'
      }
    }).composite(composite).jpeg({ quality: 80 }).toFile(path.join(contactDir, `contact-sheet-${viewport.width}x${viewport.height}.jpg`));
  }
}

async function main() {
  const args = parseArgs(process.argv);
  await fs.mkdir(args.out, { recursive: true });
  const pages = scopedPages(args.base, args.pages) || await loadPages(args.base, args.out);
  if (args.pages) {
    await fs.writeFile(path.join(args.out, 'pages-scoped.json'), JSON.stringify(pages, null, 2));
  }
  const screenshotsDir = path.join(args.out, 'screenshots');
  const metricsDir = path.join(args.out, 'metrics');
  await fs.mkdir(screenshotsDir, { recursive: true });
  await fs.mkdir(metricsDir, { recursive: true });

  const browser = await chromium.launch();
  const captures = [];
  const reports = [];

  for (const pageInfo of pages) {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage({
        viewport,
        deviceScaleFactor: 1,
        colorScheme: 'dark',
        reducedMotion: 'reduce'
      });
      await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(250);

      const slug = slugFor(pageInfo.url);
      const viewportName = `${viewport.width}x${viewport.height}`;
      const baseName = `${slug}__${viewportName}`;
      const screenshotPath = path.join(screenshotsDir, `${baseName}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      const metrics = await page.evaluate(pageMetricsScript);
      metrics.page = pageInfo;
      metrics.screenshot = screenshotPath.replaceAll('\\', '/');
      metrics.blankCapture = await isBlankImage(screenshotPath);
      await fs.writeFile(path.join(metricsDir, `${baseName}.json`), JSON.stringify(metrics, null, 2));
      captures.push({ screenshot: screenshotPath, viewport: viewportName, page: pageInfo.url });
      reports.push(metrics);
      await page.close();
    }
  }

  await browser.close();
  await buildContactSheets(screenshotsDir, path.join(args.out, 'contact-sheets'), captures);

  const summary = {
    generatedAt: new Date().toISOString(),
    base: args.base,
    viewportCount: VIEWPORTS.length,
    pageCount: pages.length,
    captureCount: reports.length,
    blankCaptures: reports.filter((report) => report.blankCapture).length,
    issueCount: reports.reduce((count, report) => count +
      (report.issues.horizontalScroll ? 1 : 0) +
      report.issues.overflowElements.length +
      report.issues.clippedElements.length +
      report.issues.smallTapTargets.length, 0),
    reports
  };
  await fs.writeFile(path.join(args.out, 'fleet-report.json'), JSON.stringify(summary, null, 2));
  console.log(`fleet: captured ${summary.captureCount} screenshots, ${summary.blankCaptures} blank, ${summary.issueCount} issues`);
  if (summary.blankCaptures > 0) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
