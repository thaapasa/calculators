export type JsonPathSegment = string | number;

/**
 * Parse a path string into segments. Accepts:
 *   - dotted: `a.b.c`, `a.b[0].c`, optional leading `$` or `$.`
 *   - JSON Pointer: `/a/b/0`
 *   - bracketed quoted keys: `a["b.c"][0]`, `a['b.c']`
 */
export function parseJsonPath(path: string): JsonPathSegment[] {
  const trimmed = path.trim();
  if (!trimmed || trimmed === '$' || trimmed === '.') return [];
  if (trimmed.startsWith('/')) {
    return trimmed
      .slice(1)
      .split('/')
      .map(seg => {
        const decoded = seg.replace(/~1/g, '/').replace(/~0/g, '~');
        return /^\d+$/.test(decoded) ? Number(decoded) : decoded;
      });
  }
  let s = trimmed.startsWith('$') ? trimmed.slice(1) : trimmed;
  if (s.startsWith('.')) s = s.slice(1);
  const parts: JsonPathSegment[] = [];
  let i = 0;
  let expectKey = true;
  while (i < s.length) {
    const ch = s[i];
    if (ch === '.') {
      if (expectKey) throw new Error(`Invalid path syntax: "${path}"`);
      expectKey = true;
      i++;
      continue;
    }
    if (ch === '[') {
      const end = s.indexOf(']', i + 1);
      if (end === -1) throw new Error(`Unclosed bracket in path: "${path}"`);
      const inner = s.slice(i + 1, end);
      if (/^\d+$/.test(inner)) {
        parts.push(Number(inner));
      } else if (
        (inner.startsWith('"') && inner.endsWith('"')) ||
        (inner.startsWith("'") && inner.endsWith("'"))
      ) {
        parts.push(inner.slice(1, -1));
      } else {
        throw new Error(`Invalid bracket segment "[${inner}]" in path: "${path}"`);
      }
      expectKey = false;
      i = end + 1;
      continue;
    }
    let j = i;
    while (j < s.length && s[j] !== '.' && s[j] !== '[') j++;
    if (j === i) throw new Error(`Invalid path syntax: "${path}"`);
    const seg = s.slice(i, j);
    parts.push(/^\d+$/.test(seg) ? Number(seg) : seg);
    expectKey = false;
    i = j;
  }
  if (expectKey && parts.length > 0) throw new Error(`Trailing dot in path: "${path}"`);
  return parts;
}

/** Get value at path. Returns `undefined` if any segment is missing. */
export function getAtPath(root: unknown, path: JsonPathSegment[]): unknown {
  let cur: unknown = root;
  for (const seg of path) {
    if (cur === null || cur === undefined) return undefined;
    if (typeof seg === 'number') {
      if (!Array.isArray(cur)) return undefined;
      cur = cur[seg];
    } else {
      if (typeof cur !== 'object' || Array.isArray(cur)) return undefined;
      cur = (cur as Record<string, unknown>)[seg];
    }
  }
  return cur;
}

/** Set value at path. Returns a new root with structural sharing along the path. */
export function setAtPath(root: unknown, path: JsonPathSegment[], value: unknown): unknown {
  if (path.length === 0) return value;
  const firstNumeric = typeof path[0] === 'number';
  const rootClone =
    root === null || root === undefined
      ? firstNumeric
        ? []
        : {}
      : Array.isArray(root)
        ? [...root]
        : typeof root === 'object'
          ? { ...(root as Record<string, unknown>) }
          : firstNumeric
            ? []
            : {};
  let cur: Record<string | number, unknown> = rootClone as Record<string | number, unknown>;
  for (let i = 0; i < path.length - 1; i++) {
    const seg = path[i];
    const next = path[i + 1];
    const wantArray = typeof next === 'number';
    let child = cur[seg];
    if (child === null || child === undefined || typeof child !== 'object') {
      child = wantArray ? [] : {};
    } else {
      child = Array.isArray(child) ? [...child] : { ...(child as Record<string, unknown>) };
    }
    cur[seg] = child;
    cur = child as Record<string | number, unknown>;
  }
  cur[path[path.length - 1]] = value;
  return rootClone;
}

/** Render an extracted JSON value as text — primitive strings unquoted. */
export function renderExtractedValue(value: unknown): string {
  if (value === undefined) return '';
  if (typeof value === 'string') return value;
  if (value === null) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

/** Coerce a text value to a JSON-compatible value. Tries JSON.parse first, falls back to string. */
export function coerceJsonValue(text: string, mode: 'auto' | 'string' | 'json'): unknown {
  if (mode === 'string') return text;
  if (mode === 'json') return JSON.parse(text);
  const trimmed = text.trim();
  if (trimmed === '') return text;
  try {
    return JSON.parse(trimmed);
  } catch {
    return text;
  }
}
