
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page just acts as a router to the correct admin page.
export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    // In a real app, you would check for a valid session.
    // For this prototype, we'll use localStorage as a simple check.
    const isAdminLoggedIn = typeof window !== 'undefined' && localStorage.getItem('admin_logged_in') === 'true';

    if (isAdminLoggedIn) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return null; // or a loading spinner
}
