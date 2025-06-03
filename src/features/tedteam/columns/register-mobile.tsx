import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { RegisterSlotSchedule, DayKey } from "../slotInfo"

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
      className={cn("text-xs w-full", config.className)}
      onClick={() => !config.disabled && onStatusChange(config.nextStatus)}
      disabled={config.disabled}
    >
      {config.label}
    </Button>
  )
}

type Props = {
  data: RegisterSlotSchedule[]
  onStatusChange: (slotIndex: number, dayKey: string, newStatus: "register" | "registered" | "unregistered" | "full") => void
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
              <div key={`${slotIndex}-${idx}`} className="pb-2 mb-2 border-b last:border-none last:mb-0">
                <div className="text-sm font-medium text-gray-800 mb-1">{slotName}</div>
                <div className="mt-1 text-xs font-medium text-green-600">{cell!.time}</div>
                <div className="text-xs font-medium text-blue-600 mb-2">{cell!.date}</div>
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