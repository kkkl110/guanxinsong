import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { Presentation, PresentationFile } from 'file:///C:/Users/30687/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT,'output/report-question-02');
const TMP = path.join(ROOT,'tmp/question2-build');
const SKILL = 'C:/Users/30687/.codex/plugins/cache/openai-primary-runtime/presentations/26.1026.10807/skills/presentations';
const PYTHON = 'C:/Users/30687/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
process.env.RUNTIME_NODE_MODULES='C:/Users/30687/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
process.env.RUNTIME_NODE=process.execPath;
process.env.RUNTIME_PYTHON=PYTHON;
const data = JSON.parse(await fs.readFile(path.join(OUT,'report-data.json'),'utf8'));
await fs.mkdir(TMP,{recursive:true});
await fs.mkdir(path.join(OUT,'pages'),{recursive:true});
const p = Presentation.create({slideSize:{width:1920,height:1080}});
const FONT='Microsoft YaHei';
const c={bg:'#182130',text:'#F1F4F8',muted:'#B6C0CF',accent:'#55B5D8',gold:'#D6BD91',line:'#526174',head:'#24354B'};

function text(slide,content,left,top,width,height,size=26,color=c.text,bold=false){
 const sh=slide.shapes.add({geometry:'textbox',position:{left,top,width,height},fill:'none',line:{fill:'none',width:0}});
 sh.text=content;
 sh.text.style={typeface:FONT,fontSize:size,color,bold,wrap:'square',autoFit:'none',insets:0,verticalAlignment:'top'};
 return sh;
}
function table(slide,headers,rows,left,top,width,height,widths,font=25,headHeight=58){
 const t=slide.tables.add({rows:rows.length+1,columns:headers.length,left,top,width,height,columnWidths:widths,values:[headers,...rows]});
 t.styleOptions={headerRow:false,bandedRows:false};
 t.cells.block({row:0,column:0,rowCount:rows.length+1,columnCount:headers.length}).assign({fill:c.bg,textStyle:{typeface:FONT,fontSize:font,color:c.text},margins:{top:12,bottom:12,left:16,right:16}});
 t.borders.assign({style:'solid',fill:c.line,width:0.65});
 t.cells.block({row:0,column:0,rowCount:1,columnCount:headers.length}).assign({fill:c.head,textStyle:{typeface:FONT,fontSize:font+1,color:c.accent,bold:true}});
 t.rows[0].height=headHeight;
 for(let i=1;i<=rows.length;i++){
   t.rows[i].height=(height-headHeight)/rows.length;
   t.getCell(i,0).text.style={typeface:FONT,fontSize:font,color:c.gold,bold:true};
 }
 return t;
}
async function photo(slide,a,left,top,width,height){
 const bytes=await fs.readFile(path.join(OUT,a.file));
 const ratio=Math.min(width/a.width,height/a.height);
 const w=a.width*ratio,h=a.height*ratio;
 slide.images.add({blob:bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),contentType:a.file.endsWith('.png')?'image/png':'image/jpeg',alt:`${a.id} ${a.caption}`,fit:'contain',position:{left:left+(width-w)/2,top:top+(height-h)/2,width:w,height:h}});
}
for(let i=0;i<data.slides.length;i++){
 const s=data.slides[i], slide=p.slides.add();
 slide.background.fill=c.bg;
 text(slide,'02',96,48,110,94,76,c.accent,true);
 text(slide,s.title,226,62,1574,70,50,c.text,true);
 text(slide,s.subtitle,228,143,1570,52,27,c.muted);
 if(s.type==='overview'){
  table(slide,s.headers,s.rows,100,234,1720,650,[190,510,510,510],25,66);
  text(slide,s.takeaway,110,925,1700,72,28,c.gold,true);
  text(slide,s.note,110,1018,1700,34,20,c.muted);
 }else if(s.type==='paired'){
  for(let j=0;j<2;j++){
   const a=data.assets.find(x=>x.id===s.images[j]);
   const x=100+j*895;
   text(slide,`${j===0?'A  萤火突击':'B  烽火地带'}`,x,210,825,42,31,c.accent,true);
   await photo(slide,a,x,260,825,302);
   text(slide,a.caption,x,585,825,90,25,c.text);
   text(slide,`${a.id}  ${a.platform}`,x,680,825,30,18,c.muted);
  }
  table(slide,s.headers,s.rows,100,731,1720,220,[190,765,765],24,48);
  text(slide,s.takeaway,110,976,1700,65,26,c.gold,true);
 }else if(s.type==='differences'){
  table(slide,s.headers,s.rows,100,228,1720,738,[170,450,500,600],24,60);
  text(slide,s.note,110,995,1700,56,23,c.muted);
 }else{
  table(slide,s.headers,s.rows,100,228,1720,718,[180,570,970],25,58);
  text(slide,s.takeaway,110,975,1700,70,26,c.gold,true);
 }
 text(slide,`${String(i+1).padStart(2,'0')} / 06`,1730,1049,100,24,18,c.muted);
 const sourceText=s.sources.map(id=>`${id} ${data.sources[id].title}\n${data.sources[id].url}\n${data.sources[id].date}。${data.sources[id].scope}`).join('\n\n');
 const imageNotes=(s.images??[]).map(id=>{const a=data.assets.find(x=>x.id===id);return `${a.id} ${a.kind}。${a.platform}\n${a.raw}\n建议标注：${a.focus}`;}).join('\n\n');
 slide.speakerNotes.text=`研究口径：A基于资料整理供用户结合项目经验校准；B为资料分析，尚无本次亲身试玩记录。人群和体验得失为设计推断。\n\n${sourceText}\n\n${imageNotes}`;
 const png=await p.export({slide,format:'png',scale:1});
 await fs.writeFile(path.join(OUT,'pages',`page-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));
 console.log(`Rendered page ${i+1}`);
 const layout=await slide.export({format:'layout'});
 await fs.writeFile(path.join(TMP,`page-${i+1}.layout.json`),await layout.text());
}
await fs.writeFile(path.join(TMP,'presentation.json'),JSON.stringify(p.toProto()));
const candidatePath=path.join(TMP,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidatePath);
console.log('Exported candidate PPTX');
const {finalizePresentation}=await import(pathToFileURL(path.join(SKILL,'container_tools/artifact_tool_utils.mjs')).href);
const finalPath=path.join(OUT,'第二部分-同品类对照与设计迁移.pptx');
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath,finalPath,pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','18288000,10287000','--validate-bullet-geometry','--validate-heading-fit',...[1,2,3,4,5,6].flatMap(n=>['--require-native-table-slide',String(n)])],requiredNativeTableOwnerSlides:[1,2,3,4,5,6],fontPolicy:{basis:'design',families:[FONT]},verifyArtifactToolImport:true,receiptPath:path.join(TMP,'validation.json')});
console.log(JSON.stringify({finalPath,result}));
