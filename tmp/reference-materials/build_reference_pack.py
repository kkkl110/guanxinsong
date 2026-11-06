from pathlib import Path
from PIL import Image
import csv
import hashlib
import html
import json
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / 'output/report-question-01/12-references'
CANDIDATES = BASE / 'candidates'
OUT = BASE / '交付包-战斗流程版'
IMAGES = OUT / 'images'
IMAGES.mkdir(parents=True, exist_ok=True)

CASES = {
    '01': ('补给槽与背包的容量关系', '把使用位置、存储位置和容量口径分开表达。'),
    '02': ('搜寻中的信息揭示与物品转移', '把未搜索、搜索中、已揭示、已入包分成不同状态。'),
    '03': ('地图中什么信息已知、何时更新', '区分未知信息、已知点位、可用条件与现场状态。'),
    '04': ('到达、启动撤离与成功带出', '把局内撤离等待与完成后的收益确认衔接起来。'),
    '05': ('三角色控制、生命与治疗对象', '借鉴操控层级与治疗目标表达；失败规则仍需确认。'),
    '06': ('战斗是否为搜刮与撤离的前置条件', '用可直接开启的探索宝箱与清怪解锁的战斗宝箱作对照。'),
}

DATA = [
    dict(id='01A', game='暗区突围', title='快捷区与存储区分别命名',
         source_file='01C-arena-quick-use.JPG',
         filename='01A-暗区突围-快捷区与存储区',
         caption='通过“快捷使用区／物品储存区”及口袋、弹挂、背包等分区名称，说明物品所在位置。本题可借鉴分区标题与容量口径：先明确3个补给槽是否独立，再在界面中写清是否占用30格背包。',
         focus='左侧 Quick Use Container、Item Storage Container；各存储区标题与格子。',
         application='用于说明“为什么必须先确认补给槽与背包的关系”，不照搬对方的装备层级。',
         source='https://forum.gamer.com.tw/C.php?bsn=71992&snA=303',
         source_label='巴哈姆特玩家实机帖子', date='2023-12（原图路径月份；具体拍摄日未核实）',
         original='https://truth.bahamut.com.tw/s01/202312/forum/71992/18438d82ae01e12e9ede5d8b9f0d0329.JPG',
         kind='国际服历史实机截图', platform='手游来源；背包页没有触屏操作键',
         boundary='只引用可见分区，不将历史版本的快捷用药范围写成当前规则。'),
    dict(id='01B', game='萤火突击', title='资源状态与背包容量分开显示',
         source_file='01B-lostlight-loadout.jpg',
         filename='01B-萤火突击-资源与容量读数',
         caption='“已装备”与“仓库”并列，医疗包、插板与背包各有状态或容量读数。本题若采用独立补给槽，可将补给数量与背包剩余格数分开显示；补充、替换时同步反馈数量变化及空间不足原因。',
         focus='左侧“已装备”；医疗包读数、插板3/3、背包0/25；右侧“仓库”。',
         application='对应独立补给槽方案的容量表达；空间不足和替换反馈是本题建议补充的设计。',
         source='https://game.xiaomi.com/viewpoint/1213071714_1707285517822_13',
         source_label='萤火攻略团《保姆级物资配置指南》／小米游戏中心', date='2024-02-07',
         original='https://pic.kts.g.mi.com/6d5a1e323de791028845eb4a936b2e1a2320443672912799849.jpg',
         kind='攻略所用完整游戏界面截图', platform='手游攻略来源；该菜单无输入端提示',
         boundary='医疗包读数、插板数量与背包容量是不同指标，不写成同一种格子容量。'),
    dict(id='02A', game='暗区突围', title='未知、搜索中与已揭示同时可见',
         source_file='02A-arena-search.jpg',
         filename='02A-暗区突围-搜索与信息揭示',
         caption='容器内已揭示物品与斜纹未知区域同时显示，并保留搜索耗时和“暂停搜索”。本题可借鉴这些状态提示，让玩家分清仍在搜索、已经看见和已经入包；物品揭示后仍需明确其是否完成转移。',
         focus='右侧电子保险箱内的已知物品、斜纹搜索区；“暂停搜索”和耗时。',
         application='对应搜索状态、信息揭示顺序与暂停入口；“入包成功”需另做反馈。',
         source='https://game.xiaomi.com/viewpoint/1161954049_1683723102635_100',
         source_label='沐大眼／小米游戏中心', date='2023-05-10',
         original='https://pic.kts.g.mi.com/48dfd0e12ab3c2241c6bebcc0df37f326007761796221553621.jpg',
         kind='历史实机截图', platform='手游触屏界面',
         boundary='静图不能证明受击中断、世界暂停、搜索进度保存或自动入包规则。'),
    dict(id='02B', game='暗区突围', title='搜索、打开与拾取有独立入口',
         source_file='gif-frames/arena-transfer-120.png',
         filename='02B-暗区突围-搜索与拾取入口',
         caption='未搜索容器保留“搜索”入口，选中物品后另列“拾取”“打开”等操作。本题可借鉴搜索与取物分开操作、分开反馈的方式：揭示后允许比较和整理，只有转移成功才确认物品已经入包。',
         focus='“未搜索／搜索”状态；选中背包后的“拾取”“打开”操作栏。',
         application='用于证明操作入口可以区分；本题无需照搬套包或整包拾取玩法。',
         source='https://game.xiaomi.com/viewpoint/1382733055_1639215943432_13/',
         source_label='暗区突围官方搜寻教学／小米游戏中心', date='2021-12-11',
         original='https://pic.kts.g.mi.com/d9f9af6ff840328ce62d5b0ed0326ca57325422506217347769.gif',
         kind='官方历史动图截帧（零基第120帧）', platform='手游触屏界面',
         boundary='原始604×310，适合局部或小图。未放大、重绘；这一帧不证明转移已经完成。'),
    dict(id='03A', game='原神', title='已知地形与未知区域有视觉区分',
         source_file='03C-genshin-unknown.jpg',
         filename='03A-原神-已知与未知地图',
         caption='已揭开地形与深色未知区形成区别，未知点位保留标识并给出解锁提示。本题可借鉴已知与未知的信息层级，再为已发现、已完成目标补充状态样式，避免玩家把“尚未发现”误解成“没有内容”。',
         focus='深色未知区域与已揭开地形的边界；Unknown标识；底部解锁提示。',
         application='借鉴信息公开层级；不要求本题新增整张地图遮罩或神像解锁机制。',
         source='https://www.hoyolab.com/article/21057972',
         source_label='HoYoLAB玩家Kekuuu帖子', date='2023-08-21',
         original='https://upload-os-bbs.hoyolab.com/upload/2023/08/21/318571439/78509d613550565483baab28b866fdd7_3970572929609001665.jpg',
         kind='跨端游戏地图截图', platform='拍摄端未核实；无输入端提示',
         boundary='“已完成目标样式”是本题的补充建议，不能称这张图已证明动态更新或事件完成流程。'),
    dict(id='03B', game='暗区突围', title='位置、条件与当前状态分层说明',
         source_file='03A-arena-map.jpg',
         filename='03B-暗区突围-撤离条件与状态',
         caption='地图详情说明撤离位置与条件，现场再以“撤离点已关闭”反馈当前状态。本题可借鉴位置概览、条件详情和现场反馈的分层表达，让玩家出发前能规划路线，到点后能理解不可用原因。',
         focus='左侧地图详情嵌图；现场红色“撤离点已关闭／人工湖”。',
         application='对应已知撤离信息与当前可用状态；本题可再补充条件满足后的地图状态更新。',
         source='https://www.taptap.cn/moment/259346301672492930',
         source_label='暗区突围官方老皮／TapTap', date='2022-07-08',
         original='https://img2-tc.tapimg.com/bbcode/images/a4be42271adce3ac04c837434c979f6c.png/_tap_ugc.jpg',
         kind='官方说明合成图（原有嵌图、红框）', platform='主体为手游触屏界面',
         boundary='原图已有讲解标注，不是纯实机单帧；不能证明地图实时更新、发现或追踪流程。'),
    dict(id='04A', game='暗区突围', title='撤离等待与整局计时各有标签',
         source_file='04C-arena-extract-timer.jpg',
         filename='04A-暗区突围-撤离倒计时',
         caption='画面分别标注整局剩余时间与“撤离倒计时”，同时写明在区域内等待的完成条件。本题可借鉴专用进度与条件提示，让玩家明确自己仍在撤离过程中；发生中断时说明原因，并在完成后进入带出结算。',
         focus='中央“撤离倒计时48.6”与等待条件；左上整局时间16:48。',
         application='对应撤离进行中的界面；中断原因与重试入口是本题需补充确认的设计。',
         source='https://game.xiaomi.com/viewpoint/1382733055_1641828325701_14',
         source_label='暗区突围官方测试FAQ／小米游戏中心', date='2022-01-10',
         original='https://pic.kts.g.mi.com/0a4fa1f97b50def03d69de1fac5035a16610857894454563096.jpg',
         kind='历史测试版实机截图', platform='手游触屏界面',
         boundary='另有撤离点生效时间字段；不能据此确认受击、移动或离开区域后的具体中断规则。'),
    dict(id='04B', game='三角洲行动', title='用结果页确认成功与带出收益',
         source_file='04D-delta-success.jpg',
         filename='04B-三角洲行动-撤离成功结算',
         caption='结果页突出“撤离成功”，并汇总撤离地点、行动时长和本局收益。本题可在真正完成撤离后集中确认已保存收益，再展示带出物资明细，让玩家清楚区分局内搜到的物资与最终成功带出的资源。',
         focus='左上“撤离成功”；撤离地点与行动时长；本局收益。',
         application='作为04A的完成态对照，说明成功的明确反馈与收益确认时机。',
         source='https://www.taptap.cn/moment/647145802216508950',
         source_label='TapTap玩家战绩帖子', date='2025-04-08',
         original='https://img2-tc.tapimg.com/moment/etag/FrCQQ-t6n9c_zu1iZ5UJyUMkGzV3.jpg/_tap_ugc.jpg',
         kind='跨端游戏结果页截图', platform='拍摄端未核实；无输入端提示',
         boundary='截图显示成功结果与收益汇总；不能证明后台保存或全部失败保留规则。'),
    dict(id='05A', game='绝区零', title='当前操控与后台队员形成层级',
         source_file='05C-zzz-mobile.png',
         filename='05A-绝区零-三角色与切换入口',
         caption='三名角色的头像与生命信息集中排列，当前角色以更大区域和数值生命突出显示，右下设置切换入口。本题可借鉴这一层级，让玩家持续识别当前操控者与后台队员状态，为三角色轮换提供清楚依据。',
         focus='左上当前角色848/1241与两名后台队员；右下切换入口。',
         application='对应暂按单人轮换上场的方案；失能状态、自动换人与全员失败需要另行确认。',
         source='https://www.miyoushe.com/zzz/article/47010988',
         source_label='米游社玩家测试体验帖', date='2023-12-27',
         original='https://upload-bbs.miyoushe.com/upload/2023/12/27/378227969/8e0a8787a806d764628f94dfe12173f2_7012347800230316142.png',
         kind='历史测试版实机截图', platform='手游触屏界面；可见摇杆与技能键',
         boundary='参考历史测试版HUD；不凭静图断言后台受伤、失能自动切换或全员失败逻辑。'),
    dict(id='05B', game='原神', title='治疗对象与不可用状态一起显示',
         source_file='05H-genshin-satiety.jpg',
         filename='05B-原神-治疗目标与使用限制',
         caption='角色列表同时展示各自生命条与饱食状态，并以描边标明当前选择；红色饱食图标提示使用限制。本题可借鉴“选中谁、状态如何、能否使用”并置的表达，帮助玩家在消耗补给前判断作用对象和可用性。',
         focus='四名角色生命条；凝光选中描边；其下红色饱食图标。',
         application='只借鉴目标、生命和禁用原因的对应关系，不建议为本题新增饱食机制。',
         source='https://gamewith.jp/genshin/article/show/236762',
         source_label='GameWith《回復(復活)方法まとめ｜回復キャラ一覧》', date='来源日期与拍摄日未核实；采集于2026-10-31',
         original='https://img.gamewith.jp/img/8da204e142af0c2c886954d9fb8ae17b.jpg',
         kind='攻略所用游戏菜单局部', platform='多端界面局部，输入端别未确认',
         boundary='不是完整治疗确认流程；四人队仅借鉴表达，不照搬队伍人数与饱食规则。'),
    dict(id='06A', game='原神', title='探索宝箱：到达后直接交互',
         source_file='genshin-bank-open.jpg',
         source_path='output/report-question-01/06-combat-references/candidates/genshin-bank-open.jpg',
         filename='06A-原神-探索宝箱直接交互',
         caption='《原神》北国银行宝箱靠近后出现开启入口，该处获取流程无需先清怪。本题可借鉴：常规容器直接提供“搜索”操作，让玩家通过探索获得基础收益，自行决定是否为降低搜刮风险而战斗。',
         focus='角色面前的宝箱；右侧“珍贵的宝箱”交互入口。',
         application='支撑“获取物资不必一律经过战斗”的探索路线；本题仍须让玩家在搜索时感知环境威胁。',
         source='https://www.taptap.cn/moment/165087926852520061',
         source_label='TapTap玩家thy转载《如何进入北国银行的方法指引》', date='2021-07-16',
         original='https://img2-tc.tapimg.com/bbcode/images/ffe6f7ad8d5a1704d0563d3f72fb0660.jpg/_tap_ugc.jpg',
         kind='历史版本实机截图', platform='中文手游触屏界面；可见摇杆与虚拟技能键',
         boundary='来源路径为进入银行、上楼、开启宝箱，不含清怪环节。该图没有敌人，不能证明受击中可持续搜刮；也不支持撤离规则。'),
    dict(id='06B', game='原神', title='战斗宝箱：击败守卫后解锁',
         source_file='genshin-guarded-04.jpg',
         source_path='output/report-question-01/06-combat-references/candidates/genshin-guarded-04.jpg',
         filename='06B-原神-击败守卫解锁宝箱',
         caption='《原神》该任务以“打倒山顶上的所有魔物”提示战斗目标，旁边宝箱保持红色封印。本题可借鉴：仅对指定战斗奖励设置清怪门槛，并明确提示“击败守卫后可搜索”，完成后反馈解锁，再开放搜刮。',
         focus='左上战斗目标文字；左侧宝箱的红色封印；中央仍存活的守卫。',
         application='与06A对照，区分直接探索取物与战斗解锁奖励；明确箱子绑定哪些敌人，避免随意把周边全部敌人当成门槛。',
         source='https://www.gamersky.com/handbook/202106/1399019.shtml',
         source_label='米游社玩家嬲到了埃及／游民星空转载《狂风听谁号令解谜攻略》', date='2021-06-20',
         original='https://img1.gamersky.com/image2021/06/20210620_msl_535_2/image004.jpg',
         kind='1.6历史活动任务实机截图', platform='PC端截图；可见[V]追踪、数字切人与Enter提示',
         boundary='用该攻略对其守卫宝箱的描述核对战斗解锁关系，不把所有红色封印都解释成战斗锁。“击败守卫后可搜索”是本题拟增文案，不是原图已有提示。'),
]

