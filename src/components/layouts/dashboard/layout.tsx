import { Outlet } from 'react-router';
import { toast } from 'sonner';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import { useAuth, UserButton, useSession } from '@clerk/clerk-react';

import { AppSidebar } from './app-sidebar';
import useRouter from '@/hooks/use-router';
import { useEffect } from 'react';
import { getClientCookie, setClientCookie } from '@/lib/jsCookies';

export default function DashboardLayout() {
  const { session } = useSession();
  const { getToken } = useAuth();

  const getAccessToken = async () => {
    try {
      const token = await getToken({ template: 'access_token' });
      if (!token) {
        throw new Error('Failed to retrieve token');
      }

      setClientCookie('access_token', token);
      window.location.reload();
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  useEffect(() => {
    const accessToken = getClientCookie('access_token');
    if (!accessToken) getAccessToken();
  }, [getToken]);

  const router = useRouter();
  if (!session) {
    toast.error('You must be logged in to access this page');
    router.push('/sign-in');
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex items-center justify-between h-16 gap-2 px-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4 mr-2" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/sign-out" />
          </div>
        </header>
        <div className="flex flex-col flex-1 gap-4 p-4 bg-primary/5">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
