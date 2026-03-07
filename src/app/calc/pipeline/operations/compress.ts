import { binaryData, OperationDef, toBinary } from '../types';

async function transformStream(
  data: Uint8Array,
  stream: CompressionStream | DecompressionStream,
): Promise<Uint8Array> {
  // Write and read concurrently to avoid deadlock when internal buffers fill up
  const writer = stream.writable.getWriter();
  const writePromise = writer.write(data as unknown as BufferSource).then(() => writer.close());

  const chunks: Uint8Array[] = [];
  const reader = stream.readable.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  await writePromise;

  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

export const gzipCompressOp: OperationDef = {
  id: 'gzip-compress',
  name: 'Gzip-pakkaus',
  category: 'compress',
  process: async input =>
    binaryData(await transformStream(toBinary(input), new CompressionStream('gzip'))),
};

export const gzipDecompressOp: OperationDef = {
  id: 'gzip-decompress',
  name: 'Gzip-purku',
  category: 'compress',
  process: async input =>
    binaryData(await transformStream(toBinary(input), new DecompressionStream('gzip'))),
};

export const compressOperations: OperationDef[] = [gzipCompressOp, gzipDecompressOp];
