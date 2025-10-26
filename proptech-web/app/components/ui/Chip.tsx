import React from "react";

export interface ChipProps {
  label: string;
  onClick?: () => void;
}

export default function Chip({ label, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs border border-gray-200 bg-white hover:bg-gray-50 transition"
    >
      {label}
    </button>
  );
}
