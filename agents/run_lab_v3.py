from ollama import chat
from pathlib import Path
from datetime import datetime
import json
import random
import re
from playwright.sync_api import sync_playwright

MODEL = "qwen2.5-coder:7b"   # use :14b if you downloaded the 14b model
MAX_ATTEMPTS = 4

ROOT = Path(__file__).resolve().parent.parent
GAMES = ROOT / "games"
MEMORY = ROOT / "memory"
LOGS = ROOT / "logs"
for folder in (GAMES, MEMORY, LOGS):
    folder.mkdir(exist_ok=True)
LESSONS_FILE = MEMORY / "lessons_v3.json"

GAME_TYPES = [
    "catch falling objects with a basket moved by the left and right arrow keys",
    "click targets that appear on screen before they disappear",
    "repeat a growing sequence of colored buttons (Simon says)",
    "dodge falling blocks by moving left and right",
    "whack-a-mole with a 3x3 grid of clickable squares",
    "guess a secret number from 1 to 100 with higher/lower hints",
    "reaction-time test: click as soon as the screen turns green",
]

DESIGNER = ("You design tiny browser games that can be played in under two "
            "minutes. Keep it very simple: one screen, one mechanic. Describe "
            "it in 5 short bullet points: goal, controls, rules, how you win, "
            "how you lose.")
BUILDER = ("You write a complete single-file HTML game with inline CSS and "
           "JavaScript. Rules: "
           "1) Put all JavaScript in one <script> at the end of <body>. "
           "2) Declare every variable with let or const before using it, and "
           "never reassign a const. "
           "3) Only use document.getElementById for ids that exist in your HTML. "
           "4) Draw everything on a <canvas> or with visible HTML elements, "
           "using bright colors on a dark background and large shapes. "
           "5) The game must start by itself, show its instructions on screen, "
           "and respond to the keyboard or mouse. Every button must visibly "
           "change something on screen when clicked. "
           "6) Keep it under 150 lines. "
           "Output only the HTML, starting with <!DOCTYPE html>.")
CRITIC = ("You rate tiny browser games. On the first line write SCORE: n/10 "
          "(for fun and clarity). Then write two short sentences of feedback.")


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
    start = text.find("<!DOCTYPE")
    if start > 0:
        text = text[start:]
    return text.strip()


def load_lessons():
    if LESSONS_FILE.exists():
        try:
            return json.loads(LESSONS_FILE.read_text())
        except Exception:
            return []
    return []


def save_lessons(lessons):
    LESSONS_FILE.write_text(json.dumps(lessons[-15:], indent=2))


def snapshot(page):
    text = page.evaluate(
        "() => document.body.innerText + '|' + document.body.innerHTML.length")
    return text, page.screenshot()


def playtest(path):
    problems = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1000, "height": 800})
        page.on("dialog", lambda d: d.accept())
        page.on("pageerror",
                lambda e: problems.append("JavaScript error: " + str(e)))
        page.on("console",
                lambda m: problems.append("Console error: " + m.text)
                if m.type == "error" else None)
        page.goto(path.resolve().as_uri())
        page.wait_for_timeout(1000)
        info = page.evaluate("""() => ({
            text: document.body.innerText.trim().length,
            canvas: document.querySelectorAll('canvas').length,
            elements: document.querySelectorAll('body *').length
        })""")
        text_before, shot_before = snapshot(page)

        for box in page.query_selector_all("input, textarea")[:5]:
            try:
                kind = (box.get_attribute("type") or "text").lower()
                if kind in ("text", "number", "search", "tel"):
                    box.fill("50", timeout=800)
                    box.press("Enter", timeout=800)
            except Exception:
                pass

        selector = "button, [onclick], input[type=button], input[type=submit]"
        for button in page.query_selector_all(selector)[:12]:
            try:
                button.click(timeout=800)
                page.wait_for_timeout(150)
            except Exception:
                pass

        for x, y in [(500, 400), (300, 300), (700, 500), (500, 200)]:
            try:
                page.mouse.click(x, y)
                page.wait_for_timeout(100)
            except Exception:
                pass

        for key in ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp",
                    "Space", "Enter", "a", "d", "w", "s", "ArrowRight"]:
            try:
                page.keyboard.press(key)
                page.wait_for_timeout(120)
            except Exception:
                pass

        page.wait_for_timeout(500)
        text_after, shot_after = snapshot(page)
        browser.close()

    if info["canvas"] == 0 and info["text"] == 0 and info["elements"] < 3:
        problems.append("The page is blank: nothing is drawn on screen.")
    elif text_before == text_after and shot_before == shot_after:
        problems.append("Nothing on screen changed after typing, clicking "
                        "buttons, mouse clicks, and key presses.")
    return list(dict.fromkeys(problems))[:5]


lessons = load_lessons()
lesson_text = ""
if lessons:
    lesson_text = ("\n\nLessons from earlier games. Avoid these mistakes:\n- "
                   + "\n- ".join(lessons))

game_type = random.choice(GAME_TYPES)
print("Game type:", game_type)
print("Designer is thinking...")
idea = ask(DESIGNER, "Design this kind of game: " + game_type)
print(idea)

print("Builder is building...")
html = clean_html(ask(BUILDER, "Build this game:\n" + idea + lesson_text))

temp = LOGS / "current_game.html"
passed = False
attempts_used = 0
for attempt in range(1, MAX_ATTEMPTS + 1):
    attempts_used = attempt
    temp.write_text(html)
    print(f"Playtester is testing (attempt {attempt})...")
    problems = playtest(temp)
    if not problems:
        passed = True
        print("Playtest passed!")
        break
    print("Playtester found problems:")
    for problem in problems:
        print(" -", problem)
    lesson = "Past game failed with: " + problems[0][:200]
    if lesson not in lessons:
        lessons.append(lesson)
    if attempt < MAX_ATTEMPTS:
        print("Builder is fixing...")
        html = clean_html(ask(BUILDER,
            "Fix these problems:\n" + "\n".join(problems) +
            "\n\nCurrent code:\n" + html))
save_lessons(lessons)

stamp = datetime.now().strftime("%Y-%m-%d %H:%M")
if passed:
    print("Critic is scoring...")
    review = ask(CRITIC, html)
    number = len([p for p in GAMES.glob("game-*") if p.is_dir()]) + 1
    folder = GAMES / f"game-{number:03d}"
    folder.mkdir()
    (folder / "index.html").write_text(html)
    (folder / "design.md").write_text(idea)
    (folder / "review.md").write_text(review)
    result = f"PASSED, saved as game-{number:03d}"
    print("Done! Saved to games/game-" + f"{number:03d}/index.html")
    print(review)
else:
    failed = LOGS / "failed"
    failed.mkdir(exist_ok=True)
    name = "failed-" + datetime.now().strftime("%Y%m%d-%H%M%S") + ".html"
    (failed / name).write_text(html)
    result = "FAILED after all attempts"
    print("This game could not be fixed. It was NOT added to your games.")
    print("The lab learned from the errors. Run the script again to try a new game.")

with open(LOGS / "lab_log.md", "a") as log:
    log.write(f"- {stamp} | {game_type} | attempts: {attempts_used} | {result}\n")
temp.unlink(missing_ok=True)
