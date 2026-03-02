/* ============================================================
   Dashboard Layout — Sidebar + Main Content Area
   Protected route with auth check
   ============================================================ */

"use client";

import Sidebar from "@/components/ui/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // auth guard removed for hackathon/demo – all pages accessible without login
    return (
        <div className="min-h-screen bg-bg-main">
            <Sidebar />
            <main className="ml-64 min-h-screen">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
