import { notFound } from 'next/navigation';

// Página demo temporalmente deshabilitada
// En producción, redirigir o mostrar 404
export default function DemoAssetsPage() {
  notFound();
}
