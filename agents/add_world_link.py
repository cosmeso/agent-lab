from pathlib import Path

page = Path(__file__).resolve().parent.parent / "index.html"
text = page.read_text()

BANNER = """<a class="card" id="enter-world" href="games/andromeda-world/" style="display:block;max-width:720px;margin:10px auto 0;padding:22px;text-align:center;text-decoration:none">
<div style="font-family:Cinzel,Georgia,serif;font-size:1.5em;letter-spacing:.06em">Enter the Village</div>
<div class="desc" style="margin-top:6px">Step into the 3D world of the Utopian Galaxies. Find the Egg Shrine, get your egg, and play the old arcade.</div>
</a>"""

if "enter-world" in text:
    print("World entrance already on the front page.")
elif "</header>" in text:
    page.write_text(text.replace("</header>", "</header>\n" + BANNER, 1))
    print("World entrance added to the front page.")
else:
    print("Could not find the front page header, so no entrance was added.")
