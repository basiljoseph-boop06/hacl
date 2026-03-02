/* ============================================================
   Dashboard Overview Page — Stats + Health Passport + Quick Actions
   ============================================================ */

"use client";

import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import HealthPassport from "@/components/dashboard/HealthPassport";
import StatsCard from "@/components/ui/StatsCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";
import { IHospital } from "@/types";

// dynamic imports for map (same as hospital page)
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

const quickActions = [
    {
        label: "Upload Report",
        href: "/dashboard/vault",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
        ),
        color: "bg-primary/10 text-primary",
    },
    {
        label: "AI Analysis",
        href: "/dashboard/ai-oracle",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        color: "bg-info/10 text-info",
    },
    {
        label: "Donate Blood",
        href: "/dashboard/blood-community",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        color: "bg-danger/10 text-danger",
    },
    {
        label: "My Hospital",
        href: "/dashboard/hospital",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        color: "bg-accent/10 text-amber-600",
    },
];

export default function DashboardPage() {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20">
                <p className="text-text-secondary">Unable to load profile. Please try again.</p>
            </div>
        );
    }

    const [hospitals, setHospitals] = useState<IHospital[]>([]);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        fetch("/api/hospitals")
            .then((r) => r.json())
            .then((d) => setHospitals(d.data || []))
            .catch(console.error);
    }, []);

    useEffect(() => {
        setMapReady(true);
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        Welcome back, {user.name?.split(" ")[0]} 👋
                    </h1>
                    <p className="text-text-secondary mt-1">
                        Here&apos;s your health overview
                    </p>
                </div>
                <Badge
                    variant={user.verificationStatus === "verified" ? "verified" : "pending"}
                    dot
                >
                    {user.verificationStatus === "verified" ? "Verified" : "Pending Verification"}
                </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    }
                    label="Vitality Score"
                    value={user.vitalityScore}
                    color="primary"
                    trend={{ value: 5, positive: true }}
                />
                <StatsCard
                    icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    }
                    label="Karma Score"
                    value={user.karmaScore}
                    color="accent"
                />
                <StatsCard
                    icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    }
                    label="Blood Type"
                    value={user.bloodGroup}
                    color="danger"
                />
                <StatsCard
                    icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    }
                    label="Health ID"
                    value={user.healthId}
                    color="info"
                />
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Health Passport */}
                <div className="lg:col-span-1">
                    <HealthPassport user={user} />
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-2">
                    <Card>
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                                >
                                    <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                                        {action.icon}
                                    </div>
                                    <span className="text-sm font-medium text-text-primary">{action.label}</span>
                                </Link>
                            ))}
                        </div>
                    </Card>

                    {/* Verification Notice */}
                    {user.verificationStatus !== "verified" && (
                        <Card variant="bordered" className="mt-4">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-accent/10">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-text-primary">Verification Required</h4>
                                    <p className="text-sm text-text-secondary mt-1">
                                        Visit your assigned hospital with your QR code, or upload a doctor-signed document
                                        to unlock all features including AI insights and teleconsultation.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Nearby hospitals section */}
            {hospitals.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-text-primary">Nearby Hospitals</h2>
                    <Card className="p-0">
                        {mapReady && (
                            <div className="w-full h-64">
                                <MapContainer
                                    center={[
                                        hospitals[0].location.lat,
                                        hospitals[0].location.lng,
                                    ]}
                                    zoom={12}
                                    scrollWheelZoom={false}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {hospitals.map((h) => (
                                        <Marker
                                            key={h._id}
                                            position={[h.location.lat, h.location.lng]}
                                        >
                                            <Popup>
                                                <div className="text-sm">
                                                    <strong>{h.name}</strong>
                                                    <br />
                                                    {h.address}
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            </div>
                        )}
                        <ul className="divide-y divide-border">
                            {hospitals.slice(0, 8).map((h) => (
                                <li
                                    key={h._id}
                                    className="px-6 py-4 hover:bg-primary/5 transition-colors"
                                >
                                    <p className="font-semibold text-text-primary">
                                        {h.name}
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                        {h.address}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            )}
        </div>
    );
}
