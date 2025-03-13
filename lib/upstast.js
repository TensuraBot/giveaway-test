// lib/upstash.js
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.notable-grouper-61858.upstash.io,
  token: process.env.AfGiAAIjcDFjZDY1Mjg4ZjZiM2U0YzY5YThkZDk3NTgxZTZiNWU3YXAxMA,
});

export default redis;
