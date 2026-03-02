/* ============================================================
   POST /api/ai/analyze-report — AI Medical Report Analysis
   Uses Featherless AI for structured medical analysis
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { analyzeReport } from "@/lib/featherless";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { reportText } = body;

        if (!reportText || reportText.trim().length < 10) {
            return NextResponse.json(
                { success: false, message: "Report text must be at least 10 characters" },
                { status: 400 }
            );
        }

        const result = await analyzeReport(reportText);

        // Try to parse structured JSON from AI response
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
        console.error("AI analyze error:", error);
        return NextResponse.json(
            { success: false, message: "AI analysis failed. Please try again." },
            { status: 500 }
        );
    }
}
