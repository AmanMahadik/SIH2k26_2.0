// mobile-app/src/services/captureQueue.ts
// Offline-First Persistent Capture Queue for NirikshAI 2.0 (AICTE APH 2024-27)

import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface CaptureRecord {
  id: string;
  imageUri: string;
  imageHash: string;
  lat: number;
  lng: number;
  accuracy: number;
  geofenceStatus: 'COMPLIANT' | 'BREACH' | 'UNCERTAIN';
  distanceM: number;
  deviceId: string;
  officerId: string;
  officerName: string;
  campusName: string;
  labId: string;
  labName: string;
  labCode: string;
  clause: string;
  address: string;
  capturedAt: string; // UTC ISO
  appVersion: string;
  syncStatus: 'PENDING' | 'UPLOADING' | 'SYNCED' | 'FAILED';
  retryCount: number;
  blobUrl?: string;
}

const getApiBaseUrl = (): string => {
  const debuggerHost =
    Constants.expoConfig?.hostUri || (Constants as any).manifest2?.extra?.expoClient?.hostUri || '';
  const hostIp = debuggerHost ? debuggerHost.split(':')[0] : '';
  if (hostIp && hostIp !== 'localhost') {
    return `http://${hostIp}:3000`;
  }
  return 'http://50.0.7.112:3000';
};

