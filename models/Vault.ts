/* ============================================================
   Vault Model — Mongoose Schema
   Secure medical records storage (vitals, labs, x-rays, prescriptions)
   ============================================================ */

import mongoose, { Schema, Document, Model } from "mongoose";
import { VaultRecordType } from "@/types";

export interface IVaultDocument extends Document {
    userId: mongoose.Types.ObjectId;
    hospitalId: mongoose.Types.ObjectId;
    type: VaultRecordType;
    title: string;
    data: Record<string, unknown>;
    verified: boolean;
    doctorSignature?: string;
    fileUrl?: string;
    createdAt: Date;
}

const VaultSchema = new Schema<IVaultDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        hospitalId: {
            type: Schema.Types.ObjectId,
            ref: "Hospital",
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["vitals", "lab", "xray", "prescription"],
        },
        title: {
            type: String,
            required: [true, "Record title is required"],
            trim: true,
        },
        data: {
            type: Schema.Types.Mixed,
            required: true,
            default: {},
        },
        verified: {
            type: Boolean,
            default: false,
        },
        doctorSignature: {
            type: String,
            default: "",
        },
        fileUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for user-specific queries
VaultSchema.index({ userId: 1, type: 1 });
VaultSchema.index({ userId: 1, createdAt: -1 });

const Vault: Model<IVaultDocument> =
    mongoose.models.Vault ||
    mongoose.model<IVaultDocument>("Vault", VaultSchema);

export default Vault;
