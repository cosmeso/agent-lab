from ollama import chat
from pathlib import Path
import re

MODEL = "qwen2.5-coder:7b"

def ask(role_prompt, task):
    response = chat(model=MODEL, messages=[
        {"role": "system", "content": role_prompt},
        {"role": "user", "content": task},
    ])
    return response["message"]["content"]

def clean_html(text):
    match = re.search(r"```(?:html)?\s*(.*?)```", text, re.DOTALL)
    if match:
        text = match.group(1)
    return text.strip()

DESIGNER = ("You design tiny, fun browser games that can be played in under "
            "two minutes. Describe the game in 5 short bullet points: goal, "
            "controls, rules, how you win, how you lose.")
BUILDER = ("You write a complete, single-file HTML game with inline CSS and "
           "JavaScript. It must work on a laptop with a mouse or keyboard. "
           "Output only the HTML, starting with <!DOCTYPE html>.")
CRITIC = ("You review HTML games for bugs and unclear rules. If there are no "
          "problems, reply with only the word APPROVED. Otherwise, list the "
          "concrete problems.")

print("Designer is thinking...")
idea = ask(DESIGNER, "Propose one new tiny game.")
print(idea)

print("Builder is building...")
html = clean_html(ask(BUILDER, "Build this game:\n" + idea))

for round_num in range(3):
    print(f"Critic is reviewing (round {round_num + 1})...")
    review = ask(CRITIC, html)
    if review.strip().upper().startswith("APPROVED"):
        print("Critic approved it.")
        break
    print("Critic found problems. Builder is fixing...")
    html = clean_html(ask(BUILDER, "Fix these problems:\n" + review +
                          "\n\nCurrent code:\n" + html))

games_dir = Path(__file__).resolve().parent.parent / "games"
games_dir.mkdir(exist_ok=True)
number = len([p for p in games_dir.glob("game-*") if p.is_dir()]) + 1
folder = games_dir / f"game-{number:03d}"
folder.mkdir()
(folder / "index.html").write_text(html)
(folder / "design.md").write_text(idea)
print(f"Done! Saved to games/game-{number:03d}/index.html")
