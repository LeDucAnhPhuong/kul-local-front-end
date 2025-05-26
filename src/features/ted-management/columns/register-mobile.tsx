import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { WorkSlot } from "../types/slot-info.ts"

type DayKey = "t2" | "t3" | "t4" | "t5" | "t6" | "t7" | "cn"

const dayHeaderMap: Record<DayKey, string> = {
  t2: "Monday",
  t3: "Tuesday",
  t4: "Wednesday",
  t5: "Thursday",
  t6: "Friday",
  t7: "Saturday",
  cn: "Sunday",
}

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
    <Button
      size="sm"
      className={cn("text-xs w-full", config.className)}
      onClick={() => onStatusChange(config.nextStatus)}
    >
      {config.label}
    </Button>
  )
}

type Props = {
  data: WorkSlot[]
  onStatusChange: (slotIndex: number, dayKey: string, newStatus: "register" | "unregister" | "not-yet") => void
}

export const RegisterMobileView: React.FC<Props> = ({ data, onStatusChange }) => {
  const dayKeys: DayKey[] = ["t2", "t3", "t4", "t5", "t6", "t7", "cn"]

  return (
    <div className="block space-y-4 md:hidden">
      {dayKeys.map((dayKey) => {
        const slotsWithDay = data
          .map((slot, slotIndex) => ({
            slotName: slot.slot,
            slotIndex,
            cell: slot[dayKey],
          }))
          .filter((item) => item.cell)

        if (slotsWithDay.length === 0) return null

        return (
          <div key={dayKey} className="p-3 bg-white shadow rounded-xl">
            <h3 className="mb-2 text-lg font-bold text-blue-600">{dayHeaderMap[dayKey]}</h3>
            {slotsWithDay.map(({ slotName, slotIndex, cell }, idx) => (
              <div key={idx} className="pb-2 mb-2 border-b last:border-none last:mb-0">
                <div className="text-sm font-semibold text-gray-700">{slotName}</div>
                <div className="text-sm font-medium">{cell!.shiftCode}</div>
                <div className="text-xs text-muted-foreground">at {cell!.location}</div>
                <div className="text-xs text-gray-600 mb-2">{cell!.time}</div>
                <StatusButton
                  status={cell!.status}
                  onStatusChange={(newStatus) => onStatusChange(slotIndex, dayKey, newStatus)}
                />
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

