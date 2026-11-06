from pathlib import Path
import concurrent.futures
import html
import json
import re
import urllib.request

root = Path(__file__).resolve().parent / '06-pages'
root.mkdir(parents=True, exist_ok=True)
urls = {
    '9game': 'https://www.9game.cn/yuanshen/9322764.html',
    'gamersky': 'https://www.gamersky.com/handbook/202106/1399019.shtml',
    'baidu': 'https://jingyan.baidu.com/article/8275fc86a1c26a07a13cf678.html',
}
def get(item):
    name, url = item
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(request, timeout=25) as response:
            raw = response.read(8 * 1024 * 1024).decode('utf-8', errors='replace')
        (root / f'{name}.html').write_text(raw, encoding='utf-8')
        images = list(dict.fromkeys(html.unescape(x) for x in re.findall(r'https?[^\s<>"\x27]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s<>"\x27]*)?', raw, re.I)))
        return {'source': url, 'images': images}
    except Exception as exc:
        return {'source': url, 'error': str(exc)}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    results = list(pool.map(get, urls.items()))
(root / 'page-images.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(results, ensure_ascii=True, indent=2))
