import type { Lang } from './types';

export type PageId =
  | 'time'
  | 'numbers'
  | 'identifiers'
  | 'colors'
  | 'bytesizes'
  | 'links'
  | 'pipeline'
  | 'cryptography'
  | 'pixeldensity';

export const routePaths: Record<PageId, Record<Lang, string>> = {
  time: { fi: '/p/aika', en: '/p/time' },
  numbers: { fi: '/p/numerot', en: '/p/symbols' },
  identifiers: { fi: '/p/tunnisteet', en: '/p/identifiers' },
  colors: { fi: '/p/värit', en: '/p/colors' },
  bytesizes: { fi: '/p/tavukoot', en: '/p/bytesizes' },
  links: { fi: '/p/linkit', en: '/p/links' },
  pipeline: { fi: '/p/tekstimuunnokset', en: '/p/textconversions' },
  cryptography: { fi: '/p/kryptografia', en: '/p/cryptography' },
  pixeldensity: { fi: '/p/pikselitiheys', en: '/p/pixeldensity' },
};

const aliasesByPage: Partial<Record<PageId, string[]>> = {
  numbers: ['/p/merkit'],
  bytesizes: ['/p/bytesize'],
};

const pathToId = new Map<string, PageId>();
(Object.keys(routePaths) as PageId[]).forEach(id => {
  pathToId.set(routePaths[id].fi, id);
  pathToId.set(routePaths[id].en, id);
  aliasesByPage[id]?.forEach(path => pathToId.set(path, id));
});

export function swapPathLang(pathname: string, target: Lang): string {
  const id = pathToId.get(pathname);
  if (!id) return pathname;
  return routePaths[id][target];
}

export function getPagePaths(page: PageId): string[] {
  return [routePaths[page].fi, routePaths[page].en, ...(aliasesByPage[page] ?? [])];
}
