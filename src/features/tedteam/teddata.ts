import type {
  AttendanceData,
  SlotSchedule,
  DayKey,
  ScheduleCell,
  RegisterSlotSchedule,
  RegisterScheduleCell,
} from "./slotInfo"

export const attendanceDummyData: AttendanceData[] = [
  {
    _id: 1,
    calendar_id: 1,
    user_id: 1001,
    status: "present",
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: new Date("2025-05-27T08:00:00Z"),
    updated_at: new Date("2025-05-27T08:00:00Z"),
    classCalendar: {
      _id: 1,
      class_id: 101,
      date: new Date("2025-06-02"),
      slot_id: 1,
      room_id: 201,
      coach_id: 301,
      TedTeam_id: 401,
      note: "Focus on pronunciation and fluency",
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: new Date("2025-05-20T08:00:00Z"),
      updated_at: new Date("2025-05-20T08:00:00Z"),
      classes: {
        _id: 101,
        name: "IELTS Speaking Intensive",
        schedule: "Mon, Wed, Fri - 07:30-09:30",
        room_id: 201,
        members: 15,
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: new Date("2025-05-15T08:00:00Z"),
        updated_at: new Date("2025-05-20T08:00:00Z"),
      },
    },
  },
  {
    _id: 2,
    calendar_id: 2,
    user_id: 1001,
    status: "present",
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: new Date("2025-05-27T08:00:00Z"),
    updated_at: new Date("2025-05-27T08:00:00Z"),
    classCalendar: {
      _id: 2,
      class_id: 102,
      date: new Date("2025-06-04"),
      slot_id: 2,
      room_id: 202,
      coach_id: 302,
      TedTeam_id: 402,
      note: "Bring writing samples for review",
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: new Date("2025-05-20T08:00:00Z"),
      updated_at: new Date("2025-05-20T08:00:00Z"),
      classes: {
        _id: 102,
        name: "IELTS Writing Mastery",
        schedule: "Tue, Thu - 09:45-11:45",
        room_id: 202,
        members: 12,
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: new Date("2025-05-15T08:00:00Z"),
        updated_at: new Date("2025-05-20T08:00:00Z"),
      },
    },
  },
  {
    _id: 3,
    calendar_id: 3,
    user_id: 1001,
    status: "not yet",
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: new Date("2025-05-27T08:00:00Z"),
    updated_at: new Date("2025-05-27T08:00:00Z"),
    classCalendar: {
      _id: 3,
      class_id: 103,
      date: new Date("2025-06-06"),
      slot_id: 3,
      room_id: 203,
      coach_id: 303,
      TedTeam_id: 403,
      note: "Listening practice session",
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: new Date("2025-05-20T08:00:00Z"),
      updated_at: new Date("2025-05-20T08:00:00Z"),
      classes: {
        _id: 103,
        name: "IELTS Listening Skills",
        schedule: "Fri - 13:00-15:00",
        room_id: 203,
        members: 18,
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: new Date("2025-05-15T08:00:00Z"),
        updated_at: new Date("2025-05-20T08:00:00Z"),
      },
    },
  },
]

