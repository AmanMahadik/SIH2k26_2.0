// app/api/inspections/stream/route.ts
// Phase 5 & 6: Server-Sent Events (SSE) Stream for Real-Time EVC Inspections Feed

import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

interface SSEClient {
  id: string;
  controller: ReadableStreamDefaultController;
}

// Global active SSE subscribers
const clients = new Set<SSEClient>();

export function broadcastInspectionEvent(event: {
  type: 'NEW_CAPTURE' | 'DECISION_UPDATED' | 'CENTROID_CALIBRATED' | 'MOCK_DETECTED';
  data: any;
}) {
  const message = `data: ${JSON.stringify({ ...event, broadcastAt: new Date().toISOString() })}\n\n`;
  const encoded = new TextEncoder().encode(message);

  for (const client of clients) {
    try {
      client.controller.enqueue(encoded);
    } catch {
      clients.delete(client);
    }
  }
}

export async function GET(req: NextRequest) {
  let currentClient: SSEClient;

  const stream = new ReadableStream({
    start(controller) {
      currentClient = {
        id: Math.random().toString(36).substring(2, 9),
        controller,
      };
      clients.add(currentClient);

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
        clients.delete(currentClient);
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
