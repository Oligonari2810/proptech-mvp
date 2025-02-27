"use client"; // 🔥 Necesario para manejar eventos en Next.js

import React from "react";
import Link from "next/link";

interface ButtonProps {
  text: string;
  href?: string; // ✅ Agregamos soporte para enlaces
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, href, className = "", onClick }) => {
  const baseStyles = "px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all";

  if (href) {
    // Si el botón tiene un href, lo convertimos en un Link
    return (
      <Link href={href}>
        <button className={`${baseStyles} ${className}`}>
          {text}
        </button>
      </Link>
    );
  }

  // Si no tiene href, se comporta como un botón normal con onClick
  return (
    <button className={`${baseStyles} ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
