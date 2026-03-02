/* ============================================================
   useAuth Hook — Firebase Auth State Manager
   Provides auth context for the entire application
   ============================================================ */

"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
    user: FirebaseUser | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<FirebaseUser>;
    signUp: (email: string, password: string) => Promise<FirebaseUser>;
    signOut: () => Promise<void>;
    getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signIn: async () => {
        throw new Error("AuthContext not initialized");
    },
    signUp: async () => {
        throw new Error("AuthContext not initialized");
    },
    signOut: async () => { },
    getIdToken: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        return credential.user;
    };

    const signUp = async (email: string, password: string) => {
        const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        return credential.user;
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    const getIdToken = async () => {
        if (!user) return null;
        return user.getIdToken();
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, signIn, signUp, signOut, getIdToken }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
