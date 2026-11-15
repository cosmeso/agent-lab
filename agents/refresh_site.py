import subprocess
import sys
from pathlib import Path

CODE = "abimaels-andromeda"   # your GoatCounter site code
here = Path(__file__).resolve().parent

steps = [["build_gallery.py"], ["add_world_link.py"], ["add_counter.py", CODE], ["add_feedback.py"], ["apply_theme.py"]]
for step in steps:
    subprocess.run([sys.executable, str(here / step[0])] + step[1:], check=True)

print("Site refreshed. Now commit and push in GitHub Desktop.")
