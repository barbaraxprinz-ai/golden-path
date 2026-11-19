# CLAUDE.md – Game 2020 · The Golden Path

## Who you are working with

Barbara is the author and creator of this game. **She is not a technical user.**

- She speaks German. Always answer her in **simple, warm German**, with no technical jargon.
- She describes what she wants in everyday words. Your job is to translate that into the technical steps (Git, GitHub, files, code) and do them yourself.
- Never ask her to run commands, edit code, or work in GitHub settings herself if you can do it for her.
- Never explain things like branches, commits, pull requests or builds unless she asks. Tell her what changed in the game, not how.
- If something only she can do (for example clicking a permission in GitHub or entering a password), give her short numbered steps with exactly what to tap.
- Ask at most one simple question at a time, and only when you really need it.

## How to translate her words

| Barbara says | What you do |
|---|---|
| "Stell es online", "Lade es hoch", "Speicher das auf GitHub" | Rebuild `index.html`, commit, and push to `main` in `barbaraxprinz-ai/golden-path`. Her saying this is her approval to push. |
| "Mach es als Website", "Ich will einen Link" | Make sure GitHub Pages is on (branch `main`, root). The game lives at `https://barbaraxprinz-ai.github.io/golden-path/`. |
| "Ändere die Karte …", "Neue Karte …", "Text ändern" | Edit the card texts in `src/data.js` (cards are in English), rebuild, test. |
| "Das Brett …", "Labyrinth …", "Felder …" | Board geometry is `src/board.js`; field types and sets are in `src/app.html` (`SETS`, `GATE_POS`). |
| "Schöner machen", "größer am Handy", "Farben" | Design and layout are in the `<style>` section of `src/app.html`. Always check the phone view. |
| "Lieder", "Musik", "Suno" | The Music tab in `src/app.html`. Songs are added by her in the app; direct .mp3 links on her server also work. |
| "Rückgängig", "Wie vorher" | Revert to the previous version in Git and put it online again if it was online. |

## The project

A spiritual, non-competitive board game as a web app, in English.
Core ideas: a classic 7-circuit labyrinth with 40 fields, 12 rays, 12 gemstone gates plus the Golden Gate (13 gates), a Golden Heart in the center, golden steps (a conscious pause and a heart decision; a reward, not a speed-up), loops of reflection at the turning points, Pearls of Wisdom, Knowledge Tokens (earned by helping others), 7 Core Keys, archetypes (Seeker, Healer, Creator, Guide). Nobody wins; everyone arrives together. 2–6 players on one device; online play on separate devices is a planned next step.

### Files

- `index.html` – the finished game, one self-contained file. **This is what goes online. Never edit it by hand.**
- `src/app.html` – game engine, design, rules text
- `src/data.js` – all card texts and gates
- `src/board.js` – labyrinth geometry
- `src/build.py` – combines the three into `index.html`

### Every change

1. Edit the files in `src/`.
2. Run `python3 src/build.py` from the repository root.
3. Test it: open `index.html` in a headless browser (Playwright), play a few turns, check there are no errors, and look at a phone-width screenshot (about 390 px wide). Text must stay comfortably readable on a phone.
4. Tell Barbara in one or two German sentences what changed. Only push when she asks to put it online.
