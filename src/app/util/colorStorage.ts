import * as store from 'app/util/store';

export interface StoredColor {
  name: string;
  hex: string;
}

const COLORS_STORE_KEY = 'calculators:colors';

export function getColorsFromStore(): StoredColor[] {
  return store.getValue(COLORS_STORE_KEY) || [];
}

export function storeColors(colors: StoredColor[]) {
  store.putValue(COLORS_STORE_KEY, colors);
}
