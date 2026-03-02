/* ============================================================
   POST /api/verify/document — Document-based Verification
   User uploads doctor-signed document → AI extracts → verify
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Vault from "@/models/Vault";
import { analyzeReport } from "@/lib/featherless";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { userId, documentText, documentType, doctorSignature } = body;

        if (!userId || !documentText) {
            return NextResponse.json(
                { success: false, message: "User ID and document text are required" },
                { status: 400 }
            );
        }

        // Use AI to extract and validate structured data
        let aiResult;
        try {
            const rawResult = await analyzeReport(documentText);
            aiResult = JSON.parse(rawResult);
        } catch {
            aiResult = {
                summary: "Document processed but AI extraction limited",
                findings: [],
                recommendations: [],
                riskLevel: "low",
                confidence: 0.3,
            };
        }

        // Determine if document is valid enough for verification
        const isValid = aiResult.confidence >= 0.6 && doctorSignature;

        // Save to vault
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const vaultRecord = await Vault.create({
            userId,
            hospitalId: user.assignedHospitalId,
            type: documentType || "lab",
            title: `Verification Document - ${new Date().toLocaleDateString()}`,
            data: aiResult,
            verified: isValid,
            doctorSignature: doctorSignature || "",
        });

        // Update user verification if valid
        if (isValid) {
            user.verificationStatus = "verified";
            user.vitalityScore = Math.min(100, user.vitalityScore + 10);
            await user.save();
        }

        return NextResponse.json({
            success: true,
            data: {
                vaultRecord,
                aiAnalysis: aiResult,
                verificationResult: isValid ? "verified" : "pending_review",
            },
            message: isValid
                ? "Document verified successfully! Your status is now verified."
                : "Document submitted for review. A healthcare professional will verify it.",
        });
    } catch (error) {
        console.error("Document verification error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
