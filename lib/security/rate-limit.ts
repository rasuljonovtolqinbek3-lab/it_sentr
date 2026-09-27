export class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private limit: number;
  private windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  check(ip: string): boolean {
    const now = Date.now();
    const record = this.requests.get(ip);

    if (!record) {
      this.requests.set(ip, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (now > record.resetTime) {
      this.requests.set(ip, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (record.count >= this.limit) {
      return false; // Rate limit exceeded
    }

    record.count++;
    return true;
  }
}

// 20 requests per minute per IP for verification endpoint
export const verifyRateLimiter = new RateLimiter(20, 60 * 1000);

// 5 requests per 10 minutes per IP for admin login
export const loginRateLimiter = new RateLimiter(5, 10 * 60 * 1000);

// 20 requests per 10 minutes for admin mutations
export const adminMutationRateLimiter = new RateLimiter(20, 10 * 60 * 1000);

// 60 requests per 1 minute for admin audit GET
export const auditGetRateLimiter = new RateLimiter(60, 60 * 1000);
