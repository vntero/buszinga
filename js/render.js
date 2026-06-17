import { CANVAS_WIDTH, BUS_X, BUS_WIDTH, BUS_HEIGHT } from './constants.js';

function drawTiled(ctx, img, offsetX, y, drawHeight) {
  const w = CANVAS_WIDTH;
  const start = -(Math.floor(offsetX) % w);
  for (let x = start; x < CANVAS_WIDTH; x += w) {
    ctx.drawImage(img, x, y, w, drawHeight);
  }
}

export function drawScene(ctx, state, images) {
  const { busY, obstacles, score, bushesOffset, treesOffset } = state;

  ctx.drawImage(images.bg, 0, 0, 1000, 400);
  ctx.drawImage(images.mountain, 0, 0, 1000, 350);
  ctx.drawImage(images.bigMountain, 600, 0, 300, 300);
  ctx.drawImage(images.road, 0, 300, 1000, 200);

  drawTiled(ctx, images.bushes, bushesOffset, 0, 300);
  drawTiled(ctx, images.trees, treesOffset, 0, 300);

  for (const obs of obstacles) {
    if (!obs.collected) {
      ctx.drawImage(obs.img, obs.x, obs.y);
    }
  }

  ctx.drawImage(images.bus, BUS_X, busY, BUS_WIDTH, BUS_HEIGHT);

  ctx.font = '35px monospace';
  ctx.fillStyle = 'white';
  ctx.fillText(`Battery: ${score} kWh`, 30, 30);
}
