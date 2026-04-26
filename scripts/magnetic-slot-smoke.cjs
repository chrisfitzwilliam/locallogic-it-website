#!/usr/bin/env node
'use strict';

const assert = require('assert');
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

  throw new Error('Unable to resolve Playwright. Install it locally or set PLAYWRIGHT_PATH to a cached module path.');
}

async function assertHubArrival(pageName, expectedTheme) {
  const shellSelector = '#quartz-shell';
  const url = `${process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4318'}/${pageName}`;
  const { chromium } = resolvePlaywright();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.addInitScript(theme => {
    sessionStorage.setItem('fromLanding', '1');
    sessionStorage.setItem('navTheme', theme);
  }, expectedTheme);

  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector(shellSelector, { timeout: 5000 });

    const initial = await page.locator(shellSelector).evaluate(node => ({
      arriving: node.classList.contains('is-slot-arriving'),
      ready: node.classList.contains('is-slot-ready'),
      expanded: node.classList.contains('is-expanded'),
      motion: node.getAttribute('data-nav-motion'),
      theme: node.getAttribute('data-nav-theme'),
    }));

    assert.equal(initial.motion, 'slot', `${pageName} should opt into slot motion`);
    assert.equal(initial.theme, expectedTheme, `${pageName} should expose ${expectedTheme} nav theme`);
    assert.equal(initial.arriving, true, `${pageName} should start in slot arrival state`);

    await page.waitForTimeout(1200);

    const settled = await page.locator(shellSelector).evaluate(node => ({
      arriving: node.classList.contains('is-slot-arriving'),
      ready: node.classList.contains('is-slot-ready'),
      expanded: node.classList.contains('is-expanded'),
    }));

    assert.equal(settled.arriving, false, `${pageName} should leave slot arrival state`);
    assert.equal(settled.ready, true, `${pageName} should settle into slot-ready state`);
    assert.equal(settled.expanded, true, `${pageName} should expand its nav links after arrival`);
  } finally {
    await browser.close();
  }
}

async function main() {
  const { chromium } = resolvePlaywright();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

  try {
    const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4318';
    await page.goto(`${baseUrl}/index.html`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('#quartz-shell', { timeout: 5000 });
    await page.locator('.half--business').click();
    await page.waitForTimeout(80);

    const landingState = await page.locator('#quartz-shell').evaluate(node => ({
      pulling: node.classList.contains('is-slot-pulling'),
      motion: node.getAttribute('data-nav-motion'),
      theme: node.getAttribute('data-nav-theme'),
    }));

    assert.equal(landingState.motion, 'slot', 'landing shell should opt into slot motion');
    assert.equal(landingState.pulling, true, 'landing shell should start slot pull before navigation');
    assert.equal(landingState.theme, 'business', 'landing shell should tint toward the chosen audience');
  } finally {
    await browser.close();
  }

  await assertHubArrival('business.html', 'business');
  await assertHubArrival('residential.html', 'residential');
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
