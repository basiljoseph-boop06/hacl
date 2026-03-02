/* ============================================================
   useGeolocation Hook — Browser Geolocation API Wrapper
   ============================================================ */

"use client";

import { useState, useCallback } from "react";
import { GeoLocation } from "@/types";

interface UseGeolocationReturn {
    location: GeoLocation | null;
    loading: boolean;
    error: string | null;
    requestLocation: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
    const [location, setLocation] = useState<GeoLocation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLoading(false);
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("Location permission denied. Please enable it in your browser settings.");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError("Location information is unavailable.");
                        break;
                    case err.TIMEOUT:
                        setError("Location request timed out.");
                        break;
                    default:
                        setError("An unknown error occurred while getting location.");
                }
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // 5 min cache
            }
        );
    }, []);

    return { location, loading, error, requestLocation };
}
