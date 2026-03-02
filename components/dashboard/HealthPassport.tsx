/* ============================================================
   HealthPassport Component — QR Code + Verification Status
   Shows user Health ID, QR code, and verification progress
   ============================================================ */

"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { IUser } from "@/types";

interface HealthPassportProps {
    user: IUser;
}

export default function HealthPassport({ user }: HealthPassportProps) {
    const [showQR, setShowQR] = useState(false);

    const isVerified = user.verificationStatus === "verified";

    return (
        <Card variant="gradient" hover className="relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-info/5 rounded-full translate-y-6 -translate-x-6" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                            Health Passport
                        </p>
                        <h3 className="text-xl font-bold text-text-primary mt-0.5">
                            {user.healthId}
                        </h3>
                    </div>
                    <Badge
                        variant={isVerified ? "verified" : "pending"}
                        dot
                    >
                        {isVerified ? "Verified" : "Pending"}
                    </Badge>
                </div>

                {/* User Info */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-text-primary font-medium">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <span className="text-text-secondary">Blood Type: </span>
                        <span className="font-semibold text-danger">{user.bloodGroup}</span>
                    </div>
                </div>

                {/* Scores */}
                <div className="flex gap-3 mb-4">
                    <div className="flex-1 bg-primary/5 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-primary">{user.vitalityScore}</p>
                        <p className="text-xs text-text-muted">Vitality</p>
                    </div>
                    <div className="flex-1 bg-accent/5 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-amber-600">{user.karmaScore}</p>
                        <p className="text-xs text-text-muted">Karma</p>
                    </div>
                </div>

                {/* QR Toggle */}
                <Button
                    variant={showQR ? "ghost" : "primary"}
                    fullWidth
                    onClick={() => setShowQR(!showQR)}
                    size="sm"
                >
                    {showQR ? "Hide QR Code" : "Show QR for Check-in"}
                </Button>

                {/* QR Code */}
                {showQR && (
                    <div className="mt-4 flex flex-col items-center animate-slideUp">
                        <div className="bg-white p-4 rounded-xl shadow-md">
                            <QRCode
                                value={JSON.stringify({
                                    healthId: user.healthId,
                                    userId: user._id,
                                    ts: Date.now(),
                                })}
                                size={160}
                                level="H"
                                fgColor="#0F172A"
                            />
                        </div>
                        <p className="text-xs text-text-muted mt-2">
                            Show this at your assigned hospital
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
}
