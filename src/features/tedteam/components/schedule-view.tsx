import React, { useState } from "react"
import { attendanceDummyData, transformAttendanceData } from "../teddata"
import { personalWorkColumns } from "../columns/personal-schedule"
import { PersonalScheduleMobileView } from "../columns/personal-mobile"
import { TedDataTable } from "./ted-data"

type ScheduleType = "register" | "personal"

const ScheduleView = () => {
  const [activeTab, setActiveTab] = useState<ScheduleType>("personal")
  const [isMobile, setIsMobile] = React.useState(false)
  const scheduleData = transformAttendanceData(attendanceDummyData)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const renderScheduleComponent = () => {
    switch (activeTab) {
      case "register":
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Work Schedule Registration</h2>
              <p className="text-muted-foreground">Click status buttons to register or unregister for work shifts.</p>
            </div>
            <div className="text-center py-8 text-muted-foreground">Registration view coming soon...</div>
          </div>
        )
      case "personal":
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Personal Work Schedule</h2>
              <p className="text-muted-foreground">
                Your approved work shifts and attendance tracking. Please arrive on time for your scheduled shifts.
              </p>
            </div>

            {isMobile ? (
              <PersonalScheduleMobileView data={scheduleData} />
            ) : (
              <TedDataTable data={scheduleData} columns={personalWorkColumns} onRowClick={() => {}} />
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
      default:
        return null
    }
  }

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "personal" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("personal")}
        >
          Student Schedule
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "register" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("register")}
        >
          Class Registration
        </button>
      </div>

      {renderScheduleComponent()}
    </div>
  )
}

export default ScheduleView
