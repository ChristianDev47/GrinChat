import { StreamClient } from '@stream-io/node-sdk';
import { config } from 'dotenv';
config();

const apiKey = process.env.STREAM_API_KEY;
const secret = process.env.STREAM_API_SECRET;

if (!apiKey || !secret) {
  throw new Error('STREAM_API_KEY and STREAM_API_SECRET must be defined');
}

export const client = new StreamClient(apiKey, secret);
