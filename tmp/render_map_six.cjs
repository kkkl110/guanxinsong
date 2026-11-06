const {chromium}=require('C:/Users/30687/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path');
const root=path.resolve('output/interface-design/map-six-v1');
const fileUrl=p=>'file:///'+p.replaceAll('\\','/');
async function inspect(page){return page.evaluate(()=>{
 const board=document.querySelector('.board'),bb=board.getBoundingClientRect(),scale=bb.width/1920,visible=e=>{const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0&&!e.closest('[hidden]')};
 const texts=[],walker=document.createTreeWalker(board,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){const n=walker.currentNode,p=n.parentElement;if(!n.textContent.trim()||!visible(p)||p.closest('svg,script,style'))continue;const r=document.createRange();r.selectNodeContents(n);for(const b of r.getClientRects()){if(b.width<1||b.height<1)continue;const s=getComputedStyle(p);texts.push({text:n.textContent.trim(),x:(b.x-bb.x)/scale,y:(b.y-bb.y)/scale,w:b.width/scale,h:b.height/scale,size:parseFloat(s.fontSize),parent:p.tagName,bind:p.dataset.bind})}}
 const badFonts=texts.filter(t=>![26,28,32,36,40,44,64].includes(t.size));
 const out=texts.filter(t=>t.x<-.5||t.y<-.5||t.x+t.w>1920.5||t.y+t.h>1080.5);
 const buttons=[...board.querySelectorAll('button')].filter(visible).map(e=>{const b=e.getBoundingClientRect();return{name:e.getAttribute('aria-label')||e.textContent.trim(),w:b.width/scale,h:b.height/scale,x:(b.x-bb.x)/scale,y:(b.y-bb.y)/scale}});
 const overlaps=[];for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){const a=texts[i],b=texts[j],w=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),h=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);if(w>5&&h>Math.min(a.h,b.h)*.6)overlaps.push([a.text,b.text,Math.round(w),Math.round(h)])}
 return{fonts:[...new Set(texts.map(t=>t.size))].sort((a,b)=>a-b),minimumFont:Math.min(...texts.map(t=>t.size)),badFonts,outside:out,smallTargets:buttons.filter(b=>b.h<69.5||b.w<69.5),buttonCount:buttons.length,overlaps,textCount:texts.length};
})}
(async()=>{
 fs.mkdirSync(path.join(root,'previews'),{recursive:true});fs.mkdirSync(path.join(root,'qa'),{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});const results=[];
 for(let n=1;n<=6;n++){
  const id=String(n).padStart(2,'0'),p=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(fileUrl(path.join(root,'variants',id+'.html')));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(180);
  const normal=await inspect(p);await p.screenshot({path:path.join(root,'previews',id+'.png')});
  await p.locator('[data-diff="high"]').click();const high=await inspect(p);await p.screenshot({path:path.join(root,'qa',id+'-high.png')});
  await p.locator('[data-map="02"]').click();const map2=await inspect(p);const fallback=await p.getAttribute('.board','data-current-mode');
  await p.locator('[data-diff="high"]').click();const highLocked=await p.locator('.overlay-root').isVisible();await p.keyboard.press('Escape');
  await p.locator('[data-map="03"]').click();const lockHint=await p.locator('.locked-popover').isVisible(),mapKept=await p.getAttribute('.board','data-current-map');await p.screenshot({path:path.join(root,'qa',id+'-locked-hint.png')});await p.keyboard.press('Escape');
  await p.locator('[data-action="objectives"]').click();const goals=await p.locator('.app-drawer').isVisible();await p.keyboard.press('Escape');
  await p.locator('[data-action="prepare"]').click();const prep=await p.locator('.app-drawer').isVisible();await p.keyboard.press('Escape');
  const result={id,normal,high,map2,interactions:{highSelected:high.minimumFont>=26,map2FallbackNormal:fallback==='normal',highLocked,lockHint,lockedDidNotChangeSelected:mapKept==='02',goals,prep},errors};results.push(result);console.log(JSON.stringify(result));await p.close();
 }
 fs.writeFileSync(path.join(root,'qa','verification.json'),JSON.stringify(results,null,2));await browser.close();
})();