export const registerScheduleDummyData: RegisterScheduleCell[] = [
  {
    id: "1",
    slot_id: {
      _id: 1,
      name: "Slot 1",
      start_time: "07:30",
      end_time: "09:30",
      description: "Early morning teaching slot",
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: "2025-05-20T08:00:00Z",
      updated_at: "2025-05-20T08:00:00Z",
    },
    date: "2025-06-02",
    time: "07:30-09:30",
    status: "register",
  },
  {
    id: "2",
    slot_id: {
      _id: 2,
      name: "Slot 2",
      start_time: "09:45",
      end_time: "11:45",
      description: "Late morning teaching slot",
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: "2025-05-20T08:00:00Z",
      updated_at: "2025-05-20T08:00:00Z",
    },
    date: "2025-06-02",
    time: "09:45-11:45",
    status: "registered",
  },
  {
    id: "3",
    slot_id: {
      _id: 3,
      name: "Slot 3",
      start_time: "13:00",
      end_time: "15:00",
      description: "Afternoon teaching slot",
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: "2025-05-20T08:00:00Z",
      updated_at: "2025-05-20T08:00:00Z",
    },
    date: "2025-06-02",
    time: "13:00-15:00",
    status: "full",
  },
  {
    id: "4",
    slot_id: {
      _id: 1,
      name: "Slot 1",
      start_time: "07:30",
      end_time: "09:30",
      description: "Early morning teaching slot",
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: "2025-05-20T08:00:00Z",
      updated_at: "2025-05-20T08:00:00Z",
    },
    date: "2025-06-03",
    time: "07:30-09:30",
    status: "unregistered",
  },
  {
    id: "5",
    slot_id: {
      _id: 2,
      name: "Slot 2",
      start_time: "09:45",
      end_time: "11:45",
      description: "Late morning teaching slot",
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: "2025-05-20T08:00:00Z",
      updated_at: "2025-05-20T08:00:00Z",
    },
    date: "2025-06-03",
    time: "09:45-11:45",
    status: "register",
  },
  {
    id: "6",
    slot_id: {
      _id: 1,
      name: "Slot 1",
      start_time: "07:30",
      end_time: "09:30",
      description: "Early morning teaching slot",
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: "2025-05-20T08:00:00Z",
      updated_at: "2025-05-20T08:00:00Z",
    },
    date: "2025-06-04",
    time: "07:30-09:30",
    status: "register",
  },
  {
    id: "7",
    slot_id: {
      _id: 3,
      name: "Slot 3",
      start_time: "13:00",
      end_time: "15:00",
      description: "Afternoon teaching slot",
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: "2025-05-20T08:00:00Z",
      updated_at: "2025-05-20T08:00:00Z",
    },
    date: "2025-06-04",
    time: "13:00-15:00",
    status: "registered",
  },
  {
    id: "8",
    slot_id: {
      _id: 2,
      name: "Slot 2",
      start_time: "09:45",
      end_time: "11:45",
      description: "Late morning teaching slot",
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: "2025-05-20T08:00:00Z",
      updated_at: "2025-05-20T08:00:00Z",
    },
    date: "2025-06-05",
    time: "09:45-11:45",
    status: "full",
  },
  {
    id: "9",
    slot_id: {
      _id: 1,
      name: "Slot 1",
      start_time: "07:30",
      end_time: "09:30",
      description: "Early morning teaching slot",
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: "2025-05-20T08:00:00Z",
      updated_at: "2025-05-20T08:00:00Z",
    },
    date: "2025-06-06",
    time: "07:30-09:30",
    status: "register",
  },
]

const getSlotName = (slotId: number): string => {
  switch (slotId) {
    case 1:
      return "Slot 1"
    case 2:
      return "Slot 2"
    case 3:
      return "Slot 3"
    default:
      return `Slot ${slotId}`
  }
}

const getDayKey = (date: Date): DayKey => {
  const dayOfWeek = date.getDay()
  const dayKeyMap = {
    0: "cn" as const, // Sunday
    1: "t2" as const, // Monday
    2: "t3" as const, // Tuesday
    3: "t4" as const, // Wednesday
    4: "t5" as const, // Thursday
    5: "t6" as const, // Friday
    6: "t7" as const, // Saturday
  }
  return dayKeyMap[dayOfWeek as keyof typeof dayKeyMap]
}

const getDayKeyFromDateString = (dateString: string): DayKey => {
  const date = new Date(dateString)
  return getDayKey(date)
}

const getSlotTime = (slotId: number): string => {
  switch (slotId) {
    case 1:
      return "07:30-09:30"
    case 2:
      return "09:45-11:45"
    case 3:
      return "13:00-15:00"
    default:
      return "00:00-00:00"
  }
}

