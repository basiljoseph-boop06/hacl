/* ============================================================
   Firebase Admin SDK — Server-side Initialization
   Used for verifying tokens and server-side auth operations
   Lazy-initialized to avoid build-time errors
   ============================================================ */

import admin from "firebase-admin";

/**
 * Get or initialize the Firebase Admin app.
 * Lazy initialization prevents build-time errors
 * when environment variables are not yet available.
 */
function getAdminApp(): admin.app.App {
    if (admin.apps.length > 0) {
        return admin.apps[0]!;
    }

    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
        // Return a minimal app for development/build
        return admin.initializeApp({
            projectId: projectId || "carelytix-dev",
        });
    }

    return admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
        }),
    });
}

/**
 * Get the Firebase Admin Auth instance.
 */
export function getAdminAuth(): admin.auth.Auth {
    return getAdminApp().auth();
}

export const adminAuth = {
    verifyIdToken: async (token: string) => {
        return getAdminAuth().verifyIdToken(token);
    },
};

export default admin;
