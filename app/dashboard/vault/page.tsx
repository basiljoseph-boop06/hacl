/* ============================================================
   Vault Page — Medical Records Management
   Displays records with filtering, upload capability
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { IVault, VaultRecordType } from "@/types";

const recordTypes: { value: VaultRecordType | "all"; label: string; icon: string }[] = [
    { value: "all", label: "All Records", icon: "📋" },
    { value: "vitals", label: "Vitals", icon: "💓" },
    { value: "lab", label: "Lab Results", icon: "🔬" },
    { value: "xray", label: "X-Rays", icon: "🩻" },
    { value: "prescription", label: "Prescriptions", icon: "💊" },
];

export default function VaultPage() {
    const { user } = useUser();
    const [records, setRecords] = useState<IVault[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<VaultRecordType | "all">("all");
    const [showUpload, setShowUpload] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        title: "",
        type: "vitals" as VaultRecordType,
        data: "",
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user?._id) fetchRecords();
    }, [user, activeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ userId: user!._id! });
            if (activeFilter !== "all") params.append("type", activeFilter);

            const res = await fetch(`/api/vault?${params}`);
            const data = await res.json();
            if (data.success) setRecords(data.data);
        } catch (error) {
            console.error("Fetch records error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            const res = await fetch("/api/vault", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user!._id,
                    hospitalId: user!.assignedHospitalId,
                    type: uploadForm.type,
                    title: uploadForm.title,
                    data: { notes: uploadForm.data },
                }),
            });

            const data = await res.json();
            if (data.success) {
                setShowUpload(false);
                setUploadForm({ title: "", type: "vitals", data: "" });
                fetchRecords();
            }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    const typeIcons: Record<string, string> = {
        vitals: "💓",
        lab: "🔬",
        xray: "🩻",
        prescription: "💊",
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Health Vault</h1>
                    <p className="text-text-secondary mt-1">
                        Your verified medical records, safely stored
                    </p>
                </div>
                <Button onClick={() => setShowUpload(true)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Record
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {recordTypes.map((rt) => (
                    <button
                        key={rt.value}
                        onClick={() => setActiveFilter(rt.value)}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
              transition-all whitespace-nowrap cursor-pointer
              ${activeFilter === rt.value
                                ? "bg-primary text-white shadow-md"
                                : "bg-bg-card border border-border text-text-secondary hover:border-primary/30"
                            }
            `}
                    >
                        <span>{rt.icon}</span>
                        {rt.label}
                    </button>
                ))}
            </div>

            {/* Records */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : records.length === 0 ? (
                <Card className="text-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-1">No records yet</h3>
                    <p className="text-text-secondary text-sm">
                        Your medical records will appear here once added or verified by your hospital.
                    </p>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {records.map((record) => (
                        <Card key={record._id} hover className="flex items-center gap-4">
                            <div className="text-2xl">{typeIcons[record.type] || "📋"}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-text-primary">{record.title}</h3>
                                    <Badge variant={record.verified ? "verified" : "pending"} dot>
                                        {record.verified ? "Verified" : "Pending"}
                                    </Badge>
                                </div>
                                <p className="text-sm text-text-secondary mt-0.5">
                                    {record.type.charAt(0).toUpperCase() + record.type.slice(1)} •{" "}
                                    {new Date(record.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                            <Badge variant="default">{record.type}</Badge>
                        </Card>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            <Modal
                isOpen={showUpload}
                onClose={() => setShowUpload(false)}
                title="Add Medical Record"
            >
                <form onSubmit={handleUpload} className="space-y-4">
                    <Input
                        label="Title"
                        placeholder="e.g., Blood Test Results - March 2024"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm((p) => ({ ...p, title: e.target.value }))}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Record Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {recordTypes.filter((t) => t.value !== "all").map((rt) => (
                                <button
                                    key={rt.value}
                                    type="button"
                                    onClick={() => setUploadForm((p) => ({ ...p, type: rt.value as VaultRecordType }))}
                                    className={`
                    flex items-center gap-2 px-3 py-2 rounded-xl text-sm cursor-pointer
                    border-2 transition-all
                    ${uploadForm.type === rt.value
                                            ? "border-primary bg-primary/5 text-primary font-semibold"
                                            : "border-border text-text-secondary hover:border-primary/30"
                                        }
                  `}
                                >
                                    <span>{rt.icon}</span>
                                    {rt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                            Data / Notes
                        </label>
                        <textarea
                            className="w-full px-4 py-2.5 rounded-xl bg-bg-card border border-border
                text-text-primary placeholder:text-text-muted resize-none
                focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            rows={4}
                            placeholder="Enter medical data, notes, or observations..."
                            value={uploadForm.data}
                            onChange={(e) => setUploadForm((p) => ({ ...p, data: e.target.value }))}
                        />
                    </div>

                    <Button type="submit" fullWidth loading={uploading}>
                        Upload Record
                    </Button>
                </form>
            </Modal>
        </div>
    );
}
