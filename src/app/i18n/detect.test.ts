// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { detectInitialLang, LANGUAGE_STORAGE_KEY } from './detect';

function setHostname(hostname: string) {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...window.location, hostname },
  });
}

describe('detectInitialLang', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('honors localStorage override ahead of hostname', () => {
    setHostname('calculators.pomeranssi.fi');
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify('fi'));
    expect(detectInitialLang()).toBe('fi');

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify('en'));
    setHostname('laskurit.pomeranssi.fi');
    expect(detectInitialLang()).toBe('en');
  });

  it('picks English for the calculators.* hostname when storage is empty', () => {
    setHostname('calculators.pomeranssi.fi');
    expect(detectInitialLang()).toBe('en');
  });

  it('picks Finnish for the laskurit.* hostname when storage is empty', () => {
    setHostname('laskurit.pomeranssi.fi');
    expect(detectInitialLang()).toBe('fi');
  });

  it('falls back to Finnish for unrecognized hostnames', () => {
    setHostname('localhost');
    expect(detectInitialLang()).toBe('fi');
  });

  it('ignores malformed localStorage values', () => {
    setHostname('calculators.pomeranssi.fi');
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify('de'));
    expect(detectInitialLang()).toBe('en');
  });
});
