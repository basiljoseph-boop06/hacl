/* ============================================================
   Badge Component — Status Indicators
   ============================================================ */

"use client";

type BadgeVariant = "verified" | "pending" | "urgent" | "info" | "success" | "warning" | "default";

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    dot?: boolean;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    verified: "bg-success/10 text-success border-success/20",
    pending: "bg-accent/10 text-amber-700 border-accent/20",
    urgent: "bg-danger/10 text-danger border-danger/20",
    info: "bg-info/10 text-info border-info/20",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-accent/10 text-amber-700 border-accent/20",
    default: "bg-gray-100 text-text-secondary border-gray-200",
};

const dotColors: Record<BadgeVariant, string> = {
    verified: "bg-success",
    pending: "bg-accent",
    urgent: "bg-danger",
    info: "bg-info",
    success: "bg-success",
    warning: "bg-accent",
    default: "bg-gray-400",
};

export default function Badge({
    variant = "default",
    children,
    dot = false,
    className = "",
}: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center gap-1.5
        px-2.5 py-0.5
        text-xs font-semibold
        rounded-full border
        ${variantStyles[variant]}
        ${className}
      `}
        >
            {dot && (
                <span
                    className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} ${variant === "urgent" ? "animate-pulse" : ""
                        }`}
                />
            )}
            {children}
        </span>
    );
}
