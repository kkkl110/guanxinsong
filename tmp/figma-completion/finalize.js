const removedNodeIds=[];
const openingSource=await figma.getNodeByIdAsync('83:5639');
const opening=track(openingSource.clone());createdNodeIds.push(...opening.findAll(()=>true).map(n=>n.id));
opening.name='战斗hud-开启物资箱进行中';opening.x=8240;opening.y=6500;
for(const n of [...opening.children]){if(['新增/场景交互 / 半透明衬底','新增/场景交互 / 状态细线','新增/场景交互/内容'].includes(n.name)){removedNodeIds.push(n.id);n.remove();}}
panel(opening,'开箱读条 / 薄透底板',1088,418,456,220,.88);
const openContent=stack(opening,'开箱进行 / 自动布局',1112,438,408,180,'VERTICAL',10);
tx(openContent,'阶段标题','正在开启物资箱',0,0,408,44,32,'text','Bold');
tx(openContent,'开启时间','2.4 / 5.0 s',0,0,408,38,28,'mint');
const openTrack=stack(openContent,'开启进度',0,0,408,6,'HORIZONTAL',0);rect(openTrack,'已完成进度',0,0,196,6,'mint');rect(openTrack,'剩余进度',0,0,212,6,'text',.2);
btn(openContent,'取消开箱','取消开启',0,0,408,56,false);
tx(opening,'操作限制说明','开启期间无法移动、攻击或闪避',1050,918,540,40,24,'text');finish(opening);

const pickedSource=await figma.getNodeByIdAsync('127:1021');
const picked=track(pickedSource.clone());createdNodeIds.push(...picked.findAll(()=>true).map(n=>n.id));picked.name='背包－手动拾取完成';picked.x=10368;picked.y=10250;
picked.findOne(n=>n.name==='背包格数').characters='08 / 30';
const bagStack=picked.findOne(n=>n.name.startsWith('背包物品 / 回收晶体'));
bagStack.findOne(n=>n.name==='堆叠数量').characters='5';
item(picked,'背包物品 / 源晶碎片余量 / 占用1×1','crystal',422,322,84,84,'1');
const removedLoot=picked.findOne(n=>n.name==='已揭示 / 回收晶体');removedNodeIds.push(removedLoot.id);removedLoot.remove();
picked.findOne(n=>n.name==='搜索数量').characters='已揭示 1 件 · 未知物资依次搜索';
const selected=picked.findOne(n=>n.name==='已选物资 / 自动布局');selected.findOne(n=>n.name==='物资名称').characters='陨石铁';selected.findOne(n=>n.name==='物资属性').characters='数量 1    占用 1×1    估值 2,200';selected.findOne(n=>n.name==='已选物资净图').fills=[{type:'IMAGE',imageHash:'eeb7bb075d29a306d514c401d925a8f6ad8f026c',scaleMode:'FIT'}];
panel(picked,'转移成功 / 轻提示底板',716,210,380,104,.88);tx(picked,'转移成功提示','源晶碎片 ×3\n已移入背包',740,228,332,72,28,'mint','Medium');finish(picked);

const detail=frame('结算－物资详情（浮层）',12494,6500,900,720);
panel(detail,'明细底板',0,0,900,720,.98);tx(detail,'浮层标题','本局物资明细',40,34,650,60,44,'text','Bold');btn(detail,'关闭详情','关闭',720,34,140,60,false);
const detailRows=stack(detail,'物资明细 / 自动布局',40,132,820,400,'VERTICAL',20);
for(const [name,key,qty,value] of [['源晶碎片','crystal','3','3,600'],['陨石铁','metal','2','4,400'],['电子元件','electronics','1','6,800'],['区域凭证','permit','1','5,700']]){const row=stack(detailRows,'物资 / '+name,0,0,820,80,'HORIZONTAL',20);asset(row,'物品净图',key,0,0,80,80);tx(row,'物品名',name,0,0,320,48,32,'text','Bold');tx(row,'数量','×'+qty,0,0,100,44,28,'text');tx(row,'估值',value,0,0,260,44,28,'mint');}
rule(detail,40,574,820);tx(detail,'估值合计','本局物资总估值  20,500',40,604,820,48,32,'mint','Bold');tx(detail,'去留提示','物资去留以结算结果为准',40,662,820,32,24,'muted');finish(detail);

// Keep newly added props consistent between the three HUD states.
for(const id of ['83:5639','83:5832',opening.id]){const p=await figma.getNodeByIdAsync(id);const a=p.findOne(n=>n.name==='新增/场景物件/补给箱独立净图');a.x=1250;a.y=650;a.resize(240,150);a.fills=[{type:'IMAGE',imageHash:'c3eced2277a0a2f6019c3f0d7ce2439c9c2268f3',scaleMode:'FIT',filters:{exposure:-.25,saturation:-.12}}];mutatedNodeIds.push(a.id);const shadow=p.findOne(n=>n.name==='新增/场景物件/接触软影');if(shadow){shadow.x=1260;shadow.y=778;shadow.resize(220,18);mutatedNodeIds.push(shadow.id);}}

