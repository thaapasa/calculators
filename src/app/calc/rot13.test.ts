import 'jest';

import rot13 from './rot13';

describe('ROT-13', () => {
  it('should calculate empty string correctly', () => {
    expect(rot13('')).toEqual('');
  });
  it('should calculate rotate correctly', () => {
    expect(rot13('abc')).toEqual('nop');
    expect(rot13('TheTest&!String')).toEqual('GurGrfg&!Fgevat');
    expect(rot13('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')).toEqual(
      'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm',
    );
  });
});
