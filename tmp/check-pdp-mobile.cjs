const {chromium} = require('/Users/ujjwalanand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/products/date-bites');
  await page.locator('.pdp-summary').waitFor();
  for (const width of [320, 360, 375, 390, 430, 767, 768, 1024, 1440]) {
    await page.setViewportSize({width, height: 850});
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => {
      const width = innerWidth;
      const outside = [...document.querySelectorAll('.pdp *')].filter(el => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height || (r.left >= -1 && r.right <= width+1)) return false;
        for (let p=el.parentElement; p; p=p.parentElement) {
          if (['auto','scroll','hidden','clip'].includes(getComputedStyle(p).overflowX)) return false;
        }
        return true;
      }).map(el => el.className).slice(0,10);
      return {width, scrollWidth:document.documentElement.scrollWidth, outside};
    });
    console.log(JSON.stringify(result));
    if (width === 390) await page.screenshot({path:'tmp/pdp-mobile-390.png',fullPage:true});
  }
  await page.setViewportSize({width:320,height:640});
  await page.getByRole('button',{name:'Enlarge product image',exact:true}).click();
  console.log('zoom', await page.locator('.pdp-lightbox').evaluate(el=>({width:el.getBoundingClientRect().width,scroll:el.scrollWidth,client:el.clientWidth})));
  await page.getByRole('button',{name:'Close enlarged image',exact:true}).click();
  await page.locator('.pdp-faq').scrollIntoViewIfNeeded();
  console.log('sticky', await page.locator('.pdp-sticky-buy').boundingBox());
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
