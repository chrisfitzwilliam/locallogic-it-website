import fs from 'node:fs/promises';
import path from 'node:path';

const PROTECTED_FILES = new Set(['css/brand.css']);
const SEO_PATTERNS = [
  /<\s*title[\s>]/i,
  /<\s*meta\s+[^>]*(name|property)=/i,
  /<\s*link\s+[^>]*rel=["']canonical/i,
  /application\/ld\+json/i,
  /<\s*script\s+[^>]*type=["']application\/ld\+json/i
];

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === '--patch') {
      args.patch = value;
      i += 1;
    } else if (key === '--audit') {
      args.audit = value;
      i += 1;
    }
  }
  return args;
}

function normalizeFile(file) {
  return file.replaceAll('\\', '/').replace(/^\.?\//, '');
}

export function validatePatchText(patchText) {
  const changedFiles = new Set();
  const lines = patchText.split(/\r?\n/);
  for (const line of lines) {
    const match = /^(?:\+\+\+|---) [ab]\/(.+)$/.exec(line) || /^diff --git a\/(.+?) b\/(.+)$/.exec(line);
    if (match) {
      const file = normalizeFile(match[2] || match[1]);
      if (file !== '/dev/null') changedFiles.add(file);
    }
  }

  for (const file of changedFiles) {
    if (PROTECTED_FILES.has(file)) {
      throw new Error(`protected file rejected: ${file}`);
    }
  }

  for (const line of lines) {
    if (!line.startsWith('+') || line.startsWith('+++')) continue;
    const added = line.slice(1);
    if (/!important\b/i.test(added)) throw new Error('!important rejected');
    if (SEO_PATTERNS.some((pattern) => pattern.test(added))) {
      throw new Error('SEO/meta/JSON-LD change rejected');
    }
  }

  return [...changedFiles];
}

export async function summarizeAudit(auditPath) {
  const audit = JSON.parse(await fs.readFile(auditPath, 'utf8'));
  const bugs = [];
  for (const report of audit.metrics?.reports || []) {
    const issue = report.issues || {};
    if (issue.horizontalScroll) {
      bugs.push({
        type: 'horizontal-scroll',
        url: report.url,
        viewport: report.viewport,
        amount: issue.horizontalScroll,
        screenshot: report.screenshot
      });
    }
    for (const element of issue.overflowElements || []) {
      bugs.push({
        type: 'visible-overflow',
        url: report.url,
        viewport: report.viewport,
        element,
        screenshot: report.screenshot
      });
    }
    for (const element of issue.clippedElements || []) {
      bugs.push({
        type: 'clipped-visible-element',
        url: report.url,
        viewport: report.viewport,
        element,
        screenshot: report.screenshot
      });
    }
    for (const element of issue.smallTapTargets || []) {
      bugs.push({
        type: 'small-tap-target',
        url: report.url,
        viewport: report.viewport,
        element,
        screenshot: report.screenshot
      });
    }
  }
  return bugs;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.patch) {
    const patchText = await fs.readFile(args.patch, 'utf8');
    const files = validatePatchText(patchText);
    console.log(JSON.stringify({ ok: true, files }, null, 2));
    return;
  }
  if (args.audit) {
    const bugs = await summarizeAudit(args.audit);
    console.log(JSON.stringify({ bugCount: bugs.length, bugs: bugs.slice(0, 25) }, null, 2));
    return;
  }
  console.log(`usage:
  node qa/optimize.mjs --patch candidate.diff
  node qa/optimize.mjs --audit qa-tmp/audit-baseline.json`);
}

if (path.basename(process.argv[1] || '') === 'optimize.mjs') {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
