/* ============================================================
   /api/blood-requests — Blood Donation Request Management
   GET: List active | POST: Create | PATCH: Respond/Fulfill
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BloodRequest from "@/models/BloodRequest";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const bloodType = searchParams.get("bloodType");
        const activeOnly = searchParams.get("active") !== "false";

        await connectDB();

        const query: Record<string, unknown> = {};
        if (activeOnly) query.active = true;
        if (bloodType) query.bloodType = bloodType;

        const requests = await BloodRequest.find(query)
            .sort({ urgency: -1, createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: requests,
            count: requests.length,
        });
    } catch (error) {
        console.error("Fetch blood requests error:", error);
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

        const { hospitalId, hospitalName, bloodType, urgency, location, contactPhone, unitsNeeded } = body;

        if (!hospitalId || !bloodType || !urgency || !location || !contactPhone) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const request = await BloodRequest.create({
            hospitalId,
            hospitalName: hospitalName || "Unknown Hospital",
            bloodType,
            urgency,
            location,
            contactPhone,
            unitsNeeded: unitsNeeded || 1,
            active: true,
            unitsFulfilled: 0,
        });

        return NextResponse.json(
            { success: true, data: request },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create blood request error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { requestId, donorUserId } = body;

        if (!requestId) {
            return NextResponse.json(
                { success: false, message: "requestId is required" },
                { status: 400 }
            );
        }

        const request = await BloodRequest.findById(requestId);
        if (!request) {
            return NextResponse.json(
                { success: false, message: "Blood request not found" },
                { status: 404 }
            );
        }

        // Increment fulfilled units
        request.unitsFulfilled += 1;
        if (request.unitsFulfilled >= request.unitsNeeded) {
            request.active = false;
        }
        await request.save();

        // Increase donor karma score if donorUserId provided
        if (donorUserId) {
            await User.findByIdAndUpdate(donorUserId, {
                $inc: { karmaScore: 10 },
            });
        }

        return NextResponse.json({
            success: true,
            data: request,
            message: "Thank you for your donation! Karma +10",
        });
    } catch (error) {
        console.error("Update blood request error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
