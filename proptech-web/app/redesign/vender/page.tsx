'use client';

import PropertyForm from '../../components/redesign/PropertyForm';
import NextAuthRoleGuard from '../../components/auth/NextAuthRoleGuard';
import '../../styles/redesign/globals.css';
import '../../styles/redesign/theme.css';

export default function RedesignVenderPage() {
  return (
    <NextAuthRoleGuard allowedRoles={['broker', 'admin']}>
      <div className="min-h-screen bg-warm-bg">
        <PropertyForm />
      </div>
    </NextAuthRoleGuard>
  );
}

