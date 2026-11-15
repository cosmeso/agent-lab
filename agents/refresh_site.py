import subprocess
import sys
from pathlib import Path

CODE = "abimaels-andromeda"   # your GoatCounter site code
here = Path(__file__).resolve().parent

for step in (["build_gallery.py"], ["add_counter.py", CODE], ["add_feedback.py"]):
    subprocess.run([sys.executable, str(here / step[0])] + step[1:], check=True)

print("Site refreshed. Now commit and push in GitHub Desktop.")