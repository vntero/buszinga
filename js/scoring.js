import { intersects } from './collisions.js';
import { CHARGER_POINTS } from './constants.js';

export function applyCollisions(busBounds, obstacles) {
  let scoreGained = 0;
  let gameOver = false;

  const next = obstacles.map(obs => {
    if (obs.collected || !intersects(busBounds, obs)) return obs;
    if (obs.isCharger) {
      scoreGained += CHARGER_POINTS;
      return { ...obs, collected: true };
    }
    gameOver = true;
    return obs;
  });

  return { obstacles: next, scoreGained, gameOver };
}
