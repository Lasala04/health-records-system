const requestCounts = new Map<string, number[]>();
const MAX_REQUESTS = 100; // per minute
const WINDOW = 60000; // 1 minute

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = requestCounts.get(ip) || [];
  
  // Remove old requests outside the window
  const recentRequests = requests.filter(time => now - time < WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  return true;
}