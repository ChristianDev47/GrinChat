import pako from 'pako';
import { Base64 } from 'js-base64';
import { User } from '../types/user';

export const compressUser = (data: User) => {
  const compressed = pako.deflate(JSON.stringify(data));
  const compressedArray = Array.from(compressed);
  const compressedString = String.fromCharCode.apply(null, compressedArray);
  return Base64.encode(compressedString);
};

export const decompress = (data: string) => {
  const decoded = Base64.decode(data);
  const inflated = Uint8Array.from(decoded, (c) => c.charCodeAt(0));
  const decompressed = pako.inflate(inflated);
  const inflatedString = new TextDecoder().decode(decompressed);
  return JSON.parse(inflatedString);
};
