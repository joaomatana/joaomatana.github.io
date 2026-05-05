# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A single-page personal CV / portfolio website for João Pedro Matana (Desenvolvedor Full Stack), hosted on GitHub Pages from this repo (`joaomatana.github.io`). All content is in Brazilian Portuguese, but the design language deliberately mixes English / dev jargon (e.g. `quest_log`, `equipped_stack`, `cleared`).

It is a **pure static site** — no build system, no package manager, no tests, no backend, no JavaScript framework. There is nothing to install, build, lint, or run as a test suite.

The design metaphor is a **Game HUD / RPG character sheet**: the page presents the CV as a save file with character stats, quest log, skill tree and achievements. Commit to the metaphor when editing — copy and section names should keep the in-character voice.

## Local preview

There are no npm/build commands. To preview changes:

- Open `html/index.html` directly in a browser, or
- Serve the repo root with any static server, e.g. `python -m http.server 8000` and navigate to `http://localhost:8000/html/index.html`.

The page is served from the `/html/` subpath, not the repo root — there is no top-level `index.html`. Asset URLs inside the HTML use the relative prefix `../assets/...`, so the page must be opened from inside `html/` (don't move it to the root without rewriting those paths).

## Architecture

### Single page, hand-written

The site is **one HTML file** (`html/index.html`) plus one stylesheet (`assets/css/styles.css`) and one tiny vanilla JS file (`assets/js/main.js`). No Bootstrap, no jQuery, no plugins. The markup is semantic (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).

The earlier MACode template variants — a `topbar` layout (`index.html`) and a `minibar` layout (`index-2.html`) — were removed in the editorial redesign. There is no longer a "Modelo 1 / Modelo 2" toggle and no theme color switcher; the page commits to a single visual identity.

### Page sections (top → bottom)

1. **Topbar HUD** (fixed) — `joao_matana.exe · LVL 25 · clinicorp_solutions` brand on the left; live HP/MP/XP bars in the middle (decorative, hidden ≤1024px); 3-link nav (`about`, `quests`, `contact`) on the right.
2. **Hero / Player Profile** (`<section class="hero">`) — split layout: giant VT323 name on the left with class/guild line, bio with cyan-highlighted phrases, three CTA buttons. Right column: portrait with corner brackets, `online` badge and an animated scanline; `character_stats` panel with 5 animated horizontal bars (INT/DEX/FOC/LCK/XP); `equipped_stack` panel with 12 inventory chips. The portrait uses `mix-blend-mode: luminosity` over a dark gradient — content stays readable but tints into the HUD palette.
3. **Sobre** (`#sobre`) — `./character_info.sh` panel — formatted `<dl>`-style key/value list (name, class, level, origin, based_in, guild, specialty, academia).
4. **Quest log** (`#quests`) — 5 `<article class="quest">` blocks. The current job carries `.quest--active` (pink accent, pulsing `[active]` LED). Each quest has a left sidebar with status / period / "xp earned" and a body with company / title / objectives (`▸` markers) / `loot` chips.
5. **Skill tree** (`#formacao`) — auto-fit grid of 4 `.skill` cards with violet hover glow, ASCII icon, period and `unlocked` status.
6. **Achievements** (`#achievements`) — 3 `.achievement` cards with rarity tags (`legendary`, `epic`, `rare`). The legendary card has an animated conic-gradient sheen rotating behind the content. Replaces the old generic "Serviços" cards.
7. **Footer / Main menu** (`#contato`) — `PRESS START_` headline with blinking cursor, then 4 `.menu-item` cards (email, phone, LinkedIn, Instagram). Each menu item shifts right on hover and prepends `> ` like a CLI prompt.

### Design tokens

All theming lives in CSS custom properties at `:root` in `assets/css/styles.css`:

| Token | Value | Purpose |
|---|---|---|
| `--bg` | `#07090f` | Deep night blue (page bg) |
| `--bg-elev` / `--bg-panel` | `#0e1322` / `#0b1020` | Panel surfaces |
| `--text` | `#e6ecf7` | Cool white body text |
| `--text-soft` / `--text-muted` / `--text-dim` | `#a7b2cc` / `#5e6b85` / `#3a4360` | Secondary text tiers |
| `--c-cyan` | `#00ff9f` | Primary HUD accent — borders, status LEDs, current company on hover |
| `--c-pink` | `#ff5277` | Active quest, current company name, alert state |
| `--c-amber` | `#ffd866` | Legendary achievements, XP earned values |
| `--c-violet` | `#b794ff` | Skill tree hover, magic-tier states |
| `--c-blue` | `#6db3ff` | Common / rare achievements |
| `--display` | `'VT323', monospace` | Giant name, section titles, achievement titles, quest titles |
| `--mono` | `'JetBrains Mono', monospace` | Body copy, labels, eyebrows, buttons |
| `--pixel` | `'Press Start 2P', monospace` | Tiny rarity tags only — unreadable at body sizes |

Fonts are loaded via Google Fonts (single `<link>` in `<head>`). The page background combines four layers (radial cyan glow top, radial pink glow bottom-right, vertical+horizontal grid lines at 48px), all `background-attachment: fixed`. Two overlays sit on top: `body::before` adds CRT scanlines (3px repeat, multiply blend, 35% opacity) and `body::after` adds an edge vignette. Both are `pointer-events: none`.

`.panel` is the recurring structural element — bordered box with cyan corner brackets (`::before`/`::after`) and an optional `.panel--header` strip with a pulsing dot. Reuse it for any new content blocks instead of inventing a new container.

### Motion

- `IntersectionObserver` toggles `.is-in` on `.reveal` elements as they enter the viewport (handled in `main.js`). Stagger via `.reveal--delay-1` … `.reveal--delay-4`.
- Stat bars (`.stats__bar`) read their target value from `data-fill="92"` and animate `--fill` from 0% to that value the first time they enter view. The bar's interior uses a `repeating-linear-gradient` to keep a "segmented" HUD feel; modify color via `.is-pink`, `.is-amber`, `.is-violet` modifiers.
- Smooth scroll for in-page anchors compensates for the fixed topbar height (~16px extra padding).
- Decorative animations: `pulse` (status LEDs), `blink` (cursor `_` after `READY`), `scan` (vertical scanline travelling down the portrait every 4s), `rotate` (conic-gradient sheen on legendary achievement). All driven by CSS keyframes.
- `prefers-reduced-motion: reduce` collapses every animation to ~0ms and reveals all elements.
- **Easter egg:** Konami code (`↑↑↓↓←→←→ba`) hue-shifts the page for 2.4s. Implemented in `main.js`.

### Asset locations worth knowing

- Profile photo: `assets/img/person.jpg`
- Downloadable CV: `assets/pdf/CV.pdf` (linked from the "Download CV" link — replace this file to update the downloadable version)
- Favicon: `assets/favicon.ico`

### Repo footprint

After the editorial→HUD redesign and Pass 2 cleanup, the live tree is intentionally tiny:

```
html/index.html
assets/css/styles.css
assets/js/main.js
assets/img/person.jpg
assets/pdf/CV.pdf
assets/favicon.ico
CLAUDE.md
```

No Bootstrap, no jQuery, no vendor plugins, no Themify icon fonts, no template variants. If you find yourself adding back any of those, reconsider — the design depends on staying lean.
