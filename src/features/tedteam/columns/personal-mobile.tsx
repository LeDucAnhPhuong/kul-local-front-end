import type React from "react"
import type { SlotSchedule, DayKey } from "../slotInfo"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const dayHeaderMap: Record<DayKey, string> = {
  t2: "Monday",
  t3: "Tuesday",
  t4: "Wednesday",
  t5: "Thursday",
  t6: "Friday",
  t7: "Saturday",
  cn: "Sunday",
}

type Props = {
  data: SlotSchedule[]
}

export const PersonalScheduleMobileView: React.FC<Props> = ({ data }) => {
  const dayKeys: DayKey[] = ["t2", "t3", "t4", "t5", "t6", "t7", "cn"]

  return (
    <div className="block space-y-4 md:hidden">
      {dayKeys.map((dayKey) => {
        const slotsWithDay = data
          .map((slot) => ({ slotName: slot.slot, cell: slot[dayKey] }))
          .filter((item) => item.cell)

        if (slotsWithDay.length === 0) return null

        return (
          <div key={dayKey} className="p-3 bg-white shadow rounded-xl">
            <h3 className="mb-2 text-lg font-bold text-blue-600">{dayHeaderMap[dayKey]}</h3>

            {slotsWithDay.map(({ slotName, cell }, idx) => (
              <div key={idx} className="pb-2 mb-2 border-b last:border-none last:mb-0">
                <div className="text-sm font-semibold text-gray-700">Slot: {slotName}</div>
                <div className="text-sm font-medium truncate">{cell!.topic}</div>
                <div className="text-xs text-muted-foreground">by {cell!.instructor}</div>
                <div className="text-xs text-gray-600">
                  {/* Room {cell!.room_id} | Class {cell!.class_id} */}
                </div>
                <Badge
                  className={cn(
                    "text-xs px-2 py-1 w-fit mt-1",
                    cell!.status === "not yet"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : cell!.status === "absent"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600",
                  )}
                >
                  {cell!.status === "not yet" ? "Not Yet" : cell!.status === "absent" ? "Absent" : "Present"}
                </Badge>
                <div className="mt-1 text-xs font-medium text-green-600">{cell!.time}</div>
                <div className="text-xs font-medium text-blue-600">{cell!.date}</div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

