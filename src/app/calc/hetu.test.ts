import { describe, expect, it } from 'vitest';

import { check, generate } from './hetu';

describe('hetu', () => {
  describe('check', () => {
    it('gives the check character', () => {
      expect(check('131052-308')).toEqual('T');
      expect(check('010101A123')).not.toEqual('');
    });

    it('accepts the separators added in 2023', () => {
      for (const sep of ['Y', 'X', 'W', 'V', 'U']) {
        expect(check(`131052${sep}308`)).toEqual('T');
      }
      for (const sep of ['A', 'B', 'C', 'D', 'E', 'F']) {
        expect(check(`010105${sep}123`)).toEqual(check('010105A123'));
      }
    });

    it('rejects an unknown separator', () => {
      expect(check('131052Z308')).toEqual('');
      expect(check('131052a308')).toEqual('');
    });

    it('rejects a date that does not exist', () => {
      expect(check('319999-123')).toEqual('');
      expect(check('310452-308')).toEqual('');
      expect(check('000152-308')).toEqual('');
    });

    it('uses the century of the separator for leap years', () => {
      expect(check('290200A123')).not.toEqual('');
      expect(check('290200-123')).toEqual('');
      expect(check('290296-123')).not.toEqual('');
    });

    it('rejects input of the wrong shape', () => {
      expect(check('')).toEqual('');
      expect(check('131052-30')).toEqual('');
      expect(check('131052-308T')).toEqual('');
      expect(check('13105a-308')).toEqual('');
    });
  });

  describe('generate', () => {
    const generated = Array.from({ length: 5000 }, generate);

    it('generates a hetu that passes the check', () => {
      for (const hetu of generated) {
        expect(check(hetu), hetu).not.toEqual('');
      }
    });

    it('generates every day of the month', () => {
      const days = new Set(generated.map(h => h.slice(0, 2)));
      expect(days.has('29')).toBe(true);
      expect(days.has('30')).toBe(true);
      expect(days.has('31')).toBe(true);
    });

    it('uses an individual number from 002 to 899', () => {
      for (const hetu of generated) {
        const order = Number(hetu.slice(7));
        expect(order).toBeGreaterThanOrEqual(2);
        expect(order).toBeLessThanOrEqual(899);
      }
    });
  });
});
