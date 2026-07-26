import type { ElementType } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardList,
  Clock,
  FileText,
  Newspaper,
  User,
  UserPlus,
  Users,
} from 'lucide-react';

import { Spinner } from '@/components/ui/spinner';
import { useGetRoleQuery } from '@/features/auth/api';
import Leaderboardpage from '../student/leaderboard';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

type QuickCardDef = {
  icon: ElementType;
  title: string;
  desc: string;
  to: string;
  iconBg: string;
};

function QuickCard({ icon: Icon, title, desc, to, iconBg }: QuickCardDef) {
  return (
    <Link to={to}>
      <div className="group flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-100 transition-all duration-200 h-full">
        <div
          className={`flex-shrink-0 w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-sm">
            {title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{desc}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
      </div>
    </Link>
  );
}

type WelcomeRole = 'Admin' | 'Coach' | 'Tedteam';

const ROLE_SUBTITLES: Record<WelcomeRole, string> = {
  Admin: 'Manage your learning center from one place.',
  Coach: 'Ready to inspire your students today?',
  Tedteam: 'Your teaching journey continues here.',
};

function WelcomeBanner({ role }: { role: WelcomeRole }) {
  return (
    <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-sm">
      <p className="text-blue-100 text-sm font-medium mb-1">{getGreeting()} 👋</p>
      <h1 className="text-2xl font-bold">{role === 'Tedteam' ? 'Ted Team Member' : role}</h1>
      <p className="mt-1 text-blue-100 text-sm">{ROLE_SUBTITLES[role]}</p>
    </div>
  );
}

const ADMIN_CARDS: QuickCardDef[] = [
  {
    icon: Users,
    title: 'Account Management',
    desc: 'Manage students, coaches & admins',
    to: '/account-management',
    iconBg: 'bg-blue-500',
  },
  {
    icon: BookOpen,
    title: 'Class Management',
    desc: 'Create and organize classes',
    to: '/class-management',
    iconBg: 'bg-emerald-500',
  },
  {
    icon: Building2,
    title: 'Room Management',
    desc: 'Manage training rooms & capacity',
    to: '/room-management',
    iconBg: 'bg-violet-500',
  },
  {
    icon: CalendarDays,
    title: 'Schedule Management',
    desc: 'Plan and view class schedules',
    to: '/schedule-management',
    iconBg: 'bg-orange-500',
  },
  {
    icon: Clock,
    title: 'Slot Management',
    desc: 'Configure available time slots',
    to: '/slot-management',
    iconBg: 'bg-pink-500',
  },
  {
    icon: BarChart3,
    title: 'Statistics Overview',
    desc: 'View performance metrics & insights',
    to: '/statics-overview',
    iconBg: 'bg-teal-500',
  },
];

const COACH_CARDS: QuickCardDef[] = [
  {
    icon: CalendarDays,
    title: 'My Schedule',
    desc: 'View your upcoming classes',
    to: '/schedule',
    iconBg: 'bg-blue-500',
  },
  {
    icon: FileText,
    title: 'Quiz',
    desc: 'Create and manage student quizzes',
    to: '/view-quiz',
    iconBg: 'bg-purple-500',
  },
  {
    icon: Newspaper,
    title: 'Grade News',
    desc: 'Score student news assignments',
    to: '/grade-news',
    iconBg: 'bg-emerald-500',
  },
  {
    icon: ClipboardList,
    title: 'Assignment',
    desc: 'Manage assignments & submissions',
    to: '/assignment-coach',
    iconBg: 'bg-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Statistics',
    desc: 'Track quiz & class performance',
    to: '/statics-quiz',
    iconBg: 'bg-teal-500',
  },
];

const TEDTEAM_CARDS: QuickCardDef[] = [
  {
    icon: User,
    title: 'Personal Profile',
    desc: 'View your Ted Team information',
    to: '/personal-tedteam',
    iconBg: 'bg-blue-500',
  },
  {
    icon: UserPlus,
    title: 'Register',
    desc: 'Sign up for available teaching slots',
    to: '/register-tedteam',
    iconBg: 'bg-emerald-500',
  },
  {
    icon: BookOpen,
    title: 'View Classes',
    desc: 'See your assigned classes',
    to: '/view-classlist',
    iconBg: 'bg-violet-500',
  },
];

function RoleDashboard({ role }: { role: WelcomeRole }) {
  const cards =
    role === 'Admin' ? ADMIN_CARDS : role === 'Coach' ? COACH_CARDS : TEDTEAM_CARDS;

  return (
    <div>
      <WelcomeBanner role={role} />
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cards.map((card) => (
            <QuickCard key={card.to} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}

const DashBoardHome = () => {
  const { role, isFetching } = useGetRoleQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      role: data?.data,
      isFetching,
    }),
  });

  if (isFetching)
    return (
      <div className="bg-white flex items-center justify-center rounded-lg p-4 w-full min-h-screen">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="bg-white rounded-lg w-full p-6 min-h-screen">
      {role === 'Student' && <Leaderboardpage />}
      {(role === 'Admin' || role === 'Coach' || role === 'Tedteam') && (
        <RoleDashboard role={role as WelcomeRole} />
      )}
    </div>
  );
};

export default DashBoardHome;
