import type { ColumnDef, Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { RegisterSlotSchedule, RegisterScheduleCell } from "../slotInfo"

const StatusButton = ({
  status,
  onStatusChange,
}: {
  status: "register" | "registered" | "unregistered" | "full"
  onStatusChange: (newStatus: "register" | "registered" | "unregistered" | "full") => void
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "register":
        return {
          label: "Register",
          className: "bg-blue-500 hover:bg-blue-600 text-white",
          nextStatus: "registered" as const,
          disabled: false,
        }
      case "registered":
        return {
          label: "Registered",
          className: "bg-green-500 hover:bg-green-600 text-white",
          nextStatus: "unregistered" as const,
          disabled: false,
        }
      case "unregistered":
        return {
          label: "Unregistered",
          className: "bg-red-500 hover:bg-red-600 text-white",
          nextStatus: "register" as const,
          disabled: false,
        }
      case "full":
        return {
          label: "Full",
          className: "bg-gray-400 text-gray-600 cursor-not-allowed",
          nextStatus: "full" as const,
          disabled: true,
        }
      default:
        return {
          label: "Register",
          className: "bg-blue-500 hover:bg-blue-600 text-white",
          nextStatus: "registered" as const,
          disabled: false,
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Button
      size="sm"
      className={cn("text-xs min-w-[80px]", config.className)}
      onClick={() => !config.disabled && onStatusChange(config.nextStatus)}
      disabled={config.disabled}
    >
      {config.label}
    </Button>
  )
}

export const createRegisterScheduleColumns = (
  handleStatusChange: (rowIndex: number, dayKey: string, newStatus: "register" | "registered" | "unregistered" | "full") => void,
): ColumnDef<RegisterSlotSchedule>[] => [
  {
    accessorKey: "slot",
    header: "Slot",
    cell: ({ row }) => <div className="text-sm font-medium md:text-base whitespace-nowrap">{row.getValue("slot")}</div>,
  },
  ...["t2", "t3", "t4", "t5", "t6", "t7", "cn"].map((dayKey) => ({
    accessorKey: dayKey,
    header: () => {
      const dayHeaderMap: Record<string, string> = {
        t2: "MON",
        t3: "TUE", 
        t4: "WED",
        t5: "THU",
        t6: "FRI",
        t7: "SAT",
        cn: "SUN",
      }
      return <div className="text-center">{dayHeaderMap[dayKey] || dayKey.toUpperCase()}</div>
    },
    cell: ({ row, table }: { row: Row<RegisterSlotSchedule>; table: any }) => {
      const cell: RegisterScheduleCell | undefined = row.getValue(dayKey)
      const rowIndex = table.getRowModel().rows.findIndex((r: Row<RegisterSlotSchedule>) => r.id === row.id)

      if (!cell) {
        return <div className="flex items-center justify-center py-2 text-lg text-red-500 md:text-2xl">-</div>
      }

      return (
        <div className="space-y-1 p-1 min-w-[120px] max-w-[160px]">
          <div className="text-xs font-medium leading-tight text-green-600">{cell.time}</div>
          <div className="text-xs font-medium leading-tight text-blue-600">{cell.date}</div>
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
