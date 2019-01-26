import * as luhn from 'luhn-js';

export const checkLuhn = (str: string) => {
  try {
    const fullValue = luhn.generate(str);
    return fullValue && fullValue.length > str.length
      ? fullValue[fullValue.length - 1]
      : '-';
  } catch (e) {
    return '-';
  }
};
