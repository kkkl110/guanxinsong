// Shared editable Figma construction helpers. Scope: only authorized missing views.
const page = await figma.getNodeByIdAsync('61:601');
await figma.setCurrentPageAsync(page);
const createdNodeIds = [], mutatedNodeIds = [], completedFrames = [];
const track = n => { createdNodeIds.push(n.id); return n; };
const dup = v => JSON.parse(JSON.stringify(v));
await Promise.all(['Regular','Medium','Bold'].map(style => figma.loadFontAsync({family:'Noto Sans SC',style})));
const colors = {mint:'#96FDED',surface:'#091C22',text:'#FFFFFF',gold:'#FFC758',danger:'#FF3F3F',muted:'#A5B1B5'};
const rgb = s => {s=s.replace('#','');return{r:parseInt(s.slice(0,2),16)/255,g:parseInt(s.slice(2,4),16)/255,b:parseInt(s.slice(4,6),16)/255};};
const paint = (tone='text',opacity=1) => ({type:'SOLID',color:rgb(colors[tone]||tone),opacity});
let coll = (await figma.variables.getLocalVariableCollectionsAsync()).find(c=>c.name==='补齐界面 / 视觉规范');
if(!coll) coll=figma.variables.createVariableCollection('补齐界面 / 视觉规范');
const ownVars=(await figma.variables.getLocalVariablesAsync()).filter(v=>v.variableCollectionId===coll.id);
const vars={};
for(const [key,val] of Object.entries(colors)){
  let v=ownVars.find(v=>v.name==='color/'+key);
  if(!v){v=figma.variables.createVariable('color/'+key,coll,'COLOR');v.scopes=['FRAME_FILL','SHAPE_FILL','TEXT_FILL','STROKE_COLOR'];v.setValueForMode(coll.defaultModeId,{...rgb(val),a:1});v.setVariableCodeSyntax('WEB','var(--veil-'+key+')');}
  vars[key]=v;
}
for(const value of [10,20]){
  let v=ownVars.find(v=>v.name==='space/'+value);
  if(!v){v=figma.variables.createVariable('space/'+value,coll,'FLOAT');v.scopes=['GAP'];v.setValueForMode(coll.defaultModeId,value);v.setVariableCodeSyntax('WEB','var(--veil-space-'+value+')');}
  vars['space'+value]=v;
}
const boundPaint=(tone,opacity=1)=>{const p=vars[tone]?figma.variables.setBoundVariableForPaint(paint(tone,opacity),'color',vars[tone]):paint(tone,opacity);p.opacity=opacity;return p;};
let board=page.children.find(n=>n.name==='补齐界面 / 可复用组件与切图');
if(!board){board=track(figma.createFrame());board.name='补齐界面 / 可复用组件与切图';page.appendChild(board);board.x=12494;board.y=10600;board.resize(2500,1600);board.fills=[paint('surface')];board.clipsContent=false;}
const styles={};
const allStyles=await figma.getLocalTextStylesAsync();
for(const [key,size,weight] of [['title',44,'Bold'],['heading',32,'Bold'],['body',28,'Regular'],['caption',24,'Regular'],['small',20,'Regular']]){
  let s=allStyles.find(x=>x.name==='补齐界面/'+key);
  if(!s){s=figma.createTextStyle();s.name='补齐界面/'+key;s.fontName={family:'Noto Sans SC',style:weight};s.fontSize=size;s.lineHeight={unit:'PERCENT',value:120};}
  styles[key]=s;
}
const ASSET_IDS={crystal:'83:4638',metal:'83:4644',electronics:'83:4650',permit:'83:4655',medkit:'83:4936',potion:'83:5326',orb:'83:5329',avatar1:'83:5338',avatar2:'83:5344',avatar3:'83:5353',weapon:'83:5005',chest:'127:1551'};
const assetNodes={};
for(const [k,id] of Object.entries(ASSET_IDS)) assetNodes[k]=await figma.getNodeByIdAsync(id);
const sources={battle:await figma.getNodeByIdAsync('83:5232'),prebattle:await figma.getNodeByIdAsync('83:4764'),panel:await figma.getNodeByIdAsync('83:4798')};
function nativeFrame(parent,name,x,y,w,h){const n=track(figma.createFrame());n.name=name;parent.appendChild(n);n.resize(w,h);n.x=x;n.y=y;n.fills=[];n.clipsContent=false;return n;}
function frame(name,x,y,w=1920,h=1080){let n=page.children.find(n=>n.type==='FRAME'&&n.name===name);if(n)throw new Error('Frame already exists: '+name);n=nativeFrame(page,name,x,y,w,h);n.clipsContent=true;n.fills=[paint('surface')];return n;}
function rect(parent,name,x,y,w,h,tone='surface',opacity=1){const n=track(figma.createRectangle());n.name=name;parent.appendChild(n);n.resize(w,h);n.x=x;n.y=y;n.fills=[boundPaint(tone,1)];n.opacity=opacity;return n;}
function tx(parent,name,text,x,y,w,h,size=28,tone='text',weight='Regular'){
  const n=track(figma.createText());n.name=name;n.fontName={family:'Noto Sans SC',style:weight};n.fontSize=size;n.characters=text;n.textAutoResize='NONE';n.resize(w,h);n.lineHeight={unit:'PERCENT',value:120};n.fills=[boundPaint(tone)];parent.appendChild(n);n.x=x;n.y=y;
  const sk=size===44?'title':size===32&&weight==='Bold'?'heading':size===28&&weight==='Regular'?'body':size===24&&weight==='Regular'?'caption':size===20&&weight==='Regular'?'small':null;
  if(sk)n.textStyleId=styles[sk].id;return n;
}
function stack(parent,name,x,y,w,h,dir='VERTICAL',gap=20){const n=nativeFrame(parent,name,x,y,w,h);n.layoutMode=dir;n.primaryAxisSizingMode='FIXED';n.counterAxisSizingMode='FIXED';n.itemSpacing=gap;n.counterAxisAlignItems='CENTER';if(vars['space'+gap])n.setBoundVariable('itemSpacing',vars['space'+gap]);return n;}
function asset(parent,name,key,x,y,w,h){const src=assetNodes[key];if(!src)throw new Error('Missing content asset: '+key);const n=rect(parent,name,x,y,w,h);const f=src.fills.filter(f=>f.type==='IMAGE'&&f.visible!==false).slice(-1)[0];n.fills=[{type:'IMAGE',imageHash:f.imageHash,scaleMode:'FIT',opacity:1}];return n;}
function bg(parent,kind='battle',dim=.45,blur=0){const src=sources[kind]||sources.battle;const n=rect(parent,'背景 / 独立场景位图',0,0,parent.width,parent.height);n.fills=dup(src.fills);if(blur)n.effects=[{type:'LAYER_BLUR',radius:blur,visible:true}];parent.insertChild(0,n);if(dim){const d=rect(parent,'背景 / 阅读遮罩',0,0,parent.width,parent.height,'surface',dim);parent.insertChild(1,d);}return n;}
function vectorShape(parent,name,w,h,tone='surface',opacity=1,cut=12,stroke=true){const n=track(figma.createVector());n.name=name;parent.appendChild(n);n.vectorPaths=[{windingRule:'NONZERO',data:'M '+cut+' 0 L '+w+' 0 L '+w+' '+(h-cut)+' L '+(w-cut)+' '+h+' L 0 '+h+' L 0 '+cut+' Z'}];n.fills=[boundPaint(tone,opacity)];if(stroke){n.strokes=[boundPaint('text',.25)];n.strokeWeight=1;}return n;}
const masters={};
function master(name,w,h,build,x){let c=board.children.find(n=>n.type==='COMPONENT'&&n.name===name);if(!c){c=track(figma.createComponent());board.appendChild(c);c.name=name;c.resize(w,h);c.x=x;c.y=40;c.fills=[];c.description='只用于新增界面；复用原设计薄荷色、斜切框与字号。';build(c);c.exportSettings=[{format:'PNG',suffix:'',constraint:{type:'SCALE',value:2}}];}return c;}
masters.cell=master('物资格 / 空',84,84,c=>{const v=vectorShape(c,'1px斜切格',84,84,'surface',.45,5,true);v.constraints={horizontal:'STRETCH',vertical:'STRETCH'};},0);
masters.panel=master('面板 / 薄透斜切',444,918,c=>{const v=track(sources.panel.clone());c.appendChild(v);v.name='原稿斜切面板';v.resize(444,918);v.x=0;v.y=0;v.constraints={horizontal:'STRETCH',vertical:'STRETCH'};},130);
masters.primary=master('按钮 / 主',310,80,c=>{const v=vectorShape(c,'薄荷实底',310,80,'mint',1,15,true);v.constraints={horizontal:'STRETCH',vertical:'STRETCH'};const line=rect(c,'微光细线',28,7,260,2,'text',.25);line.constraints={horizontal:'STRETCH',vertical:'MIN'};},620);
masters.secondary=master('按钮 / 次',310,80,c=>{const v=vectorShape(c,'半透明底',310,80,'surface',.65,15,true);v.constraints={horizontal:'STRETCH',vertical:'STRETCH'};},980);
function instance(parent,name,main,x,y,w,h){const n=track(main.createInstance());n.name=name;parent.appendChild(n);n.resize(w,h);n.x=x;n.y=y;return n;}
function panel(parent,name,x,y,w,h,opacity=.78){const n=instance(parent,name,masters.panel,x,y,w,h);n.opacity=opacity;return n;}
function btn(parent,name,label,x,y,w,h,primary=true,disabled=false){const wrap=nativeFrame(parent,name,x,y,w,h);instance(wrap,'按钮底 / 组件',primary?masters.primary:masters.secondary,0,0,w,h);const t=tx(wrap,'按钮文字',label,12,0,w-24,h,h>=80?32:28,primary?'surface':'text','Bold');t.textAlignHorizontal='CENTER';t.textAlignVertical='CENTER';if(disabled)wrap.opacity=.35;return wrap;}
function rule(parent,x,y,w){return rect(parent,'分隔线',x,y,w,1,'text',.2);}
function grid(parent,x,y,cell=82,gap=8,cols=5,rows=6){const wrap=stack(parent,'物资网格 / '+cols+'×'+rows,x,y,cols*cell+(cols-1)*gap,rows*cell+(rows-1)*gap,'VERTICAL',gap);const cells=[];for(let r=0;r<rows;r++){const row=stack(wrap,'第'+(r+1)+'行',0,0,wrap.width,cell,'HORIZONTAL',gap);for(let c=0;c<cols;c++)cells.push(instance(row,'空格 '+(r+1)+'-'+(c+1),masters.cell,0,0,cell,cell));}return cells;}
function item(parent,name,key,x,y,w,h,qty='1',quality='mint'){const n=nativeFrame(parent,name,x,y,w,h);instance(n,'物品占格底 / 组件',masters.cell,0,0,w,h);rect(n,'品质侧线',0,7,3,h-14,quality,.8);const pad=Math.max(10,Math.min(w,h)*.1);asset(n,'物品净图',key,pad,pad,w-pad*2,h-pad*2-12);const t=tx(n,'堆叠数量',qty,w-48,h-28,40,26,20,'text','Medium');t.textAlignHorizontal='RIGHT';return n;}
function icon(parent,key,x,y,size=32,tone='text'){return tx(parent,'图标 / '+key,key==='close'?'×':key==='back'?'‹':key==='search'?'⌕':key==='rotate'?'↻':key==='box'?'◇':'◆',x,y,size,size,size,tone,'Bold');}
function finish(n){n.placeholder=false;n.exportSettings=[{format:'PNG',suffix:'',constraint:{type:'SCALE',value:1}}];completedFrames.push({id:n.id,name:n.name,width:n.width,height:n.height,descendants:n.findAll(()=>true).length});if(!createdNodeIds.includes(n.id))mutatedNodeIds.push(n.id);}
async function copyHud(target){
  const source=await figma.getNodeByIdAsync('83:5231');
  function copyNode(src,parent){
    let n;
    if(src.type==='TEXT'){
      const style=typeof src.fontName==='object'&&src.fontName.style&&src.fontName.style.includes('Bold')?'Bold':'Regular';
      n=tx(parent,src.name,src.characters,src.x,src.y,src.width,src.height,typeof src.fontSize==='number'?src.fontSize:24,'text',style);
      n.fills=dup(src.fills);n.textAlignHorizontal=src.textAlignHorizontal;n.textAlignVertical=src.textAlignVertical;
      if(typeof src.letterSpacing==='object')n.letterSpacing=dup(src.letterSpacing);
      if(typeof src.lineHeight==='object')n.lineHeight=dup(src.lineHeight);
    } else if(src.type==='FRAME'||src.type==='GROUP'){
      n=nativeFrame(parent,src.name,src.x,src.y,src.width,src.height);
      if(src.type==='FRAME'){n.fills=dup(src.fills);n.strokes=dup(src.strokes);n.clipsContent=src.clipsContent;}
      for(const c of src.children)copyNode(c,n);
    } else {
      n=track(src.clone());parent.appendChild(n);n.x=src.x;n.y=src.y;
      if('children'in n)for(const c of n.findAll(()=>true))createdNodeIds.push(c.id);
    }
    n.opacity=src.opacity;n.visible=src.visible;
    if('effects'in src&&'effects'in n)n.effects=dup(src.effects);
    if(src.rotation)n.rotation=src.rotation;
    return n;
  }
  for(const child of source.children)copyNode(child,target);
  target.fills=dup(source.fills);return target;
}
