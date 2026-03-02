/* ============================================================
   AI Oracle Page — AI-Powered Medical Analysis Interface
   Three modes: Report Analysis, Donor Check, X-ray Explanation
   ============================================================ */

"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { AIAnalysisResult, DonorEligibility } from "@/types";

type OracleMode = "analyze" | "donor" | "xray";

const modes = [
    {
        id: "analyze" as OracleMode,
        label: "Analyze Report",
        icon: "📊",
        description: "AI analysis of any medical report",
        endpoint: "/api/ai/analyze-report",
        inputKey: "reportText",
        placeholder: "Paste your medical report text here...",
    },
    {
        id: "donor" as OracleMode,
        label: "Donor Eligibility",
        icon: "🩸",
        description: "Check blood donation eligibility",
        endpoint: "/api/ai/check-donor",
        inputKey: "healthData",
        placeholder: "Enter your recent health data (weight, hemoglobin, medications, etc.)...",
    },
    {
        id: "xray" as OracleMode,
        label: "Explain X-Ray",
        icon: "🩻",
        description: "Patient-friendly X-ray explanation",
        endpoint: "/api/ai/explain-xray",
        inputKey: "xrayDescription",
        placeholder: "Enter the X-ray report findings text...",
    },
];

export default function AIOraclePage() {
    const [activeMode, setActiveMode] = useState<OracleMode>("analyze");
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AIAnalysisResult | DonorEligibility | null>(null);
    const [error, setError] = useState("");

    const currentMode = modes.find((m) => m.id === activeMode)!;

    const handleAnalyze = async () => {
        if (!inputText.trim() || inputText.length < 10) {
            setError("Please enter at least 10 characters of text");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch(currentMode.endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [currentMode.inputKey]: inputText }),
            });

            const data = await res.json();
            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.message || "Analysis failed");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Analysis failed");
        } finally {
            setLoading(false);
        }
    };

    const riskColors = {
        low: "success",
        moderate: "warning",
        high: "urgent",
    } as const;

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-primary">AI Oracle</h1>
                <p className="text-text-secondary mt-1">
                    AI-powered medical insights and analysis
                </p>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => {
                            setActiveMode(mode.id);
                            setResult(null);
                            setError("");
                        }}
                        className={`
              p-4 rounded-2xl border-2 text-left transition-all cursor-pointer
              ${activeMode === mode.id
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-border hover:border-primary/30"
                            }
            `}
                    >
                        <span className="text-2xl">{mode.icon}</span>
                        <h3 className="font-semibold text-text-primary mt-2">{mode.label}</h3>
                        <p className="text-xs text-text-secondary mt-1">{mode.description}</p>
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <Card>
                <h3 className="text-lg font-semibold text-text-primary mb-3">
                    {currentMode.icon} {currentMode.label}
                </h3>
                <textarea
                    className="w-full px-4 py-3 rounded-xl bg-bg-main border border-border
            text-text-primary placeholder:text-text-muted resize-none
            focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
            min-h-[160px]"
                    placeholder={currentMode.placeholder}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                {error && (
                    <p className="text-sm text-danger mt-2">{error}</p>
                )}
                <div className="flex justify-end mt-4">
                    <Button onClick={handleAnalyze} loading={loading}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Analyze with AI
                    </Button>
                </div>
            </Card>

            {/* Loading */}
            {loading && (
                <Card className="text-center py-12">
                    <Spinner size="lg" />
                    <p className="text-text-secondary mt-4">AI is analyzing your data...</p>
                    <p className="text-text-muted text-sm mt-1">This may take a few seconds</p>
                </Card>
            )}

            {/* Results */}
            {result && !loading && (
                <Card className="animate-slideUp">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                        ✨ Analysis Results
                    </h3>

                    {/* For analyze and xray modes */}
                    {"summary" in result && (
                        <div className="space-y-4">
                            {/* Risk Level & Confidence */}
                            <div className="flex items-center gap-3">
                                {"riskLevel" in result && (
                                    <Badge variant={riskColors[result.riskLevel as keyof typeof riskColors] || "info"} dot>
                                        Risk: {result.riskLevel}
                                    </Badge>
                                )}
                                {"confidence" in result && (
                                    <Badge variant="info">
                                        Confidence: {Math.round((result.confidence as number) * 100)}%
                                    </Badge>
                                )}
                            </div>

                            {/* Summary */}
                            <div className="bg-primary/5 rounded-xl p-4">
                                <h4 className="text-sm font-semibold text-primary mb-1">Summary</h4>
                                <p className="text-sm text-text-primary">{result.summary}</p>
                            </div>

                            {/* Findings */}
                            {"findings" in result && (result.findings as string[]).length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-text-primary mb-2">Key Findings</h4>
                                    <ul className="space-y-1.5">
                                        {(result.findings as string[]).map((finding, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                                <span className="text-primary mt-0.5">•</span>
                                                {finding}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Recommendations */}
                            {"recommendations" in result && (result.recommendations as string[]).length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-text-primary mb-2">Recommendations</h4>
                                    <ul className="space-y-1.5">
                                        {(result.recommendations as string[]).map((rec, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                                <span className="text-success mt-0.5">✓</span>
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* For donor mode */}
                    {"eligible" in result && (
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl ${result.eligible ? "bg-success/10" : "bg-danger/10"}`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{result.eligible ? "✅" : "❌"}</span>
                                    <h4 className={`font-semibold ${result.eligible ? "text-success" : "text-danger"}`}>
                                        {result.eligible ? "Eligible to Donate" : "Not Eligible at This Time"}
                                    </h4>
                                </div>
                            </div>

                            {(result.reasons as string[]).length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-text-primary mb-2">Reasons</h4>
                                    <ul className="space-y-1.5">
                                        {(result.reasons as string[]).map((reason, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                                <span className="text-info mt-0.5">ℹ</span>
                                                {reason}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {"nextEligibleDate" in result && result.nextEligibleDate && (
                                <p className="text-sm text-text-secondary">
                                    📅 Next eligible date: <span className="font-semibold">{result.nextEligibleDate}</span>
                                </p>
                            )}
                        </div>
                    )}

                    {/* Disclaimer */}
                    <div className="mt-6 p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <p className="text-xs text-amber-700">
                            ⚠️ <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and
                            does not constitute medical advice. Always consult a qualified healthcare professional.
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
}
