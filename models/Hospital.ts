/* ============================================================
   Hospital Model — Mongoose Schema
   Healthcare facility with geolocation and capacity tracking
   ============================================================ */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHospitalDocument extends Document {
    name: string;
    address: string;
    location: {
        lat: number;
        lng: number;
    };
    verificationLevel: number;
    loadCapacity: number;
    specialties: string[];
    phone: string;
    imageUrl?: string;
    createdAt: Date;
}

const HospitalSchema = new Schema<IHospitalDocument>(
    {
        name: {
            type: String,
            required: [true, "Hospital name is required"],
            trim: true,
        },
        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true,
        },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        verificationLevel: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            default: 1,
        },
        loadCapacity: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
            default: 50,
        },
        specialties: {
            type: [String],
            default: [],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        imageUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Geo-index for location-based queries
HospitalSchema.index({ "location.lat": 1, "location.lng": 1 });

const Hospital: Model<IHospitalDocument> =
    mongoose.models.Hospital ||
    mongoose.model<IHospitalDocument>("Hospital", HospitalSchema);

export default Hospital;
