'use client';

import { useEffect, useState } from 'react';
import { AcademicProgressSkeleton } from './academic-skeleton';
import { AcademicProgress } from './academic-progress';
import { useGetAcademicProgressQuery } from '../api.student';

interface UserInfo {
  profileImage: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  classId: string | null;
  role: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdByUser: any | null;
  updatedByUser: any | null;
}

interface RoomInfo {
  name: string;
  capacity: number;
  location: string;
  description: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdByUser: any | null;
  updatedByUser: any | null;
}

interface SlotInfo {
  name: string;
  startTime: string;
  endTime: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdByUser: any | null;
  updatedByUser: any | null;
}

interface ClassInfo {
  name: string;
  startTime: string;
  endTime: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdByUser: any | null;
  updatedByUser: any | null;
}

interface ScheduleInfo {
  room: RoomInfo;
  slot: SlotInfo;
  classInfor: ClassInfo;
  tedTeam: UserInfo | null;
  coach: UserInfo | null;
  roomId: string;
  slotId: string;
  classId: string;
  tedTeamId: string | null;
  date: string;
  coachId: string | null;
  note: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdByUser: any | null;
  updatedByUser: any | null;
}

interface AttendanceRecord {
  user: UserInfo;
  schedule: ScheduleInfo;
  userId: string;
  scheduleId: string;
  status: 0 | 1 | 2; // 0: not_yet, 1: present, 2: absent
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdByUser: any | null;
  updatedByUser: any | null;
}

interface AcademicData {
  attendanceScore: number;
  quizScore: number;
  newsScore: number;
  assignmentScore: number;
  finalScore: number;
  attendances: AttendanceRecord[];
}

export default function AcademicPage() {
  const { academicData, isLoading } = useGetAcademicProgressQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      academicData: data?.data || null,
      isLoading: isFetching,
    }),
  });

  return isLoading ? (
    <AcademicProgressSkeleton />
  ) : (
    academicData && <AcademicProgress data={academicData} />
  );
}
