import { describe, it, expect } from 'vitest';
import { applyCollisions } from '../js/scoring.js';

// Bus at its default position
const bus = { x: 20, y: 320, width: 70, height: 40 };

// obs overlapping the bus (x=50,y=330 puts it squarely inside bus bounds)
const makeObs = (x, y, isCharger, collected = false) => ({
  x,
  y,
  width: 60,
  height: 40,
  isCharger,
  collected,
});

describe('applyCollisions', () => {
  it('awards points and marks charger collected on hit', () => {
    const obs = makeObs(50, 330, true);
    const { obstacles, scoreGained, gameOver } = applyCollisions(bus, [obs]);
    expect(scoreGained).toBe(10);
    expect(obstacles[0].collected).toBe(true);
    expect(gameOver).toBe(false);
  });

  it('triggers game over on hazard collision', () => {
    const obs = makeObs(50, 330, false);
    const { scoreGained, gameOver } = applyCollisions(bus, [obs]);
    expect(gameOver).toBe(true);
    expect(scoreGained).toBe(0);
  });

  it('ignores non-overlapping obstacles', () => {
    const obs = makeObs(500, 330, true);
    const { scoreGained, gameOver } = applyCollisions(bus, [obs]);
    expect(scoreGained).toBe(0);
    expect(gameOver).toBe(false);
  });

  it('does not rescore an already collected charger', () => {
    const obs = makeObs(50, 330, true, true);
    const { scoreGained } = applyCollisions(bus, [obs]);
    expect(scoreGained).toBe(0);
  });
});
