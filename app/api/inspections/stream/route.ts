// app/api/inspections/stream/route.ts
// Phase 5 & 6: Server-Sent Events (SSE) Stream for Real-Time EVC Inspections Feed

import { NextRequest } from 'next/server';
import { sseClients, SSEClient } from '@/lib/inspectionEvents';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  let currentClient: SSEClient;

  const stream = new ReadableStream({
    start(controller) {
      currentClient = {
        id: Math.random().toString(36).substring(2, 9),
        controller,
      };
      sseClients.add(currentClient);

      // Initial connection greeting
      controller.enqueue(
        new TextEncoder().encode(
          `data: ${JSON.stringify({
            type: 'CONNECTED',
            message: 'AICTE Central Real-Time Scrutiny Stream Active',
            timestamp: new Date().toISOString(),
          })}\n\n`
        )
      );
    },
    cancel() {
      if (currentClient) {
        sseClients.delete(currentClient);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
