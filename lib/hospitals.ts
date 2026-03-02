/* ============================================================
   Hospital Utilities — Geolocation & Nearest Hospital Logic
   Uses Haversine formula for distance calculation
   ============================================================ */

import { GeoLocation, IHospital } from "@/types";

/**
 * Calculate distance between two geo-coordinates using Haversine formula.
 * Returns distance in kilometers.
 */
export function haversineDistance(
    point1: GeoLocation,
    point2: GeoLocation
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(point2.lat - point1.lat);
    const dLng = toRadians(point2.lng - point1.lng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(point1.lat)) *
        Math.cos(toRadians(point2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Find the nearest hospital from a list based on user location.
 * Considers both distance and load capacity (prefers hospitals below 80% load).
 */
export function findNearestHospital(
    userLocation: GeoLocation,
    hospitals: IHospital[]
): IHospital | null {
    if (hospitals.length === 0) return null;

    const hospitalsWithDistance = hospitals.map((hospital) => ({
        hospital,
        distance: haversineDistance(userLocation, hospital.location),
    }));

    // Sort by distance, preferring hospitals under 80% load
    hospitalsWithDistance.sort((a, b) => {
        const aOverloaded = a.hospital.loadCapacity > 80;
        const bOverloaded = b.hospital.loadCapacity > 80;

        if (aOverloaded && !bOverloaded) return 1;
        if (!aOverloaded && bOverloaded) return -1;
        return a.distance - b.distance;
    });

    return hospitalsWithDistance[0].hospital;
}

/**
 * Get all hospitals within a radius (in km) from a location.
 */
export function getHospitalsInRadius(
    center: GeoLocation,
    hospitals: IHospital[],
    radiusKm: number
): (IHospital & { distance: number })[] {
    return hospitals
        .map((hospital) => ({
            ...hospital,
            distance: haversineDistance(center, hospital.location),
        }))
        .filter((h) => h.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);
}
