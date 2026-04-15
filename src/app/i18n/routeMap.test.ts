import { describe, expect, it } from 'vitest';

import { routePaths, swapPathLang } from './routeMap';

describe('routeMap', () => {
  describe('swapPathLang', () => {
    it('round-trips canonical FI and EN paths for every page', () => {
      for (const { fi, en } of Object.values(routePaths)) {
        expect(swapPathLang(fi, 'en')).toBe(en);
        expect(swapPathLang(en, 'fi')).toBe(fi);
      }
    });

    it('returns the same path when target equals source language', () => {
      expect(swapPathLang('/p/time', 'en')).toBe('/p/time');
      expect(swapPathLang('/p/aika', 'fi')).toBe('/p/aika');
    });

    it('resolves legacy aliases to canonical target', () => {
      expect(swapPathLang('/p/merkit', 'en')).toBe('/p/symbols');
      expect(swapPathLang('/p/merkit', 'fi')).toBe('/p/numerot');
      expect(swapPathLang('/p/bytesize', 'en')).toBe('/p/bytesizes');
      expect(swapPathLang('/p/bytesize', 'fi')).toBe('/p/tavukoot');
    });

    it('passes through unknown paths unchanged', () => {
      expect(swapPathLang('/', 'en')).toBe('/');
      expect(swapPathLang('/', 'fi')).toBe('/');
      expect(swapPathLang('/does-not-exist', 'en')).toBe('/does-not-exist');
    });
  });
});
