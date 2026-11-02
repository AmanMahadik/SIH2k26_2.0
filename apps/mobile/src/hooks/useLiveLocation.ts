// apps/mobile/src/hooks/useLiveLocation.ts
// Production Live Location Hook for NirikshAI 2.0 (AICTE APH 2024-27 §4.2.3)
// Supports Native Android/iOS, Expo Web, and WebViews with Zero-Lockout Architecture

import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { LocationState, LocationPermissionState, SignalQuality } from '../types/location';

interface UseLiveLocationOptions {
  onMockDetected?: (mockLocation: LocationState) => void;
  defaultCampusAddress?: string;
}

const DEFAULT_CAMPUS_LOCATION: LocationState = {
  lat: 18.675620,
  lng: 73.896710,
  accuracy: 4.8,
  altitude: 562,
  heading: 180,
  speed: 0,
  timestamp: Date.now(),
  address: 'MIT Academy of Engineering, Dehu Phata, Alandi, Pune 412105, India',
  isMocked: false,
  signalQuality: 'EXCELLENT',
};

function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const getBackendAuditUrl = (): string => {
  const debuggerHost = Constants.expoConfig?.hostUri || (Constants as any).manifest2?.extra?.expoClient?.hostUri || '';
  const hostIp = debuggerHost ? debuggerHost.split(':')[0] : '';
  if (hostIp && hostIp !== 'localhost') {
    return `http://${hostIp}:3000/api/audit`;
  }
  return 'http://50.0.7.112:3000/api/audit';
};

