import type { ColumnDef, Row } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { PersonalWorkSlot, PersonalWorkShift } from "../types/slot-info.ts"

export const personalWorkColumns: ColumnDef<PersonalWorkSlot>[] = [
  {
    accessorKey: "slot",
    header: "Work Slot",
    cell: ({ row }) => <div className="font-medium text-center py-4">{row.getValue("slot")}</div>,
  },
  ...["t2", "t3", "t4", "t5", "t6", "t7", "cn"].map((dayKey) => ({
    accessorKey: dayKey,
    header: () => {
      const dayNames = {
        t2: "Monday",
        t3: "Tuesday",
        t4: "Wednesday",
        t5: "Thursday",
        t6: "Friday",
        t7: "Saturday",
        cn: "Sunday",
      }
      return <div className="text-center">{dayNames[dayKey as keyof typeof dayNames]}</div>
    },
    cell: ({ row }: { row: Row<PersonalWorkSlot> }) => {
      const cell: PersonalWorkShift | undefined = row.getValue(dayKey)

      if (!cell) {
        return <div className="flex justify-center items-center text-red-500 text-2xl py-4">-</div>
      }

      return (
        <div className="space-y-2 p-2 min-w-[120px] max-w-[160px]">
          <div className="space-y-1">
            <p className="font-semibold text-sm">{cell.shiftCode}</p>
            <p className="text-xs text-muted-foreground">at {cell.location}</p>
            <p className="text-xs text-blue-600 font-medium">{cell.time}</p>
          </div>

          <Badge
            className={cn(
              "text-xs px-2 py-1 w-fit",
              cell.status === "not-yet"
                ? "bg-orange-500 hover:bg-orange-600"
                : cell.status === "absent"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600",
            )}
          >
            {cell.status === "not-yet" ? "Not Yet" : cell.status === "absent" ? "Absent" : "Present"}
          </Badge>
        </div>
      )
    },
    meta: {
      sort: false,
      filter: false,
    },
  })),
]
