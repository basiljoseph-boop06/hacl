/* ============================================================
   Health ID Generation — Unique AG-XXXX Format
   Generates collision-resistant Health IDs with optional hashing
   ============================================================ */

import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

const HEALTH_ID_SECRET = process.env.HEALTH_ID_SECRET || "carelytix-secret";

/**
 * Generate a unique Health ID in the format AG-XXXX
 * Uses UUID v4 and takes first 8 hex characters for uniqueness.
 */
export function generateHealthId(): string {
    const uuid = uuidv4().replace(/-/g, "");
    const shortId = uuid.substring(0, 8).toUpperCase();
    return `AG-${shortId}`;
}

/**
 * Hash a sensitive value using HMAC-SHA256 for storage.
 * Useful for hashing Health IDs or other PII for lookups.
 */
export function hashSensitiveData(data: string): string {
    return CryptoJS.HmacSHA256(data, HEALTH_ID_SECRET).toString(
        CryptoJS.enc.Hex
    );
}

/**
 * Create a verification hash for QR code data.
 * Encodes user ID + timestamp so the QR can be validated.
 */
export function createQRPayload(userId: string, healthId: string): string {
    const payload = {
        userId,
        healthId,
        timestamp: Date.now(),
        nonce: uuidv4().substring(0, 6),
    };
    const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(payload),
        HEALTH_ID_SECRET
    ).toString();
    return encrypted;
}

/**
 * Decrypt and validate a QR payload.
 * Returns null if invalid or expired (>30 min).
 */
export function verifyQRPayload(
    encrypted: string
): { userId: string; healthId: string; timestamp: number } | null {
    try {
        const bytes = CryptoJS.AES.decrypt(encrypted, HEALTH_ID_SECRET);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        const payload = JSON.parse(decrypted);

        // QR codes expire after 30 minutes
        const THIRTY_MINUTES = 30 * 60 * 1000;
        if (Date.now() - payload.timestamp > THIRTY_MINUTES) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}
