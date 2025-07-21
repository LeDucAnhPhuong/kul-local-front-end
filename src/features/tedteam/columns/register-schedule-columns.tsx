import type { ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { RegisterSlotSchedule, RegisterScheduleCell } from '../slotInfo';
import { getRegisterStatus } from '../teddata';
import { formatDate } from 'date-fns';
import { useRegisterScheduleMutation, useUnregisterScheduleMutation } from '../api.tedteam';

export const StatusButton = ({
  status,
  scheduleId,
}: {
  status: 'register' | 'registered' | 'unregistered' | 'approved' | "rejected" | 'closed';
  scheduleId?: string[];
}) => {
  const [registerStatus] = useRegisterScheduleMutation();
  const [unREgisterStatus] = useUnregisterScheduleMutation();

  const handleChangeStatus = async () => {
    switch (status) {
      case 'register':
        await registerStatus({
          scheduleId,
        }).unwrap();
        break;
      case 'registered':
        await unREgisterStatus({
          scheduleId,
        }).unwrap();
        break;
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'register':
        return {
          label: 'Register',
          className: 'bg-blue-500 hover:bg-blue-600 text-white',
          nextStatus: 'registered' as const,
          disabled: false,
        };
      case 'registered':
        return {
          label: 'Registered',
          className: 'bg-green-500 hover:bg-green-600 text-white',
          nextStatus: 'unregistered' as const,
          disabled: false,
        };
      case 'unregistered':
        return {
          label: 'Unregistered',
          className: 'bg-red-500 hover:bg-red-600 text-white',
          nextStatus: 'register' as const,
          disabled: false,
        };
      case 'approved':
        return {
          label: 'Approved',
          className: 'bg-green-600 text-gray-100 cursor-not-allowed',
          nextStatus: 'approved' as const,
          disabled: true,
        };
      case 'closed':
        return {
          label: 'Closed',
          className: 'bg-gray-400 text-gray-600 cursor-not-allowed',
          nextStatus: 'closed' as const,
          disabled: true,
        };
      case 'rejected':
        return {
          label: 'Rejected',
          className: 'bg-gray-400 text-gray-600 cursor-not-allowed',
          nextStatus: 'rejected' as const,
          disabled: true,
        };
      default:
        return {
          label: 'Register',
          className: 'bg-blue-500 hover:bg-blue-600 text-white',
          nextStatus: 'registered' as const,
          disabled: false,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Button
      size="sm"
      className={cn('text-xs min-w-[80px]', config.className)}
      onClick={() => !config.disabled && handleChangeStatus()}
      disabled={config.disabled}
    >
      {config.label}
    </Button>
  );
};

export const columns: ColumnDef<RegisterSlotSchedule>[] = [
  {
    accessorKey: 'slot',
    header: 'Slot',
    cell: ({ row }) => (
      <div className="text-sm font-medium md:text-base whitespace-nowrap">
        {row.getValue('slot')}
      </div>
    ),
  },
  ...['t2', 't3', 't4', 't5', 't6', 't7', 'cn'].map((dayKey) => ({
    accessorKey: dayKey,
    header: () => {
      const dayHeaderMap: Record<string, string> = {
        t2: 'MON',
        t3: 'TUE',
        t4: 'WED',
        t5: 'THU',
        t6: 'FRI',
        t7: 'SAT',
        cn: 'SUN',
      };
      return <div className="text-center">{dayHeaderMap[dayKey] || dayKey.toUpperCase()}</div>;
    },
    cell: ({ row }: { row: Row<RegisterSlotSchedule>; }) => {
      const cell: RegisterScheduleCell | undefined = row.getValue(dayKey);

      const schedule = cell?.schedule;

      if (!schedule) {
        return (
          <div className="flex items-center justify-center py-2 text-lg text-red-500 md:text-2xl">
            -
          </div>
        );
      }

      return (
        <div className="space-y-1 p-1 min-w-[120px] w-full flex flex-col items-center">
          <div className="text-xs font-medium leading-tight text-green-600">
            {schedule?.slot?.startTime} - {schedule?.slot?.endTime}
          </div>
          <div className="text-xs font-medium leading-tight text-blue-600">
            {formatDate(schedule?.date, 'dd-MM-yyyy')}
          </div>
          <StatusButton status={getRegisterStatus(cell?.status)} scheduleId={schedule?.scheduleIds} />
        </div>
      );
    },
    meta: {
      sort: false,
      filter: false,
    },
  })),
];
