import { LRUCache } from 'lru-cache';
import crypto from 'crypto';
import { Plan } from '../../shared/schemas.js';

const cache = new LRUCache<string, Plan>({
  max: 100,
  ttl: 1000 * 60 * 10, // 10 minutes
});

export function getCacheKey(prefix: string, data: unknown): string {
  const hash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  return `${prefix}:${hash}`;
}

export function getCachedResponse(key: string): Plan | undefined {
  return cache.get(key);
}

export function setCachedResponse(key: string, value: Plan): void {
  cache.set(key, value);
}
