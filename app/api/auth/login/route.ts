/* ============================================================
   POST /api/auth/login — User Login
   Validates Firebase token and returns user profile
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { firebaseUid, email } = body;

        if (!firebaseUid && !email) {
            return NextResponse.json(
                { success: false, message: "Firebase UID or email required" },
                { status: 400 }
            );
        }

        const query = firebaseUid ? { firebaseUid } : { email };
        const user = await User.findOne(query)
            .populate("assignedHospitalId")
            .lean();

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found. Please register first." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
