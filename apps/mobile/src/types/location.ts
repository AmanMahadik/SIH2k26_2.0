// mobile-app/src/types/location.ts
// Statutory Location Types for NirikshAI 2.0 (AICTE APH 2024-27 §4.2.3)

export type SignalQuality = 'EXCELLENT' | 'GOOD' | 'WEAK' | 'NO_FIX';

export interface LocationState {
  lat: number;
  lng: number;
  accuracy: number;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
  address: string;
  isMocked: boolean;
  signalQuality: SignalQuality;
}

export type LocationPermissionState =
  | 'CHECKING'
  | 'GRANTED'
  | 'DENIED'
  | 'CAN_ASK_AGAIN'
  | 'SERVICES_DISABLED';