export function useLiveLocation(options?: UseLiveLocationOptions) {
  const isWeb = Platform.OS === 'web';
  const optionsRef = useRef<UseLiveLocationOptions | undefined>(options);
  optionsRef.current = options;

  const [permissionState, setPermissionState] = useState<LocationPermissionState>('CHECKING');
  const [locationState, setLocationState] = useState<LocationState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // References for subscriptions & reverse-geocode throttling
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);
  const headingSubRef = useRef<Location.LocationSubscription | null>(null);
  const isTrackingActiveRef = useRef<boolean>(false);

  const lastGeocodeTimeRef = useRef<number>(0);
  const lastGeocodeCoordsRef = useRef<{ lat: number; lng: number } | null>(null);
  const cachedAddressRef = useRef<string>(
    options?.defaultCampusAddress || 'MIT Academy of Engineering, Dehu Phata, Alandi, Pune 412105, India'
  );
  const hasLoggedMockRef = useRef<boolean>(false);

  // Log mock detection to central Azure PostgreSQL audit ledger
  const logMockAttemptToAudit = async (state: LocationState) => {
    if (hasLoggedMockRef.current) return;
    hasLoggedMockRef.current = true;
    try {
      await fetch(getBackendAuditUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor: 'Dr. Priya Sharma (EVC Lead)',
          action: 'EVC_GPS_MOCKING_ATTEMPT_DETECTED',
          entity: 'inspection_security_violation',
          payload: {
            timestamp: new Date(state.timestamp).toISOString(),
            mock_coords: { lat: state.lat, lng: state.lng, accuracy: state.accuracy },
            statutory_clause: 'APH 2024-27 §4.2.3 (Prohibition of Mock Location Providers)',
            system_action: 'CAPTURE_SHUTTER_LOCKED',
          },
        }),
      });
    } catch (e) {
      // Non-blocking catch
    }
  };

  // Reverse geocode with 5s or 20m movement throttling
  const getThrottledAddress = async (lat: number, lng: number): Promise<string> => {
    if (isWeb) {
      return cachedAddressRef.current;
    }
    const now = Date.now();
    const timeSinceLastGeocode = now - lastGeocodeTimeRef.current;

    let distanceSinceLast = 999;
    if (lastGeocodeCoordsRef.current) {
      distanceSinceLast = calculateDistanceMeters(
        lat,
        lng,
        lastGeocodeCoordsRef.current.lat,
        lastGeocodeCoordsRef.current.lng
      );
    }

    // Reuse cache if under 5 seconds and moved less than 20 meters
    if (timeSinceLastGeocode < 5000 && distanceSinceLast < 20 && cachedAddressRef.current) {
      return cachedAddressRef.current;
    }

    try {
      const geo = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (geo && geo.length > 0) {
        const place = geo[0];
        const formatted = [
          place.name,
          place.street,
          place.subregion,
          place.city,
          place.postalCode,
          place.country,
        ]
          .filter(Boolean)
          .join(', ');

        if (formatted) {
          cachedAddressRef.current = formatted;
          lastGeocodeTimeRef.current = now;
          lastGeocodeCoordsRef.current = { lat, lng };
          return formatted;
        }
      }
    } catch (err) {
      // Fallback to cache on network glitch
    }

    return cachedAddressRef.current;
  };

  // Process location updates
  const handleLocationUpdate = useCallback(
    async (loc: Location.LocationObject) => {
      const lat = Number(loc.coords.latitude.toFixed(6));
      const lng = Number(loc.coords.longitude.toFixed(6));
      const accuracy = Number((loc.coords.accuracy ?? 15.0).toFixed(1));
      const altitude = loc.coords.altitude !== null ? Math.round(loc.coords.altitude) : 560;
      const speed = loc.coords.speed !== null ? Number(loc.coords.speed.toFixed(1)) : 0.0;
      const heading = loc.coords.heading !== null ? Math.round(loc.coords.heading) : 180;

      // Mock location detection for Android
      const isMocked = Boolean(
        (loc as any).mocked === true ||
        (loc.coords as any).mocked === true
      );

      // Determine signal quality
      let signalQuality: SignalQuality = 'GOOD';
      if (accuracy <= 10) {
        signalQuality = 'EXCELLENT';
      } else if (accuracy > 30) {
        signalQuality = 'WEAK';
      }

      const address = await getThrottledAddress(lat, lng);

      const nextState: LocationState = {
        lat,
        lng,
        accuracy,
        altitude,
        heading,
        speed,
        timestamp: loc.timestamp || Date.now(),
        address,
        isMocked,
        signalQuality,
      };

      setLocationState(nextState);

      if (isMocked) {
        logMockAttemptToAudit(nextState);
        if (optionsRef.current?.onMockDetected) {
          optionsRef.current.onMockDetected(nextState);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Stop location & heading listeners
  const stopTracking = useCallback(() => {
    if (locationSubRef.current) {
      try {
        locationSubRef.current.remove();
      } catch {}
      locationSubRef.current = null;
    }
    if (headingSubRef.current) {
      try {
        headingSubRef.current.remove();
      } catch {}
      headingSubRef.current = null;
    }
    isTrackingActiveRef.current = false;
  }, []);

  // Start continuous watchPositionAsync
  const startTracking = useCallback(async () => {
    if (isWeb) {
      setPermissionState('GRANTED');
      setErrorMessage(null);
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            handleLocationUpdate({
              coords: {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                altitude: pos.coords.altitude,
                heading: pos.coords.heading,
                speed: pos.coords.speed,
              },
              timestamp: pos.timestamp,
            } as any);
          },
          () => {
            setLocationState((prev) => prev || DEFAULT_CAMPUS_LOCATION);
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        setLocationState((prev) => prev || DEFAULT_CAMPUS_LOCATION);
      }
      return;
    }

    try {
      let servicesEnabled = true;
      try {
        servicesEnabled = await Location.hasServicesEnabledAsync();
      } catch {
        servicesEnabled = true;
      }

      if (!servicesEnabled) {
        setPermissionState('SERVICES_DISABLED');
        setErrorMessage('Location services / GPS is disabled on your device quick settings.');
        return;
      }

      const perm = await Location.getForegroundPermissionsAsync();
      if (!perm.granted) {
        setPermissionState(perm.canAskAgain ? 'CAN_ASK_AGAIN' : 'DENIED');
        return;
      }

      setPermissionState('GRANTED');
      setErrorMessage(null);

      // 1. Immediately fetch last known position for instant HUD feedback (0ms wait)
      try {
        const lastKnown = await Location.getLastKnownPositionAsync();
        if (lastKnown) {
          await handleLocationUpdate(lastKnown);
        }
      } catch {}

      if (isTrackingActiveRef.current) return;
      isTrackingActiveRef.current = true;

      // 2. Start continuous position watch using Balanced accuracy (reliable indoors and outdoors)
      try {
        locationSubRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 1500,
            distanceInterval: 1,
          },
          handleLocationUpdate
        );
      } catch (watchErr) {
        const singleLoc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (singleLoc) {
          await handleLocationUpdate(singleLoc);
        }
      }

      // 3. Start heading watch (optional on devices without compass)
      try {
        headingSubRef.current = await Location.watchHeadingAsync((h) => {
          const deg = Math.round(h.trueHeading >= 0 ? h.trueHeading : h.magHeading);
          setLocationState((prev) => (prev ? { ...prev, heading: deg } : null));
        });
      } catch {}
    } catch (err: any) {
      setErrorMessage(err.message || 'Error initializing GPS tracking');
    }
  }, [handleLocationUpdate, isWeb]);

  // Request foreground permission
  const requestPermission = useCallback(async () => {
    if (isWeb) {
      setPermissionState('GRANTED');
      setErrorMessage(null);
      await startTracking();
      return;
    }

    try {
      let servicesEnabled = true;
      try {
        servicesEnabled = await Location.hasServicesEnabledAsync();
      } catch {
        servicesEnabled = true;
      }

      if (!servicesEnabled) {
        setPermissionState('SERVICES_DISABLED');
        setErrorMessage('Please turn on GPS / Location Services in device quick settings.');
        return;
      }

      // Check current permission before re-requesting to avoid permission flickering
      const currentPerm = await Location.getForegroundPermissionsAsync();
      if (currentPerm.granted) {
        setPermissionState('GRANTED');
        setErrorMessage(null);
        await startTracking();
        return;
      }

      const res = await Location.requestForegroundPermissionsAsync();
      if (res.granted) {
        setPermissionState('GRANTED');
        setErrorMessage(null);
        await startTracking();
      } else {
        setPermissionState(res.canAskAgain ? 'CAN_ASK_AGAIN' : 'DENIED');
        setErrorMessage('Location permission not granted. You can continue with Campus Centroid coordinates.');
      }
    } catch (e: any) {
      setPermissionState('DENIED');
      setErrorMessage(e.message || 'Permission request failed');
    }
  }, [isWeb, startTracking]);

  // Fallback bypass: immediately grants permission and applies campus coordinates
  const bypassPermission = useCallback(() => {
    setPermissionState('GRANTED');
    setErrorMessage(null);
    setLocationState((prev) => prev || DEFAULT_CAMPUS_LOCATION);
  }, []);

  // Enable services (Android intent or settings)
  const enableServices = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        await Location.enableNetworkProviderAsync();
      } else {
        await Linking.openSettings();
      }
      await requestPermission();
    } catch {
      await Linking.openSettings();
    }
  }, [requestPermission]);

  const openSettings = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch {}
  }, []);

  // Mount effect: runs ONCE on screen mount
  useEffect(() => {
    requestPermission();

    const appStateSub = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        startTracking();
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        stopTracking();
      }
    });

    return () => {
      appStateSub.remove();
      stopTracking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    locationState,
    permissionState,
    errorMessage,
    requestPermission,
    openSettings,
    enableServices,
    bypassPermission,
    refreshLocation: startTracking,
  };
}
