"""Build declutter/index.html and declutter/ALL_IN_ONE.md from declutter/agents/*.md.

Each agent file has a small front-matter block (name, emoji, tagline, use_when)
followed by the prompt to paste into the Claude app.
"""
from pathlib import Path
import html
import json

ROOT = Path(__file__).resolve().parent.parent
DIR = ROOT / "declutter"
AGENTS = DIR / "agents"

ALL_IN_ONE_HEADER = """You are my Declutter team: a set of specialist agents that help me clean digital slop out of my iPhone and my life.
When I start a chat, act as the Declutter Coach unless I name a specialist or send a screenshot that obviously belongs to one (camera roll means the Photo Purger, inbox means the Inbox Sweeper, and so on).
Say which agent is talking in the first line, for example "📸 Photo Purger".

Rules for every agent: prefer reversible moves; flag irreplaceable or sensitive items (photos of people, IDs, tax, medical, legal, 2FA codes) before suggesting I delete them; never repeat passwords, codes or account numbers seen in screenshots; keep replies short because I'm on my phone; no guilt.
"""


def parse(path):
    text = path.read_text(encoding="utf-8")
    _, front, body = text.split("---", 2)
    meta = {}
    for line in front.strip().splitlines():
        key, _, value = line.partition(":")
        meta[key.strip()] = value.strip()
    meta["prompt"] = body.strip()
    meta["file"] = path.name
    return meta


def build():
    agents = [parse(p) for p in sorted(AGENTS.glob("*.md"))]

    all_in_one = ALL_IN_ONE_HEADER + "".join(
        f"\n\n## {a['emoji']} {a['name']}\nUse when: {a['use_when']}\n\n{a['prompt']}" for a in agents
    )
    (DIR / "ALL_IN_ONE.md").write_text(all_in_one + "\n", encoding="utf-8")

    cards = []
    for i, a in enumerate(agents):
        cards.append(f"""
<details class="agent">
<summary><span class="emoji">{a['emoji']}</span><span><span class="name">{html.escape(a['name'])}</span><span class="tag">{html.escape(a['tagline'])}</span></span></summary>
<p class="when"><b>Use when:</b> {html.escape(a['use_when'])}</p>
<button class="copy" data-i="{i}">Copy prompt</button>
<pre>{html.escape(a['prompt'])}</pre>
</details>""")

    prompts = json.dumps([a["prompt"] for a in agents] + [all_in_one]).replace("</", "<\\/")
    page = PAGE.replace("{{CARDS}}", "".join(cards)).replace("{{PROMPTS}}", prompts).replace(
        "{{ALL_I}}", str(len(agents))
    )
    (DIR / "index.html").write_text(page, encoding="utf-8")
    print(f"Built {len(agents)} agents -> declutter/index.html, declutter/ALL_IN_ONE.md")


PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Declutter">
<title>Declutter Agents</title>
<link rel="stylesheet" href="../shared/theme.css">
<style>
*{box-sizing:border-box}
body{margin:0;font-size:16px;line-height:1.5}
header,main{max-width:680px;margin:0 auto;padding:0 16px}
header{padding-top:max(32px,env(safe-area-inset-top));text-align:center}
h1{margin:0 0 6px;font-size:1.9em}
h2{font-size:1.1em;margin:28px 0 10px}
.card{padding:16px;margin-bottom:12px}
ol{padding-left:22px;margin:8px 0}
li{margin:4px 0}
.agent{background:var(--panel);border:1px solid rgba(255,255,255,.08);border-radius:14px;margin-bottom:10px;overflow:hidden}
summary{list-style:none;display:flex;gap:12px;align-items:center;padding:14px 16px;cursor:pointer;min-height:56px}
summary::-webkit-details-marker{display:none}
.emoji{font-size:1.7em;flex:none}
.name{display:block;font-weight:600}
.tag{display:block;color:var(--muted);font-size:.9em}
.when{margin:0 16px 10px;color:var(--muted);font-size:.92em}
pre{white-space:pre-wrap;word-wrap:break-word;margin:0;padding:14px 16px 18px;font:13px/1.5 ui-monospace,Menlo,monospace;color:var(--text);background:rgba(0,0,0,.25);max-height:340px;overflow:auto}
button.copy{margin:0 16px 12px;padding:12px 18px;border-radius:999px;border:0;font:600 15px Inter,system-ui,sans-serif;background:var(--gold);color:#1a1620;min-height:44px}
button.copy.big{display:block;width:100%;margin:12px 0 0}
button.copy.done{background:#9fe3c4}
footer{text-align:center;color:var(--muted);padding:30px 16px max(30px,env(safe-area-inset-bottom));font-size:.85em}
</style>
</head>
<body>
<header>
<h1>Declutter Agents</h1>
<p>Eight small Claude agents that help you clear slop off your iPhone. Copy a prompt, paste it into the Claude app, send screenshots, and follow the steps.</p>
</header>
<main>
<h2>Set up once (recommended)</h2>
<div class="card">
<ol>
<li>On claude.ai, create a <b>Project</b> called <i>Declutter</i>.</li>
<li>Paste the all-in-one prompt below into the project's <b>instructions</b>.</li>
<li>On your iPhone, open the Claude app › Projects › Declutter › new chat, and say <i>"start"</i> or send a screenshot.</li>
</ol>
<button class="copy big" data-i="{{ALL_I}}">Copy all-in-one project prompt</button>
</div>
<div class="card">
<b>No project?</b> Open any agent below, tap <b>Copy prompt</b>, and paste it as the first message of a new Claude chat. To send screenshots fast, share them from Photos to the Claude app.
</div>
<h2>The agents</h2>
{{CARDS}}
<h2>Suggested order</h2>
<div class="card"><ol>
<li>🔕 Notifications: the biggest calm for the least effort</li>
<li>💸 Apps & subscriptions: saves real money</li>
<li>📥 Inbox</li>
<li>📸 Photos</li>
<li>🧹 Feeds, then 🗂 Notes, Files & Tabs</li>
<li>🔁 Weekly Reset, every Sunday after that</li>
</ol></div>
</main>
<footer>Agents suggest; you decide. Nothing is deleted unless you do it yourself.<br>Tip: Share › Add to Home Screen to keep this page one tap away.</footer>
<script>
const PROMPTS = {{PROMPTS}};
document.querySelectorAll("button.copy").forEach(b => b.addEventListener("click", async e => {
  e.preventDefault();
  const text = PROMPTS[+b.dataset.i];
  try { await navigator.clipboard.writeText(text); }
  catch (_) {
    const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t);
    t.select(); document.execCommand("copy"); t.remove();
  }
  const old = b.textContent; b.textContent = "Copied ✓"; b.classList.add("done");
  setTimeout(() => { b.textContent = old; b.classList.remove("done"); }, 1600);
}));
</script>
</body>
</html>
"""

if __name__ == "__main__":
    build()
