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
          title: 'Account Management',
          url: '/account-management',
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
      case 'TedTeam':
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
