import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import type { TimePeriod } from './leaderboard.type';

export const getDisplayName = (user: {
  firstName: string | null;
  lastName: string | null;
  email: string;
}) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  if (user.lastName) {
    return user.lastName;
  }
  return user.email.split('@')[0];
};

export const getInitials = (user: {
  firstName: string | null;
  lastName: string | null;
  email: string;
}) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`;
  }
  if (user.firstName) {
    return user.firstName[0];
  }
  if (user.lastName) {
    return user.lastName[0];
  }
  return user.email[0].toUpperCase();
};

export const getDateRange = (period: TimePeriod) => {
  const now = new Date();

  switch (period) {
    case 'week':
      return {
        startDate: startOfWeek(now, { weekStartsOn: 1 }), // Monday start
        endDate: endOfWeek(now, { weekStartsOn: 1 }),
        label: `week ${format(now, 'w')} - ${format(now, 'yyyy')}`,
      };
    case 'month':
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
        label: format(now, 'MMMM yyyy'),
      };
    case 'year':
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now),
        label: format(now, 'yyyy'),
      };
    default:
      return {
        startDate: startOfWeek(now, { weekStartsOn: 1 }),
        endDate: endOfWeek(now, { weekStartsOn: 1 }),
        label: `Week ${format(now, 'w')} - ${format(now, 'yyyy')}`,
      };
  }
};
