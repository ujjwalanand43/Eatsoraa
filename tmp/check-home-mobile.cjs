const {chromium}=require('/Users/ujjwalanand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({channel:'chrome',headless:true});
 const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await p.goto('http://localhost:3000/');
 await p.locator('.category-grid').waitFor();
 await p.waitForTimeout(2500);
 await p.evaluate(()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close()));
 const pause=p.getByRole('button',{name:'Pause hero slideshow',exact:true});
 if(await pause.count()) await pause.click();
 for(const scheme of ['light','dark']) {
  await p.emulateMedia({colorScheme:scheme});
  for(const width of [320,360,390,430,650,767,768,1024,1440]) {
   await p.setViewportSize({width,height:844});
   console.log(JSON.stringify(await p.evaluate(({scheme})=>({scheme,width:innerWidth,scroll:document.documentElement.scrollWidth,outside:[...document.querySelectorAll('.soraa-home *')].filter(el=>{const r=el.getBoundingClientRect();if(!r.width||!r.height||(r.left>=-1&&r.right<=innerWidth+1))return false;for(let a=el.parentElement;a;a=a.parentElement){if(['auto','hidden','scroll','clip'].includes(getComputedStyle(a).overflowX))return false;}return true;}).map(el=>String(el.className)).slice(0,15)}),{scheme})));
  }
 }
 await p.setViewportSize({width:390,height:844});
 await p.evaluate(()=>scrollTo(0,0));
 await p.screenshot({path:'tmp/home-mobile-top.png'});
 for(let i=0;i<4;i++) {
  console.log('slide',i,await p.locator('.home-hero-slide.is-current').evaluate(el=>({width:el.clientWidth,height:el.clientHeight,overflow:el.scrollWidth>el.clientWidth})));
  await p.getByRole('button',{name:'Next hero slide',exact:true}).click();
 }
 await p.locator('.better-showcase').scrollIntoViewIfNeeded();
 await p.screenshot({path:'tmp/home-mobile-campaign.png'});
 console.log('colours',await p.locator('html').evaluate(el=>getComputedStyle(el).colorScheme));
 console.log('images',await p.locator('.soraa-home img').evaluateAll(es=>es.map(e=>({cls:e.className,parent:e.parentElement.className,h:Math.round(e.getBoundingClientRect().height),w:Math.round(e.getBoundingClientRect().width)})).filter(e=>e.h>290)));
 await p.screenshot({path:'tmp/home-mobile.png',fullPage:true});
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
