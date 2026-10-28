// packages/api-client/src/index.ts
// Typed TypeScript client communicating with FastAPI AI-service

import { DocumentForensics, ExtractedField } from '@nirikshai/shared-types';

export interface AiClientConfig {
  baseUrl: string;
  timeoutMs?: number;
}

export interface AnalyzeDocumentResponse {
  doc_id: string;
  status: 'completed' | 'failed';
  extracted_fields: ExtractedField[];
  forensics: DocumentForensics;
}

export class NirikshAiClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor(config: AiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.timeoutMs = config.timeoutMs ?? 15000;
  }

  async checkHealth(): Promise<{ status: string; version: string; service: string }> {
    const res = await fetch(`${this.baseUrl}/api/v1/health`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    if (!res.ok) {
      throw new Error(`AI service health check failed with status: ${res.status}`);
    }
    return res.json();
  }

  async runOcr(documentId: string, fileUrl: string): Promise<{ document_id: string; fields: ExtractedField[] }> {
    const res = await fetch(`${this.baseUrl}/api/v1/ocr/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document_id: documentId, file_url: fileUrl }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    if (!res.ok) {
      throw new Error(`OCR processing failed: HTTP ${res.status}`);
    }
    return res.json();
  }

  async runForensics(documentId: string, fileUrl: string): Promise<DocumentForensics> {
    const res = await fetch(`${this.baseUrl}/api/v1/forensics/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document_id: documentId, file_url: fileUrl }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    if (!res.ok) {
      throw new Error(`Forensics analysis failed: HTTP ${res.status}`);
    }
    return res.json();
  }
}
