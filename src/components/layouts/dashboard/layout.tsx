import { Outlet, useNavigate } from 'react-router';
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

import { UserButton, useSession} from '@clerk/clerk-react';

import { AppSidebar } from './app-sidebar';

export default function DashboardLayout() {
  const { session } = useSession();
  

  const navigate = useNavigate();
  if (!session) {
    toast.error('You must be logged in to access this page');
    navigate('/sign-in');
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
            <UserButton />
          </div>
        </header>
        <div className="flex flex-col flex-1 gap-4 p-4 bg-primary/5">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
