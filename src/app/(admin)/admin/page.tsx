'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

// This page just acts as a router to the correct admin page.
export default function AdminRootPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // Wait until auth state is loaded

    // Check a local storage flag to see if the last login was for an admin
    const isAdminLoggedIn = typeof window !== 'undefined' && localStorage.getItem('admin_logged_in') === 'true';

    if (user && isAdminLoggedIn) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin-login');
    }
  }, [user, loading, router]);

  return null; // or a loading spinner
}
