/* ============================================================
   Carelytix — Core TypeScript Types
   ============================================================ */

// ─── Enums ───────────────────────────────────────────────────

export type VerificationStatus = "pending" | "verified" | "rejected";

export type VaultRecordType = "vitals" | "lab" | "xray" | "prescription";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type UrgencyLevel = "low" | "medium" | "high" | "critical";

// ─── Location ────────────────────────────────────────────────

export interface GeoLocation {
  lat: number;
  lng: number;
}

// ─── User ────────────────────────────────────────────────────

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  healthId: string;
  bloodGroup: BloodGroup;
  assignedHospitalId: string;
  verificationStatus: VerificationStatus;
  vitalityScore: number;
  karmaScore: number;
  location?: GeoLocation;
  firebaseUid: string;
  createdAt: Date;
  updatedAt?: Date;
}

// ─── Hospital ────────────────────────────────────────────────

export interface IHospital {
  _id?: string;
  name: string;
  address: string;
  location: GeoLocation;
  verificationLevel: number;
  loadCapacity: number;
  specialties: string[];
  phone: string;
  imageUrl?: string;
  createdAt: Date;
}

// ─── Vault Record ────────────────────────────────────────────

export interface IVault {
  _id?: string;
  userId: string;
  hospitalId: string;
  type: VaultRecordType;
  title: string;
  data: Record<string, unknown>;
  verified: boolean;
  doctorSignature?: string;
  fileUrl?: string;
  createdAt: Date;
}

// ─── Blood Request ───────────────────────────────────────────

export interface IBloodRequest {
  _id?: string;
  hospitalId: string;
  hospitalName?: string;
  bloodType: BloodGroup;
  urgency: UrgencyLevel;
  location: GeoLocation;
  active: boolean;
  contactPhone: string;
  unitsNeeded: number;
  unitsFulfilled: number;
  createdAt: Date;
}

// ─── API Response ────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ─── AI Oracle ───────────────────────────────────────────────

export interface AIAnalysisResult {
  summary: string;
  findings: string[];
  recommendations: string[];
  riskLevel: "low" | "moderate" | "high";
  confidence: number;
}

export interface DonorEligibility {
  eligible: boolean;
  reasons: string[];
  nextEligibleDate?: string;
  recommendations: string[];
}
