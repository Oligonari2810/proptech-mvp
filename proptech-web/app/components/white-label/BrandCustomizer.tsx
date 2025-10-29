"use client";
import { useState } from "react";
import ThemeProvider, { useThemeConfig } from "./ThemeProvider";

export default function BrandCustomizer() {
  const current = useThemeConfig();
  const [primary, setPrimary] = useState(current.colors.primary);
  const [secondary, setSecondary] = useState(current.colors.secondary);

  return (
    <div className="bg-white p-4 rounded-lg border space-y-3">
      <h3 className="font-semibold">Personalización de Marca</h3>
      <div className="flex gap-4 items-center">
        <label className="text-sm">Primario</label>
        <input type="color" value={primary} onChange={(e)=>setPrimary(e.target.value)} />
        <label className="text-sm">Secundario</label>
        <input type="color" value={secondary} onChange={(e)=>setSecondary(e.target.value)} />
      </div>
      <div className="p-3 rounded" style={{ background: secondary }}>
        <button className="px-3 py-1 rounded text-white" style={{ background: primary }}>Botón Preview</button>
      </div>
      <ThemeProvider theme={{ colors: { primary, secondary, accent: current.colors.accent, background: current.colors.background } }}>
        <div className="text-sm text-gray-600">Vista previa aplicada.</div>
      </ThemeProvider>
    </div>
  );
}


