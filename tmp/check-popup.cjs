const {chromium}=require('/Users/ujjwalanand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage({viewport:{width:375,height:812}});
await p.addInitScript(()=>localStorage.setItem('soraa-cookie-choice','necessary'));
await p.goto('http://localhost:3000');await p.locator('.product-pulse').waitFor({state:'attached'});
await p.evaluate(()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close()));
await p.locator('.order-globe-visual').scrollIntoViewIfNeeded();
await p.locator('.product-pulse').evaluate(el=>{el.style.opacity='1';el.style.visibility='visible';el.style.transform='none'});
await p.waitForTimeout(500);
await p.locator('.order-globe-visual').evaluate(el=>window.scrollBy(0,el.getBoundingClientRect().bottom-innerHeight+90));
console.log('layer',await p.locator('.product-pulse').evaluate(el=>{const r=el.getBoundingClientRect();return {parent:el.parentElement.tagName,onTop:el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}}));
await p.screenshot({path:'tmp/popup-globe-fixed.png'});
for(const width of [320,375,390,430,767]){await p.setViewportSize({width,height:812}); console.log('cards',width,await p.locator('.collection-showcase .pdp-related-track').evaluate(el=>({cardWidth:el.firstElementChild.getBoundingClientRect().width,viewport:el.clientWidth,scroll:el.scrollWidth})));}
await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
