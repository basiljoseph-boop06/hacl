/* ============================================================
   POST /api/ai/check-donor — AI Donor Eligibility Check
   Evaluates blood donation eligibility based on health data
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { checkDonorEligibility } from "@/lib/featherless";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { healthData } = body;

        if (!healthData || healthData.trim().length < 10) {
            return NextResponse.json(
                { success: false, message: "Health data must be at least 10 characters" },
                { status: 400 }
            );
        }

        const result = await checkDonorEligibility(healthData);

        let parsed;
        try {
            parsed = JSON.parse(result);
        } catch {
            parsed = {
                eligible: false,
                reasons: [result],
                nextEligibleDate: null,
                recommendations: [],
            };
        }

        return NextResponse.json({
            success: true,
            data: parsed,
        });
    } catch (error) {
        console.error("AI donor check error:", error);
        return NextResponse.json(
            { success: false, message: "Donor eligibility check failed. Please try again." },
            { status: 500 }
        );
    }
}
