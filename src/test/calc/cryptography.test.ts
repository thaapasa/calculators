import { hash } from '../../app/ui/cryptography';

describe('MD5', () => {
  it('should calculate empty string correctly', () => {
    expect(hash('', 'md5')).toEqual('d41d8cd98f00b204e9800998ecf8427e');
  });
  it('should calculate hash correctly', () => {
    expect(hash('abc', 'md5')).toEqual('900150983cd24fb0d6963f7d28e17f72');
    expect(hash('TheTest&!String', 'md5')).toEqual(
      '10397b78536d4e37ff52f1320bb59e39'
    );
  });
});

describe('SHA1', () => {
  it('should calculate empty string correctly', () => {
    expect(hash('', 'sha1')).toEqual(
      'da39a3ee5e6b4b0d3255bfef95601890afd80709'
    );
  });
  it('should calculate hash correctly', () => {
    expect(hash('abc', 'sha1')).toEqual(
      'a9993e364706816aba3e25717850c26c9cd0d89d'
    );
    expect(hash('TheTest&!String', 'sha1')).toEqual(
      '8a9ebf68025c745d1d842f990deb07ceb6c4b515'
    );
  });
});

describe('SHA512', () => {
  it('should calculate empty string correctly', () => {
    expect(hash('', 'sha512')).toEqual(
      'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'
    );
  });
  it('should calculate hash correctly', () => {
    expect(hash('abc', 'sha512')).toEqual(
      'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f'
    );
    expect(hash('TheTest&!String', 'sha512')).toEqual(
      'ae3d76f072bd8de320e883e751c45f14b144b90cce3d4151a525056bec77b3bcc365fd984f33be91a5a0c009140b491263933d64bf54e6bb5b1dae856ec5d5cb'
    );
  });
});
