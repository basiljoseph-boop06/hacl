/* ============================================================
   User Model — Mongoose Schema
   Core user identity with Health ID and hospital assignment
   ============================================================ */

import mongoose, { Schema, Document, Model } from "mongoose";
import { BloodGroup, VerificationStatus, GeoLocation } from "@/types";

export interface IUserDocument extends Document {
    name: string;
    email: string;
    phone: string;
    healthId: string;
    bloodGroup: BloodGroup;
    assignedHospitalId: mongoose.Types.ObjectId;
    verificationStatus: VerificationStatus;
    vitalityScore: number;
    karmaScore: number;
    location?: GeoLocation;
    firebaseUid: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        healthId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        bloodGroup: {
            type: String,
            required: [true, "Blood group is required"],
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        assignedHospitalId: {
            type: Schema.Types.ObjectId,
            ref: "Hospital",
            required: true,
        },
        verificationStatus: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending",
        },
        vitalityScore: {
            type: Number,
            default: 50,
            min: 0,
            max: 100,
        },
        karmaScore: {
            type: Number,
            default: 0,
            min: 0,
        },
        location: {
            lat: { type: Number },
            lng: { type: Number },
        },
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation in dev (HMR)
const User: Model<IUserDocument> =
    mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;
