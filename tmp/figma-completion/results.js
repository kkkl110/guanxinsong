const resultLoot=[['源晶碎片','crystal','3','3,600'],['陨石铁','metal','2','4,400'],['电子元件','electronics','1','6,800'],['区域凭证','permit','1','5,700']];
function resultText(p,name,value,x,y,w,h,size=28,tone='text',alpha=1,weight='Regular'){const n=tx(p,name,value,x,y,w,h,size,tone,weight);n.opacity=alpha;return n;}
async function resultPage(id,success){
  const p=await figma.getNodeByIdAsync(id);if(p.children.length)throw new Error('Result frame is not empty: '+id);
  bg(p,'prebattle',.63,12);
  resultText(p,'页标题','探索结算',60,44,800,64,44,'text',1,'Bold');
  resultText(p,'地图与难度','旧城区 · 普通',60,110,700,40,28,'text',.75);
  resultText(p,'探索时长','探索时长  12:37',1500,60,360,44,28,'text',.75);
  panel(p,'结算物资 / 独立薄透面板',60,180,1070,720,.85);
  panel(p,'进度与体力 / 独立薄透面板',1170,180,690,720,.85);
  resultText(p,'结果标题',success?'撤离成功':'撤离失败',100,206,560,64,44,success?'mint':'text',1,'Bold');
  resultText(p,'结果说明',success?'背包物资已带回仓库':'失败原因：队伍全员失能',100,278,850,40,28,'text',.75);
  resultText(p,'本局带出估值标签','本局带出估值',100,344,500,38,24,'text',.75);
  resultText(p,'本局带出估值',success?'20,500':'0',100,386,650,112,84,success?'mint':'text',1,'Bold');
  resultText(p,'损失提示',success?'物资 4 类 · 共 7 件':'损失物资估值 20,500',750,428,330,46,28,'text',.75);
  rule(p,100,508,990);
  const rows=stack(p,'物资结果列表 / 自动布局',100,526,990,296,'VERTICAL',10);
  for(const [name,key,qty,value] of resultLoot){
    const row=stack(rows,'结果物资 / '+name,0,0,990,64,'HORIZONTAL',20);
    const pic=asset(row,'物品净图',key,0,0,64,64);if(!success)pic.opacity=.35;
    const nameCol=stack(row,'物品名称与数量',0,0,450,64,'VERTICAL',0);
    resultText(nameCol,'物品名称',name,0,0,450,34,28,'text',success?1:.6,'Medium');
    resultText(nameCol,'物品数量','数量 '+qty,0,0,450,28,20,'text',.5);
    resultText(row,'物资估值',value,0,0,190,44,28,'text',.75);
    resultText(row,'去留状态',success?'已入库':'未带出',0,0,226,44,28,success?'mint':'text',success?1:.5);
  }
  resultText(p,'去留规则',success?'带出物资可用于交易、制作与设施成长':'本局搜刮物资全部丢失',100,844,990,36,24,'text',.65);
  resultText(p,'永久探索标题','永久探索进度',1210,212,610,44,32,'text',1,'Bold');
  resultText(p,'永久探索进度','44%  →  48%',1210,272,470,72,48,'text',1,'Bold');
  resultText(p,'永久探索增量','+4%',1710,286,110,44,32,'mint',1,'Bold');
  rect(p,'探索进度底',1210,360,610,6,'text',.14);rect(p,'原有探索进度',1210,360,268,6,'text',.4);rect(p,'本局新增探索进度',1478,360,25,6,'mint');
  resultText(p,'永久记录说明','永久探索记录已保留',1210,384,610,32,24,'text',.5);
  rule(p,1210,446,610);
  resultText(p,'体力标题','全员体力消耗 1',1210,470,610,44,32,'text',1,'Bold');
  const party=stack(p,'角色体力结果 / 自动布局',1210,530,610,240,'VERTICAL',20);
  const members=[['阿梨','avatar1','2 / 2  →  1 / 2',false],['捷可','avatar2','1 / 2  →  0 / 2',true],['YU','avatar3','2 / 2  →  1 / 2',false]];
  for(const [name,key,change,empty] of members){const row=stack(party,'体力 / '+name,0,0,610,60,'HORIZONTAL',20);asset(row,'角色头像',key,0,0,64,60);resultText(row,'角色名称',name,0,0,120,44,28,'text',1,'Medium');const col=stack(row,'体力变化与反馈',0,0,386,60,'VERTICAL',0);resultText(col,'体力变化',change,0,0,386,36,28,empty?'gold':'mint');resultText(col,'出战状态',empty?'体力耗尽 · 不可出战':'可继续出战',0,0,386,24,20,'text',.5);}
  resultText(p,'临时强化结束','本局临时强化已结束',1210,804,610,36,24,'text',.5);
  resultText(p,'战前保留说明','战前武器与未使用的战前补给已保留',60,940,1060,40,24,'text',.75);
  btn(p,'物资详情入口','物资详情',1170,946,310,80,false);
  btn(p,'返回整备入口','返回整备',1510,946,350,80,true);
  finish(p);return p;
}
const resultSuccess=await resultPage('83:4243',true);
const resultFail=await resultPage('83:4244',false);

const teleportFail=frame('传送－进入失败',4153,6500);
bg(teleportFail,'prebattle',.7,10);
panel(teleportFail,'失败反馈 / 浮层',510,310,900,460,.94);
resultText(teleportFail,'反馈标题','传送未完成',570,360,780,60,44,'text',1,'Bold');
resultText(teleportFail,'反馈原因','通道连接中断，请重试',570,446,780,44,32,'text',.75);
resultText(teleportFail,'配置保留说明','队伍、武器和携带补给已保留',570,508,780,38,28,'text',.75);
resultText(teleportFail,'未消耗说明','本次未进入探索，不消耗体力与补给',570,554,780,38,28,'mint');
btn(teleportFail,'返回配置','返回战前配置',570,650,360,80,false);btn(teleportFail,'重试传送','重新传送',960,650,390,80,true);finish(teleportFail);

const staminaRecover=frame('战前配置－体力恢复',2145,6500);
bg(staminaRecover,'prebattle',.64,10);panel(staminaRecover,'体力恢复 / 浮层',510,240,900,600,.94);
resultText(staminaRecover,'弹层标题','恢复角色体力',570,282,780,64,44,'text',1,'Bold');
asset(staminaRecover,'捷可头像','avatar2',570,390,150,140);
resultText(staminaRecover,'角色名称','捷可',760,384,560,48,32,'text',1,'Bold');resultText(staminaRecover,'当前体力','当前体力  0 / 2',760,448,560,44,28,'gold');resultText(staminaRecover,'恢复结果','使用后体力  1 / 2',760,498,560,44,28,'mint');
rule(staminaRecover,570,570,780);
resultText(staminaRecover,'道具消耗','体力恢复道具 ×1     持有 3',570,602,780,44,28,'text',.75);
resultText(staminaRecover,'出战规则','体力归零时不可出战，每次探索消耗 1 点',570,658,780,38,24,'text',.5);
btn(staminaRecover,'取消恢复','取消',570,728,360,80,false);btn(staminaRecover,'确认恢复体力','确认恢复',960,728,390,80,true);finish(staminaRecover);
