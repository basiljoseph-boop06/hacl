/* ============================================================
   Card Component — Glassmorphism Container
   Hover lift animation, padding variants
   ============================================================ */

"use client";

import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "gradient" | "bordered";
    padding?: "sm" | "md" | "lg" | "none";
    hover?: boolean;
}

const variantStyles = {
    default: "bg-bg-card border border-border",
    glass: "glass",
    gradient: "gradient-card border border-border",
    bordered: "bg-bg-card border-2 border-primary/20",
};

const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            variant = "default",
            padding = "md",
            hover = false,
            className = "",
            children,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={`
          rounded-2xl
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${hover ? "card-hover" : ""}
          shadow-sm
          ${className}
        `}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";
export default Card;
