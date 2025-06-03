import { useState, useEffect, useCallback } from "react"
import { registerScheduleDummyData, transformRegisterScheduleData } from "../teddata"
import { createRegisterScheduleColumns } from "../columns/register-schedule-columns"
import { RegisterMobileView } from "../columns/register-mobile"
import { TedDataTable } from "./ted-data"
import type { RegisterSlotSchedule } from "../slotInfo"

export default function RegisterSchedule() {
  const [data, setData] = useState<RegisterSlotSchedule[]>(() =>
    transformRegisterScheduleData(registerScheduleDummyData)
  )
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleStatusChange = useCallback((
    rowIndex: number,
    dayKey: string,
    newStatus: "register" | "registered" | "unregistered" | "full",
  ) => {
    setData((prevData) =>
      prevData.map((row, index) => {
        if (index === rowIndex) {
          const currentCell = row[dayKey as keyof RegisterSlotSchedule]
          if (currentCell && typeof currentCell === 'object' && 'status' in currentCell) {
            return {
              ...row,
              [dayKey]: {
                ...currentCell,
                status: newStatus,
              },
            }
          }
          return row
        }
        return row
      }),
    )
  }, [])

  const columns = createRegisterScheduleColumns(handleStatusChange)

  return (
    <div className="bg-white dark:bg-background p-6 rounded-xl border border-stone-200 dark:border-stone-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Work Schedule Registration</h2>
        <p className="text-muted-foreground">
          Click status buttons to register or unregister for work shifts.
        </p>
      </div>

      {isMobile ? (
        <RegisterMobileView data={data} onStatusChange={handleStatusChange} />
      ) : (
        <TedDataTable data={data} columns={columns} onRowClick={() => { }} />
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Available to Register</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Registered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Unregistered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span>Full</span>
          </div>
        </div>
        <div className="mt-2 text-xs">
          Time slots: Slot 1 (07:30-09:30) | Slot 2 (09:45-11:45) | Slot 3 (13:00-15:00)
        </div>
      </div>
    </div>
  )
}