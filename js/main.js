import { images, sounds, buildCharacters, loadAssets } from './assets.js';
import {
  CANVAS_WIDTH,
  BUS_X,
  BUS_WIDTH,
  BUS_HEIGHT,
  BUS_START_Y,
  BUS_STEP,
  BUS_MIN_Y,
  BUS_MAX_Y,
  LANES,
  BASE_OBSTACLE_SPEED,
  BUSHES_SCROLL_SPEED,
  TREES_SCROLL_SPEED,
  WIN_SCORE,
} from './constants.js';
import { makeObstacle, advanceObstacles } from './obstacles.js';
import { applyCollisions } from './scoring.js';
import { drawScene } from './render.js';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let state = {
  score: 0,
  speed: BASE_OBSTACLE_SPEED,
  busY: BUS_START_Y,
  bushesOffset: 0,
  treesOffset: 0,
  obstacles: [],
};

let characters = [];

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (state.busY < BUS_MAX_Y) state.busY += BUS_STEP;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (state.busY > BUS_MIN_Y) state.busY -= BUS_STEP;
  }
});

let lastTimestamp = null;

function loop(timestamp) {
  if (lastTimestamp === null) lastTimestamp = timestamp;
  // Cap dt so a backgrounded tab resuming doesn't cause a huge position jump
  const dt = Math.min((timestamp - lastTimestamp) / 1000, 1 / 20);
  lastTimestamp = timestamp;

  state.bushesOffset += BUSHES_SCROLL_SPEED * dt;
  state.treesOffset += TREES_SCROLL_SPEED * dt;

  state.obstacles = advanceObstacles(
    state.obstacles,
    dt,
    state.speed,
    CANVAS_WIDTH,
    characters,
    LANES,
  );

  const busBounds = { x: BUS_X, y: state.busY, width: BUS_WIDTH, height: BUS_HEIGHT };
  const { obstacles, scoreGained, gameOver } = applyCollisions(busBounds, state.obstacles);
  state.obstacles = obstacles;
  state.score += scoreGained;

  if (scoreGained > 0) sounds.scoreUp.play().catch(() => {});

  if (gameOver) {
    sounds.crash.play().catch(() => {});
    sounds.youlose.play().catch(() => {});
    window.location.href = './youlose.html';
    return;
  }

  if (state.score >= WIN_SCORE) {
    sounds.youwin.play().catch(() => {});
    window.location.href = './youwin.html';
    return;
  }

  drawScene(ctx, state, images);
  requestAnimationFrame(loop);
}

async function boot() {
  await loadAssets();
  characters = buildCharacters();
  state.obstacles = [makeObstacle(characters, LANES, CANVAS_WIDTH)];
  sounds.soundtrack.play().catch(() => {});
  requestAnimationFrame(loop);
}

boot();
