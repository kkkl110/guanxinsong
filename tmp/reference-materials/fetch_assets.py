import concurrent.futures
import json
from pathlib import Path
import sys
import urllib.request

from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")
WORKSPACE = Path(__file__).resolve().parents[2]
MANIFEST = Path(sys.argv[1]) if len(sys.argv) > 1 else WORKSPACE / "tmp/reference-materials/candidates.json"
OUTPUT = Path(sys.argv[2]) if len(sys.argv) > 2 else WORKSPACE / "output/report-question-01/12-references/candidates"
OUTPUT.mkdir(parents=True, exist_ok=True)

def fetch(item):
    filename = item["filename"]
    if Path(filename).name != filename:
        raise ValueError("Only plain asset filenames are accepted")
    target = OUTPUT / filename
    try:
        if target.exists():
            try:
                with Image.open(target) as cached:
                    return {"file": filename, "size": list(cached.size), "format": cached.format,
                            "frames": getattr(cached, "n_frames", 1), "bytes": target.stat().st_size, "cached": True}
            except Exception:
                pass
        headers = {"User-Agent": "Mozilla/5.0"}
        if item.get("referer"):
            headers["Referer"] = item["referer"]
        request = urllib.request.Request(item["url"], headers=headers)
        with urllib.request.urlopen(request, timeout=35) as response:
            data = response.read(32 * 1024 * 1024 + 1)
        if len(data) > 32 * 1024 * 1024:
            raise ValueError("Asset exceeds 32 MB")
        with target.open("wb") as stream:
            stream.write(data)
        with Image.open(target) as image:
            return {"file": filename, "size": list(image.size), "format": image.format,
                    "frames": getattr(image, "n_frames", 1), "bytes": len(data)}
    except Exception as error:
        return {"file": filename, "error": str(error)}

items = json.loads(MANIFEST.read_text(encoding="utf-8"))
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    results = list(pool.map(fetch, items))
for result in results:
    print(json.dumps(result, ensure_ascii=False))
(OUTPUT / "download-results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