def md_link(label, url):
    return f'[{label}]({url})'

seen = set()
for item in DATA:
    src = ROOT / item['source_path'] if 'source_path' in item else CANDIDATES / item['source_file']
    with Image.open(src) as img:
        img.load()
        item['width'], item['height'] = img.size
        image_format = img.format
    extension = {'JPEG': '.jpg', 'PNG': '.png'}[image_format]
    filename = item['filename'] + extension
    dst = IMAGES / filename
    shutil.copy2(src, dst)
    item['file'] = f'images/{filename}'
    item['sha256'] = hashlib.sha256(dst.read_bytes()).hexdigest()
    assert item['sha256'] not in seen, '重复图片'
    seen.add(item['sha256'])

assert len(DATA) == 12
assert len(list(IMAGES.iterdir())) == 12

intro = '''# 问题一｜12张游戏参考图与12段图注

按报告01—06项逐一配对，每项两张。图片均来自现有游戏的公开资料；没有AI生成、补画、重绘或放大。02B为官方动图的原尺寸截帧，03B为来源自带标注的官方说明合成图，05B为来源所用菜单局部。

**使用方式：**每项A图先说明核心表达，B图补充状态或结果。可直接复制各图的“上屏图注”；“建议标注”可作为PPT中放大或画框的位置。完整原图保存在images目录，打开index.html可浏览。

**端别与版本：**素材以手游及触屏界面为主；03A、04B、05B拍摄端未核实，06B明确为PC截图。部分资料为历史版本或测试版，日期均指来源页面或路径日期，不冒充当前版本。本版06A／06B替换旧包的计时参考。

**阅读边界：**图注前半句讲可见内容，后半句讲本题的优化建议。参考图不替代策划确认，尤其不能仅靠静图确定自动换人、后台受伤、队伍失败或面板暂停。原神配图支持物资的战斗解锁关系，不提供本题的撤离规则。

'''
md = [intro]
txt = []
for case, (title, purpose) in CASES.items():
    md.append(f'## {case}｜{title}\n\n{purpose}\n')
    for item in [x for x in DATA if x['id'].startswith(case)]:
        md.append(f"### {item['id']}《{item['game']}》｜{item['title']}\n")
        md.append(f"![{item['id']} {item['title']}]({item['file']})\n")
        md.append(f"**上屏图注**\n\n{item['caption']}\n")
        md.append(f"**建议标注：**{item['focus']}\n")
        md.append(f"**与本题的对应：**{item['application']}\n")
        md.append(f"**来源：**{md_link(item['source_label'], item['source'])} · {item['date']} · {md_link('原始图片／动图', item['original'])}\n")
        md.append(f"**素材说明：**{item['width']}×{item['height']}；{item['kind']}；{item['platform']}。{item['boundary']}\n")
        txt.append(f"{item['id']}《{item['game']}》｜{item['title']}\n{item['caption']}\n")

