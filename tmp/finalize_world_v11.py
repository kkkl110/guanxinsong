from pathlib import Path
import re, json

p=Path('output/worldbuilding/界域回收_世界观与玩法策划案_V1.1.md')
s=p.read_text(encoding='utf-8')
s=s.replace('正文原有的【方案补充】属于本项目提案；原有【待确认】属于题面留白，须结合本版采用口径阅读。世界观名称是题材包装，不能替代玩家看得懂的功能名称。','世界观和题面留白采用本方案明确写出的口径。后续校准用于完善参数与本体接口，不将已经采用的规则重新悬置。世界观名称是题材包装，功能名称仍需让玩家直接理解。')
s=s.replace('【方案补充】','【原型采用】').replace('【待确认】','【后续校准】')
s=s.replace('5. 暂停搜索后可比较、旋转和手动转移已揭示物品；','5. 搜索完成或主动暂停后，可比较、旋转和手动转移已揭示物品；')
s=s.replace('4. 暂停后比较品质、用途、价值与占格，','4. 搜索完成或主动暂停后，比较品质、用途、价值与占格，')
s=s.replace('离开范围或切入失能状态则取消读条。','离开范围或当前角色失能则取消读条。')
s=s.replace('异常场在一次探索时段中逐渐增强，导致迷雾加重；','异常场周期性起伏，回收署在低干扰时段开放进入窗口；本次探索对应异常场由低谷逐渐增强的时段，迷雾随之加重。')
s=s.replace('题面没有明确失败是否也累计疲劳。建议成功撤离和队伍阵亡都视为完成一次探索，出战角色均增加\n1 点疲劳，避免玩家通过失败无限重复使用同一队伍。','题面没有明确失败是否也累计疲劳。本版成功、阵亡和超时均计为一次探索，出战角色各增加1点；仅入场失败不计。后续可校准恢复道具成本，不改动题面给定的+1与阈值2。')
s=s.replace('本方案优先建议以物资交换为基础，避免额外引入一套局内货币系统。','本版采用物资交换，不另加局内货币。后续配置商人商品、换取成本与数量。')
s=s.replace('题面没有明确仓库是否采用网格容量，也没有给出仓库上限。本方案不擅自设定仓库格数；后续根据基础\nRPG 的仓储规则统一。','题面没有明确仓库是否为网格或给出上限。本期仓库采用分类物品列表承接背包转移，不额外设置一套拼格或仓库容量门槛；与本体存储接口对接时再校准。受30格空间约束的是探索背包。')

# Convert the original Pandoc simple tables into ordinary Markdown tables.
lines=s.splitlines(); out=[]; i=0; converted=0
sep=re.compile(r'^\s*-{2,}(?:\s+-{2,})+\s*$')
full=re.compile(r'^\s*-{6,}\s*$')
split=lambda line: re.split(r'\s{2,}',line.strip())
while i<len(lines):
    if i+1<len(lines) and sep.match(lines[i+1]) and not full.match(lines[i]):
        cols=split(lines[i]); n=len(cols)
        if n<2:
            out.append(lines[i]);i+=1;continue
        if out and full.match(out[-1]):out.pop()
        j=i+2;rows=[]
        while j<len(lines):
            line=lines[j]
            if full.match(line):j+=1;break
            if not line.strip():j+=1;continue
            if not line.startswith('  '):break
            parts=split(line)
            if len(parts)==n:rows.append(parts)
            elif len(parts)==1 and rows and len(line)-len(line.lstrip())>6:
                rows[-1][-1]+=' '+parts[0]
            else:break
            j+=1
        if rows:
            esc=lambda t:t.replace('|','／')
            out.append('| '+' | '.join(map(esc,cols))+' |')
            out.append('| '+' | '.join(['---']*n)+' |')
            out.extend('| '+' | '.join(map(esc,r))+' |' for r in rows)
            out.append('');converted+=1;i=j;continue
    out.append(lines[i]);i+=1
s='\n'.join(out).rstrip()+'\n'
s=s.replace('迷雾随之加重。稳定锚点','迷雾随之加重。稳定锚点')
p.write_text(s,encoding='utf-8')
print(json.dumps({'converted_tables':converted,'lines':len(s.splitlines()),'bytes':len(s.encode('utf-8'))},ensure_ascii=False))
