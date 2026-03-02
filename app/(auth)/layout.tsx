/* ============================================================
   Auth Layout — Centered Card with Background Pattern
   Shared by login and register pages
   ============================================================ */

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 gradient-hero" />
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-info/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/8 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-md px-4 py-8">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary shadow-xl mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Carelytix</h1>
                    <p className="text-gray-400 text-sm mt-1">Digital Health Identity Platform</p>
                </div>

                {/* Card */}
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
