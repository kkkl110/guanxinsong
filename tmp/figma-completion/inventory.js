// Editable inventory views. Execute after shared helpers and loaded product fonts.
// This script appends only to the designated empty frame and creates three new frames.
function invText(p, name, value, x, y, w, h, size = 28, tone = 'text', alpha = 1, weight = 'Regular') {
  const n = tx(p, name, value, x, y, w, h, size, tone, weight);
  n.opacity = alpha;
  return n;
}
function invTop(p, title, sub, timer = true) {
  btn(p, '返回', '返回', 60, 46, 128, 64, false);
  invText(p, '页面标题', title, 218, 48, 780, 62, 44, 'text', 1, 'Bold');
  invText(p, '页面说明', sub, 220, 112, 1000, 38, 24, 'text', .75);
  if (timer) {
    invText(p, '撤离倒计时标签', '撤离倒计时', 1460, 60, 210, 40, 28, 'text', .75);
    invText(p, '撤离倒计时', '13:23', 1690, 51, 170, 56, 40, 'mint', 1, 'Bold');
  } else {
    invText(p, '整备状态', '基地整备', 1650, 62, 210, 42, 28, 'mint');
  }
}
function invParty(p) {
  const line = stack(p, '队伍武器栏 / 自动布局', 100, 226, 540, 64, 'HORIZONTAL', 10);
  const party = [['阿梨', 'avatar1'], ['捷可', 'avatar2'], ['YU', 'avatar3']];
  for (let k = 0; k < party.length; k++) {
    const card = stack(line, '队伍成员 / ' + party[k][0], 0, 0, 170, 64, 'HORIZONTAL', 10);
    asset(card, '角色头像 / ' + party[k][0], party[k][1], 0, 0, 56, 64);
    const words = stack(card, '装备文字', 0, 0, 104, 64, 'VERTICAL', 0);
    invText(words, '角色名称', party[k][0], 0, 0, 104, 34, 28, 'text', 1, 'Bold');
    invText(words, '武器状态', '已装备', 0, 0, 104, 30, 24, 'text', .75);
  }
}
function invSupplies(p, x = 90, y = 918) {
  invText(p, '独立补给标题', '独立补给', x, y - 38, 180, 34, 24, 'text', .75);
  invText(p, '独立补给规则', '不占背包格数', x + 330, y - 38, 240, 34, 24, 'text', .5);
  const slots = stack(p, '独立补给槽 / 自动布局', x, y, 570, 68, 'HORIZONTAL', 20);
  const defs = [['急救包','medkit','3/5'], ['能量剂','potion','2/5'], ['脉冲弹','orb','5/5']];
  for (const [label, key, count] of defs) {
    const s = stack(slots, '补给槽 / ' + label, 0, 0, 170, 68, 'HORIZONTAL', 10);
    asset(s, '补给净图', key, 0, 0, 60, 60);
    const textCol = stack(s, '补给文字', 0, 0, 100, 68, 'VERTICAL', 0);
    invText(textCol, '补给名称', label, 0, 0, 100, 34, 24);
    invText(textCol, '补给数量', count, 0, 0, 100, 34, 24, 'mint');
  }
}
function invBag(p, full = false) {
  panel(p, '背包 / 斜切半透明面板', 60, 164, 620, 840, .78);
  const headline = stack(p, '背包标题 / 自动布局', 100, 180, 540, 42, 'HORIZONTAL', 20);
  invText(headline, '背包标题', '背包', 0, 0, 350, 42, 32, 'text', 1, 'Bold');
  invText(headline, '背包格数', full ? '30 / 30' : '07 / 30', 0, 0, 170, 42, 32, full ? 'text' : 'mint');
  invParty(p);
  rule(p, 100, 302, 540);
  const gx = 140, gy = 322, cell = 84, gap = 10, step = cell + gap;
  grid(p, gx, gy, cell, gap, 5, 6);
  if (!full) {
    item(p, '背包物品 / 电子模组 / 占用2×3', 'electronics', gx, gy, cell * 2 + gap, cell * 3 + gap * 2, '1', 'mint');
    item(p, '背包物品 / 回收晶体 / 占用1×1', 'crystal', gx + step * 2, gy, cell, cell, '3', 'mint');
  } else {
    // 6 + 4 + 2 + 3 + 15 = exactly 30 occupied cells.
    item(p, '背包物品 / 电子模组 / 占用2×3', 'electronics', gx, gy, cell * 2 + gap, cell * 3 + gap * 2, '1', 'mint');
    item(p, '背包物品 / 陨铁构件 / 占用2×2', 'metal', gx + step * 2, gy, cell * 2 + gap, cell * 2 + gap, '1', 'mint');
    item(p, '背包物品 / 区域证 / 占用1×2', 'permit', gx + step * 4, gy, cell, cell * 2 + gap, '1', 'mint');
    for (let c = 2; c < 5; c++) item(p, '背包物品 / 晶体 ' + c, 'crystal', gx + step * c, gy + step * 2, cell, cell, '1', 'mint');
    const keys = ['metal', 'crystal', 'permit', 'electronics', 'crystal'];
    for (let r = 3; r < 6; r++) for (let c = 0; c < 5; c++) {
      item(p, '背包物品 / 单格材料 ' + r + '-' + c, keys[(c + r) % keys.length], gx + step * c, gy + step * r, cell, cell, String((r + c) % 3 + 1), 'mint');
    }
  }
  invSupplies(p);
}
function invContainer(p, mode) {
  const searching = mode === 'searching', full = mode === 'full';
  panel(p, '搜索物资 / 独立浮层', 1160, 164, 700, 840, .82);
  const heading = stack(p, '容器标题 / 自动布局', 1200, 182, 620, 44, 'HORIZONTAL', 20);
  invText(heading, '容器名称', '物资箱', 0, 0, 390, 44, 32, 'text', 1, 'Bold');
  invText(heading, '容器状态', searching ? '搜索中' : full ? '搜索完成' : '已暂停', 0, 0, 210, 44, 28, 'mint');
  if (searching) {
    invText(p, '当前搜索说明', '正在搜索下一件物资', 1200, 242, 420, 38, 24, 'text', .75);
    invText(p, '当前搜索时间', '3.2 / 5.0s', 1640, 242, 180, 38, 24, 'mint');
    rect(p, '搜索进度底', 1200, 292, 620, 4, 'text', .16);
    rect(p, '搜索进度', 1200, 292, 397, 4, 'mint');
  } else {
    invText(p, '搜索状态说明', full ? '物资已揭示，可手动转移' : '已揭示内容保留 · 当前进度归零', 1200, 244, 620, 40, 24, 'text', .75);
    rule(p, 1200, 294, 620);
  }
  const qx = 1200, qy = 330, cell = 114, step = 124;
  grid(p, qx, qy, cell, 10, 5, 2);
  const revealed = full ? 3 : 2;
  const keys = ['crystal', 'metal', 'electronics'];
  const labels = ['回收晶体', '陨铁构件', '电子模组'];
  for (let i = 0; i < revealed; i++) item(p, '已揭示 / ' + labels[i], keys[i], qx + step * i, qy, cell, cell, i === 0 ? '3' : '1', 'mint');
  for (let i = revealed; i < 10; i++) {
    const xx = qx + step * (i % 5), yy = qy + step * Math.floor(i / 5);
    if (!full) invText(p, '未知物资 / 不展示属性', '？', xx + 35, yy + 29, 44, 56, 40, 'text', .35);
  }
  invText(p, '搜索数量', full ? '搜索完成 · 3 件物资' : '已揭示 2 件 · 未知物资依次搜索', 1200, 586, 620, 40, 24, 'text', .5);
  rule(p, 1200, 642, 620);
  if (!full) {
    const detail = stack(p, '已选物资 / 自动布局', 1200, 668, 620, 110, 'HORIZONTAL', 20);
    asset(detail, '已选物资净图', 'crystal', 0, 0, 100, 100);
    const info = stack(detail, '物资详情文字', 0, 0, 500, 110, 'VERTICAL', 8);
    invText(info, '物资名称', '回收晶体', 0, 0, 500, 42, 32, 'text', 1, 'Bold');
    invText(info, '物资属性', '数量 3    占用 1×1    估值 1,200', 0, 0, 500, 38, 24, 'text', .75);
    invText(p, '拾取规则', searching ? '搜索中，暂停后可手动拾取' : '选中已揭示物资，手动移入背包', 1200, 810, 620, 40, 28, 'text', .75);
    btn(p, searching ? '暂停搜索' : '继续搜索', searching ? '暂停搜索' : '继续搜索', 1200, 894, 290, 66, false);
    btn(p, searching ? '搜索中禁用拾取' : '手动拾取', searching ? '暂停后拾取' : '拾取', 1510, 894, 310, 66, true, searching);
    invText(p, '物资保留说明', '未拾取的物资仍保留在容器中', 1200, 968, 620, 30, 20, 'text', .5);
  } else {
    const detail = stack(p, '待转移物资 / 自动布局', 1200, 662, 620, 94, 'HORIZONTAL', 20);
    asset(detail, '待转移电子模组净图', 'electronics', 0, 0, 94, 94);
    const words = stack(detail, '待转移物资文字', 0, 0, 506, 94, 'VERTICAL', 8);
    invText(words, '物资名称', '高密度电子模组', 0, 0, 506, 42, 32, 'text', 1, 'Bold');
    invText(words, '物资属性', '估值 6,800    占用 6 格', 0, 0, 506, 38, 24, 'text', .75);
    grid(p, 1200, 778, 36, 6, 3, 2);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) rect(p, '旋转后的占格预览', 1200 + 42 * c, 778 + 42 * r, 36, 36, 'mint', .22);
    invText(p, '旋转状态', '已旋转 90° · 3×2', 1350, 778, 460, 38, 28, 'mint');
    invText(p, '空间不足原因', '背包已满，请先整理或丢弃物资', 1350, 820, 460, 34, 24, 'text', .75);
    btn(p, '再次旋转', '旋转 90°', 1200, 894, 290, 66, false);
    btn(p, '容量不足禁止转移', '空间不足', 1510, 894, 310, 66, true, true);
    invText(p, '物资保留说明', '转移未完成，物资仍在容器中', 1200, 968, 620, 30, 20, 'text', .5);
  }
}

