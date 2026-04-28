#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function resolvePlaywright() {
  const candidates = [];

  if (process.env.PLAYWRIGHT_PATH) {
    candidates.push(process.env.PLAYWRIGHT_PATH);
  }

  try {
    return require('playwright');
  } catch (err) {
    // Fall through to cached npx installs for this workspace.
  }

  const npxRoot = path.join(process.env.LOCALAPPDATA || '', 'npm-cache', '_npx');
  if (fs.existsSync(npxRoot)) {
    const folders = fs.readdirSync(npxRoot)
      .map(name => path.join(npxRoot, name, 'node_modules', 'playwright'))
      .filter(candidate => fs.existsSync(candidate));
    candidates.push(...folders);
  }

  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch (err) {
      // Try the next candidate.
    }
  }

  throw new Error(
    'Unable to resolve Playwright. Install it locally or set PLAYWRIGHT_PATH to a cached module path.'
  );
}

function listPages(rootDir) {
  const pages = [];
  const rootEntries = fs.readdirSync(rootDir, { withFileTypes: true });
  for (const entry of rootEntries) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      pages.push(entry.name);
    }
  }

  const servicesDir = path.join(rootDir, 'services');
  if (fs.existsSync(servicesDir)) {
    for (const family of fs.readdirSync(servicesDir, { withFileTypes: true })) {
      if (!family.isDirectory()) continue;
      const familyDir = path.join(servicesDir, family.name);
      for (const entry of fs.readdirSync(familyDir, { withFileTypes: true })) {
        if (entry.isFile() && entry.name.endsWith('.html')) {
          pages.push(path.posix.join('services', family.name, entry.name));
        }
      }
    }
  }

  return pages.sort();
}

function sanitizeFileName(value) {
  return value.replace(/[^a-z0-9._-]+/gi, '-');
}

async function main() {
  const { chromium } = resolvePlaywright();

  const rootDir = process.cwd();
  const baseUrl = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
  const outputDir = path.resolve(process.env.AUDIT_OUTPUT_DIR || path.join('.audit-output', 'responsive-audit'));
  const viewports = [
    { name: '320x568', width: 320, height: 568 },
    { name: '390x844', width: 390, height: 844 },
    { name: '768x1024', width: 768, height: 1024 },
    { name: '1366x768', width: 1366, height: 768 },
    { name: '1920x1080', width: 1920, height: 1080 },
  ];

  const pages = listPages(rootDir);
  const browser = await chromium.launch({ headless: true });
  const runId = new Date().toISOString().replace(/[:.]/g, '-');
  const runDir = path.join(outputDir, runId);
  fs.mkdirSync(runDir, { recursive: true });

  const results = [];

  for (const pageName of pages) {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      const failedRequests = [];

      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', err => pageErrors.push(String(err)));
      page.on('requestfailed', req => {
        failedRequests.push({
          url: req.url(),
          error: req.failure() ? req.failure().errorText : 'unknown',
        });
      });

      const url = `${baseUrl}/${pageName}`;
      const screenshotPath = path.join(
        runDir,
        sanitizeFileName(pageName.replace(/\//g, '__') + `__${viewport.name}.png`)
      );

      let mobileMenuOpen = null;
      let scrollWidth = null;
      let clientWidth = null;
      let status = 'ok';

      try {
        const response = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
        if (!response || !response.ok()) {
          status = `http_${response ? response.status() : 'no-response'}`;
        }

        await page.waitForTimeout(800);

        const hamburger = page.locator('.nav-hamburger');
        if (await hamburger.count()) {
          const visible = await hamburger.first().isVisible().catch(() => false);
          if (visible) {
            await hamburger.first().click({ timeout: 5000 }).catch(() => {});
            await page.waitForTimeout(250);
            mobileMenuOpen = await page.evaluate(() => {
              const menu = document.querySelector('.nav-mobile-menu');
              if (!menu) return null;
              const styles = getComputedStyle(menu);
              const aria = document.querySelector('.nav-hamburger')?.getAttribute('aria-expanded');
              return {
                ariaExpanded: aria,
                openClass: menu.classList.contains('open'),
                display: styles.display,
                visible: styles.display !== 'none' && styles.visibility !== 'hidden' && styles.opacity !== '0',
              };
            });
          }
        }

        const metrics = await page.evaluate(() => {
          const de = document.documentElement;
          const body = document.body;
          return {
            scrollWidth: Math.max(de.scrollWidth, body ? body.scrollWidth : 0),
            clientWidth: de.clientWidth,
            scrollHeight: Math.max(de.scrollHeight, body ? body.scrollHeight : 0),
            clientHeight: de.clientHeight,
          };
        });
        scrollWidth = metrics.scrollWidth;
        clientWidth = metrics.clientWidth;

        await page.screenshot({ path: screenshotPath, fullPage: true });

        if (scrollWidth > clientWidth) {
          status = 'overflow';
        }
        if (viewport.width <= 767 && mobileMenuOpen && mobileMenuOpen.visible === false) {
          status = status === 'ok' ? 'mobile-nav' : status;
        }
      } catch (err) {
        status = `throw:${err.message}`;
      } finally {
        results.push({
          page: pageName,
          viewport: viewport.name,
          status,
          scrollWidth,
          clientWidth,
          consoleErrors,
          pageErrors,
          failedRequests,
          mobileMenuOpen,
          screenshotPath: path.relative(rootDir, screenshotPath),
        });
        await context.close();
      }
    }
  }

  await browser.close();

  const failures = results.filter(result =>
    result.status !== 'ok' ||
    result.consoleErrors.length > 0 ||
    result.pageErrors.length > 0 ||
    result.failedRequests.length > 0
  );

  console.log(JSON.stringify({
    baseUrl,
    outputDir: path.relative(rootDir, runDir),
    pages: pages.length,
    viewports: viewports.length,
    results,
    failures,
  }, null, 2));

  process.exitCode = failures.length ? 1 : 0;
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
