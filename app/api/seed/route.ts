/* ============================================================
   POST /api/seed — Seed Sample Hospital Data
   Creates sample hospitals for development and testing
   ============================================================ */

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Hospital from "@/models/Hospital";
import BloodRequest from "@/models/BloodRequest";
import User from "@/models/User";
import { generateHospitals } from "@/lib/featherless";

const sampleHospitals = [
    {
        name: "Apollo Hospitals",
        address: "Greams Road, Chennai, Tamil Nadu 600006",
        location: { lat: 13.0604, lng: 80.2496 },
        verificationLevel: 5,
        loadCapacity: 45,
        specialties: ["Cardiology", "Neurology", "Oncology", "Orthopedics"],
        phone: "+91-44-2829-0200",
    },
    {
        name: "AIIMS Delhi",
        address: "Sri Aurobindo Marg, New Delhi 110029",
        location: { lat: 28.5672, lng: 77.2100 },
        verificationLevel: 5,
        loadCapacity: 72,
        specialties: ["General Medicine", "Surgery", "Pediatrics", "Psychiatry"],
        phone: "+91-11-2658-8500",
    },
    {
        name: "Fortis Hospital",
        address: "Sector 62, Gurgaon, Haryana 122002",
        location: { lat: 28.4089, lng: 77.0631 },
        verificationLevel: 4,
        loadCapacity: 38,
        specialties: ["Cardiology", "Nephrology", "Gastroenterology"],
        phone: "+91-124-496-2222",
    },
    {
        name: "Manipal Hospital",
        address: "HAL Airport Road, Bangalore 560017",
        location: { lat: 12.9583, lng: 77.6485 },
        verificationLevel: 4,
        loadCapacity: 55,
        specialties: ["Orthopedics", "Neurosurgery", "Oncology"],
        phone: "+91-80-2502-4444",
    },
    {
        name: "Medanta - The Medicity",
        address: "Sector 38, Gurgaon, Haryana 122001",
        location: { lat: 28.4395, lng: 77.0427 },
        verificationLevel: 5,
        loadCapacity: 60,
        specialties: ["Heart Institute", "Neurosciences", "Liver Transplant"],
        phone: "+91-124-414-1414",
    },
    {
        name: "Narayana Health",
        address: "Hosur Road, Bangalore 560099",
        location: { lat: 12.8846, lng: 77.5996 },
        verificationLevel: 4,
        loadCapacity: 42,
        specialties: ["Cardiac Surgery", "Pediatrics", "Renal Sciences"],
        phone: "+91-80-7122-2222",
    },
    {
        name: "Kokilaben Hospital",
        address: "Rao Saheb Achutrao Patwardhan Marg, Mumbai 400053",
        location: { lat: 19.1310, lng: 72.8263 },
        verificationLevel: 4,
        loadCapacity: 50,
        specialties: ["Oncology", "Neurology", "Robotics Surgery"],
        phone: "+91-22-3066-6666",
    },
    {
        name: "CMC Vellore",
        address: "Ida Scudder Road, Vellore, Tamil Nadu 632004",
        location: { lat: 12.9239, lng: 79.1338 },
        verificationLevel: 5,
        loadCapacity: 65,
        specialties: ["Hematology", "Endocrinology", "Dermatology"],
        phone: "+91-416-228-1000",
    },
];

const sampleBloodRequests = [
    {
        bloodType: "O+",
        urgency: "critical",
        contactPhone: "+91-44-2829-0200",
        unitsNeeded: 3,
        hospitalIndex: 0,
    },
    {
        bloodType: "A-",
        urgency: "high",
        contactPhone: "+91-11-2658-8500",
        unitsNeeded: 2,
        hospitalIndex: 1,
    },
    {
        bloodType: "B+",
        urgency: "medium",
        contactPhone: "+91-80-2502-4444",
        unitsNeeded: 1,
        hospitalIndex: 3,
    },
    {
        bloodType: "AB+",
        urgency: "high",
        contactPhone: "+91-22-3066-6666",
        unitsNeeded: 4,
        hospitalIndex: 6,
    },
];

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Clear existing data
        await Hospital.deleteMany({});
        await BloodRequest.deleteMany({});

        // Determine seeding strategy: use AI if query param or env var
        let hospitalsData = sampleHospitals;
        const url = new URL(req.url);
        const useAi =
            url.searchParams.get("ai") === "true" ||
            process.env.USE_AI_HOSPITALS === "true";
        if (useAi) {
            // generate hospitals around Vandalur, Tamil Nadu
            const aiHospitals: any[] = await generateHospitals(
                "Vandalur, Chennai, Tamil Nadu, India",
                10
            );
            // basic validation/fallback
            if (Array.isArray(aiHospitals) && aiHospitals.length > 0) {
                hospitalsData = aiHospitals.map((h) => ({
                    name: h.name || "Unknown Hospital",
                    address: h.address || "",
                    location: h.location || { lat: 12.9, lng: 80.1 },
                    verificationLevel: h.verificationLevel || 3,
                    loadCapacity: h.loadCapacity || 50,
                    specialties: h.specialties || [],
                    phone: h.phone || "",
                }));
            }
        }

        // Seed hospitals
        const hospitals = await Hospital.insertMany(hospitalsData as any[]);

        // Seed blood requests
        const bloodRequests = sampleBloodRequests.map((br) => ({
            hospitalId: hospitals[br.hospitalIndex]._id,
            hospitalName: hospitals[br.hospitalIndex].name,
            bloodType: br.bloodType,
            urgency: br.urgency,
            location: hospitals[br.hospitalIndex].location,
            contactPhone: br.contactPhone,
            unitsNeeded: br.unitsNeeded,
            unitsFulfilled: 0,
            active: true,
        }));

        await BloodRequest.insertMany(bloodRequests);

        // add demo users (doctor + patient) so folks can log in by email without needing Firebase
        await User.deleteMany({});
        const sampleUsers = [
            {
                name: "Dr. Alice",
                email: "doctor@example.com",
                phone: "+10000000001",
                bloodGroup: "O+",
                healthId: "TEST-DR-001",
                firebaseUid: "demo-doctor-uid",
                assignedHospitalId: hospitals[0]._id,
                verificationStatus: "verified",
                vitalityScore: 85,
                karmaScore: 10,
            },
            {
                name: "John Patient",
                email: "patient@example.com",
                phone: "+10000000002",
                bloodGroup: "A-",
                healthId: "TEST-PT-001",
                firebaseUid: "demo-patient-uid",
                assignedHospitalId: hospitals[1]?._id || hospitals[0]._id,
                verificationStatus: "pending",
                vitalityScore: 45,
                karmaScore: 5,
            },
        ];
        await User.insertMany(sampleUsers);

        return NextResponse.json({
            success: true,
            message: `Seeded ${hospitals.length} hospitals and ${bloodRequests.length} blood requests`,
            data: {
                hospitals: hospitals.map((h) => ({ _id: h._id, name: h.name })),
            },
        });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to seed data" },
            { status: 500 }
        );
    }
}
