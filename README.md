# Game 2020 · The Golden Path

*Are you on your path?*

A spiritual, non-competitive board game as a web app. Walk the seven circuits of a classic labyrinth toward the Golden Heart: 40 fields, 12 gemstone gates plus the Golden Gate, golden steps, loops of reflection, and card decks (Choice, Insight, Pearls of Wisdom, Power Animals, Colors, Prayers, Togetherness, Golden Steps, Loops, Core Keys).

## Play
Open `index.html` in any browser – it is a single self-contained file. With GitHub Pages enabled (Settings → Pages → Branch `main`), the game runs at `https://barbaraxprinz-ai.github.io/golden-path/`.

## Edit
- `src/data.js` – all card texts
- `src/board.js` – labyrinth geometry
- `src/app.html` – game engine and design

After editing, rebuild the single file:
```
python3 src/build.py
```