md.append('''## 放入当前三页报告时的安排

- 第1页：01A＋01B，02A＋02B；第2页：03A＋03B，04A＋04B；第3页：05A＋05B，06A＋06B。
- 每题右侧先放A图，再放B图，图注保持相同编号。若两张完整截图缩小后看不清UI，使用“相关区域放大＋完整图来源脚注”，保留原图供核对。
- 01、02重点放大分区标题、格子和操作入口；03重点放大未知区域、点位条件与当前状态；04重点放大撤离进度和成功结果；05重点放大角色状态与治疗目标；06A保留开箱交互，06B同时保留战斗目标、敌人和封印宝箱。
- 05的配图没有覆盖“全员失能判定失败”；06的配图没有提供撤离规则。常规撤离不设击杀门槛、条件点显示具体要求，均为本题方案建议，不能写成原神已有的撤离机制。

素材整理日期：2026-10-31。原图署名、水印及来源已有标注均保留。
''')
(OUT / '12张参考图与配套文案.md').write_text('\n'.join(md), encoding='utf-8')
(OUT / '12段可直接使用的图注.txt').write_text('\n'.join(txt), encoding='utf-8-sig')
(OUT / '素材来源与核验.json').write_text(json.dumps(DATA, ensure_ascii=False, indent=2), encoding='utf-8')
with (OUT / '素材索引.csv').open('w', newline='', encoding='utf-8-sig') as fp:
    writer = csv.DictWriter(fp, fieldnames=['id', 'game', 'title', 'file', 'width', 'height', 'caption', 'source', 'date', 'kind', 'platform', 'boundary'])
    writer.writeheader()
    writer.writerows({key: item[key] for key in writer.fieldnames} for item in DATA)

