import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redisClientInstance: Redis | null = null;
let redisConnectionFailed = false;

// In-Memory Fallback Cache Store with TTL support
const inMemoryCacheStore = new Map<string, { value: any; expiresAt: number | null }>();

function cleanInMemoryCache() {
    const now = Date.now();
    for (const [key, item] of inMemoryCacheStore.entries()) {
        if (item.expiresAt !== null && item.expiresAt <= now) {
            inMemoryCacheStore.delete(key);
        }
    }
}

// Periodic cleanup for in-memory cache every 60 seconds
setInterval(cleanInMemoryCache, 60000);

export function getRedisClient(): Redis | null {
    if (redisConnectionFailed) return null;
    if (redisClientInstance) return redisClientInstance;

    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl || redisUrl.trim() === '') {
        return null;
    }

    try {
        redisClientInstance = new Redis(redisUrl, {
            connectTimeout: 4000,
            maxRetriesPerRequest: 1,
            enableOfflineQueue: false,
            retryStrategy(times) {
                if (times > 3) {
                    console.warn('Redis retry limit exceeded. Falling back to In-Memory cache.');
                    redisConnectionFailed = true;
                    return null;
                }
                return Math.min(times * 200, 1000);
            },
        });

        redisClientInstance.on('connect', () => {
            console.log('Successfully connected to Redis Cache instance!');
            redisConnectionFailed = false;
        });

        redisClientInstance.on('error', (err) => {
            console.warn('Redis client error:', err.message);
            if (err.message.includes('ECONNREFUSED') || err.message.includes('ETIMEDOUT')) {
                redisConnectionFailed = true;
            }
        });

        return redisClientInstance;
    } catch (err) {
        console.error('Failed to initialize Redis client:', err);
        redisConnectionFailed = true;
        return null;
    }
}

/**
 * Retrieve cached item by key from Redis (or In-Memory fallback).
 */
export async function getCache<T = any>(key: string): Promise<T | null> {
    const client = getRedisClient();

    if (client) {
        try {
            const data = await client.get(key);
            if (data) {
                return JSON.parse(data) as T;
            }
            return null;
        } catch (err) {
            console.warn(`Redis getCache error for key ${key}:`, err);
        }
    }

    // Fallback to In-Memory cache
    const cached = inMemoryCacheStore.get(key);
    if (cached) {
        if (cached.expiresAt === null || cached.expiresAt > Date.now()) {
            return cached.value as T;
        }
        inMemoryCacheStore.delete(key);
    }
    return null;
}

/**
 * Store an item in Redis cache with an optional TTL in seconds (default: 300s / 5 mins).
 */
export async function setCache(key: string, value: any, ttlSeconds = 300): Promise<boolean> {
    const client = getRedisClient();
    const serialized = JSON.stringify(value);

    if (client) {
        try {
            if (ttlSeconds > 0) {
                await client.set(key, serialized, 'EX', ttlSeconds);
            } else {
                await client.set(key, serialized);
            }
            return true;
        } catch (err) {
            console.warn(`Redis setCache error for key ${key}:`, err);
        }
    }

    // Fallback to In-Memory cache
    const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    inMemoryCacheStore.set(key, { value, expiresAt });
    return true;
}

/**
 * Delete a specific key or list of keys from cache.
 */
export async function delCache(keys: string | string[]): Promise<boolean> {
    const keyList = Array.isArray(keys) ? keys : [keys];
    if (keyList.length === 0) return true;

    const client = getRedisClient();
    if (client) {
        try {
            await client.del(...keyList);
        } catch (err) {
            console.warn('Redis delCache error:', err);
        }
    }

    // Clear from In-Memory fallback
    for (const k of keyList) {
        inMemoryCacheStore.delete(k);
    }
    return true;
}

/**
 * Flush/Invalidate all keys matching a prefix pattern (e.g., 'products:*')
 */
export async function invalidateCachePattern(pattern: string): Promise<boolean> {
    const client = getRedisClient();

    if (client) {
        try {
            const keys = await client.keys(pattern);
            if (keys.length > 0) {
                await client.del(...keys);
            }
        } catch (err) {
            console.warn(`Redis invalidateCachePattern error for ${pattern}:`, err);
        }
    }

    // Invalidate matching keys in in-memory store
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    for (const key of inMemoryCacheStore.keys()) {
        if (regex.test(key)) {
            inMemoryCacheStore.delete(key);
        }
    }
    return true;
}

/**
 * Check Redis Connection & Diagnostic Status
 */
export async function checkRedisConnection(): Promise<{
    connected: boolean;
    mode: 'Redis Server' | 'In-Memory Fallback Cache';
    message: string;
    keysCount: number;
}> {
    const client = getRedisClient();

    if (client && !redisConnectionFailed) {
        try {
            const pingRes = await client.ping();
            if (pingRes === 'PONG') {
                const keys = await client.keys('*');
                return {
                    connected: true,
                    mode: 'Redis Server',
                    message: 'Connected to Redis server instance!',
                    keysCount: keys.length,
                };
            }
        } catch (err: any) {
            console.warn('Redis ping check error:', err.message);
        }
    }

    return {
        connected: false,
        mode: 'In-Memory Fallback Cache',
        message: process.env.REDIS_URL
            ? 'REDIS_URL provided, but connection unreachable. Operating in high-speed In-Memory Cache mode.'
            : 'REDIS_URL not configured. Operating in high-speed In-Memory Cache mode.',
        keysCount: inMemoryCacheStore.size,
    };
}
