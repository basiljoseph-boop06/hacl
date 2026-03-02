/* ============================================================
   Root Layout — App Shell
   Includes global fonts, auth provider, metadata
   ============================================================ */

import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata: Metadata = {
  title: "Carelytix — Digital Health Identity Platform",
  description:
    "Your digital health identity, AI-powered insights, verified medical records, and blood donation community — all in one secure platform.",
  keywords: [
    "healthcare",
    "health ID",
    "medical records",
    "blood donation",
    "AI health",
    "telemedicine",
  ],
  openGraph: {
    title: "Carelytix — Digital Health Identity Platform",
    description:
      "Secure health identity, AI insights, and community-driven healthcare.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-bg-main">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
