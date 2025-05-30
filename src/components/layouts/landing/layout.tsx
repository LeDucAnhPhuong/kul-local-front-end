"use client"
import { Outlet } from 'react-router';

import Footer from './footer';
import Header from './header';
import { useSession } from '@clerk/clerk-react';
import useRouter from '@/hooks/use-router';
import { useEffect } from 'react';

function LandingLayout() {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace('/dashboard');
    }
  }, [session]);
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default LandingLayout;
