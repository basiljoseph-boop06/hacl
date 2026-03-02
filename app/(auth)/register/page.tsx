/* ============================================================
   Register Page — Create Health ID
   Includes geolocation, blood group selection, hospital assignment
   ============================================================ */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { BloodGroup } from "@/types";

const bloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function RegisterPage() {
    const router = useRouter();
    const { signUp } = useAuth();
    const { location, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        bloodGroup: "" as BloodGroup | "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [healthId, setHealthId] = useState("");

    const updateForm = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!form.bloodGroup) {
            setError("Please select your blood group");
            return;
        }

        setLoading(true);

        try {
            // Create Firebase account
            const fbUser = await signUp(form.email, form.password);

            // Register in our system
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    bloodGroup: form.bloodGroup,
                    firebaseUid: fbUser.uid,
                    location: location || undefined,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setHealthId(data.data.healthId);
                // Brief pause to show Health ID before redirecting
                setTimeout(() => router.push("/dashboard"), 2500);
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Success state
    if (healthId) {
        return (
            <div className="text-center animate-fadeIn">
                <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome to Carelytix!</h2>
                <p className="text-text-secondary mb-4">Your Health ID has been generated</p>
                <div className="inline-block px-6 py-3 bg-primary/10 rounded-2xl border-2 border-primary/30">
                    <p className="text-3xl font-bold text-primary tracking-wider">{healthId}</p>
                </div>
                <p className="text-sm text-text-muted mt-4">Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">Create your Health ID</h2>
            <p className="text-sm text-text-secondary mb-6">
                Join Carelytix and get your unique digital health identity
            </p>

            {error && (
                <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-xl text-sm text-danger">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    required
                />

                <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    required
                />

                <Input
                    label="Phone"
                    type="tel"
                    placeholder="+91-XXXXXXXXXX"
                    value={form.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={(e) => updateForm("password", e.target.value)}
                    required
                />

                {/* Blood Group Selector */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                        Blood Group
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {bloodGroups.map((bg) => (
                            <button
                                key={bg}
                                type="button"
                                onClick={() => updateForm("bloodGroup", bg)}
                                className={`
                  px-3 py-2 rounded-xl text-sm font-semibold
                  border-2 transition-all duration-200 cursor-pointer
                  ${form.bloodGroup === bg
                                        ? "border-danger bg-danger/10 text-danger"
                                        : "border-border text-text-secondary hover:border-danger/50"
                                    }
                `}
                            >
                                {bg}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                        Location (for hospital assignment)
                    </label>
                    {location ? (
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-success/5 border border-success/20 rounded-xl">
                            <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-success font-medium">Location detected</span>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            fullWidth
                            size="sm"
                            loading={geoLoading}
                            onClick={requestLocation}
                        >
                            📍 Detect My Location
                        </Button>
                    )}
                    {geoError && (
                        <p className="text-xs text-amber-600 mt-1">{geoError}</p>
                    )}
                </div>

                <Button type="submit" fullWidth loading={loading} size="lg">
                    Create Health ID
                </Button>
            </form>

            <p className="text-center text-sm text-text-secondary mt-6">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-primary font-semibold hover:text-primary-dark transition-colors"
                >
                    Sign In
                </Link>
            </p>
        </div>
    );
}
