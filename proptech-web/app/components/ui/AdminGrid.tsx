import React from "react";

export default function AdminGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
  );
}
