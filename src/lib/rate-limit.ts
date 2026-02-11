const requests = new Map<string, number[]>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20;

export function rateLimit(ip: string): { limited: boolean } {
  const now = Date.now();
  const timestamps = requests.get(ip) ?? [];

  // Remove timestamps outside the window
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    requests.set(ip, recent);
    return { limited: true };
  }

  recent.push(now);
  requests.set(ip, recent);

  // Periodically prune stale entries (every ~100 requests)
  if (requests.size > 500) {
    Array.from(requests.entries()).forEach(([key, times]) => {
      const active = times.filter((t) => now - t < WINDOW_MS);
      if (active.length === 0) requests.delete(key);
      else requests.set(key, active);
    });
  }

  return { limited: false };
}
