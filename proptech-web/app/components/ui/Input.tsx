import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // Extends all input attributes
  variant?: "default" | "error";
}

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-300 ${className}`}
    />
  );
}