const invSearch = await figma.getNodeByIdAsync('83:4242');
if (!invSearch || invSearch.type !== 'FRAME') throw new Error('Expected assigned empty inventory frame 83:4242');
bg(invSearch, 'battle', .48, 3);
invTop(invSearch, '搜索物资与背包', '西区 · 废品站');
invBag(invSearch, false);
invContainer(invSearch, 'searching');
finish(invSearch);

const invWarehouse = frame('局外背包＋仓库', 10368, 6500);
bg(invWarehouse, 'prebattle', .5, 3);
invTop(invWarehouse, '背包与仓库', '出战前整理物资与独立补给', false);
invBag(invWarehouse, false);
panel(invWarehouse, '仓库 / 半透明面板', 860, 164, 1000, 840, .82);
const warehouseHeading = stack(invWarehouse, '仓库标题 / 自动布局', 900, 184, 920, 44, 'HORIZONTAL', 20);
invText(warehouseHeading, '仓库标题', '仓库', 0, 0, 650, 44, 32, 'text', 1, 'Bold');
invText(warehouseHeading, '仓库存量', '共 24 件', 0, 0, 250, 44, 28, 'text', .75);
const tabs = stack(invWarehouse, '仓库分类 / 自动布局', 900, 248, 920, 54, 'HORIZONTAL', 20);
for (const name of ['全部', '材料', '补给', '装备']) btn(tabs, '分类 / ' + name, name, 0, 0, 140, 54, name === '全部');
const wx = 900, wy = 330, ws = 114, wg = 10;
grid(invWarehouse, wx, wy, ws, wg, 7, 4);
const warehouseKeys = ['electronics', 'metal', 'crystal', 'permit', 'weapon', 'medkit', 'potion', 'orb'];
for (let i = 0; i < 24; i++) {
  const key = warehouseKeys[i % warehouseKeys.length];
  item(invWarehouse, '仓库物资 / ' + key + ' / ' + (i + 1), key, wx + (ws + wg) * (i % 7), wy + (ws + wg) * Math.floor(i / 7), ws, ws, String((i % 4) + 1), 'mint');
}
rule(invWarehouse, 900, 840, 920);
const warehouseDetail = stack(invWarehouse, '仓库选中物资 / 自动布局', 900, 860, 920, 56, 'HORIZONTAL', 20);
invText(warehouseDetail, '已选物资名称', '电子模组', 0, 0, 230, 44, 32, 'text', 1, 'Bold');
invText(warehouseDetail, '已选物资属性', '占用 2×3    估值 6,800', 0, 0, 650, 44, 28, 'text', .75);
btn(invWarehouse, '自动存入仓库', '一键存入', 1200, 928, 290, 66, false);
btn(invWarehouse, '仓库物资移入背包', '移入背包', 1510, 928, 310, 66, true);
finish(invWarehouse);

const invPaused = frame('背包－搜索暂停与手动拾取', 10368, 7750);
bg(invPaused, 'battle', .48, 3);
invTop(invPaused, '搜索物资与背包', '西区 · 废品站');
invBag(invPaused, false);
invContainer(invPaused, 'paused');
finish(invPaused);

const invFull = frame('背包－空间不足与旋转', 10368, 9000);
bg(invFull, 'battle', .48, 3);
invTop(invFull, '搜索物资与背包', '西区 · 废品站');
invBag(invFull, true);
invContainer(invFull, 'full');
finish(invFull);

