import { Fragment, useEffect, useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
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
import { getClientCookie, setClientCookie } from '@/lib/jsCookies';

const ROUTE_NAMES: Record<string, string> = {
  dashboard: 'Dashboard',
  'schedule-student': 'My Schedule',
  'quizzes-student': 'Quizzes',
  'list-news': 'News',
  assignment: 'Assignment',
  'academic-progress': 'Academic Progress',
  'speaking-practice': 'Speaking Practice',
  'view-quiz': 'Quiz',
  schedule: 'Schedule',
  'grade-news': 'Grade News',
  'assignment-coach': 'Assignment',
  'statics-quiz': 'Statistics',
  'personal-tedteam': 'Personal Profile',
  'register-tedteam': 'Register Ted Team',
  'view-classlist': 'View Classes',
  'class-management': 'Class Management',
  'schedule-management': 'Schedule Management',
  'room-management': 'Room Management',
  'slot-management': 'Slot Management',
  'account-management': 'Account Management',
  'statics-overview': 'Statistics Overview',
  'register-management': 'Registrations',
  leaderboard: 'Leaderboard',
  add: 'Add New',
  'make-quiz': 'Make Quiz',
  'assignment-submission': 'Submission Detail',
  'detail-class': 'Class Detail',
  ClassList: 'Class List',
  'update-room': 'Update',
  'update-slot': 'Update',
  'update-class': 'Update',
  'add-student': 'Add Student',
  news: 'News Detail',
  assignments: 'Assignment',
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function segmentToLabel(seg: string): string {
  if (UUID_RE.test(seg)) return '...';
  return (
    ROUTE_NAMES[seg] ??
    seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export default function DashboardLayout() {
  const { session } = useSession();
  const { getToken } = useAuth();
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    return segments.map((seg, i) => ({
      label: segmentToLabel(seg),
      path: '/' + segments.slice(0, i + 1).join('/'),
    }));
  }, [location.pathname]);

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
                {breadcrumbs.map((crumb, index) => (
                  <Fragment key={crumb.path}>
                    {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.path}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                ))}
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
