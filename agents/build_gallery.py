from pathlib import Path
import html
import re

ROOT = Path(__file__).resolve().parent.parent
GAMES = ROOT / "games"

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Abimael's Andromeda</title>
<style>
body{margin:0;background:#0f1115;color:#eee;font-family:sans-serif}
header{padding:40px 20px 10px;text-align:center}
h1{margin:0;font-size:2em}
header p{color:#9aa;max-width:560px;margin:10px auto}
main{max-width:760px;margin:0 auto;padding:20px;display:grid;gap:14px}
a.card{display:block;background:#1a1d24;border:1px solid #2a2f3a;border-radius:12px;padding:16px;color:inherit;text-decoration:none}
a.card:hover{border-color:#4cc9a0}
.name{font-size:1.2em;font-weight:bold}
.score{float:right;color:#4cc9a0}
.desc{color:#9aa;margin-top:8px;font-size:.95em}
footer{text-align:center;color:#667;padding:30px}
</style>
</head>
<body>
<header>
<h1>Abimael's Andromeda</h1>
<p>A lab of AI agents that design, build, and test small games. Play one and see what they made.</p>
</header>
<main>
{{CARDS}}
</main>
</body>
</html>
"""


def clean(text):
    return re.sub(r"[*#`]", "", text).strip(" -\t")


folders = sorted([f for f in GAMES.iterdir() if f.is_dir()],
                 key=lambda f: f.name, reverse=True)
folders.sort(key=lambda f: f.name == "memory-match")

cards = []
for folder in folders:
    if not (folder / "index.html").exists():
        continue
    name = folder.name.replace("-", " ").title()
    desc = ""
    design = folder / "design.md"
    if design.exists():
        lines = [clean(l) for l in design.read_text().splitlines() if l.strip()]
        desc = " ".join(lines[:2])[:220]
    score = ""
    review = folder / "review.md"
    if review.exists():
        m = re.search(r"SCORE:\s*(\d+)\s*/\s*10", review.read_text())
        if m:
            score = m.group(1) + "/10"
    cards.append(
        '<a class="card" href="games/' + html.escape(folder.name) + '/">'
        '<span class="score">' + html.escape(score) + '</span>'
        '<div class="name">' + html.escape(name) + '</div>'
        '<div class="desc">' + html.escape(desc) + '</div></a>')

page = TEMPLATE.replace("{{CARDS}}", "\n".join(cards))
(ROOT / "index.html").write_text(page)
print(f"Gallery built with {len(cards)} games.")
