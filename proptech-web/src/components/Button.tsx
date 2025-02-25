"use client"; // Esto es obligatorio para manejar eventos

import React from "react";

interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, className, onClick }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md ${className}`}
      onClick={onClick} // ✅ Manejo de eventos en un Client Component
    >
      {text}
    </button>
  );
};

export default Button;
