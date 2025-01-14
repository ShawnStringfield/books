import { NextResponse } from "next/server";

// Separate export for middleware usage
export { updateMetrics };

// Store rate limit metrics
interface RateLimitMetrics {
  totalRequests: number;
  limitExceeded: number;
  requestsByIP: Map<string, number>;
  lastReset: Date;
}

// In-memory store
const metrics: RateLimitMetrics = {
  totalRequests: 0,
  limitExceeded: 0,
  requestsByIP: new Map(),
  lastReset: new Date(),
};

// Store metrics in memory with a timestamp
let lastMetricsUpdate = Date.now();

function updateMetrics(ip: string, wasLimited: boolean) {
  console.log("Updating metrics:", {
    ip,
    wasLimited,
    beforeTotal: metrics.totalRequests,
  });

  metrics.totalRequests++;
  if (wasLimited) {
    metrics.limitExceeded++;
  }

  const currentRequests = metrics.requestsByIP.get(ip) || 0;
  metrics.requestsByIP.set(ip, currentRequests + 1);

  lastMetricsUpdate = Date.now();

  console.log("Metrics updated:", {
    totalRequests: metrics.totalRequests,
    limitExceeded: metrics.limitExceeded,
    requestsByIP: Object.fromEntries(metrics.requestsByIP),
    lastUpdate: new Date(lastMetricsUpdate).toISOString(),
  });
}

// Reset metrics daily
setInterval(
  () => {
    console.log("Resetting metrics");
    metrics.totalRequests = 0;
    metrics.limitExceeded = 0;
    metrics.requestsByIP.clear();
    metrics.lastReset = new Date();
    lastMetricsUpdate = Date.now();
  },
  24 * 60 * 60 * 1000,
);

export async function GET() {
  console.log("Getting metrics:", {
    totalRequests: metrics.totalRequests,
    limitExceeded: metrics.limitExceeded,
    requestsByIP: Object.fromEntries(metrics.requestsByIP),
    lastUpdate: new Date(lastMetricsUpdate).toISOString(),
  });

  // Convert Map to Object for JSON serialization
  const requestsByIP = Object.fromEntries(metrics.requestsByIP);

  return NextResponse.json(
    {
      totalRequests: metrics.totalRequests,
      limitExceeded: metrics.limitExceeded,
      requestsByIP,
      lastReset: metrics.lastReset,
      lastUpdate: lastMetricsUpdate,
      rateLimitPercentage:
        (metrics.limitExceeded / metrics.totalRequests) * 100 || 0,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
