'use client';
import * as React from 'react';
import { Link, useLocation } from 'react-router';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

import { VersionSwitcher } from '@/components/layouts/dashboard/version-switcher';
import { useGetRoleQuery } from '@/features/auth/api';

// This is sample data.
const AdminData = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Getting Started',
      url: '#',
      items: [
        {
          title: 'Dashboard Home',
          url: '/dashboard',
        },
        {
          title: 'Schedule Management',
          url: '/schedule-management',
        },
        {
          title: 'Account Management',
          url: '/account-management',
        },
        {
          title: 'Room Management',
          url: '/room-management',
        },
        {
          title: 'Slot Management',
          url: '/slot-management',
        },
        {
          title: 'Class Management',
          url: '/class-management',
        },
        {
          title: 'Ted Team Registrations',
          url: '/register-management',
        },
      ],
    },
  ],
};
const StudentData = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Getting Started',
      url: '#',
      items: [
        {
          title: 'Dashboard Home',
          url: '/dashboard',
        },
        {
          title: 'Schedule Student',
          url: '/schedule-student',
        },
        {
          title: 'Quizzes Student',
          url: '/quizzes-student',
        },

        {
          title: 'List News',
          url: '/list-news',
        },
      ],
    },
  ],
};
const CoachData = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Getting Started',
      url: '#',
      items: [
        {
          title: 'Dashboard Home',
          url: '/dashboard',
        },
        {
          title: 'Quiz',
          url: '/view-quiz',
        },
        {
          title: 'Schedule',
          url: '/schedule',
        },
        {
          title: 'Grade News',
          url: '/grade-news',
        },
        {
          title: 'Assignment',
          url: '/assignment',
        },
      ],
    },
  ],
};
const TedTeamData = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Getting Started',
      url: '#',
      items: [
        {
          title: 'Dashboard Home',
          url: '/dashboard',
        },
        {
          title: 'Personal Ted Team',
          url: '/personal-tedteam',
        },
        {
          title: 'Register Ted Team',
          url: '/register-tedteam',
        },
        {
          title: 'View Classes',
          url: '/view-classlist',
        },
      ],
    },
  ],
};

type SidebarNavItem = {
  title: string;
  url: string;
};

type SidebarNavGroup = {
  title: string;
  url: string;
  items: SidebarNavItem[];
};

type SidebarData = {
  versions: string[];
  navMain: SidebarNavGroup[];
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [data, setData] = React.useState<SidebarData>({
    versions: [],
    navMain: [],
  });

  const { role } = useGetRoleQuery(undefined, {
    selectFromResult: ({ data }) => ({
      role: data?.data,
    }),
  });

  React.useEffect(() => {
    switch (role) {
      case 'Admin':
        setData(AdminData);
        break;
      case 'Coach':
        setData(CoachData);
        break;
      case 'Student':
        setData(StudentData);
        break;
      case 'Tedteam':
        setData(TedTeamData);
        break;
    }
  }, [role]);

  const location = useLocation();
  console.log('🚀 ~ AppSidebar ~ location:', location);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
