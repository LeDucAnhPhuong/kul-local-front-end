import { useState, useEffect, useCallback, useMemo } from "react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { registerScheduleDummyData, transformRegisterScheduleData } from "../teddata"
import { createRegisterScheduleColumns } from "../columns/register-schedule-columns"
import { RegisterMobileView } from "../columns/register-mobile"
import { TedDataTable } from "./ted-data"
import type { RegisterSlotSchedule } from "../slotInfo"

// === Week Selection Utils ===
const getMonday = (date: Date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

const getSunday = (monday: Date) => {
  const d = new Date(monday)
  d.setDate(d.getDate() + 6)
  return d
}

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

const generateWeekOptions = () => {
  const weeks = []
  const start = getMonday(new Date(2000, 0, 1))
  const end = new Date(2050, 11, 31)
  const current = new Date(start)

  while (current <= end) {
    const monday = getMonday(current)
    const sunday = getSunday(monday)
    weeks.push({
      value: monday.toISOString().split("T")[0],
      label: `${formatDate(monday)} - ${formatDate(sunday)}`,
    })
    current.setDate(current.getDate() + 7)
  }

  return weeks
}

export default function RegisterSchedule() {
  const weekOptions = useMemo(() => generateWeekOptions(), [])
  const todayMonday = getMonday(new Date()).toISOString().split("T")[0]

  const [selectedWeek, setSelectedWeek] = useState(() => {
    const match = weekOptions.find((w) => w.value === todayMonday)
    return match ? match.value : weekOptions[0]?.value || ""
  })

  const [data, setData] = useState<RegisterSlotSchedule[]>(() =>
    transformRegisterScheduleData(registerScheduleDummyData),
  )
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // You can add API integration here based on selectedWeek
  useEffect(() => {
    // TODO: Fetch data based on selectedWeek
    // For now, keeping the dummy data
    console.log("Selected week:", selectedWeek)
  }, [selectedWeek])

  const handleStatusChange = useCallback(
    (rowIndex: number, dayKey: string, newStatus: "register" | "registered" | "unregistered" | "full") => {
      setData((prevData) =>
        prevData.map((row, index) => {
          if (index === rowIndex) {
            const currentCell = row[dayKey as keyof RegisterSlotSchedule]
            if (currentCell && typeof currentCell === "object" && "status" in currentCell) {
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
    },
    [],
  )

  const columns = createRegisterScheduleColumns(handleStatusChange)

  return (
    <div className="bg-white dark:bg-background p-6 rounded-xl border border-stone-200 dark:border-stone-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Work Schedule Registration</h2>
        <p className="text-muted-foreground">Click status buttons to register or unregister for work shifts.</p>
      </div>

      {/* Week Selection */}
      <div className="mb-6">
        <p className="mb-2 text-sm text-gray-500">Select a week:</p>
        <div className="w-[250px]">
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-full px-3 py-2 text-sm flex justify-between items-center">
              <SelectValue placeholder="Select week" className="flex-1 text-center" />
            </SelectTrigger>
            <SelectContent>
              {weekOptions.map((week) => (
                <SelectItem key={week.value} value={week.value} className="text-center justify-center">
                  {week.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isMobile ? (
        <RegisterMobileView data={data} onStatusChange={handleStatusChange} />
      ) : (
        <TedDataTable data={data} columns={columns} onRowClick={() => {}} />
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Register</span>
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
