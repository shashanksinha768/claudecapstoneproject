/**
 * StayFinder — Browser verification via Playwright
 * Tests the live UI in a headless Chromium browser.
 * Run: node verify-browser.js
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const indexUrl  = 'file://' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
const testsUrl  = 'file://' + path.resolve(__dirname, 'tests.html').replace(/\\/g, '/');

let passed = 0, failed = 0;
const failures = [];

function log(icon, label, detail) {
  console.log(`  ${icon} ${label}${detail ? ' → ' + detail : ''}`);
}

function assert(label, condition, detail) {
  if (condition) { passed++; log('✅', label, detail); }
  else           { failed++; failures.push(label); log('❌', label, detail); }
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx     = await browser.newContext({ viewport: { width: 1280, height: 800 } });

  // ── tests.html: confirm all unit tests pass ───────────────────────────────
  console.log('\n=== Browser: tests.html unit runner ===');
  const tPage = await ctx.newPage();
  await tPage.goto(testsUrl, { waitUntil: 'domcontentloaded' });
  await tPage.waitForSelector('#summary');

  const summaryText  = await tPage.textContent('#summary');
  const summaryClass = await tPage.getAttribute('#summary', 'class');
  const rows = await tPage.$$eval('#results tr', rows =>
    rows.map(r => ({
      num:    r.cells[0]?.textContent?.trim(),
      desc:   r.cells[1]?.textContent?.trim(),
      result: r.cells[2]?.textContent?.trim(),
    }))
  );

  rows.forEach(r => {
    const pass = r.result === 'PASS';
    if (pass) passed++;
    else      { failed++; failures.push(`tests.html #${r.num}: ${r.desc}`); }
    log(pass ? '✅' : '❌', `test #${r.num}`, r.desc);
  });

  assert('tests.html summary class = pass-summary',
    summaryClass && summaryClass.includes('pass-summary'), summaryText);
  await tPage.close();

  // ── index.html: UI integration ────────────────────────────────────────────
  console.log('\n=== Browser: index.html UI integration ===');
  const p = await ctx.newPage();
  await p.goto(indexUrl, { waitUntil: 'domcontentloaded' });

  // Initial load
  const initCount = await p.locator('.card').count();
  assert('Initial load shows 10 cards', initCount === 10, `got ${initCount}`);

  const resultText = await p.textContent('#result-count');
  assert('Result count = "Showing 10 of 10 properties"',
    resultText.includes('10 of 10'), resultText);

  const noResultsVisible = await p.locator('#no-results').evaluate(el => el.style.display !== 'none');
  assert('No-results message hidden on load', !noResultsVisible);

  // AC-1: Wi-Fi filter
  await p.check('#wifi');
  await p.waitForTimeout(100);
  const wifiCount = await p.locator('.card').count();
  assert('AC-1 Wi-Fi filter → 7 cards', wifiCount === 7, `got ${wifiCount}`);

  // AC-1b: Wi-Fi + Breakfast
  await p.check('#breakfast');
  await p.waitForTimeout(100);
  const unionCount = await p.locator('.card').count();
  assert('AC-1b Wi-Fi + Breakfast → 9 cards (OR)', unionCount === 9, `got ${unionCount}`);

  // AC-2: hotel + villa type
  await p.uncheck('#wifi'); await p.uncheck('#breakfast');
  await p.check('#hotel'); await p.check('#villa');
  await p.waitForTimeout(100);
  const allTypeCount = await p.locator('.card').count();
  assert('AC-2 Hotel + Villa selected → all 10', allTypeCount === 10, `got ${allTypeCount}`);

  // AC-3: score slider ≥ 8
  await p.uncheck('#hotel'); await p.uncheck('#villa');
  await p.fill('#score-range', '8');
  await p.dispatchEvent('#score-range', 'input');
  await p.waitForTimeout(150);
  const scoreCount = await p.locator('.card').count();
  assert('AC-3 Min score = 8 → 7 cards', scoreCount === 7, `got ${scoreCount}`);

  // Verify score label updated
  const scoreLabel = await p.textContent('#score-label');
  assert('AC-3 Score label updated to ≥ 8.0', scoreLabel.includes('8.0'), scoreLabel);

  // Verify ARIA attr updated
  const ariaNow = await p.getAttribute('#score-range', 'aria-valuenow');
  assert('DD-06 aria-valuenow updated to 8', ariaNow === '8', `got ${ariaNow}`);

  // AC-4: combined filters
  await p.fill('#score-range', '1'); await p.dispatchEvent('#score-range', 'input');
  await p.check('#wifi'); await p.check('#hotel');
  await p.fill('#score-range', '9'); await p.dispatchEvent('#score-range', 'input');
  await p.waitForTimeout(150);
  const combinedCount = await p.locator('.card').count();
  const combinedTitle = await p.locator('.card-title').first().textContent();
  assert('AC-4 wifi + hotel + score≥9 → 1 card', combinedCount === 1, `got ${combinedCount}`);
  assert('AC-4 that card = Grand Horizon Hotel', combinedTitle.includes('Grand Horizon'), combinedTitle);

  // AC-7: no-results message — start clean, use breakfast+villa+score≥9.6 (truly impossible)
  await p.click('.btn-reset');
  await p.check('#breakfast'); await p.check('#villa');
  await p.evaluate(() => {
    const el = document.getElementById('score-range');
    el.value = '9.6'; el.dispatchEvent(new Event('input'));
  });
  await p.waitForTimeout(150);
  const noResults2Visible = await p.locator('#no-results').evaluate(el => el.style.display !== 'none');
  const noResultsCards    = await p.locator('.card').count();
  assert('AC-7 Impossible combo → no-results message shown', noResults2Visible);
  assert('AC-7 Card count = 0 when no-results shown', noResultsCards === 0, `got ${noResultsCards}`);

  // AC-5: reset
  await p.click('.btn-reset');
  await p.waitForTimeout(100);
  const afterResetCount = await p.locator('.card').count();
  const afterResetText  = await p.textContent('#result-count');
  assert('AC-5 Reset → 10 cards restored', afterResetCount === 10, `got ${afterResetCount}`);
  assert('AC-5 Result count resets to 10 of 10', afterResetText.includes('10 of 10'), afterResetText);

  // AC-6: result count updates immediately
  await p.check('#villa');
  await p.waitForTimeout(100);
  const villaCt  = await p.locator('.card').count();
  const villaLbl = await p.textContent('#result-count');
  assert('AC-6 Count updates immediately when villa selected',
    villaLbl.includes(`${villaCt} of 10`), villaLbl);

  // DD-06 ARIA: aria-valuemin and aria-valuemax present on slider
  const ariaMin = await p.getAttribute('#score-range', 'aria-valuemin');
  const ariaMax = await p.getAttribute('#score-range', 'aria-valuemax');
  assert('DD-06 aria-valuemin = 1', ariaMin === '1', `got ${ariaMin}`);
  assert('DD-06 aria-valuemax = 10', ariaMax === '10', `got ${ariaMax}`);

  // Probe: aria-valuetext updates on slider change (use evaluate for decimal values)
  await p.click('.btn-reset');
  await p.evaluate(() => {
    const el = document.getElementById('score-range');
    el.value = '7'; el.dispatchEvent(new Event('input'));
  });
  await p.waitForTimeout(100);
  const ariaText = await p.getAttribute('#score-range', 'aria-valuetext');
  assert('🔍 DD-06 aria-valuetext updates to "≥ 7.0"', ariaText && ariaText.includes('7.0'), `got ${ariaText}`);

  // Probe: score slider min boundary (value=1 → "Any (≥ 1)")
  await p.fill('#score-range', '1'); await p.dispatchEvent('#score-range', 'input');
  await p.waitForTimeout(50);
  const minLabel    = await p.textContent('#score-label');
  const minAriaText = await p.getAttribute('#score-range', 'aria-valuetext');
  assert('🔍 Slider at min (1) → label "Any (≥ 1)"', minLabel.includes('Any'), minLabel);
  assert('🔍 Slider at min → aria-valuetext = "Any (≥ 1)"', minAriaText && minAriaText.includes('Any'), minAriaText);

  // Probe: AC-8 mobile viewport (375px) — layout doesn't crash, filters still work
  console.log('\n=== Browser: AC-8 Mobile viewport (375px) ===');
  await ctx.close();
  const mCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mPage = await mCtx.newPage();
  await mPage.goto(indexUrl, { waitUntil: 'domcontentloaded' });

  const mCards    = await mPage.locator('.card').count();
  const mAside    = await mPage.locator('aside.filters').isVisible();
  assert('AC-8 Mobile: 10 cards render at 375px', mCards === 10, `got ${mCards}`);
  assert('AC-8 Mobile: filter panel visible at 375px', mAside);

  await mPage.check('#wifi');
  await mPage.waitForTimeout(100);
  const mWifiCards = await mPage.locator('.card').count();
  assert('AC-8 Mobile: wifi filter works at 375px', mWifiCards === 7, `got ${mWifiCards}`);
  await mCtx.close();

  await browser.close();

  // ── Final summary ─────────────────────────────────────────────────────────
  const total = passed + failed;
  console.log(`\n${'='.repeat(60)}`);
  console.log(`BROWSER RESULT: ${passed}/${total} passed, ${failed} failed`);
  if (failures.length) {
    console.log('\nFailed:');
    failures.forEach(f => console.log(`  ✗ ${f}`));
  }
  console.log('='.repeat(60));
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => { console.error('FATAL:', e.message); process.exit(2); });
