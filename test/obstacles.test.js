import { describe, it, expect } from 'vitest';
import { makeObstacle, advanceObstacles } from '../js/obstacles.js';

const LANES = [330, 390, 450];
const CANVAS_W = 1000;
const SPEED = 300;
const DT = 1 / 60;

const mockChar = (isCharger = false) => ({ img: {}, width: 60, height: 40, isCharger });

describe('makeObstacle', () => {
  it('places obstacle at the given startX', () => {
    const obs = makeObstacle([mockChar()], LANES, 1000);
    expect(obs.x).toBe(1000);
  });

  it('places obstacle y within the lanes array', () => {
    const obs = makeObstacle([mockChar()], LANES, 1000);
    expect(LANES).toContain(obs.y);
  });

  it('starts uncollected with nextSpawned false', () => {
    const obs = makeObstacle([mockChar()], LANES, 1000);
    expect(obs.collected).toBe(false);
    expect(obs.nextSpawned).toBe(false);
  });

  it('inherits isCharger from the character definition', () => {
    const obs = makeObstacle([mockChar(true)], LANES, 1000);
    expect(obs.isCharger).toBe(true);
  });
});

describe('advanceObstacles', () => {
  it('moves obstacles left by speed * dt each frame', () => {
    const obs = makeObstacle([mockChar()], LANES, 1000);
    const [moved] = advanceObstacles([obs], DT, SPEED, CANVAS_W, [mockChar()], LANES);
    expect(moved.x).toBeCloseTo(1000 - SPEED * DT);
  });

  it('spawns a new obstacle when crossing the threshold', () => {
    // At x=905, one step of 5px pushes it to 900 (= CANVAS_W - SPAWN_THRESHOLD_X)
    const obs = { ...makeObstacle([mockChar()], LANES, 905), nextSpawned: false };
    const result = advanceObstacles([obs], DT, SPEED, CANVAS_W, [mockChar()], LANES);
    expect(result).toHaveLength(2);
  });

  it('does not spawn again after the flag is set', () => {
    const obs = { ...makeObstacle([mockChar()], LANES, 905), nextSpawned: false };
    const step1 = advanceObstacles([obs], DT, SPEED, CANVAS_W, [mockChar()], LANES);
    const step2 = advanceObstacles(step1, DT, SPEED, CANVAS_W, [mockChar()], LANES);
    expect(step2).toHaveLength(2);
  });

  it('removes collected obstacles', () => {
    const obs = { ...makeObstacle([mockChar()], LANES, 500), collected: true };
    const result = advanceObstacles([obs], DT, SPEED, CANVAS_W, [mockChar()], LANES);
    expect(result).toHaveLength(0);
  });

  it('removes obstacles that have scrolled off-screen', () => {
    const obs = { ...makeObstacle([mockChar()], LANES, -300), nextSpawned: true };
    const result = advanceObstacles([obs], DT, SPEED, CANVAS_W, [mockChar()], LANES);
    expect(result).toHaveLength(0);
  });
});
