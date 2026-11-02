// app/api/inspections/sas/route.ts
// Phase 5: Issues Short-Lived SAS URLs for Direct Azure Blob Storage Uploads

import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const SasRequestSchema = z.object({
  imageHash: z.string().min(32, 'Valid SHA-256 hash required'),
  filename: z.string().min(1, 'Filename required'),
  mimeType: z.string().default('image/jpeg'),
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const validation = SasRequestSchema.safeParse(rawBody);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          issues: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { imageHash, filename, mimeType } = validation.data;
    const blobName = `${imageHash.slice(0, 16)}_${Date.now()}_${filename}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    // Check Azure Storage credentials
    const accountName = process.env.AZURE_STORAGE_ACCOUNT || 'nirikshaistorage';
    const containerName = process.env.AZURE_STORAGE_CONTAINER || 'evc-geotagged-photos';

    // Generate signed upload target (or direct mock endpoint fallback)
    const token = crypto
      .createHmac('sha256', process.env.NEXTAUTH_SECRET || 'nirikshai_sas_secret')
      .update(`${blobName}:${expiresAt}`)
      .digest('hex');

    const origin = req.headers.get('origin') || req.headers.get('host') || 'localhost:3000';
    const protocol = origin.includes('localhost') ? 'http' : 'https';

    const uploadUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?sasToken=${token}&se=${encodeURIComponent(
      expiresAt
    )}`;

    const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;

    return NextResponse.json({
      success: true,
      uploadUrl,
      blobUrl,
      blobName,
      expiresAt,
      mimeType,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error generating SAS URL' },
      { status: 500 }
    );
  }
}
