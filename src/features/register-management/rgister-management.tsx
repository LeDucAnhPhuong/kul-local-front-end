'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, Calendar, MapPin, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DataTable from '@/components/data-table/data-table';
import {
  useAcceptRegisteredMutation,
  useGerAllRegisteredTeamsQuery,
  useRejectRegisteredMutation,
} from './register.api';
import { Spinner } from '@/components/ui/spinner';

interface TedTeamUser {
  email: string;
  role: string;
  profileImage: string;
  first_name: string;
  last_name: string;
  classid: string;
  id: string;
  created_at: string;
  updated_at: string;
  isActive: boolean;
}

interface Room {
  name: string;
  capacity: number;
  location: string;
  description: string;
  id: string;
}

interface Coach {
  email: string;
  role: string;
  profileImage: string;
  first_name: string;
  last_name: string;
  id: string;
}

interface ClassInfor {
  name: string;
  startTime: string;
  endTime: string;
  id: string;
}

interface Slot {
  name: string;
  startTime: string;
  endTime: string;
  id: string;
}

interface Schedule {
  room: Room;
  coach: Coach;
  classInfor: ClassInfor;
  slot: Slot;
  date: string;
  id: string;
}

interface Registration {
  assignUser: TedTeamUser;
  schedule: Schedule;
  status: number;
  id: string;
  createdAt: string;
  updatedAt: string;
  created_at: string;
  updated_at: string;
  isActive: boolean;
}

export default function TedTeamRegistrationsPage() {
  const [acceptedRegister, { isLoading: isLoadingAccept }] = useAcceptRegisteredMutation();
  const [rejectedRegister, { isLoading: isLoadingReject }] = useRejectRegisteredMutation();
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  const { data, isFetching } = useGerAllRegisteredTeamsQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      data: data?.data || [],
      isFetching,
    }),
  });

  const handleAccept = async (registrationId: string) => {
    try {
      await acceptedRegister(registrationId).unwrap();
      toast.success('Registration accepted successfully');
      setRegistrationId(registrationId);
    } catch (error) {
      toast.error('Failed to accept registration');
    }
  };

  const handleReject = async (registrationId: string) => {
    try {
      await rejectedRegister(registrationId).unwrap();
      toast.success('Registration rejected successfully');
      setRegistrationId(registrationId);
    } catch (error) {
      toast.error('Failed to reject registration');
    }
  };

  const columns: ColumnDef<Registration>[] = [
    {
      accessorKey: 'assignUser',
      header: 'TedTeam Member',
      cell: ({ row }) => {
        const user = row.getValue('assignUser') as TedTeamUser;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.profileImage || '/placeholder.svg'}
                alt={`${user?.first_name} ${user?.last_name}`}
              />
              <AvatarFallback>
                {user?.first_name}
                {user?.last_name}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'schedule.classInfor',
      header: 'Class',
      cell: ({ row }) => {
        const className = row.original.schedule?.classInfor?.name;
        return (
          <div className="flex items-center">
            <GraduationCap className="w-4 h-4 mr-2 text-blue-500" />
            <span className="font-medium">{className}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'schedule.coach',
      header: 'Coach',
      cell: ({ row }) => {
        const coach = row.original.schedule?.coach;
        return (
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={coach?.profileImage || '/placeholder.svg'}
                alt={`${coach?.first_name} ${coach?.last_name}`}
              />
              <AvatarFallback className="text-xs">
                {coach?.first_name}
                {coach?.last_name}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {coach?.first_name} {coach?.last_name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'schedule.date',
      header: 'Schedule',
      cell: ({ row }) => {
        const schedule = row.original.schedule;
        return (
          <div className="space-y-1">
            <div className="flex items-center text-sm">
              <Calendar className="w-3 h-3 mr-1 text-gray-500" />
              {formatDate(schedule?.date)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(schedule?.slot?.startTime)} - {formatTime(schedule?.slot?.endTime)}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'schedule.room',
      header: 'Room',
      cell: ({ row }) => {
        const room = row.original.schedule?.room;
        return (
          <div className="space-y-1">
            <div className="font-medium">{room?.name}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-3 h-3 mr-1" />
              {room?.location}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as number;
        return getStatusBadge(status);
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const registration = row.original;
        const isPending = registration?.status === 1;

        return (
          <div className="flex space-x-2">
            {isPending && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  onClick={() => handleAccept(registration?.id)}
                  disabled={isFetching}
                >
                  {isLoadingAccept && registrationId === registration?.id ? (
                    <Spinner />
                  ) : (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Accept
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  onClick={() => handleReject(registration?.id)}
                  disabled={isFetching}
                >
                  {isLoadingReject && registrationId === registration?.id ? (
                    <Spinner />
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Reject
                    </>
                  )}
                </Button>
              </>
            )}
            {!isPending && (
              <span className="text-sm text-muted-foreground">
                {registration?.status === 1 ? 'Accepted' : 'Rejected'}
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const pendingCount = data?.filter((item: Registration) => item?.status === 1).length;
  const acceptedCount = data?.filter((item: Registration) => item?.status === 2).length;
  const rejectedCount = data?.filter((item: Registration) => item?.status === 3).length;

  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="container  mx-auto py-8 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">TedTeam Registration Management</h1>
          <p className="text-muted-foreground">
            Manage class registration requests from TedTeam members
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{acceptedCount}</div>
              <p className="text-xs text-muted-foreground">Approved registrations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
              <p className="text-xs text-muted-foreground">Declined requests</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registration Requests</CardTitle>
            <CardDescription>Review and manage TedTeam class registration requests</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={data} isLoading={isFetching} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const getStatusBadge = (status: number) => {
  switch (status) {
    case 1:
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case 2:
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Accepted
        </Badge>
      );
    case 3:
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (time: string) => {
  return time;
};