export const transformAttendanceData = (data: AttendanceData[]): SlotSchedule[] => {
  const slotMap = new Map<string, SlotSchedule>()

  data.forEach((item) => {
    const slotName = getSlotName(item.classCalendar.slot_id)
    const dayKey = getDayKey(item.classCalendar.date)

    if (!slotMap.has(slotName)) {
      slotMap.set(slotName, {
        slot: slotName,
      })
    }

    const schedule = slotMap.get(slotName)!
    const scheduleCell: ScheduleCell = {
      topic: item.classCalendar.classes.name,
      instructor: `Coach ${item.classCalendar.coach_id}`,
      location: `Room ${item.classCalendar.room_id}`,
      time: getSlotTime(item.classCalendar.slot_id),
      status: item.status,
      date: item.classCalendar.date.toISOString().split('T')[0],
      class_id: item.classCalendar.class_id,
      room_id: item.classCalendar.room_id,
      coach_id: item.classCalendar.coach_id,
      TedTeam_id: item.classCalendar.TedTeam_id,
    }

    schedule[dayKey] = scheduleCell
  })

  return Array.from(slotMap.values())
}

export const transformRegisterScheduleData = (data: RegisterScheduleCell[]): RegisterSlotSchedule[] => {
  const slotMap = new Map<string, RegisterSlotSchedule>()

  data.forEach((item) => {
    const slotName = item.slot_id.name
    const dayKey = getDayKeyFromDateString(item.date)

    if (!slotMap.has(slotName)) {
      slotMap.set(slotName, {
        slot: slotName,
      })
    }

    const schedule = slotMap.get(slotName)!
    schedule[dayKey] = item
  })

  return Array.from(slotMap.values())
}

// Utility functions
export const getAttendanceByDate = (data: AttendanceData[], date: Date): AttendanceData[] => {
  return data.filter(item => {
    const itemDate = new Date(item.classCalendar.date)
    return itemDate.toDateString() === date.toDateString()
  })
}

export const getAttendanceByStatus = (data: AttendanceData[], status: "not yet" | "present" | "absent"): AttendanceData[] => {
  return data.filter(item => item.status === status)
}

export const getAttendanceByUserId = (data: AttendanceData[], userId: number): AttendanceData[] => {
  return data.filter(item => item.user_id === userId)
}

export const getAttendanceStatistics = (data: AttendanceData[]) => {
  const total = data.length
  const present = data.filter(item => item.status === "present").length
  const absent = data.filter(item => item.status === "absent").length
  const notYet = data.filter(item => item.status === "not yet").length

  return {
    total,
    present,
    absent,
    notYet,
    presentRate: total > 0 ? (present / total * 100).toFixed(2) : "0",
    absentRate: total > 0 ? (absent / total * 100).toFixed(2) : "0",
  }
}

export const getRegisterScheduleByDate = (data: RegisterScheduleCell[], date: string): RegisterScheduleCell[] => {
  return data.filter(item => item.date === date)
}

export const getRegisterScheduleByStatus = (data: RegisterScheduleCell[], status: "register" | "registered" | "unregistered" | "full"): RegisterScheduleCell[] => {
  return data.filter(item => item.status === status)
}

// Format date utilities
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const formatTime = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`
}

export const getDayName = (dayKey: DayKey): string => {
  const dayNames: Record<DayKey, string> = {
    cn: "Chủ nhật",
    t2: "Thứ 2",
    t3: "Thứ 3",
    t4: "Thứ 4",
    t5: "Thứ 5",
    t6: "Thứ 6",
    t7: "Thứ 7",
  }
  return dayNames[dayKey]
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "present":
      return "text-green-600 bg-green-100"
    case "absent":
      return "text-red-600 bg-red-100"
    case "not yet":
      return "text-yellow-600 bg-yellow-100"
    case "registered":
      return "text-blue-600 bg-blue-100"
    case "register":
      return "text-purple-600 bg-purple-100"
    case "full":
      return "text-gray-600 bg-gray-100"
    case "unregistered":
      return "text-orange-600 bg-orange-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}

export const transformedAttendanceSchedule = transformAttendanceData(attendanceDummyData)
export const transformedRegisterSchedule = transformRegisterScheduleData(registerScheduleDummyData)