e = html.escape
parts = ['''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>问题一 · 12张参考图与文案</title><style>
:root{color-scheme:dark;--bg:#111824;--panel:#1b2432;--text:#eef1f6;--muted:#b9c2d0;--accent:#e2c58f;--line:#384354}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.7 system-ui,'Microsoft YaHei',sans-serif}main{max-width:1480px;margin:auto;padding:40px 28px 70px}h1{font-size:32px;line-height:1.3;margin:0 0 14px}h2{font-size:23px;margin:0}h3{font-size:19px;line-height:1.5;margin:0 0 14px}p{margin:10px 0}a{color:var(--accent)}header{max-width:1100px;margin-bottom:30px}.intro,.muted{color:var(--muted)}nav{display:flex;gap:12px;flex-wrap:wrap;margin:22px 0}nav a{padding:6px 12px;border:1px solid var(--line);border-radius:5px;text-decoration:none}.section-head{margin:34px 0 18px;padding-top:24px;border-top:1px solid var(--line)}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.card{min-width:0;background:var(--panel);border:1px solid var(--line);border-radius:9px;padding:22px}.visual{display:flex;align-items:center;justify-content:center;background:#080c12;min-height:260px;margin:0 0 16px}.visual img{display:block;max-width:100%;max-height:380px;width:auto;height:auto}.id{color:var(--accent);font-variant-numeric:tabular-nums}.caption{font-size:16px;line-height:1.8}.focus{font-size:14px;color:var(--muted)}details{margin-top:14px;font-size:14px;color:var(--muted)}summary{cursor:pointer;color:var(--accent)}footer{border-top:1px solid var(--line);padding-top:20px;margin-top:35px;font-size:14px;color:var(--muted)}@media(max-width:850px){.grid{grid-template-columns:1fr}main{padding:24px 16px}.card{padding:16px}.visual{min-height:180px}h1{font-size:26px}}@media print{body{background:white;color:black}.card{background:white;border:1px solid #aaa;break-inside:avoid}a,.id,summary{color:#63512b}.muted,.focus{color:#333}.grid{display:block}.card{margin:12px 0}.visual{background:#eee}nav{display:none}}
</style></head><body><main><header><p class="id">交互需求确认 / 参考素材</p><h1>六种情况，十二张游戏参考图</h1><p class="intro">每项两图，按报告01—06顺序排列。点击截图可打开完整原图；下方图注可直接复制到报告。</p><p class="intro">以手游及触屏界面为主。03A、04B、05B拍摄端未核实；历史测试版、动图截帧和官方说明合成图均已标注。没有生成、补画或放大游戏内容。</p><nav>''']
for case, (title, _) in CASES.items():
    parts.append(f'<a href="#case-{case}">{case} {e(title)}</a>')
