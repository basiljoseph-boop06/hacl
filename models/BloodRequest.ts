/* ============================================================
   Blood Request Model — Mongoose Schema
   Emergency blood donation requests with geolocation
   ============================================================ */

import mongoose, { Schema, Document, Model } from "mongoose";
import { BloodGroup, UrgencyLevel } from "@/types";

export interface IBloodRequestDocument extends Document {
    hospitalId: mongoose.Types.ObjectId;
    hospitalName: string;
    bloodType: BloodGroup;
    urgency: UrgencyLevel;
    location: {
        lat: number;
        lng: number;
    };
    active: boolean;
    contactPhone: string;
    unitsNeeded: number;
    unitsFulfilled: number;
    createdAt: Date;
}

const BloodRequestSchema = new Schema<IBloodRequestDocument>(
    {
        hospitalId: {
            type: Schema.Types.ObjectId,
            ref: "Hospital",
            required: true,
        },
        hospitalName: {
            type: String,
            required: true,
            trim: true,
        },
        bloodType: {
            type: String,
            required: true,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        urgency: {
            type: String,
            required: true,
            enum: ["low", "medium", "high", "critical"],
            default: "medium",
        },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        active: {
            type: Boolean,
            default: true,
            index: true,
        },
        contactPhone: {
            type: String,
            required: true,
            trim: true,
        },
        unitsNeeded: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        unitsFulfilled: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for active requests by blood type
BloodRequestSchema.index({ active: 1, bloodType: 1 });
BloodRequestSchema.index({ "location.lat": 1, "location.lng": 1 });

const BloodRequest: Model<IBloodRequestDocument> =
    mongoose.models.BloodRequest ||
    mongoose.model<IBloodRequestDocument>("BloodRequest", BloodRequestSchema);

export default BloodRequest;
