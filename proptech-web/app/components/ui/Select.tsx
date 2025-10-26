import React from "react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  // Extends all select attributes
  variant?: "default" | "error";
}

export default function Select({ className = "", ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`w-full rounded-2xl border border-gray-300 px-3 py-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-300 ${className}`}
    />
  );
}
