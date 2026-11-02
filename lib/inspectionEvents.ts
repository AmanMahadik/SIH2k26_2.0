// lib/inspectionEvents.ts
// Shared Server-Sent Events (SSE) broadcaster for EVC inspections

export interface SSEClient {
  id: string;
  controller: ReadableStreamDefaultController;
}

// Global active SSE subscribers
export const sseClients = new Set<SSEClient>();

export function broadcastInspectionEvent(event: {
  type: 'NEW_CAPTURE' | 'DECISION_UPDATED' | 'CENTROID_CALIBRATED' | 'MOCK_DETECTED';
  data: any;
}) {
  const message = `data: ${JSON.stringify({ ...event, broadcastAt: new Date().toISOString() })}\n\n`;
  const encoded = new TextEncoder().encode(message);

  for (const client of sseClients) {
    try {
      client.controller.enqueue(encoded);
    } catch {
      sseClients.delete(client);
    }
  }
}
