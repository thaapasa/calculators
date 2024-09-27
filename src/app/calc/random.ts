const allowedChars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789-_=!*&';

export function getRandomString(len: number): string {
  const randomValues = new Uint8Array(len);
  crypto.getRandomValues(randomValues);
  let result = '';
  randomValues.forEach(b => (result += allowedChars[b & 0x3f]));
  return result;
}
