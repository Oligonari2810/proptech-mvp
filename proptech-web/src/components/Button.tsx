"use client"; // 🔥 Esto es obligatorio para los eventos en Next.js

import React from "react";

interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, className = "", onClick = () => {} }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all ${className}`}
      onClick={onClick} // ✅ Siempre tendrá una función válida
    >
      {text}
    </button>
  );
};

export default Button;
