'use client';

import useRouter from '@/hooks/use-router';
import { useLayoutEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  useLayoutEffect(() => {
    router.replace('/dashboard');
    window.location.reload();
  }, []);

  return <div>...loading</div>;
}
