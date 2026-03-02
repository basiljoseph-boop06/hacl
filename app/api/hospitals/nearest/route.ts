/* ============================================================
   GET /api/hospitals/nearest — Find Nearest Hospital
   Query params: lat, lng
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Hospital from "@/models/Hospital";
import { findNearestHospital } from "@/lib/hospitals";
import { IHospital } from "@/types";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const lat = parseFloat(searchParams.get("lat") || "0");
        const lng = parseFloat(searchParams.get("lng") || "0");

        if (!lat || !lng) {
            return NextResponse.json(
                { success: false, message: "lat and lng query parameters are required" },
                { status: 400 }
            );
        }

        await connectDB();
        const hospitals = await Hospital.find({}).lean<IHospital[]>();

        if (hospitals.length === 0) {
            return NextResponse.json(
                { success: false, message: "No hospitals found" },
                { status: 404 }
            );
        }

        const nearest = findNearestHospital({ lat, lng }, hospitals);

        return NextResponse.json({
            success: true,
            data: nearest,
        });
    } catch (error) {
        console.error("Nearest hospital error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
