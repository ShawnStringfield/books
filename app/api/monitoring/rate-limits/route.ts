import { NextResponse } from "next/server";
import { getMetrics } from "./metrics";

export async function GET() {
  return NextResponse.json(getMetrics(), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
