import { notFound } from 'next/navigation';

// Página de assets temporalmente deshabilitada
// En producción, redirigir a admin dashboard
export default function AssetsPage() {
  notFound();
}
