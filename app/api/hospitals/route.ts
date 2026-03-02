/* ============================================================
   /api/hospitals — Hospital CRUD Operations
   GET: List all hospitals | POST: Create hospital
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Hospital from "@/models/Hospital";

export async function GET() {
    try {
        await connectDB();
        const hospitals = await Hospital.find({}).sort({ name: 1 }).lean();

        return NextResponse.json({
            success: true,
            data: hospitals,
            count: hospitals.length,
        });
    } catch (error) {
        console.error("Fetch hospitals error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const { name, address, location, verificationLevel, loadCapacity, specialties, phone } = body;

        if (!name || !address || !location || !phone) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const hospital = await Hospital.create({
            name,
            address,
            location,
            verificationLevel: verificationLevel || 1,
            loadCapacity: loadCapacity || 50,
            specialties: specialties || [],
            phone,
        });

        return NextResponse.json(
            { success: true, data: hospital },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create hospital error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
