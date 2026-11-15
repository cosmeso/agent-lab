from pathlib import Path

BAR = """<div id="fb" style="position:fixed;bottom:0;left:0;right:0;padding:6px;background:rgba(0,0,0,.8);color:#fff;font-family:sans-serif;font-size:14px;text-align:center;z-index:99999">
Enjoying this game?
<button onclick="vote('up')" style="font-size:18px;width:auto;margin:0 4px;padding:4px 10px">&#128077;</button>
<button onclick="vote('down')" style="font-size:18px;width:auto;margin:0 4px;padding:4px 10px">&#128078;</button>
<span id="fbmsg"></span>
</div>
<script>
function vote(kind) {
  var key = 'voted:' + location.pathname;
  try {
    if (localStorage.getItem(key)) {
      document.getElementById('fbmsg').textContent = 'You already voted';
      return;
    }
  } catch (e) {}
  if (window.goatcounter && window.goatcounter.count) {
    window.goatcounter.count({path: 'thumbs-' + kind + location.pathname, title: 'Thumbs ' + kind, event: true});
  }
  try { localStorage.setItem(key, '1'); } catch (e) {}
  document.getElementById('fbmsg').textContent = 'Thanks!';
}
</script>
"""

root = Path(__file__).resolve().parent.parent
added = 0
for page in sorted((root / "games").glob("*/index.html")):
    text = page.read_text()
    if 'id="fb"' in text or "</body>" not in text or "no-feedback-bar" in text:
        continue
    page.write_text(text.replace("</body>", BAR + "</body>"))
    added += 1
print(f"Feedback bar added to {added} games.")
