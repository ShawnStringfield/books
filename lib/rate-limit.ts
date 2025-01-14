// Simple in-memory cache implementation
interface CacheItem<T> {
  value: T;
  expires: number;
}

interface RateLimitRecord {
  count: number;
  expires: number;
}

const cache = new Map<string, CacheItem<unknown>>();
const rateLimitCache = new Map<string, RateLimitRecord>();

export interface RateLimitConfig {
  interval: number;
  uniqueTokenPerInterval: number;
}

export function setCache<T>(key: string, value: T, expiresIn: number): void {
  cache.set(key, {
    value,
    expires: Date.now() + expiresIn * 1000,
  });
}

export function getCache<T>(key: string): T | null {
  const item = cache.get(key) as CacheItem<T> | undefined;
  if (!item) return null;

  if (Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }

  return item.value;
}

export async function rateLimit(config: RateLimitConfig) {
  const { interval } = config;

  return {
    check: async (limit: number, identifier: string): Promise<boolean> => {
      const now = Date.now();
      const key = `ratelimit:${identifier}`;

      let record = rateLimitCache.get(key);

      if (!record || now > record.expires) {
        record = { count: 0, expires: now + interval };
      }

      record.count++;
      rateLimitCache.set(key, record);

      if (record.count > limit) {
        throw new Error("Rate limit exceeded");
      }

      return true;
    },
  };
}
