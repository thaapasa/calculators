import * as R from 'ramda';

export type EmptyObject = Record<string, never>;

export type MaybePromise<X> = X | Promise<X>;

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function isDefined(value: unknown): boolean {
  return value !== undefined && value !== null;
}

export function isNumber(value: unknown): boolean {
  return value !== undefined && value !== null && typeof value === 'number' && !isNaN(value);
}

export function isString(value: unknown): boolean {
  return value !== undefined && value !== null && typeof value === 'string';
}

export function isObject(value: unknown): boolean {
  return value !== undefined && value !== null && typeof value === 'object';
}

export function isArray(value: unknown): boolean {
  return Array.isArray(value);
}

export function flatten<T>(arr: T[][]): T[] {
  const res: T[] = [];
  arr.forEach(list => list.forEach(i => res.push(i)));
  return res;
}

export function noop(): void {
  return;
}

export function identity<T>(value: T): T {
  return value;
}

export function nonEmpty(value: any): boolean {
  return value && value.length && value.length > 0;
}

export function combine(a: unknown, b: unknown): string {
  return `${a}${b}`;
}

export function combineWith(separator: string): (a: unknown, b: unknown) => string {
  return (a: unknown, b: unknown) => `${a}${separator}${b}`;
}

export function pairsToObject<T>(pairs: Array<[string, T]>): Record<string, T> {
  const res: Record<string, T> = {};
  pairs.forEach(p => (res[p[0]] = p[1]));
  return res;
}

export function objectKeys<T extends object>(object: T): ReadonlyArray<keyof T> {
  return Object.keys(object) as unknown as ReadonlyArray<keyof T>;
}

export function mapObject<S, T, O, X extends { [k in keyof O]: S }>(
  f: (v: S, k: keyof X, obj: X) => T,
  obj: X,
): Record<keyof X, T> {
  return R.mapObjIndexed(f as any, obj) as Record<keyof X, T>;
}

export function allFieldsOfType<T>() {
  return <X extends Record<any, T>>(obj: X): Record<keyof X, T> => obj;
}

const consoleMethods = [
  'assert',
  'clear',
  'count',
  'debug',
  'dir',
  'dirxml',
  'error',
  'exception',
  'group',
  'groupCollapsed',
  'groupEnd',
  'info',
  'log',
  'markTimeline',
  'profile',
  'profileEnd',
  'table',
  'time',
  'timeEnd',
  'timeline',
  'timelineEnd',
  'timeStamp',
  'trace',
  'warn',
];

export function assertDefined<T>(t: T | undefined | null): asserts t is T {
  if (t === null || typeof t === 'undefined') {
    throw new Error(`Value is ${t}`);
  }
}

// Avoid `console` errors in browsers that lack a console.
export function fixConsole(): void {
  if (window.console === undefined) {
    (window as any).console = {};
  }
  const c = window.console as any;
  consoleMethods.forEach(method => {
    // Only stub undefined methods.
    if (!c[method]) {
      c[method] = noop;
    }
  });
}