class CaptureQueueService {
  private db: SQLite.SQLiteDatabase | null = null;
  private isSyncing = false;
  private memoryFallback: Map<string, CaptureRecord> = new Map();

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      if (Platform.OS !== 'web') {
        this.db = SQLite.openDatabaseSync('nirikshai_captures.db');
        this.db.execSync(`
          CREATE TABLE IF NOT EXISTS inspection_captures (
            id TEXT PRIMARY KEY,
            imageUri TEXT NOT NULL,
            imageHash TEXT NOT NULL UNIQUE,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            accuracy REAL NOT NULL,
            geofenceStatus TEXT NOT NULL,
            distanceM REAL NOT NULL,
            deviceId TEXT NOT NULL,
            officerId TEXT NOT NULL,
            officerName TEXT NOT NULL,
            campusName TEXT NOT NULL,
            labId TEXT NOT NULL,
            labName TEXT NOT NULL,
            labCode TEXT NOT NULL,
            clause TEXT NOT NULL,
            address TEXT NOT NULL,
            capturedAt TEXT NOT NULL,
            appVersion TEXT NOT NULL,
            syncStatus TEXT NOT NULL,
            retryCount INTEGER DEFAULT 0,
            blobUrl TEXT
          );
        `);
      }
    } catch (err) {
      console.warn('SQLite init warning, using memory fallback:', err);
    }
  }

  public async enqueueCapture(record: CaptureRecord): Promise<void> {
    if (this.db) {
      try {
        this.db.runSync(
          `INSERT OR REPLACE INTO inspection_captures (
            id, imageUri, imageHash, lat, lng, accuracy, geofenceStatus,
            distanceM, deviceId, officerId, officerName, campusName,
            labId, labName, labCode, clause, address, capturedAt,
            appVersion, syncStatus, retryCount, blobUrl
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            record.id,
            record.imageUri,
            record.imageHash,
            record.lat,
            record.lng,
            record.accuracy,
            record.geofenceStatus,
            record.distanceM,
            record.deviceId,
            record.officerId,
            record.officerName,
            record.campusName,
            record.labId,
            record.labName,
            record.labCode,
            record.clause,
            record.address,
            record.capturedAt,
            record.appVersion,
            record.syncStatus,
            record.retryCount,
            record.blobUrl || '',
          ]
        );
      } catch (err) {
        console.error('Error enqueuing capture to SQLite:', err);
        this.memoryFallback.set(record.id, record);
      }
    } else {
      this.memoryFallback.set(record.id, record);
    }

    // Trigger immediate sync in background if online
    this.syncQueue().catch(() => {});
  }

  public async getAllCaptures(): Promise<CaptureRecord[]> {
    if (this.db) {
      try {
        const rows = this.db.getAllSync<CaptureRecord>(
          `SELECT * FROM inspection_captures ORDER BY capturedAt DESC;`
        );
        return rows || [];
      } catch (err) {
        console.error('Error reading captures from SQLite:', err);
        return Array.from(this.memoryFallback.values()).reverse();
      }
    }
    return Array.from(this.memoryFallback.values()).reverse();
  }

  public async updateCaptureStatus(
    id: string,
    status: CaptureRecord['syncStatus'],
    blobUrl?: string
  ): Promise<void> {
    if (this.db) {
      try {
        this.db.runSync(
          `UPDATE inspection_captures 
           SET syncStatus = ?, blobUrl = COALESCE(?, blobUrl), retryCount = retryCount + 1 
           WHERE id = ?;`,
          [status, blobUrl || null, id]
        );
      } catch (err) {
        console.error('Error updating status in SQLite:', err);
      }
    }
    const mem = this.memoryFallback.get(id);
    if (mem) {
      mem.syncStatus = status;
      if (blobUrl) mem.blobUrl = blobUrl;
      mem.retryCount += 1;
    }
  }

  public async syncQueue(): Promise<{ synced: number; failed: number }> {
    if (this.isSyncing) return { synced: 0, failed: 0 };
    this.isSyncing = true;

    let synced = 0;
    let failed = 0;

    try {
      const net = await Network.getNetworkStateAsync();
      if (!net.isConnected || !net.isInternetReachable) {
        this.isSyncing = false;
        return { synced: 0, failed: 0 };
      }

      const allCaptures = await this.getAllCaptures();
      const pendingCaptures = allCaptures.filter(
        (c) => c.syncStatus === 'PENDING' || c.syncStatus === 'FAILED'
      );

      for (const cap of pendingCaptures) {
        try {
          await this.updateCaptureStatus(cap.id, 'UPLOADING');

          // 1. Check/Request SAS upload URL or use direct API fallback
          let uploadedBlobUrl = '';
          const baseUrl = getApiBaseUrl();

          try {
            const sasRes = await fetch(`${baseUrl}/api/inspections/sas`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imageHash: cap.imageHash,
                filename: `${cap.id}.jpg`,
                mimeType: 'image/jpeg',
              }),
            });

            if (sasRes.ok) {
              const sasData = await sasRes.json();
              if (sasData.uploadUrl) {
                // Upload binary blob via SAS URL
                const fileInfo = await FileSystem.getInfoAsync(cap.imageUri);
                if (fileInfo.exists) {
                  const uploadRes = await FileSystem.uploadAsync(sasData.uploadUrl, cap.imageUri, {
                    httpMethod: 'PUT',
                    headers: {
                      'x-ms-blob-type': 'BlockBlob',
                      'Content-Type': 'image/jpeg',
                    },
                  });
                  if (uploadRes.status === 200 || uploadRes.status === 201) {
                    uploadedBlobUrl = sasData.blobUrl;
                  }
                }
              }
            }
          } catch (sasErr) {
            // Non-fatal, continue with direct metadata submission
          }

          // 2. Submit capture metadata + proof to /api/inspections (Idempotency key = imageHash)
          const metaRes = await fetch(`${baseUrl}/api/inspections`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: cap.id,
              campus_name: cap.campusName,
              aicte_id: '1-23111191',
              lab_name: cap.labName,
              lab_code: cap.labCode,
              statutory_clause: cap.clause,
              address: cap.address,
              latitude: cap.lat,
              longitude: cap.lng,
              accuracy: cap.accuracy,
              distance_meters: cap.distanceM,
              geofence_status: cap.geofenceStatus,
              inspector_name: cap.officerName,
              sha256_seal: cap.imageHash,
              captured_at: cap.capturedAt,
              device_id: cap.deviceId,
              app_version: cap.appVersion,
              blob_url: uploadedBlobUrl,
            }),
          });

          if (metaRes.ok) {
            await this.updateCaptureStatus(cap.id, 'SYNCED', uploadedBlobUrl);
            synced++;
          } else {
            await this.updateCaptureStatus(cap.id, 'FAILED');
            failed++;
          }
        } catch (itemErr) {
          await this.updateCaptureStatus(cap.id, 'FAILED');
          failed++;
        }
      }
    } finally {
      this.isSyncing = false;
    }

    return { synced, failed };
  }
}

export const captureQueue = new CaptureQueueService();
