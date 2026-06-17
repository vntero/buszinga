import { SPAWN_THRESHOLD_X } from './constants.js';

export function makeObstacle(characters, lanes, startX) {
  const char = characters[Math.floor(Math.random() * characters.length)];
  return {
    img: char.img,
    width: char.width,
    height: char.height,
    isCharger: char.isCharger,
    x: startX,
    y: lanes[Math.floor(Math.random() * lanes.length)],
    collected: false,
    nextSpawned: false,
  };
}

export function advanceObstacles(obstacles, dt, speed, canvasWidth, characters, lanes) {
  let newSpawn = null;

  const advanced = obstacles.map(obs => {
    const next = { ...obs, x: obs.x - speed * dt };
    if (!obs.nextSpawned && !obs.collected && next.x <= canvasWidth - SPAWN_THRESHOLD_X) {
      newSpawn = makeObstacle(characters, lanes, canvasWidth + 75);
      return { ...next, nextSpawned: true };
    }
    return next;
  });

  const compacted = advanced.filter(obs => !obs.collected && obs.x > -(obs.width + 50));

  return newSpawn ? [...compacted, newSpawn] : compacted;
}
