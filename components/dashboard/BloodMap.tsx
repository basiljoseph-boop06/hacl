/* ============================================================
   BloodMap Component — React-Leaflet Map with Blood Requests
   Dynamic import to avoid SSR issues with Leaflet
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { IBloodRequest } from "@/types";

// Dynamic import to prevent SSR issues
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
);

interface BloodMapProps {
    requests: IBloodRequest[];
    center?: [number, number];
    onRespond?: (requestId: string) => void;
}

const urgencyColors = {
    low: "#22C55E",
    medium: "#F59E0B",
    high: "#EF4444",
    critical: "#DC2626",
};

export default function BloodMap({
    requests,
    center = [20.5937, 78.9629], // Default: India center
    onRespond,
}: BloodMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="w-full h-[400px] rounded-2xl bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-8 h-8 text-text-muted mx-auto animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-sm text-text-muted mt-2">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-border shadow-sm">
            <MapContainer
                center={center}
                zoom={5}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {requests.map((request) => (
                    <Marker
                        key={request._id}
                        position={[request.location.lat, request.location.lng]}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-sm">{request.hospitalName}</h4>
                                    <Badge variant={request.urgency === "critical" || request.urgency === "high" ? "urgent" : "warning"}>
                                        {request.urgency}
                                    </Badge>
                                </div>
                                <p className="text-sm mb-1">
                                    <span className="font-medium" style={{ color: urgencyColors[request.urgency] }}>
                                        {request.bloodType}
                                    </span>
                                    {" — "}
                                    {request.unitsNeeded - request.unitsFulfilled} units needed
                                </p>
                                <p className="text-xs text-gray-500 mb-2">
                                    📞 {request.contactPhone}
                                </p>
                                {onRespond && (
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        fullWidth
                                        onClick={() => onRespond(request._id!)}
                                    >
                                        Respond to Request
                                    </Button>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
