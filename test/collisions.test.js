import { describe, it, expect } from 'vitest';
import { intersects } from '../js/collisions.js';

const box = (x, y, width, height) => ({ x, y, width, height });

describe('intersects', () => {
  it('returns true for partially overlapping boxes', () => {
    expect(intersects(box(0, 0, 50, 50), box(25, 25, 50, 50))).toBe(true);
  });

  it('returns true when one box fully contains the other', () => {
    expect(intersects(box(10, 10, 10, 10), box(0, 0, 100, 100))).toBe(true);
  });

  it('returns false for boxes touching edge-to-edge (no overlap)', () => {
    expect(intersects(box(0, 0, 50, 50), box(50, 0, 50, 50))).toBe(false);
  });

  it('returns false for boxes stacked vertically with no overlap', () => {
    expect(intersects(box(0, 0, 50, 50), box(0, 50, 50, 50))).toBe(false);
  });

  it('returns false for completely separate boxes', () => {
    expect(intersects(box(0, 0, 10, 10), box(100, 100, 10, 10))).toBe(false);
  });
});
