const {chromium} = require('/Users/ujjwalanand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  const page = await browser.newPage({viewport: {width: 1440, height: 950}});
  await page.goto('http://localhost:3000', {waitUntil: 'domcontentloaded'});
  await page.locator('.welcome-offer[open]').waitFor();
  await page.getByRole('button', {name: 'Close welcome popup'}).click();
  await page.reload({waitUntil: 'domcontentloaded'});
  await page.locator('.social-grid').waitFor();
  await page.waitForTimeout(1200);
  console.log('cooldown', await page.locator('.welcome-offer').evaluate(e => !e.open));
  console.log('removed', await page.locator('.social-controls, .better-tabs, .social-footer .orange-button').count());
  const track = page.locator('.social-grid');
  await track.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const start = await track.evaluate(e => e.scrollLeft);
  await page.waitForTimeout(1500);
  console.log('autoScrollDelta', await track.evaluate(e => e.scrollLeft) - start);
  await page.emulateMedia({reducedMotion: 'reduce'});
  const reduced = await track.evaluate(e => e.scrollLeft);
  await page.waitForTimeout(500);
  console.log('reducedMotionDelta', await track.evaluate(e => e.scrollLeft) - reduced);
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({width, height: 950});
    console.log('width', width, 'overflow', await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
  }
  await page.evaluate(() => localStorage.setItem('soraa-welcome-last-shown', String(Date.now() - 3600001)));
  await page.reload({waitUntil: 'domcontentloaded'});
  await page.locator('.welcome-offer[open]').waitFor();
  console.log('afterOneHour', true);
  await page.getByRole('button', {name: 'Close welcome popup'}).click();
  await page.locator('.category-section').screenshot({path: 'tmp/category-cleanup.png'});
  await browser.close();
})().catch(error => {console.error(error); process.exit(1)});
