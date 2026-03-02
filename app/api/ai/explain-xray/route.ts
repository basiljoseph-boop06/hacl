/* ============================================================
   POST /api/ai/explain-xray — AI X-ray Explanation
   Provides patient-friendly X-ray analysis
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { explainXray } from "@/lib/featherless";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { xrayDescription } = body;

        if (!xrayDescription || xrayDescription.trim().length < 10) {
            return NextResponse.json(
                { success: false, message: "X-ray description must be at least 10 characters" },
                { status: 400 }
            );
        }

        const result = await explainXray(xrayDescription);

        let parsed;
        try {
            parsed = JSON.parse(result);
        } catch {
            parsed = {
                summary: result,
                findings: [],
                recommendations: [],
                riskLevel: "low",
                confidence: 0.5,
            };
        }

        return NextResponse.json({
            success: true,
            data: parsed,
        });
    } catch (error) {
        console.error("AI xray explain error:", error);
        return NextResponse.json(
            { success: false, message: "X-ray explanation failed. Please try again." },
            { status: 500 }
        );
    }
}
