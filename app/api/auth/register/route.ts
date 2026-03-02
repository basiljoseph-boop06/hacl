/* ============================================================
   POST /api/auth/register — User Registration
   Creates user, generates Health ID, assigns nearest hospital
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Hospital from "@/models/Hospital";
import { generateHealthId } from "@/lib/healthId";
import { findNearestHospital } from "@/lib/hospitals";
import { IHospital } from "@/types";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { name, email, phone, bloodGroup, firebaseUid, location } = body;

        // Validate required fields
        if (!name || !email || !phone || !bloodGroup || !firebaseUid) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { firebaseUid }],
        });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "User already exists" },
                { status: 409 }
            );
        }

        // Generate unique Health ID
        let healthId = generateHealthId();
        while (await User.findOne({ healthId })) {
            healthId = generateHealthId();
        }

        // Find nearest hospital
        const hospitals = await Hospital.find({}).lean<IHospital[]>();
        let assignedHospitalId: string;

        if (location && hospitals.length > 0) {
            const nearest = findNearestHospital(
                { lat: location.lat, lng: location.lng },
                hospitals
            );
            assignedHospitalId = nearest?._id?.toString() || hospitals[0]._id!.toString();
        } else if (hospitals.length > 0) {
            // Assign random hospital if no location provided
            assignedHospitalId = hospitals[0]._id!.toString();
        } else {
            return NextResponse.json(
                { success: false, message: "No hospitals available. Please seed data first." },
                { status: 500 }
            );
        }

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            bloodGroup,
            healthId,
            firebaseUid,
            assignedHospitalId,
            verificationStatus: "pending",
            vitalityScore: 50,
            karmaScore: 0,
            location: location || undefined,
        });

        return NextResponse.json(
            {
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    healthId: user.healthId,
                    bloodGroup: user.bloodGroup,
                    assignedHospitalId: user.assignedHospitalId,
                    verificationStatus: user.verificationStatus,
                    vitalityScore: user.vitalityScore,
                    karmaScore: user.karmaScore,
                },
                message: `Welcome! Your Health ID is ${healthId}`,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