// Organize discrete content images and vector UI masters for individual export.
board.resize(4040,2940);
let assetIndex=0;
for(const key of ['crystal','metal','electronics','permit','medkit','potion','orb','avatar1','avatar2','avatar3','weapon']){const x=650+(assetIndex%6)*300,y=240+Math.floor(assetIndex/6)*330;const n=asset(board,'切图 / '+key,key,x,y,256,256);n.exportSettings=[{format:'PNG',suffix:'',constraint:{type:'SCALE',value:2}}];tx(board,'素材标签 / '+key,key,x,y+266,256,36,24,'text');assetIndex++;}
const chest=await figma.getNodeByIdAsync('127:1551');chest.x=650;chest.y=980;chest.resize(512,320);chest.exportSettings=[{format:'PNG',suffix:'',constraint:{type:'SCALE',value:2}}];mutatedNodeIds.push(chest.id);
for(const [key,x] of [['battle',0],['prebattle',2100]]){const n=rect(board,'切图 / 背景-'+key,x,1800,1920,1080);n.fills=dup(sources[key].fills);n.exportSettings=[{format:'PNG',suffix:'',constraint:{type:'SCALE',value:1}}];}
for(const c of Object.values(masters)){c.exportSettings=[{format:'SVG',suffix:''},{format:'PNG',suffix:'',constraint:{type:'SCALE',value:2}}];mutatedNodeIds.push(c.id);}

async function link(fromFrameId,nodeName,toId,navigation='NAVIGATE',trigger='ON_CLICK'){
  const p=await figma.getNodeByIdAsync(fromFrameId);const n=p.findOne(n=>n.name===nodeName);if(!n)throw new Error('Missing prototype action '+nodeName);
  await n.setReactionsAsync([{trigger:{type:trigger},actions:[{type:'NODE',destinationId:toId,navigation,transition:{type:'DISSOLVE',easing:{type:'EASE_OUT'},duration:.15}}]}]);mutatedNodeIds.push(n.id);
}
await link('83:5639','长按开启 / 主交互',opening.id,'NAVIGATE','ON_PRESS');
await link(opening.id,'取消开箱','83:5639');
await opening.setReactionsAsync([{trigger:{type:'AFTER_TIMEOUT',timeout:2.6},actions:[{type:'NODE',destinationId:'83:4242',navigation:'NAVIGATE',transition:null}]}]);
await link('83:4242','暂停搜索','127:1021');await link('127:1021','继续搜索','83:4242');await link('127:1021','手动拾取',picked.id);await link(picked.id,'继续搜索','83:4242');
for(const id of ['83:4242','127:1021','127:1219',picked.id])await link(id,'返回','83:5639');
await link('127:651','返回','83:4763');
for(const id of ['83:4243','83:4244']){await link(id,'返回整备入口','83:4763');await link(id,'物资详情入口',detail.id,'OVERLAY');}
const closeDetail=detail.findOne(n=>n.name==='关闭详情');await closeDetail.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'CLOSE'}]}]);mutatedNodeIds.push(closeDetail.id);
await link('83:5832','重新搜索 / 主交互','83:4242');await link('131:918','查看撤离路线','83:3321');await link('131:1144','取消本次撤离','131:1376');
await link('130:1040','返回配置','83:4763');await link('130:1040','重试传送','83:5032');await link('130:1058','取消恢复','83:4763');await link('130:1058','确认恢复体力','83:4763');
const infoIds=['83:4242','83:4243','83:4244','83:5639','83:5832','127:651','127:1021','127:1219','130:1040','130:1058','131:918','131:1144','131:1376',opening.id,picked.id,detail.id];
const textExport=[],structure=[];
for(const id of infoIds){const n=await figma.getNodeByIdAsync(id),all=n.findAll(()=>true),types={};for(const a of all)types[a.type]=(types[a.type]||0)+1;for(const t of n.findAllWithCriteria({types:['TEXT']}))textExport.push({frameId:id,frameName:n.name,nodeId:t.id,layerName:t.name,text:t.characters,fontName:t.fontName,fontSize:t.fontSize,width:t.width,height:t.height});structure.push({id:n.id,name:n.name,width:n.width,height:n.height,types,imageNodes:all.filter(x=>'fills'in x&&Array.isArray(x.fills)&&x.fills.some(f=>f.type==='IMAGE')).map(x=>({id:x.id,name:x.name,width:x.width,height:x.height})),prototypeNodes:all.filter(x=>'reactions'in x&&x.reactions.length).length});}
const svgExport=[];for(const [key,n] of Object.entries(masters))svgExport.push({name:key,svg:await n.exportAsync({format:'SVG_STRING',svgOutlineText:false})});
const contentExports=board.children.filter(n=>n.name.startsWith('切图 / ')).map(n=>({id:n.id,name:n.name,width:n.width,height:n.height}));
return{createdNodeIds,mutatedNodeIds,removedNodeIds,completedFrames,textExport,structure,svgExport,contentExports,openingId:opening.id,pickedId:picked.id,detailId:detail.id};
