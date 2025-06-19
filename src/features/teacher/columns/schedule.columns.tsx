import type { ColumnDef, Row } from "@tanstack/react-table"
import type { ScheduleItem } from "../types/schedule"
import { CalendarDays } from "lucide-react"

function renderScheduleCell(schedule?: ScheduleItem | null) {
  if (!schedule) return <div className="text-amber-700 text-sm ml-2 text-center">-</div>
  return (
    <div className="text-sm">
      <div className="text-blue-400">{schedule.classInfo?.name}</div>
      <div className="text-xs text-gray-600 dark:text-gray-400">
        at {schedule.room?.name} | {schedule.room?.location}
      </div>
      <div className="flex items-center gap-x-1 text-xs text-emerald-600">
        <CalendarDays className="w-3.5 h-3.5" /> {schedule.slot?.startTime} - {schedule.slot?.endTime}
      </div>
    </div>
  )
}

type ScheduleRow = {
  slotName: string
  slotId?: string
  startTime?: string
  endTime?: string
} & {
  [key in "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"]?: ScheduleItem | null
}

export const columns: ColumnDef<ScheduleRow>[] = [
  {
    accessorKey: "slotName",
    header: "Slot",
    cell: ({ row }) => (
      <div className="font-medium capitalize">
        <div>{row.original.slotName}</div>
        {row.original.startTime && row.original.endTime && (
          <div className="text-xs text-gray-500">
            {row.original.startTime} - {row.original.endTime}
          </div>
        )}
      </div>
    ),
  },
  ...(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const).map((day) => ({
    accessorKey: day,
    header: day,
    cell: ({ row }: { row: Row<ScheduleRow> }) => renderScheduleCell(row.original[day]),
  })),
]
