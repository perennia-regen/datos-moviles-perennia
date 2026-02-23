import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";

export function useHeading(enabled = true) {
  const [heading, setHeading] = useState<number | null>(null);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let mounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscriptionRef.current = await Location.watchHeadingAsync((data) => {
        if (mounted && data.trueHeading >= 0) {
          setHeading(data.trueHeading);
        }
      });
    })();

    return () => {
      mounted = false;
      subscriptionRef.current?.remove();
    };
  }, [enabled]);

  return heading;
}
