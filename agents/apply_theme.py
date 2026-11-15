from pathlib import Path

root = Path(__file__).resolve().parent.parent
pages = [(root / "index.html", "shared/theme.css")]
for page in sorted((root / "games").glob("*/index.html")):
    pages.append((page, "../../shared/theme.css"))

done = 0
for page, href in pages:
    text = page.read_text()
    if "theme.css" in text or "</head>" not in text:
        continue
    page.write_text(text.replace("</head>", '<link rel="stylesheet" href="' + href + '">\n</head>', 1))
    done += 1
print(f"Theme added to {done} pages.")
