import { projects, categories, spotlight } from '../src/data/projects.ts';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL || 'http://127.0.0.1:4321';
const out='tmp/qa'; await mkdir(out,{recursive:true});
const browser=await chromium.launch();
const problems=[];const results=[];
try {
 for(const width of [1440,1024,768,390]) {
  for(const theme of ['light','dark']) {
   const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme,reducedMotion:'reduce'});
   await context.addInitScript(theme=>localStorage.setItem('al-theme',theme),theme);
   const page=await context.newPage();
   page.on('pageerror',e=>problems.push(String(e)));
   page.on('console',m=>{if(m.type()==='error')problems.push(m.text());});
   for(const route of ['/','/projects/','/cv/']) {
    const response=await page.goto(base+route);
    assert.equal(response.status(),200,route);
    await page.locator('h1').waitFor();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Horizontal overflow at ${width} ${route}`);
    assert.equal(await page.locator('h1').count(),1);
    await page.screenshot({path:`${out}/${route==='/'?'home':route.split('/')[1]}-${width}-${theme}.png`,fullPage:true});
    results.push({route,width,theme,status:'pass'});
   }
   await context.close();
  }
 }
 const context=await browser.newContext({viewport:{width:390,height:844},colorScheme:'light'});
 const page=await context.newPage();
 await page.goto(base+'/');
 const toggle=page.locator('#theme-toggle');
 await toggle.click(); assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
 await toggle.click(); assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await page.reload(); assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await toggle.click(); assert.equal(await page.locator('html').getAttribute('data-theme'),'system');
 await page.emulateMedia({colorScheme:'dark'});
 assert.equal(await page.locator('html').evaluate(e=>getComputedStyle(e).colorScheme),'dark');
 await page.getByRole('link',{name:'Projects',exact:true}).click();
 assert.ok(page.url().endsWith('/projects/'));
 for(const [name,expected] of [...categories.map(c=>[c.short,projects.filter(p=>p.category===c.id).length]),['All projects',projects.length]]) {
  await page.getByRole('button',{name:new RegExp('^'+name)}).click();
  assert.equal(await page.locator('.collection-card:visible').count(),expected);
 }
 await page.getByRole('button',{name:'Storage',exact:true}).click();
 await page.reload(); assert.equal(await page.locator('.collection-card:visible').count(),1);
 await page.goBack(); assert.equal(await page.locator('.collection-card:visible').count(),projects.length);
 assert.equal(await page.locator('[data-project="pql"] a').count(),0);
 await page.goto(base+'/projects/#parsing');
 assert.equal(await page.locator('.collection-card:visible').count(),5);
 await page.goto(base+'/');
 assert.deepEqual(await page.locator('.featured-card').evaluateAll(cards=>cards.map(card=>card.dataset.project)),spotlight.map(p=>p.name));
 await page.goto(base+'/cv/');
 const pdf=await context.request.get(base+'/resume.pdf'); assert.equal(pdf.status(),200);assert.ok((await pdf.body()).subarray(0,5).toString()==='%PDF-');
 await page.getByRole('link',{name:'Al Liu, home',exact:true}).evaluate(e=>e.focus());
 // Keyboard focus must have a visible outline when the user tabs.
 await page.keyboard.press('Tab');
 const outline=await page.locator(':focus').evaluate(e=>getComputedStyle(e).outlineStyle);
 assert.notEqual(outline,'none');
 await page.emulateMedia({media:'print'});
 assert.equal(await page.locator('.site-header').isVisible(),false);
 assert.equal(await page.locator('.cv-nav').isVisible(),false);
 assert.equal(await page.locator('#theme-toggle').isVisible(),false);
 await page.emulateMedia({media:'screen'});
 const missing=await page.goto(base+'/this-route-does-not-exist/');assert.equal(missing.status(),404);
 await context.close();
 const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const noJSPage=await noJS.newPage();await noJSPage.goto(base+'/projects/');
 assert.equal(await noJSPage.locator('.collection-card:visible').count(),projects.length);
 assert.equal(await noJSPage.locator('.category-nav').isVisible(),true);
 assert.equal(await noJSPage.locator('.project-filters').isVisible(),false);
 await noJS.close();
 assert.deepEqual(problems,[],'Browser console or script errors');
 await writeFile(`${out}/browser-results.json`,JSON.stringify({results,theme:'pass',filters:'pass',navigation:'pass',pdf:'pass',print:'pass',keyboard:'pass',noJavaScript:'pass'},null,2));
 console.log('PASS: 24 page/viewport/theme combinations, theme persistence, filters, direct routes, PDF, print, keyboard, and no-JS fallback.');
}finally{await browser.close();}
