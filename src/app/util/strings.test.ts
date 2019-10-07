import 'jest';
import { toUpperCaseFirst } from './strings';

describe('toUpperCaseFirst', () => {
  it('should uppercase first letter', () => {
    expect(toUpperCaseFirst('fish')).toEqual('Fish');
    expect(toUpperCaseFirst('FISH')).toEqual('FISH');
    expect(toUpperCaseFirst('Fish')).toEqual('Fish');
  });
  it('should work with corner cases', () => {
    expect(toUpperCaseFirst('f')).toEqual('F');
    expect(toUpperCaseFirst('')).toEqual('');
    expect(toUpperCaseFirst('G')).toEqual('G');
  });
});
