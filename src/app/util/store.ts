const dummyStore = {};

export function putValue<T>(key: string, value: T): void {
  if (window.localStorage) {
    window.localStorage.setItem(key, JSON.stringify(value));
  } else {
    dummyStore[key] = value;
  }
}

export function getValue<T>(key: string): T | null {
  if (window.localStorage) {
    try {
      const v = window.localStorage.getItem(key);
      return v !== null ? (JSON.parse(v) as T) : null;
    } catch (e) {
      return null;
    }
  } else {
    return dummyStore[key];
  }
}