parts.append('</nav><p><a href="12段可直接使用的图注.txt">12段图注</a> · <a href="12张参考图与配套文案.md">完整说明</a> · <a href="素材索引.csv">来源索引</a></p></header>')
for case, (title, purpose) in CASES.items():
    parts.append(f'<section id="case-{case}"><div class="section-head"><h2><span class="id">{case}</span> {e(title)}</h2><p class="muted">{e(purpose)}</p></div><div class="grid">')
    for item in [x for x in DATA if x['id'].startswith(case)]:
        parts.append(f'''<article class="card"><h3><span class="id">{item['id']}</span> 《{e(item['game'])}》<br>{e(item['title'])}</h3><a class="visual" href="{e(item['file'])}" target="_blank"><img src="{e(item['file'])}" alt="{item['id']} {e(item['title'])}" loading="lazy"></a><p class="caption">{e(item['caption'])}</p><p class="focus"><b>建议标注：</b>{e(item['focus'])}</p><details><summary>来源、版本与使用说明</summary><p>{e(item['width']) if isinstance(item['width'], str) else item['width']}×{item['height']} · {e(item['kind'])} · {e(item['platform'])}</p><p><a href="{e(item['source'])}" target="_blank" rel="noreferrer">{e(item['source_label'])}</a> · {e(item['date'])} · <a href="{e(item['original'])}" target="_blank" rel="noreferrer">原始资料</a></p><p>{e(item['application'])}</p><p>{e(item['boundary'])}</p></details></article>''')
    parts.append('</div></section>')
