import 'jest';

import * as n from './numbers';

describe('Numbers', () => {
  describe('binary string -> int', () => {
    it('should work for valid input', () => {
      expect(n.binaryStrToInt('1')).toEqual(1);
      expect(n.binaryStrToInt('10')).toEqual(2);
      expect(n.binaryStrToInt('1111')).toEqual(15);
      expect(n.binaryStrToInt('10000')).toEqual(16);
      expect(n.binaryStrToInt('100000000')).toEqual(256);
    });
    it('should leave numbers as-is', () => {
      expect(n.binaryStrToInt(123)).toEqual(123);
    });
    it('should fail correctly for invalid input', () => {
      expect(n.binaryStrToInt('')).toBeNaN();
      expect(n.binaryStrToInt('102')).toBeNaN();
      expect(n.binaryStrToInt('abc')).toBeNaN();
      expect(n.binaryStrToInt('abc')).toBeNaN();
      expect(n.binaryStrToInt(null as any)).toBeNaN();
      expect(n.binaryStrToInt(undefined as any)).toBeNaN();
      expect(n.binaryStrToInt({ a: 1 } as any)).toBeNaN();
    });
  });

  describe('int -> binary string', () => {
    it('should work for valid input', () => {
      expect(n.intToBinaryStr(0)).toEqual('0');
      expect(n.intToBinaryStr(1)).toEqual('1');
      expect(n.intToBinaryStr(5)).toEqual('101');
      expect(n.intToBinaryStr(127)).toEqual('1111111');
    });
  });
});
