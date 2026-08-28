// In-memory rate limiting store
const rateLimitMap = new Map<string, number[]>();

// Periodically clean up expired entries to prevent memory leaks
if (typeof globalThis !== "undefined" && !(globalThis as any)._rateLimitInterval) {
  (globalThis as any)._rateLimitInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of rateLimitMap.entries()) {
      // Keep entries up to 1 hour
      const filtered = timestamps.filter((ts) => now - ts < 3600000);
      if (filtered.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, filtered);
      }
    }
  }, 60000);

  // Prevent keeping Node.js process alive in CLI/build contexts
  if ((globalThis as any)._rateLimitInterval.unref) {
    (globalThis as any)._rateLimitInterval.unref();
  }
}

export function checkRateLimit(
  ip: string,
  limit: number,
  windowMs: number
): { success: boolean; limit: number; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = ip;

  let timestamps = rateLimitMap.get(key) || [];

  // Remove timestamps outside the sliding window
  timestamps = timestamps.filter((ts) => now - ts < windowMs);

  if (timestamps.length >= limit) {
    const oldestTimestamp = timestamps[0] || now;
    const resetTime = oldestTimestamp + windowMs;
    return {
      success: false,
      limit,
      remaining: 0,
      resetTime
    };
  }

  timestamps.push(now);
  rateLimitMap.set(key, timestamps);

  return {
    success: true,
    limit,
    remaining: limit - timestamps.length,
    resetTime: now + windowMs
  };
}

export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }
  return "127.0.0.1";
}