parts.append('<footer>使用提醒：图注中的“本题可借鉴／建议”是方案建议。第05项的全员失败规则、第06项的迷雾机制仍需策划确认，静态参考图不能替代玩法定义。<br>素材整理：2026-10-31。图片原有水印与标注保留。</footer></main></body></html>')
gallery = ''.join(parts).replace('03A、04B、05B拍摄端未核实；历史测试版', '03A、04B、05B拍摄端未核实，06B为PC实机；历史测试版').replace('第05项的全员失败规则、第06项的迷雾机制仍需策划确认，静态参考图不能替代玩法定义。', '第05项的全员失败规则、第06项的战斗前置关系仍需策划确认；原神配图不提供本题的撤离规则。')
(OUT / 'index.html').write_text(gallery, encoding='utf-8')

zip_path = ROOT / 'output/report-question-01/问题一-12张游戏参考图与文案-战斗流程版.zip'
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for fp in sorted(OUT.rglob('*')):
        if fp.is_file():
            zf.write(fp, Path('问题一-12张游戏参考图与文案') / fp.relative_to(OUT))

html_content = (OUT / 'index.html').read_text(encoding='utf-8')
assert html_content.count('<img ') == 12
assert len(txt) == 12
for item in DATA:
    assert (OUT / item['file']).exists()
with zipfile.ZipFile(zip_path) as zf:
    assert zf.testzip() is None
    assert sum('/images/' in name for name in zf.namelist()) == 12
print(json.dumps({'images': len(DATA), 'captions': len(txt), 'unique_images': len(seen), 'zip': str(zip_path), 'gallery': str(OUT / 'index.html'), 'zip_bytes': zip_path.stat().st_size, 'dimensions': {x['id']: f"{x['width']}×{x['height']}" for x in DATA}}, ensure_ascii=False, indent=2))
