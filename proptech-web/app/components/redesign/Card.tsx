'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const hoverStyles = hover ? 'hover:transform hover:-translate-y-1 cursor-pointer' : '';
  
  return (
    <div
      className={`redesign-card bg-white p-6 ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

