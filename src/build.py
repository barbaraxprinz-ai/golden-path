"""Build the single-file game: python3 src/build.py (run from the repository root)."""
import os, re, shutil, subprocess, sys, tempfile

def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()

parts = {
    "/*DATA*/": "src/data.js",
    "/*DATA2*/": "src/data2.js",
    "/*DATA3*/": "src/data3.js",
    "/*BOARD*/": "src/board.js",
    "/*FONTS*/": "src/fonts.css",
}
html = read("src/app.html")
for marker, path in parts.items():
    html = html.replace(marker, read(path) if os.path.exists(path) else "")

# Self-test: every inline script must parse (needs node; skipped if missing).
if shutil.which("node"):
    for i, js in enumerate(re.findall(r"<script>(.*?)</script>", html, re.S)):
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as t:
            t.write(js)
        r = subprocess.run(["node", "--check", t.name], capture_output=True, text=True)
        os.unlink(t.name)
        if r.returncode:
            sys.exit(f"Script {i} has a syntax error – index.html NOT written:\n{r.stderr}")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print(f"index.html written ({len(html.encode())//1024} KB)")
