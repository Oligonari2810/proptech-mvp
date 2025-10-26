import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  color?: "accent" | "brand";
}

export default function Badge({ children, color = "accent" }: BadgeProps) {
  const map = {
    accent: "bg-accent-50 text-accent-700",
    brand: "bg-brand-50 text-brand-700",
  };
  return (
    <span
      className={`text-xs font-medium rounded-full px-2 py-1 ${map[color]}`}
      role="status"
    >
      {children}
    </span>
  );
}
