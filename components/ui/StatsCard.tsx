/* ============================================================
   StatsCard Component — Dashboard Metric Display
   Icon, value, label, and optional trend indicator
   ============================================================ */

"use client";

interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    trend?: {
        value: number;
        positive: boolean;
    };
    color?: "primary" | "accent" | "danger" | "success" | "info";
    className?: string;
}

const colorStyles = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-amber-600",
    danger: "bg-danger/10 text-danger",
    success: "bg-success/10 text-success",
    info: "bg-info/10 text-info",
};

export default function StatsCard({
    icon,
    label,
    value,
    trend,
    color = "primary",
    className = "",
}: StatsCardProps) {
    return (
        <div
            className={`
        bg-bg-card border border-border rounded-2xl p-5
        card-hover group
        ${className}
      `}
        >
            <div className="flex items-start justify-between">
                <div
                    className={`
            p-3 rounded-xl ${colorStyles[color]}
            transition-transform duration-300 group-hover:scale-110
          `}
                >
                    {icon}
                </div>
                {trend && (
                    <span
                        className={`
              inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold
              ${trend.positive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}
            `}
                    >
                        <svg
                            className={`w-3 h-3 ${trend.positive ? "" : "rotate-180"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {Math.abs(trend.value)}%
                    </span>
                )}
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold text-text-primary">{value}</p>
                <p className="text-sm text-text-secondary mt-0.5">{label}</p>
            </div>
        </div>
    );
}
