from pathlib import Path
from html import escape

out=Path('output/interface-design/map-selection');out.mkdir(parents=True,exist_ok=True)
p=[]
def rect(x,y,w,h,fill,stroke=None,sw=1,rx=0,opacity=1):
 p.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" opacity="{opacity}"'+(f' stroke="{stroke}" stroke-width="{sw}"' if stroke else '')+'/>')
def text(x,y,s,size=26,weight=400,fill='#A5B4C3',anchor='start'):
 p.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{escape(s)}</text>')
def line(x1,y1,x2,y2,color='#354250',w=1):
 p.append(f'<path d="M{x1},{y1} L{x2},{y2}" fill="none" stroke="{color}" stroke-width="{w}"/>')
def poly(points,fill='#17232F',stroke='#43505D',w=1):
 p.append(f'<polygon points="{points}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>')

p.append('<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-labelledby="title desc">')
p.append('<title id="title">界域回收：战前地图选择布局</title><desc id="desc">1920乘1080。左侧五图导航，中间城市分区，右侧地图详情及普通高危，底部前往战前配置。当前选中旧城区普通难度。</desc>')
p.append('<style>text{font-family:"Noto Sans SC","Microsoft YaHei",sans-serif}text{font-variant-numeric:tabular-nums}</style>')
rect(0,0,1920,1080,'#0B111B')
rect(0,0,1920,144,'#101924')
rect(64,48,70,70,'#17232F','#43505D',1,4)
text(99,99,'‹',44,500,'#F2F5F7','middle')
text(160,104,'地图选择',44,700,'#F2F5F7')
text(1856,96,'镜港回收署 / 区域部署',26,500,'#A5B4C3','end')

text(64,213,'探索区域',32,600,'#F2F5F7')
text(384,211,'05',26,500,'#A5B4C3','end')
names=['旧城区','物流工业区','中央交通区','科研设施区','中央能源区']
states=['普通探索度 62%','普通探索度 18%','未解锁','未解锁','未解锁']
for i,(name,state) in enumerate(zip(names,states)):
 y=240+i*120
 rect(64,y,320,104,'#152832' if i==0 else '#131D28','#50D5F4' if i==0 else '#2E3A46',2 if i==0 else 1,4)
 if i==0:rect(64,y,4,104,'#50D5F4')
 text(84,y+41,f'{i+1:02}',26,500,'#50D5F4' if i==0 else '#A5B4C3')
 text(130,y+42,name,32,600,'#F2F5F7' if i<2 else '#A5B4C3')
 text(130,y+80,state,26,400,'#A5B4C3')
text(64,871,'地图依序开放，解锁后保留',26,400,'#A5B4C3')

rect(408,176,880,708,'#101A25','#2E3A46',1,4)
text(440,222,'镜港分区总览',28,600,'#F2F5F7')
text(1256,222,'MIRRORPORT',26,500,'#A5B4C3','end')
for x in range(440,1260,64):line(x,254,x,808,'#1B2834')
for y in range(256,810,64):line(440,y,1256,y,'#1B2834')
# A fictional city schematic, deliberately limited to the five exploration districts.
poly('450,594 544,504 692,528 710,714 610,800 470,756','#1B3A43','#50D5F4',2)
poly('488,350 628,286 756,358 714,496 556,478','#1C2935','#43505D')
poly('746,468 900,394 1004,484 956,678 760,686','#1A2733','#43505D')
poly('832,282 962,250 1096,310 1076,426 944,446 818,378','#18242F','#43505D')
poly('1080,252 1164,220 1248,302 1248,408 1130,414 1084,348','#18242F','#43505D')
for x,y,w,h in [(485,628,38,44),(533,604,38,44),(580,624,46,56),(510,690,46,42),(573,710,40,43),(635,672,33,50),(554,354,48,74),(617,343,67,38),(625,398,44,62),(783,505,50,46),(850,492,72,38),(878,568,46,63),(791,603,48,42),(887,313,51,50),(958,318,48,57),(1001,371,42,35),(1148,287,46,82)]:
 rect(x,y,w,h,'#2B3D49','#41515E',1,2)
for a,b,c,d in [(466,573,1204,277),(626,796,1021,278),(476,458,1198,601)]:
 line(a,b,c,d,'#344652',14);line(a,b,c,d,'#62717B',1)
def zone(x,y,w,label,active=False):
 rect(x,y,w,70,'#15323D' if active else '#111C27','#50D5F4' if active else '#52606B',2 if active else 1,4)
 text(x+w/2,y+45,label,28,600,'#F2F5F7' if active else '#B6C1C9','middle')
zone(462,717,210,'01  旧城区',True)
zone(514,432,226,'02  物流工业区')
zone(776,636,226,'03  中央交通区')
zone(852,378,226,'04  科研设施区')
zone(1030,252,226,'05  中央能源区')
line(440,824,1256,824,'#2E3A46')
rect(440,848,14,14,'#50D5F4');text(466,870,'当前选择',26,400,'#A5B4C3')
rect(668,848,14,14,'#60717F');text(694,870,'可查看区域',26,400,'#A5B4C3')

rect(1312,176,544,708,'#14202C','#354250',1,4)
text(1344,220,'区域 01 · 已开放',26,500,'#50D5F4')
text(1344,281,'旧城区',40,700,'#F2F5F7')
text(1344,328,'雨巷街区 · 基础物资回收',26,400,'#A5B4C3')
rect(1344,360,234,70,'#50D5F4',None,1,4)
text(1461,405,'普通',28,600,'#0B111B','middle')
rect(1590,360,234,70,'#182733','#52606B',1,4)
text(1707,405,'高危',28,600,'#F2F5F7','middle')
text(1344,485,'普通探索度',28,600,'#F2F5F7')
text(1824,485,'62%',32,600,'#F2F5F7','end')
rect(1344,508,480,8,'#2F3D49',None,1,4);rect(1344,508,297.6,8,'#50D5F4',None,1,4)
text(1344,556,'高危难度已开放',26,400,'#A5B4C3')
text(1344,610,'可能产出',28,600,'#F2F5F7')
for i,label in enumerate(['金属材料','电子元件','生活物资']):
 x=1344+i*164
 rect(x,632,152,112,'#1B2A37',None,1,4)
 rect(x+52,644,48,38,'#344754','#7D909E',1,3)
 text(x+76,721,label,26,400,'#F2F5F7','middle')
rect(1344,782,480,70,'#1B2B38','#52606B',1,4)
text(1584,827,'区域情报',28,600,'#F2F5F7','middle')

line(64,920,1856,920,'#354250')
text(64,974,'已选择  旧城区 · 普通',32,600,'#F2F5F7')
text(64,1020,'进入后随机出生，可自主选择探索路线',26,400,'#A5B4C3')
rect(1488,936,368,88,'#50D5F4',None,1,4)
text(1672,992,'前往战前配置',28,600,'#0B111B','middle')
p.append('</svg>')
(out/'地图选择-布局示意.svg').write_text('\n'.join(p),encoding='utf-8')
(out/'render.html').write_text('<!doctype html><meta charset="utf-8"><style>html,body{margin:0;width:1920px;height:1080px;background:#0B111B}img{display:block;width:1920px;height:1080px}</style><img src="地图选择-布局示意.svg" alt="地图选择布局">',encoding='utf-8')
print(str(out.resolve()))
