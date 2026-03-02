/* ============================================================
   Hospital Page — Assigned Hospital Information
   Shows hospital details, specialties, contact info
   ============================================================ */

"use client";

import { useUser } from "@/hooks/useUser";
import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { IHospital } from "@/types";

// dynamic imports for react-leaflet to avoid SSR errors
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

export default function HospitalPage() {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    // The assignedHospitalId is populated with hospital data
    const hospital = user?.assignedHospitalId as unknown as IHospital | null;

    if (!hospital || typeof hospital === "string") {
        return (
            <div className="max-w-3xl mx-auto">
                <Card className="text-center py-16">
                    <div className="text-4xl mb-3">🏥</div>
                    <h3 className="text-lg font-semibold text-text-primary">No Hospital Assigned</h3>
                    <p className="text-text-secondary text-sm mt-1">
                        Hospital information will appear here once you&apos;re assigned.
                    </p>
                </Card>
            </div>
        );
    }

    const loadColor =
        hospital.loadCapacity > 80
            ? "danger"
            : hospital.loadCapacity > 50
                ? "warning"
                : "success";

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-primary">My Hospital</h1>
                <p className="text-text-secondary mt-1">
                    Your assigned primary care facility
                </p>
            </div>

            {/* Hospital Card */}
            <Card variant="gradient" className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-10 translate-x-10" />

                <div className="relative z-10">
                    {/* Hospital Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-text-primary">{hospital.name}</h2>
                                    <p className="text-sm text-text-secondary">{hospital.address}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: 5 }, (_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < hospital.verificationLevel ? "text-accent" : "text-gray-200"}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-bg-main rounded-xl p-4 text-center">
                            <p className="text-sm text-text-muted mb-1">Verification Level</p>
                            <p className="text-2xl font-bold text-primary">{hospital.verificationLevel}/5</p>
                        </div>
                        <div className="bg-bg-main rounded-xl p-4 text-center">
                            <p className="text-sm text-text-muted mb-1">Current Load</p>
                            <div>
                                <p className={`text-2xl font-bold ${loadColor === "danger" ? "text-danger" : loadColor === "warning" ? "text-amber-600" : "text-success"
                                    }`}>
                                    {hospital.loadCapacity}%
                                </p>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                                    <div
                                        className={`rounded-full h-1.5 transition-all ${loadColor === "danger" ? "bg-danger" : loadColor === "warning" ? "bg-accent" : "bg-success"
                                            }`}
                                        style={{ width: `${hospital.loadCapacity}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-bg-main rounded-xl p-4 text-center">
                            <p className="text-sm text-text-muted mb-1">Phone</p>
                            <p className="text-sm font-semibold text-text-primary">{hospital.phone}</p>
                        </div>
                    </div>

                    {/* Specialties */}
                    {hospital.specialties && hospital.specialties.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-text-primary mb-2">Specialties</h3>
                            <div className="flex flex-wrap gap-2">
                                {hospital.specialties.map((specialty) => (
                                    <Badge key={specialty} variant="info">
                                        {specialty}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Map */}
            <Card>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Location</h3>
                <div className="w-full h-64 rounded-xl overflow-hidden border border-border">
                    {typeof hospital.location?.lat === "number" && (
                        <MapContainer
                            center={[hospital.location.lat, hospital.location.lng]}
                            zoom={14}
                            scrollWheelZoom={false}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[hospital.location.lat, hospital.location.lng]}> 
                                <Popup>
                                    <div className="text-sm">
                                        {hospital.name}
                                        <br />
                                        {hospital.address}
                                    </div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    )}
                </div>
                <p className="text-sm text-text-muted mt-2">
                    Lat: {hospital.location?.lat?.toFixed(4)}, Lng: {hospital.location?.lng?.toFixed(4)}
                </p>
                <a
                    href={`https://maps.google.com/?q=${hospital.location?.lat},${hospital.location?.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-sm text-primary font-medium hover:text-primary-dark transition-colors"
                >
                    Open in Google Maps →
                </a>
            </Card>
        </div>
    );
}
