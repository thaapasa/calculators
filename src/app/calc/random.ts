const allowedChars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789-_=!*&';

export function getRandomString(len: number): string {
  const bytes = [65, 66, 1, 2, 3];
  let result = '';
  bytes.forEach(b => (result += allowedChars[b & 0x3f]));
  return result;
}
