import { useState } from "react"
import RegisterSchedule from "./register-schedule"
import PersonalSchedule from "./personal-schedule"

type ScheduleType = "register" | "personal"

const ScheduleView = () => {
  const [activeTab, setActiveTab] = useState<ScheduleType>("register")

  const renderScheduleComponent = () => {
    switch (activeTab) {
      case "register":
        return <RegisterSchedule />
      case "personal":
        return <PersonalSchedule />
      default:
        return <RegisterSchedule />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "register" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("register")}
        >
          Work Registration
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "personal" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("personal")}
        >
          Personal Schedule
        </button>
      </div>

      {renderScheduleComponent()}
    </div>
  )
}

export default ScheduleView
