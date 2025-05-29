import React from "react"
import { attendanceDummyData, transformAttendanceData } from "../teddata"
import { personalWorkColumns } from "../columns/personal-schedule"
import { PersonalScheduleMobileView } from "../columns/personal-mobile"
import { TedDataTable } from "./ted-data"

export default function PersonalSchedule() {
  const [isMobile, setIsMobile] = React.useState(false)
  const scheduleData = transformAttendanceData(attendanceDummyData)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="bg-white dark:bg-background p-6 rounded-xl border border-stone-200 dark:border-stone-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Personal Work Schedule</h2>
        <p className="text-muted-foreground">
          Your approved work shifts and attendance tracking. Please arrive on time for your scheduled shifts.
        </p>
      </div>

      {isMobile ? (
        <PersonalScheduleMobileView data={scheduleData} />
      ) : (
        <TedDataTable data={scheduleData} columns={personalWorkColumns} onRowClick={() => { }} />
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Not Yet</span>
          </div>
        </div>
      </div>
    </div>
  )
}
