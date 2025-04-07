import { NextResponse } from 'next/server';

/**
 * Simple ping endpoint that returns a timestamp
 * Used for measuring network latency
 */
export async function GET() {
  return NextResponse.json({ 
    timestamp: Date.now(),
    status: 'ok'
  });
}
