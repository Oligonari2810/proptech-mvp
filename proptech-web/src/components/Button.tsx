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
  const baseStyles = "px-4 py-2 rounded-md shadow-md transition-all text-center";

  if (href) {
    return (
      <Link href={href}>
        <button className={`${baseStyles} ${className}`}>{text}</button>
      </Link>
    );
  }

  return (
    <button className={`${baseStyles} ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
