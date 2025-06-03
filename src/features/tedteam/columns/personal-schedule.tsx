import type { ColumnDef, Row } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { SlotSchedule, ScheduleCell } from "../slotInfo"

export const personalWorkColumns: ColumnDef<SlotSchedule>[] = [
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
    cell: ({ row }: { row: Row<SlotSchedule> }) => {
      const cell: ScheduleCell | undefined = row.getValue(dayKey)

      if (!cell) {
        return <div className="flex items-center justify-center py-2 text-lg text-red-500 md:text-2xl">-</div>
      }

      return (
        <div className="space-y-1 p-1 min-w-[120px] max-w-[160px]">
          <div className="space-y-1">
            <p className="text-xs font-semibold leading-tight md:text-sm line-clamp-2">{cell.topic}</p>
            <p className="text-xs leading-tight text-muted-foreground">by {cell.instructor}</p>
          </div>

          <div className="text-xs leading-tight text-gray-600">
            Room {cell.room_id} | Class {cell.class_id}
          </div>
          <Badge
            className={cn(
              "text-xs px-2 py-1 w-fit",
              cell.status === "not yet"
                ? "bg-orange-500 hover:bg-orange-600"
                : cell.status === "absent"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600",
            )}
          >
            {cell.status === "not yet" ? "Not Yet" : cell.status === "absent" ? "Absent" : "Present"}
          </Badge>

          <div className="text-xs font-medium leading-tight text-green-600">{cell.time}</div>

          <div className="text-xs font-medium leading-tight text-blue-600">{cell.date}</div>
        </div>
      )
    },
    meta: {
      sort: false,
      filter: false,
    },
  })),
]

