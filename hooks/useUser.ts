/* ============================================================
   useUser Hook — Fetch Current User Profile from API
   ============================================================ */

"use client";

import { useState, useEffect, useCallback } from "react";
import { IUser } from "@/types";
import { useAuth } from "./useAuth";

interface UseUserReturn {
    user: IUser | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useUser(): UseUserReturn {
    const { user: firebaseUser, getIdToken } = useAuth();
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        if (!firebaseUser) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const token = await getIdToken();
            const res = await fetch("/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch user profile");
            }

            const data = await res.json();
            if (data.success) {
                setUser(data.data);
            } else {
                setError(data.message || "Failed to fetch user");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [firebaseUser, getIdToken]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return { user, loading, error, refetch: fetchUser };
}
