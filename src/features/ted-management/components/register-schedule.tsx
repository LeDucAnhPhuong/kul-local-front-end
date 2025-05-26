import React from "react"
import { useState } from "react"
import { TedDataTable } from "./ted-data"
import { createScheduleColumns } from "../columns/register-schedule-columns"
import { RegisterMobileView } from "../columns/register-mobile"
import { tedWorkScheduleData } from "../teddata"
import type { WorkSlot } from "../slotInfo"

export default function RegisterSchedule() {
  const [data, setData] = useState<WorkSlot[]>(tedWorkScheduleData)
  const [isMobile, setIsMobile] = useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleStatusChange = (rowIndex: number, dayKey: string, newStatus: "register" | "unregister" | "not-yet") => {
    setData((prevData) =>
      prevData.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [dayKey]: row[dayKey as keyof WorkSlot]
              ? {
                  ...(row[dayKey as keyof WorkSlot] as any),
                  status: newStatus,
                }
              : undefined,
          }
        }
        return row
      }),
    )
  }

  const columns = createScheduleColumns(handleStatusChange)

  return (
    <div className="bg-white dark:bg-background p-6 rounded-xl border border-stone-200 dark:border-stone-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Work Schedule Registration</h2>
        <p className="text-muted-foreground">Click status buttons to register or unregister for work shifts</p>
      </div>

      {isMobile ? (
        <RegisterMobileView data={data} onStatusChange={handleStatusChange} />
      ) : (
        <TedDataTable data={data} columns={columns} onRowClick={() => {}} />
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Registered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Unregistered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span>Not Registered</span>
          </div>
        </div>
      </div>
    </div>
  )
}
