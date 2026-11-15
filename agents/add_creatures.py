from pathlib import Path

page = Path(__file__).resolve().parent.parent / "games" / "pop-time-machine" / "index.html"
text = page.read_text()

if "creature.js" in text:
    print("Creatures are already connected to Pop Time Machine.")
    raise SystemExit

edits = [
    ('<main id="app"></main>',
     '<main id="app"></main>\n<script src="../../shared/creature.js"></script>'),
    ("  cur = 0;\n  buildBoard(era);",
     "  cur = 0;\n  if (window.Creature) { players[0].shield += Creature.startShields(); Creature.startRun(); }\n  buildBoard(era);"),
    ("  var opts = shuffle(t.q.slice(3)).filter(function (o) { return o !== banned; });",
     "  var opts = shuffle(t.q.slice(3)).filter(function (o) { return o !== banned; });\n  if (who === 0 && window.Creature) { opts = Creature.trim(opts, t.q[3]); }"),
    ("' is up</p>';",
     "' is up</p>' + (who === 0 && window.Creature ? Creature.note() : '');"),
    ("    var pts = t.tier * 100;",
     "    var pts = t.tier * 100;\n    if (who === 0 && window.Creature) { pts = Math.round(pts * Creature.scoreBoost()); }"),
    ('    msg += esc(p.name) + " scores " + pts + "! ";',
     '    msg += esc(p.name) + " scores " + pts + "! ";\n    if (who === 0 && window.Creature) { var cn = Creature.feed(t.tier, eraName); if (cn) { msg += cn + " "; } }'),
]

for old, new in edits:
    if text.count(old) != 1:
        print("Could not find a spot to edit:", old[:45])
        raise SystemExit(1)
    text = text.replace(old, new)

page.write_text(text)
print("Creatures connected to Pop Time Machine.")
