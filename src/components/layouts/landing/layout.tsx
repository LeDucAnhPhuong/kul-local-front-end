'use client';
import { Outlet } from 'react-router';

function LandingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default LandingLayout;
