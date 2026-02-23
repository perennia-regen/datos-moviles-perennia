import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";

interface LocationState {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export function useLocation(enabled = true) {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permiso de ubicación denegado");
        return;
      }

      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 3000,
        },
        (loc) => {
          if (mounted) {
            setLocation({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              accuracy: loc.coords.accuracy,
            });
          }
        }
      );
    })();

    return () => {
      mounted = false;
      subscriptionRef.current?.remove();
    };
  }, [enabled]);

  return { location, error };
}
