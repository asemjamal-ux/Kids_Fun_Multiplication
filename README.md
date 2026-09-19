# Fun with Multiplication!

A colourful, interactive website that teaches children aged 6–12 the multiplication tables from 1 to 10.
Pure HTML/CSS/JS — no build step, no accounts, no backend.

## Run it

Open `index.html` directly in a browser, or serve the folder (recommended so fonts and
hash-links behave consistently):

```bash
python -m http.server 5173
```

Then visit <http://localhost:5173>.

## Pages

| Page | What's there |
|------|--------------|
| `index.html` | Hero with Multi the mascot, "pick a table" chips, feature cards, a quick-fire challenge widget |
| `games.html` | "Who's playing?" name card, six games — **Times Table Race** (60-second sprint), **Multiplication Bingo** (5×5 card, decoy calls), **Math Puzzles** (missing number, true/false, which-makes, odd-one-out; three lives), **Memory Match** (flip cards, pair question with answer), **Balloon Pop** (tap the rising balloon with the right answer), **Number Hunt** (tap every tile equal to the target before time runs out) — and the **Prize box** |
| `videos.html` | Ten animated "episodes" — one per table — that build each answer as rows of emoji, with skip-counting strip, captions, optional read-aloud narration (Web Speech API), speed control, memory tricks, plus an interactive 10×10 chart |
| `worksheets.html` | Worksheet generator: practice problems (across/stacked), missing-number puzzles, blank and full charts, skip-counting; optional answer key page; print-ready via `window.print()` |
| `parents.html` | Progress tracker (reads localStorage), seven usage tips, learning order, tricks cheat-sheet, 10-minute routine, classroom ideas, FAQ |

## Stars & prizes

Every correct answer anywhere on the site (games, quick challenge) earns one star via `MM.recordFact()`.
Every 10 stars unlocks the next sticker from `MM.STICKERS` (24 in total) and shows a celebration popup
addressed to the child by name. The name, stars and prizes are stored in `localStorage` (`mm_name`,
`mm_stars`, `mm_prizes`). The star chip in the nav links to the prize box on the games page.

## Languages

English is the default; Arabic (عربي) is available from the toggle in the nav. The choice is
remembered in `localStorage` and the page reloads in the chosen language.

- `js/i18n.js` holds both dictionaries and is loaded in `<head>` so `dir="rtl"` is set before first paint.
- Static text: elements carry `data-i18n="key"` (text), `data-i18n-html="key"` (markup),
  `data-i18n-placeholder`, `data-i18n-title`. The English copy lives in the HTML; Arabic is applied on top.
- Dynamic text (games, video captions, worksheets) goes through `MM.t('key', {vars})`.
- In RTL the layout mirrors via flex/grid + logical CSS properties, fonts switch to Baloo Bhaijaan 2 / Cairo,
  and every maths expression is forced left-to-right so `3 × 4 = 12` never flips.
- Video narration uses an Arabic voice (`ar-SA`) when available on the device.

To add another language, add a `T.<code>` block in `js/i18n.js` and extend the toggle.

## Structure

```
css/style.css      shared design system (sticker-book aesthetic, responsive, print, RTL)
js/i18n.js         English + Arabic dictionaries, MM.t(), language toggle
js/main.js         helpers: storage, randomness, confetti, synth sounds, mascot SVG, nav, name, stars & prizes
js/games.js        Race, Bingo, Puzzles
js/games-more.js   Memory Match, Balloon Pop, Number Hunt + name card
js/videos.js       episode player + chart
js/worksheets.js   worksheet generator
```

Progress and best scores are stored in the browser's `localStorage` under `mm_*` keys.
Fonts (Fredoka + Nunito) load from Google Fonts and fall back to system fonts offline.
