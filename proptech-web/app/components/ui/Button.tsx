import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-50";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-soft",
    secondary:
      "bg-white text-ink-900 border border-gray-200 hover:bg-gray-50",
    ghost: "bg-transparent text-ink-700 hover:bg-gray-50",
  };
  return (
    <button
      {...props}
      className={[base, sizes[size], variants[variant], className].join(" ")}
    >
      {children}
    </button>
  );
}
