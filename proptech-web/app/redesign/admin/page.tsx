'use client';

// Page debe ser dinámica para evitar prerender
export const dynamic = 'force-dynamic';

import AdminDashboard from '../../components/redesign/AdminDashboard';
import '../../styles/redesign/globals.css';
import '../../styles/redesign/theme.css';

export default function RedesignAdminPage() {
  return <AdminDashboard />;
}

