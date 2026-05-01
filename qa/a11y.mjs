import { chromium } from 'playwright';
import axe from 'axe-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
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

async function loadPages(base, out) {
  const pagesPath = path.join(out, 'pages.json');
  try {
    return JSON.parse(await fs.readFile(pagesPath, 'utf8'));
  } catch {
    await runNodeScript('qa/spider.mjs', ['--base', base, '--out', out]);
    return JSON.parse(await fs.readFile(pagesPath, 'utf8'));
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

async function main() {
  const args = parseArgs(process.argv);
  await fs.mkdir(args.out, { recursive: true });
  const pages = scopedPages(args.base, args.pages) || await loadPages(args.base, args.out);
  if (args.pages) {
    await fs.writeFile(path.join(args.out, 'pages-scoped-a11y.json'), JSON.stringify(pages, null, 2));
  }
  const browser = await chromium.launch();
  const results = [];

  for (const pageInfo of pages) {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
      await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 45000 });
      await page.addScriptTag({ content: axe.source });
      const report = await page.evaluate(async () => window.axe.run(document, {
        resultTypes: ['violations'],
        rules: {
          'color-contrast': { enabled: false }
        }
      }));
      results.push({
        url: pageInfo.url,
        viewport,
        violations: report.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          description: violation.description,
          nodes: violation.nodes.length
        }))
      });
      await page.close();
    }
  }

  await browser.close();
  const summary = {
    generatedAt: new Date().toISOString(),
    pageCount: pages.length,
    viewportCount: VIEWPORTS.length,
    violationCount: results.reduce((sum, result) => sum + result.violations.length, 0),
    results
  };
  await fs.writeFile(path.join(args.out, 'axe-report.json'), JSON.stringify(summary, null, 2));
  console.log(`a11y: ${summary.violationCount} violation groups`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
