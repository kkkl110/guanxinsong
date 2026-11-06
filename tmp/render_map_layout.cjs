const { chromium } = require('C:/Users/30687/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');
(async () => {
 const dir=path.resolve('output/interface-design/map-selection');
 const svg=fs.readFileSync(path.join(dir,'地图选择-布局示意.svg'),'utf8');
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
 await page.setContent('<html lang="zh-CN"><meta charset="utf-8"><style>html,body{margin:0;background:#0B111B;width:1920px;height:1080px}</style>'+svg+'</html>');
 await page.evaluate(()=>document.fonts.ready);
 const result=await page.evaluate(()=>{
  const texts=[...document.querySelectorAll('svg text')];
  return {width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,minimumFont:Math.min(...texts.map(t=>parseFloat(getComputedStyle(t).fontSize))),fontSizes:[...new Set(texts.map(t=>parseFloat(getComputedStyle(t).fontSize)))],outside:texts.filter(t=>{const b=t.getBBox();return b.x<0||b.y<0||b.x+b.width>1920||b.y+b.height>1080}).map(t=>t.textContent),textCount:texts.length};
 });
 await page.screenshot({path:path.join(dir,'地图选择-布局示意.png')});
 console.log(JSON.stringify(result));
 await browser.close();
})();
