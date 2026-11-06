const fs=require('fs'),path=require('path');
const{chromium}=require('C:/Users/30687/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve('output/interface-design/map-imagegen-v2');
(async()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});const report=[];
 for(const item of manifest.images){
  const data='data:image/png;base64,'+fs.readFileSync(path.join(root,'originals',item.id+'-final.png')).toString('base64');
  const result=await page.evaluate(async src=>{const im=new Image();im.src=src;await im.decode();const c=document.createElement('canvas');c.width=1920;c.height=1080;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(im,0,0,1920,1080);return{data:c.toDataURL('image/png').split(',')[1],sourceWidth:im.naturalWidth,sourceHeight:im.naturalHeight}},data);
  const out=path.join(root,'final',item.file);fs.writeFileSync(out,Buffer.from(result.data,'base64'));const b=fs.readFileSync(out);report.push({id:item.id,file:item.file,source:[result.sourceWidth,result.sourceHeight],exported:[b.readUInt32BE(16),b.readUInt32BE(20)],bytes:b.length});
 }
 const titles={A:'冷青精密航图',B:'黑瓷浅金档案',C:'深蓝银色部署'};
 const cards=manifest.images.map(i=>`<a class="card" href="final/${i.file}"><img src="final/${i.file}" alt="${i.id} ${i.direction} ${i.state}"><div class="caption"><strong>${i.id} · ${i.direction}</strong><span>${i.state}</span></div></a>`).join('');
 const html=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>界域回收 · 六张选图方案</title><style>*{box-sizing:border-box}body{margin:0;background:#0a111b;color:#eff4f6;font:26px/1.45 "Microsoft YaHei",sans-serif}.sheet{width:1920px;margin:auto;padding:48px 64px}h1{margin:0;font-size:44px}p{color:#b9c7d2;margin:12px 0 32px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:28px}.card{display:block;background:#13212f;border:1px solid #3d4d5b;border-radius:10px;overflow:hidden;text-decoration:none;color:inherit}.card img{display:block;width:100%;aspect-ratio:16/9}.caption{height:80px;padding:18px 24px;display:flex;justify-content:space-between;align-items:center;gap:16px}.caption strong{font-size:28px;font-weight:600}.caption span{font-size:26px;color:#bdcbd5}.note{margin:28px 0 0;color:#a9bcca;font-size:26px}@media(max-width:1919px){.sheet{width:100%;padding:24px}.grid{grid-template-columns:1fr}.caption{height:auto;min-height:80px}}</style><main class="sheet"><h1>界域回收 / 地图选择视觉方案</h1><p>三个方向 × 普通可进入／高危锁定预览 · 点击图片查看1920×1080原尺寸</p><div class="grid">${cards}</div><p class="note">高危60%为展示假设；PNG为视觉选型稿，实际字号及透明热区需在可编辑原型中验收。</p></main></html>`;
 fs.writeFileSync(path.join(root,'index.html'),html,'utf8');
 await page.setViewportSize({width:1920,height:2200});await page.goto('file:///'+path.join(root,'index.html').replaceAll('\\','/'));await page.evaluate(()=>document.fonts.ready);await page.locator('.sheet').screenshot({path:path.join(root,'六图对照总览.png')});
 fs.writeFileSync(path.join(root,'导出检查.json'),JSON.stringify({images:report,resolutionPass:report.every(r=>r.exported[0]===1920&&r.exported[1]===1080),note:'标准尺寸导出；未对生图内容绘制新的UI。'},null,2));
 console.log(JSON.stringify(report));await browser.close();
})();
