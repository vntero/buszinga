# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Buszinga! is a browser-based arcade game: drive a school bus across three lanes of traffic, dodge cars/trucks, and collect chargers ("batteries") for points. Pure client-side HTML/CSS with vanilla JS modules rendered on a `<canvas>`. No framework, no bundler, no runtime dependencies — dev tooling only.

## Running the game

ES modules require HTTP, not `file://`. Serve the directory:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

## Dev commands

```bash
npm install          # install devDependencies (vitest, eslint, prettier)
npm test             # run unit tests once
npm run test:watch   # vitest in watch mode
npm run lint         # eslint js/
npm run format       # prettier --write .
```

## Page flow

- `index.html` — start screen, links to `bonanza.html` to begin play
- `bonanza.html` — the actual game; loads `js/main.js` as an ES module
- `youlose.html` — shown on crash; links back to `bonanza.html`
- `youwin.html` — shown on win; links back to `bonanza.html`

All pages share `style.css`.

## Architecture

### Module map (`js/`)

| File | Role |
|---|---|
| `constants.js` | Single source of truth for all magic numbers (canvas size, bus bounds, lane y-coords, speeds, score thresholds) |
| `collisions.js` | Pure `intersects(a, b)` AABB test — no side effects, no imports |
| `obstacles.js` | Pure `makeObstacle` and `advanceObstacles` — spawn, move, compact the obstacle array |
| `scoring.js` | Pure `applyCollisions(busBounds, obstacles)` — runs AABB checks, returns score delta and gameOver flag |
| `assets.js` | Preloads all `Image`/`Audio` objects; exports `loadAssets()` promise and `buildCharacters()` |
| `render.js` | All `ctx.drawImage` / `ctx.fillText` calls; `drawTiled` handles infinite parallax scrolling |
| `main.js` | Wires everything: `requestAnimationFrame` loop with delta-time, keyboard input, win/lose redirects |

### Game loop (main.js)

`boot()` awaits `loadAssets()`, then kicks off `requestAnimationFrame(loop)`. Each frame:

1. Compute `dt = min((timestamp - lastTimestamp) / 1000, 1/20)` — capped at 50 ms so a backgrounded tab resuming doesn't teleport obstacles.
2. Advance `state.bushesOffset` and `state.treesOffset` (monotonically increasing, wrapped in render via modulo).
3. `advanceObstacles` — moves each obstacle left by `speed * dt` px, spawns a new peer when an obstacle crosses `CANVAS_WIDTH - SPAWN_THRESHOLD_X`, filters out collected and off-screen ones. Each obstacle carries a `nextSpawned` flag so it only triggers one spawn.
4. `applyCollisions` — checks bus AABB against every obstacle; charger hit awards `CHARGER_POINTS` and marks it `collected: true`; hazard hit sets `gameOver`.
5. Handle win/lose redirects, then `drawScene`.

Speeds are in **px/sec** (delta-time normalised), not px/frame: obstacle speed 300 px/s, trees 30 px/s, bushes 15 px/s — equivalent to original at 60 fps.

### Bus movement

Arrow keys move `state.busY` in 60 px steps, clamped to `[BUS_MIN_Y=320, BUS_MAX_Y=440]`, yielding exactly three reachable positions (320, 380, 440) — one per lane defined in `LANES = [330, 390, 450]`. The 10 px offset between bus Y and lane Y is intentional (the bus sprite is taller than the lane centre).

### Obstacle state shape

```js
{
  img, width, height,   // copied from the character definition at spawn time
  isCharger,            // true for the charger sprite — avoids src string matching
  x, y,                 // current position (y fixed at spawn, x decreasing)
  collected,            // true after charger is picked up
  nextSpawned,          // true after this obstacle has triggered the next spawn
}
```

### Parallax background

`drawTiled(ctx, img, offsetX, y, drawHeight)` draws at most two tiles per call using `start = -(Math.floor(offsetX) % CANVAS_WIDTH)`, replacing the original 12-element pre-populated array.

### Tests (`test/`)

Vitest unit tests cover the three pure modules. Assets, render, and main are not unit-tested (browser-only APIs). Run with `npm test`.

### Notes

- `sounds.*.play()` calls are wrapped in `.catch(() => {})` — browser autoplay policy may block audio without a prior user gesture.
- The `school.png` asset exists in `Images/` but is intentionally unused — leftover from an earlier iteration.
