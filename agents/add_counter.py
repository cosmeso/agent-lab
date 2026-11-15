import sys
from pathlib import Path

if len(sys.argv) < 2:
    print("Add your code at the end, like: python3 agents/add_counter.py mycode")
    sys.exit(1)

code = sys.argv[1]
tag = ('<script data-goatcounter="https://' + code + '.goatcounter.com/count" '
       'async src="//gc.zgo.at/count.js"></script>')

root = Path(__file__).resolve().parent.parent
pages = [root / "index.html"] + sorted((root / "games").glob("*/index.html"))

added = 0
for page in pages:
    text = page.read_text()
    if "goatcounter" in text:
        continue
    if "</body>" in text:
        page.write_text(text.replace("</body>", tag + "\n</body>"))
        added += 1
print(f"Counter added to {added} pages.")
