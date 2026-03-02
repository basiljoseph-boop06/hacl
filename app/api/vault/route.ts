/* ============================================================
   /api/vault — Medical Records Vault
   GET: List user records | POST: Add new record
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Vault from "@/models/Vault";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const type = searchParams.get("type");

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "userId is required" },
                { status: 400 }
            );
        }

        await connectDB();

        const query: Record<string, unknown> = { userId };
        if (type) query.type = type;

        const records = await Vault.find(query)
            .sort({ createdAt: -1 })
            .populate("hospitalId", "name")
            .lean();

        return NextResponse.json({
            success: true,
            data: records,
            count: records.length,
        });
    } catch (error) {
        console.error("Fetch vault error:", error);
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

        const { userId, hospitalId, type, title, data, doctorSignature, fileUrl } = body;

        if (!userId || !hospitalId || !type || !title) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const record = await Vault.create({
            userId,
            hospitalId,
            type,
            title,
            data: data || {},
            verified: false,
            doctorSignature: doctorSignature || "",
            fileUrl: fileUrl || "",
        });

        return NextResponse.json(
            { success: true, data: record },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create vault record error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
