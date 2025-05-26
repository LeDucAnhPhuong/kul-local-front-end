import type { ColumnDef, Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { WorkSlot, WorkShift } from "../types/slot-info"

const StatusButton = ({
  status,
  onStatusChange,
}: {
  status: "register" | "unregister" | "not-yet"
  onStatusChange: (newStatus: "register" | "unregister" | "not-yet") => void
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "register":
        return {
          label: "Registered",
          className: "bg-green-500 hover:bg-green-600 text-white",
          nextStatus: "unregister" as const,
        }
      case "unregister":
        return {
          label: "Unregistered",
          className: "bg-red-500 hover:bg-red-600 text-white",
          nextStatus: "not-yet" as const,
        }
      case "not-yet":
        return {
          label: "Not Registered",
          className: "bg-gray-500 hover:bg-gray-600 text-white",
          nextStatus: "register" as const,
        }
      default:
        return {
          label: "Not Registered",
          className: "bg-gray-500 hover:bg-gray-600 text-white",
          nextStatus: "register" as const,
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Button size="sm" className={cn("text-xs", config.className)} onClick={() => onStatusChange(config.nextStatus)}>
      {config.label}
    </Button>
  )
}

export const createScheduleColumns = (
  handleStatusChange: (rowIndex: number, dayKey: string, newStatus: "register" | "unregister" | "not-yet") => void,
): ColumnDef<WorkSlot>[] => [
  {
    accessorKey: "slot",
    header: "Work Shift",
    cell: ({ row }) => <div className="font-medium text-center py-4">{row.getValue("slot")}</div>,
  },
  ...["t2", "t3", "t4", "t5", "t6", "t7", "cn"].map((dayKey) => ({
    accessorKey: dayKey,
    header: () => {
      const dayNames = {
        t2: "Mon",
        t3: "Tue",
        t4: "Wed",
        t5: "Thu",
        t6: "Fri",
        t7: "Sat",
        cn: "Sun",
      }
      return <div className="text-center">{dayNames[dayKey as keyof typeof dayNames]}</div>
    },
    cell: ({ row, table }: { row: Row<WorkSlot>; table: any }) => {
      const cell: WorkShift | undefined = row.getValue(dayKey)
      const rowIndex = table.getRowModel().rows.findIndex((r: Row<WorkSlot>) => r.id === row.id)

      if (!cell) {
        return <div className="flex justify-center items-center text-red-500 text-2xl py-4">-</div>
      }

      return (
        <div className="space-y-2 p-2">
          <div className="space-y-1">
            <p className="font-semibold text-sm">{cell.shiftCode}</p>
            <p className="text-xs text-muted-foreground">at {cell.location}</p>
            <p className="text-xs text-blue-600 font-medium">{cell.time}</p>
          </div>
          <StatusButton
            status={cell.status}
            onStatusChange={(newStatus) => handleStatusChange(rowIndex, dayKey, newStatus)}
          />
        </div>
      )
    },
    meta: {
      sort: false,
      filter: false,
    },
  })),
]
