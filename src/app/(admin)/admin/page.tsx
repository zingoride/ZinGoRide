
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

    // In a real app, you would check for a valid session and admin role.
    // For this prototype, we'll use auth state as a simple check.
    const isAdminLoggedIn = !!user;

    if (isAdminLoggedIn) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [user, loading, router]);

  return null; // or a loading spinner
}
