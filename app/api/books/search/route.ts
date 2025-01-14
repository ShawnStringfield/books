import { NextResponse } from "next/server";
import { updateMetrics } from "../../monitoring/rate-limits/metrics";

interface BookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
    publishedDate?: string;
    categories?: string[];
  };
}

interface BooksResponse {
  items: BookItem[];
  totalItems: number;
}

// Cache for 1 hour
const CACHE_DURATION = 60 * 60;
// Rate limit settings
const RATE_LIMIT = {
  tokens: 100, // requests
  interval: 60 * 60 * 1000, // 1 hour in ms
};

// In-memory stores
const rateLimitStore = new Map<string, { tokens: number; timestamp: number }>();
const cacheStore = new Map<string, { data: BooksResponse; expires: number }>();

function checkRateLimit(ip: string): boolean {
  console.log("Checking rate limit for IP:", ip);

  const now = Date.now();
  const userRateLimit = rateLimitStore.get(ip) || {
    tokens: RATE_LIMIT.tokens,
    timestamp: now,
  };

  // Reset tokens if interval has passed
  if (now - userRateLimit.timestamp >= RATE_LIMIT.interval) {
    userRateLimit.tokens = RATE_LIMIT.tokens;
    userRateLimit.timestamp = now;
  }

  const isLimited = userRateLimit.tokens <= 0;
  console.log("Rate limit check:", {
    ip,
    isLimited,
    remainingTokens: userRateLimit.tokens,
    nextReset: new Date(
      userRateLimit.timestamp + RATE_LIMIT.interval,
    ).toISOString(),
  });

  if (!isLimited) {
    userRateLimit.tokens--;
    rateLimitStore.set(ip, userRateLimit);
  }

  // Update metrics
  updateMetrics(ip, isLimited);

  return !isLimited;
}

function getCachedData(key: string): BooksResponse | null {
  const cached = cacheStore.get(key);
  if (!cached) return null;

  if (Date.now() > cached.expires) {
    cacheStore.delete(key);
    return null;
  }

  return cached.data;
}

function setCachedData(key: string, data: BooksResponse): void {
  cacheStore.set(key, {
    data,
    expires: Date.now() + CACHE_DURATION * 1000,
  });
}

export async function GET(request: Request) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

    const hasRemainingQuota = checkRateLimit(ip);
    if (!hasRemainingQuota) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(RATE_LIMIT.tokens),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(
              Math.floor(Date.now() / 1000) + RATE_LIMIT.interval / 1000,
            ),
          },
        },
      );
    }

    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre")?.toLowerCase();

    if (!genre) {
      return NextResponse.json(
        { error: "Genre parameter is required" },
        { status: 400 },
      );
    }

    // Create a cache key based on the genre
    const cacheKey = `books:${genre}`;

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_DURATION}`,
          "X-Cache": "HIT",
        },
      });
    }

    // Using server-side API key
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    if (!GOOGLE_API_KEY) {
      throw new Error("Google Books API key is not configured");
    }

    // If not in cache, fetch from Google Books API
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=4&key=${GOOGLE_API_KEY}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Books App/1.0",
        },
      },
    );

    if (!response.ok) {
      // Log the error for monitoring
      console.error(
        `Google Books API error: ${response.status} - ${response.statusText}`,
      );
      throw new Error(`Failed to fetch books: ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the response
    setCachedData(cacheKey, data);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_DURATION}`,
        "X-Cache": "MISS",
        "X-RateLimit-Limit": String(RATE_LIMIT.tokens),
        "X-RateLimit-Remaining": String(rateLimitStore.get(ip)?.tokens || 0),
        "X-RateLimit-Reset": String(
          Math.floor(
            (rateLimitStore.get(ip)?.timestamp || Date.now()) / 1000 +
              RATE_LIMIT.interval / 1000,
          ),
        ),
      },
    });
  } catch (error) {
    // Log error for monitoring
    console.error("Books API Error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes("Rate limit") ? 429 : 500 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
