// Additive HUD completion. Run after shared helpers, asset import, and font loading.
// Existing frames 83:5639 / 83:5832 retain every original child unchanged.
// bg() inserts a separate background at index 0; copyHud() copies 83:5231 read-only.

function hudText(p, name, content, x, y, w, h, size = 28, tone = 'text', alpha = 1, weight = 'Regular') {
  const node = tx(p, name, content, x, y, w, h, size, tone, weight);
  node.opacity = alpha;
  return node;
}

function hudThinCard(p, name, x, y, w, h, tone = 'mint') {
  panel(p, name + ' / 半透明衬底', x, y, w, h, .78);
  rect(p, name + ' / 状态细线', x, y, 3, h, tone, .9);
}

const sceneHud = await figma.getNodeByIdAsync('83:5639');
const characterHud = await figma.getNodeByIdAsync('83:5832');
if (!sceneHud || !characterHud || !('children' in sceneHud) || !('children' in characterHud)) {
  throw new Error('Required existing HUD frames are missing. No source mutation performed.');
}
if (sceneHud.children.some(n => n.name === '新增/场景交互/内容') || characterHud.children.some(n => n.name === '新增/受击中断/内容')) {
  throw new Error('HUD additions already exist; inspect the canvas before a targeted retry.');
}

// 1. Existing white HUD: close-range world interaction, prior to opening a box.
bg(sceneHud, 'battle', 0, 0);
asset(sceneHud, '新增/场景物件/补给箱独立净图', 'chest', 1104, 594, 344, 198);
hudThinCard(sceneHud, '新增/场景交互', 1088, 418, 456, 176);
const nearContent = stack(sceneHud, '新增/场景交互/内容', 1112, 438, 408, 136, 'VERTICAL', 12);
const nearTitle = stack(nearContent, '标题与距离 / 自动布局', 0, 0, 408, 44, 'HORIZONTAL', 12);
hudText(nearTitle, '物件名称', '补给箱', 0, 0, 304, 44, 32, 'text', 1, 'Bold');
hudText(nearTitle, '交互距离', '2 m', 0, 0, 92, 44, 28, 'mint');
btn(nearContent, '长按开启 / 主交互', '长按打开', 0, 0, 408, 64, true);

// 2. Existing white HUD: interrupted search returns combat controls immediately.
// Revealed items remain known, while only the incomplete current search resets.
bg(characterHud, 'battle', 0, 0);
asset(characterHud, '新增/场景物件/补给箱独立净图', 'chest', 1138, 704, 270, 156);
hudThinCard(characterHud, '新增/受击中断', 1070, 418, 510, 270, 'gold');
const interruptedContent = stack(characterHud, '新增/受击中断/内容', 1094, 438, 462, 230, 'VERTICAL', 12);
hudText(interruptedContent, '中断原因', '受击 · 搜索中断', 0, 0, 462, 44, 32, 'gold', 1, 'Bold');
hudText(interruptedContent, '当前搜索进度', '当前进度  0.0 / 5.0 s', 0, 0, 462, 40, 28);
hudText(interruptedContent, '信息保留提示', '已揭示物资保留，当前进度已重置', 0, 0, 462, 34, 24, 'text', .75);
btn(interruptedContent, '重新搜索 / 主交互', '重新搜索', 0, 0, 462, 64, true);

// 3. New complete HUD state: non-blocking erosion warning. No map shrinking zone.
const erosionHud = frame('战斗hud-侵蚀告警', 6166, 6500);
await copyHud(erosionHud);
hudThinCard(erosionHud, '侵蚀告警', 572, 138, 776, 198, 'gold');
const erosionContent = stack(erosionHud, '侵蚀告警/内容', 600, 158, 720, 156, 'VERTICAL', 10);
hudText(erosionContent, '侵蚀阶段标题', '已进入侵蚀阶段', 0, 0, 720, 46, 32, 'gold', 1, 'Bold');
hudText(erosionContent, '风险说明', '持续受到侵蚀伤害 · 敌人更具攻击性', 0, 0, 720, 40, 28);
const erosionActions = stack(erosionContent, '撤离建议 / 自动布局', 0, 0, 720, 50, 'HORIZONTAL', 24);
hudText(erosionActions, '建议', '请尽快前往撤离点', 0, 0, 456, 50, 24, 'text', .75);
btn(erosionActions, '查看撤离路线', '查看地图', 0, 0, 240, 50, false);
finish(erosionHud);

// 4. New complete HUD state: extraction countdown, separate from global cutoff.
// Range permits moving, combat, and supplies. Being hit alone never cancels it.
const extractingHud = frame('战斗hud-撤离读条', 6166, 7750);
await copyHud(extractingHud);
hudThinCard(extractingHud, '撤离读条', 572, 138, 776, 282);
const extractingContent = stack(extractingHud, '撤离读条/内容', 600, 158, 720, 242, 'VERTICAL', 12);
hudText(extractingContent, '撤离点名称', '东侧出口 · 常规撤离', 0, 0, 720, 34, 24, 'text', .75);
const countdownRow = stack(extractingContent, '独立撤离倒计时 / 自动布局', 0, 0, 720, 56, 'HORIZONTAL', 20);
hudText(countdownRow, '倒计时标签', '撤离完成还需', 0, 0, 500, 56, 32, 'text', 1, 'Bold');
hudText(countdownRow, '倒计时数值', '03.6 s', 0, 0, 200, 56, 44, 'mint', 1, 'Bold');
const countdownTrack = stack(extractingContent, '进度轨道', 0, 0, 720, 8, 'HORIZONTAL', 0);
rect(countdownTrack, '已完成进度', 0, 0, 396, 8, 'mint', 1);
rect(countdownTrack, '未完成进度', 0, 0, 324, 8, 'text', .2);
hudText(extractingContent, '范围内操作提示', '留在范围内，可移动、战斗及使用补给', 0, 0, 720, 34, 24, 'text', .75);
const extractingActions = stack(extractingContent, '撤离操作 / 自动布局', 0, 0, 720, 56, 'HORIZONTAL', 24);
hudText(extractingActions, '时间规则', '全局撤离倒计时继续推进', 0, 0, 456, 56, 24, 'text', .5);
btn(extractingActions, '取消本次撤离', '取消撤离', 0, 0, 240, 56, false);
finish(extractingHud);

// 5. New complete HUD state: crossing the range boundary cancels only this read.
const cancelledHud = frame('战斗hud-撤离中断', 6166, 9000);
await copyHud(cancelledHud);
hudThinCard(cancelledHud, '撤离中断', 572, 138, 776, 254, 'gold');
const cancelledContent = stack(cancelledHud, '撤离中断/内容', 600, 158, 720, 214, 'VERTICAL', 12);
hudText(cancelledContent, '中断标题', '撤离已中断', 0, 0, 720, 44, 32, 'gold', 1, 'Bold');
hudText(cancelledContent, '中断原因', '已离开撤离范围，读条已归零', 0, 0, 720, 40, 28);
hudText(cancelledContent, '开启条件保留', '返回范围后可重新启动，已完成条件保留', 0, 0, 720, 34, 24, 'text', .75);
const cancelledActions = stack(cancelledContent, '范围外操作 / 自动布局', 0, 0, 720, 56, 'HORIZONTAL', 24);
hudText(cancelledActions, '状态说明', '东侧出口 · 等待返回范围', 0, 0, 456, 56, 24, 'text', .5);
btn(cancelledActions, '范围外不可启动', '返回范围后启动', 0, 0, 240, 56, false, true);
finish(cancelledHud);
