/* ============================================================
   POST /api/verify/qr — Hospital QR Verification
   Hospital scans user's QR → verifies identity → updates status
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyQRPayload } from "@/lib/healthId";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { qrData, hospitalId } = body;

        if (!qrData || !hospitalId) {
            return NextResponse.json(
                { success: false, message: "QR data and hospital ID are required" },
                { status: 400 }
            );
        }

        // Decrypt and validate QR payload
        const payload = verifyQRPayload(qrData);

        if (!payload) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired QR code" },
                { status: 400 }
            );
        }

        // Find user and verify
        const user = await User.findById(payload.userId);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Verify Health ID matches
        if (user.healthId !== payload.healthId) {
            return NextResponse.json(
                { success: false, message: "Health ID mismatch" },
                { status: 400 }
            );
        }

        // Update verification status
        user.verificationStatus = "verified";
        user.vitalityScore = Math.min(100, user.vitalityScore + 10);
        await user.save();

        return NextResponse.json({
            success: true,
            data: {
                userId: user._id,
                healthId: user.healthId,
                verificationStatus: user.verificationStatus,
            },
            message: "User verified successfully via QR scan",
        });
    } catch (error) {
        console.error("QR verification error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
