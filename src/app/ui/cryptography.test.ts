import crypto from 'node:crypto';

import { hash } from 'app/util/hash';
import md5 from 'md5';
import { describe, expect, it, vi } from 'vitest';

vi.stubGlobal('crypto', {
  subtle: {
    digest: async (algorithm: string, data: Uint8Array) => {
      const hash = crypto.createHash(algorithm.replaceAll('-', '').toLowerCase());
      hash.update(Buffer.from(data));
      return new Uint8Array(hash.digest()).buffer;
    },
  },
});

describe('MD5', () => {
  it('should calculate empty string correctly', () => {
    expect(md5('')).toEqual('d41d8cd98f00b204e9800998ecf8427e');
  });
  it('should calculate hash correctly', async () => {
    expect(md5('abc')).toEqual('900150983cd24fb0d6963f7d28e17f72');
    expect(md5('TheTest&!String')).toEqual('10397b78536d4e37ff52f1320bb59e39');
  });
});

describe('SHA1', () => {
  it('should calculate empty string correctly', async () => {
    await expect(hash('', 'SHA-1')).resolves.toEqual('da39a3ee5e6b4b0d3255bfef95601890afd80709');
  });
  it('should calculate hash correctly', async () => {
    await expect(hash('abc', 'SHA-1')).resolves.toEqual('a9993e364706816aba3e25717850c26c9cd0d89d');
    await expect(hash('TheTest&!String', 'SHA-1')).resolves.toEqual(
      '8a9ebf68025c745d1d842f990deb07ceb6c4b515',
    );
  });
});

describe('SHA512', () => {
  it('should calculate empty string correctly', async () => {
    await expect(hash('', 'SHA-512')).resolves.toEqual(
      'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
    );
  });
  it('should calculate hash correctly', async () => {
    await expect(hash('abc', 'SHA-512')).resolves.toEqual(
      'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
    );
    await expect(hash('TheTest&!String', 'SHA-512')).resolves.toEqual(
      'ae3d76f072bd8de320e883e751c45f14b144b90cce3d4151a525056bec77b3bcc365fd984f33be91a5a0c009140b491263933d64bf54e6bb5b1dae856ec5d5cb',
    );
  });
});
