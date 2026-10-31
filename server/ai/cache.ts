import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

const cache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 10, // 10 minutes
});

export function getCacheKey(prefix: string, data: any): string {
  const hash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  return `${prefix}:${hash}`;
}

export function getCachedResponse(key: string): any {
  return cache.get(key);
}

export function setCachedResponse(key: string, value: any): void {
  cache.set(key, value);
}
