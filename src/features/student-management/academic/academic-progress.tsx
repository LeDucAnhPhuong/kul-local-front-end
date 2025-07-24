'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from 'date-fns';

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

interface AcademicProgressProps {
  data: AcademicData;
}

export function AcademicProgress({ data }: AcademicProgressProps) {
  const totalAttendances = data.attendances.length;
  const absentCount = data.attendances.filter((att) => att.status === 2).length;
  const presentCount = data.attendances.filter((att) => att.status === 1).length;
  const notYetCount = data.attendances.filter((att) => att.status === 0).length;

  const getDateTime = (record: AttendanceRecord) => {
    const dateStr = record.schedule.date;
    const timeStr = record.schedule.slot.startTime;
    const dateTimeStr = `${formatDate(dateStr, 'yyyy-MM-dd')}T${timeStr}`;
    return new Date(dateTimeStr).getTime();
  };
  const attendances =
    Array.from(data?.attendances)?.sort((a, b) => {
      return getDateTime(a) - getDateTime(b);
    }) || [];

  const absentPercentage = totalAttendances > 0 ? (absentCount / totalAttendances) * 100 : 0;

  const getStatusBadge = (status: 0 | 1 | 2) => {
    switch (status) {
      case 0:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Not Yet
          </Badge>
        );
      case 1:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80">Present</Badge>;
      case 2:
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100/80">
            Absent
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Student Academic Progress</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Overview of scores and attendance records.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {/* Scores Section */}
        <div className="grid gap-4">
          <h3 className="text-xl font-semibold">Scores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Attendance Score', value: data.attendanceScore },
              { label: 'Quiz Score', value: data.quizScore },
              { label: 'News Score', value: data.newsScore },
              { label: 'Assignment Score', value: data.assignmentScore },
              { label: 'Final Score', value: data.finalScore },
            ].map((score, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{score.label}</span>
                  <span className="text-sm font-semibold">{score.value.toFixed(2)} / 10</span>
                </div>
                <Progress value={score.value * 10} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Summary Section */}
        <div className="grid gap-4">
          <h3 className="text-xl font-semibold">Attendance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <CardTitle className="text-2xl">{totalAttendances}</CardTitle>
              <CardDescription>Total Records</CardDescription>
            </Card>
            <Card className="p-4 text-center">
              <CardTitle className="text-2xl text-green-600">{presentCount}</CardTitle>
              <CardDescription>Present</CardDescription>
            </Card>
            <Card className="p-4 text-center">
              <CardTitle className="text-2xl text-red-600">{absentCount}</CardTitle>
              <CardDescription>Absent</CardDescription>
            </Card>
            <Card className="p-4 text-center">
              <CardTitle className="text-2xl text-gray-600">{notYetCount}</CardTitle>
              <CardDescription>Not Yet</CardDescription>
            </Card>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Absent Percentage</span>
              <span className="text-sm font-semibold text-red-600">
                {absentPercentage.toFixed(2)}%
              </span>
            </div>
            <Progress
              value={absentPercentage}
              className="h-3 bg-green-200 [&::-webkit-progress-value]:bg-red-500 [&::-moz-progress-bar]:bg-red-500"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This shows the percentage of absences out of total attendance records.
            </p>
          </div>
        </div>

        {/* Individual Attendance Records */}
        <div className="grid gap-4">
          <h3 className="text-xl font-semibold">Detailed Attendance Records</h3>
          {totalAttendances === 0 ? (
            <p className="text-muted-foreground text-center">No attendance records available.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Coach</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendances?.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.schedule.classInfor.name}
                      </TableCell>
                      <TableCell>{record.schedule.room.name}</TableCell>
                      <TableCell>{`${record.schedule.slot.startTime} - ${record.schedule.slot.endTime}`}</TableCell>
                      <TableCell>{new Date(record.schedule.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {record.schedule.coach
                          ? `${record.schedule.coach.firstName || ''} ${
                              record.schedule.coach.lastName || ''
                            }`.trim()
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>{new Date(record.updatedAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
