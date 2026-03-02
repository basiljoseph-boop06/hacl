/* ============================================================
   Blood Community Page — Map View + Blood Requests
   React-Leaflet map with blood request markers
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import BloodMap from "@/components/dashboard/BloodMap";
import { IBloodRequest, BloodGroup } from "@/types";
import { useUser } from "@/hooks/useUser";

const bloodTypes: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const urgencyStyles = {
    low: { bg: "bg-success/10", text: "text-success", label: "Low" },
    medium: { bg: "bg-accent/10", text: "text-amber-600", label: "Medium" },
    high: { bg: "bg-danger/10", text: "text-danger", label: "High" },
    critical: { bg: "bg-red-600/10", text: "text-red-700", label: "Critical" },
};

export default function BloodCommunityPage() {
    const { user } = useUser();
    const [requests, setRequests] = useState<IBloodRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<BloodGroup | "all">("all");

    useEffect(() => {
        fetchRequests();
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ active: "true" });
            if (filter !== "all") params.append("bloodType", filter);

            const res = await fetch(`/api/blood-requests?${params}`);
            const data = await res.json();
            if (data.success) setRequests(data.data);
        } catch (error) {
            console.error("Fetch blood requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (requestId: string) => {
        try {
            const res = await fetch("/api/blood-requests", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requestId,
                    donorUserId: user?._id,
                }),
            });

            const data = await res.json();
            if (data.success) {
                fetchRequests();
                alert(data.message || "Thank you for your donation!");
            }
        } catch (error) {
            console.error("Respond error:", error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        Blood Community 🩸
                    </h1>
                    <p className="text-text-secondary mt-1">
                        Active blood requests near you — save a life today
                    </p>
                </div>
                <Badge variant="info">
                    {requests.length} Active Request{requests.length !== 1 ? "s" : ""}
                </Badge>
            </div>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer
            ${filter === "all" ? "bg-primary text-white" : "bg-bg-card border border-border text-text-secondary hover:border-primary/30"}`}
                >
                    All Types
                </button>
                {bloodTypes.map((bt) => (
                    <button
                        key={bt}
                        onClick={() => setFilter(bt)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${filter === bt ? "bg-danger text-white" : "bg-bg-card border border-border text-text-secondary hover:border-danger/30"}`}
                    >
                        {bt}
                    </button>
                ))}
            </div>

            {/* Map */}
            <BloodMap requests={requests} onRespond={handleRespond} />

            {/* List View */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <Spinner size="lg" />
                </div>
            ) : requests.length === 0 ? (
                <Card className="text-center py-12">
                    <div className="text-4xl mb-3">🎉</div>
                    <h3 className="text-lg font-semibold text-text-primary">No active requests</h3>
                    <p className="text-text-secondary text-sm mt-1">
                        All blood requests have been fulfilled. Check back later.
                    </p>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {requests.map((req) => {
                        const urgency = urgencyStyles[req.urgency];
                        const remaining = req.unitsNeeded - req.unitsFulfilled;
                        return (
                            <Card key={req._id} hover>
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-text-primary">{req.hospitalName}</h3>
                                        <p className="text-xs text-text-muted mt-0.5">
                                            {new Date(req.createdAt).toLocaleDateString("en-IN")}
                                        </p>
                                    </div>
                                    <Badge variant={req.urgency === "critical" || req.urgency === "high" ? "urgent" : "warning"} dot>
                                        {urgency.label}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-4 mb-3">
                                    <div className="px-3 py-2 rounded-xl bg-danger/10 text-center">
                                        <p className="text-2xl font-bold text-danger">{req.bloodType}</p>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-text-secondary">
                                            <span className="font-semibold text-text-primary">{remaining}</span> unit{remaining !== 1 ? "s" : ""} needed
                                        </p>
                                        {/* Progress bar */}
                                        <div className="w-full bg-gray-100 rounded-full h-2 mt-1.5">
                                            <div
                                                className="bg-primary rounded-full h-2 transition-all"
                                                style={{ width: `${(req.unitsFulfilled / req.unitsNeeded) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-text-muted mt-1">
                                            {req.unitsFulfilled}/{req.unitsNeeded} fulfilled
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-text-muted">📞 {req.contactPhone}</p>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleRespond(req._id!)}
                                    >
                                        🤝 Respond
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
