from pathlib import Path
import json
import shutil
import zipfile

root = Path(__file__).resolve().parents[2]
full = root / 'output/report-question-01/12-references/交付包-战斗流程版'
out = root / 'output/report-question-01/06-combat-references/交付包'
(out / 'images').mkdir(parents=True, exist_ok=True)
data = [x for x in json.loads((full / '素材来源与核验.json').read_text(encoding='utf-8')) if x['id'].startswith('06')]
assert len(data) == 2
md = ['# 第06项｜战斗与搜刮的前置关系\n', '本次两图替换旧12图包中的时间规则素材。A为手机触屏截图；B为PC历史活动截图，选择它是因为战斗目标、敌人和封印宝箱同时可见，便于解释流程。\n']
txt = []
for item in data:
    shutil.copy2(full / item['file'], out / item['file'])
    caption = f"{item['id']}《{item['game']}》｜{item['title']}\n{item['caption']}\n"
    txt.append(caption)
    md.extend([f"## {item['id']}｜{item['title']}\n", f"![{item['title']}]({(out / item['file']).as_posix()})\n", f"**上屏图注**\n\n{item['caption']}\n", f"**短图注：**参考表达{item['id']}：《{item['game']}》{item['title']}。\n", f"**建议标注：**{item['focus']}\n", f"**来源：**[{item['source_label']}]({item['source']}) · {item['date']} · [原图]({item['original']})\n", f"**素材说明：**{item['width']}×{item['height']}；{item['platform']}。{item['boundary']}\n"])
md.append('''## 两图共同支持的本题方案

常规容器靠近即可搜索，不要求清空周围敌人；指定战斗奖励箱需击败关联敌人后解锁。界面分别显示“搜索”与“击败守卫后可搜索”，条件满足后给出解锁反馈。

《原神》两张图不证明本题“常规撤离不要求战斗”。可补充引用[暗区突围官方手游S12说明](https://game.xiaomi.com/viewpoint/1382733055_1743682159336_100)中允许避战搜撤的设计方向；该页面为2025年历史赛季说明，配图为宣传说明图，不作为此次实机主图。

若本页只放一张图，优先使用06B：战斗目标、守卫与锁定奖励同屏，更能说明此次需求为什么要先确认。若放两张，按06A／06B对照排列，保留以上简短图注；完整说明可以放报告备注。
''')
(out / '第06项-配图与文案.md').write_text('\n'.join(md), encoding='utf-8')
(out / '两段可直接使用的图注.txt').write_text('\n'.join(txt), encoding='utf-8-sig')
(out / '素材来源与核验.json').write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
target = root / 'output/report-question-01/第06项-战斗与搜刮参考图.zip'
with zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED) as fp:
    for path in sorted(out.rglob('*')):
        if path.is_file():
            fp.write(path, Path('第06项-战斗与搜刮参考图') / path.relative_to(out))
with zipfile.ZipFile(target) as fp:
    assert fp.testzip() is None
    assert sum('/images/' in name for name in fp.namelist()) == 2
print(json.dumps({'images':len(data), 'zip':str(target)}, ensure_ascii=True))
