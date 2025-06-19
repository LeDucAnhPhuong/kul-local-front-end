import type {
  AttendanceData,
  SlotSchedule,
  DayKey,
  ScheduleCell,
  RegisterSlotSchedule,
  RegisterScheduleCell,
  ScheduleItem,
  UserSchedule,
} from "./slotInfo"

export const attendanceDummyData: UserSchedule[] = [
  {
    userId: null,
    schedule: {
      room: {
        name: "Solution",
        capacity: 50,
        location: "P505",
        description: "Solution",
        _id: "6850cc077a6121f2fda41cc2",
        created_at: "2025-06-17T01:59:35.886Z",
        updated_at: "2025-06-17T01:59:35.886Z",
        created_by: null,
        updated_by: null,
        isActive: true
      },
      tedTeamId: "6850cc077a6121f2fda41cc2",
      coach: {
        email: "xmy283480@gmail.com",
        role: "Coach",
        profile_image: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yeG5XNE1OTjBrVzVkSEpGa0ZOVHFEV0pDcjMifQ",
        first_name: "Trần",
        last_name: "Tuấn Anh",
        _id: "68391acde63747ae6f6559b3",
        created_at: "2025-05-30T02:41:17.408Z",
        updated_at: "2025-06-18T08:35:43.307Z",
        created_by: null,
        updated_by: null,
        isActive: true
      },
      classInfo: null,
      slot: {
        name: "slot 2",
        startTime: "09:00",
        endTime: "10:00",
        _id: "6850beebc5731d80e6ed0634",
        created_at: "2025-06-17T01:03:39.661Z",
        updated_at: "2025-06-17T01:03:39.661Z",
        created_by: null,
        updated_by: null,
        isActive: true
      },
      date: "2025-06-18T00:00:00Z",
      _id: "6852a6bd390aa6a0953d2623",
      created_at: "2025-06-18T11:45:01.542Z",
      updated_at: "2025-06-18T11:45:01.542Z",
      created_by: null,
      updated_by: null,
      isActive: true
    },
    status: 0,
    user: {
      email: "leducanhphuongdev@gmail.com",
      role: "Student",
      profile_image: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ5MU9xYnBRaUpXWWJ6ajFDYmNDcUNLT3RvRyJ9",
      first_name: "Phương",
      last_name: "Lê Đức Anh",
      _id: "683848b4ae6fdf6c3e9fee90",
      created_at: "2025-05-29T11:44:52.628Z",
      updated_at: "2025-06-18T11:40:10.599Z",
      created_by: null,
      updated_by: null,
      isActive: true
    },
    scheduleId: null,
    _id: "6852a6bd390aa6a0953d2628",
    created_at: "0001-01-01T00:00:00",
    updated_at: "0001-01-01T00:00:00",
    created_by: null,
    updated_by: null,
    isActive: true
  },
  {
    userId: null,
    schedule: {
      room: {
        name: "Solution",
        capacity: 50,
        location: "P505",
        description: "Solution",
        _id: "6850cc077a6121f2fda41cc2",
        created_at: "2025-06-17T01:59:35.886Z",
        updated_at: "2025-06-17T01:59:35.886Z",
        created_by: null,
        updated_by: null,
        isActive: true
      },
      tedTeamId: "6850cc077a6121f2fda41cc2",
      coach: {
        email: "xmy283480@gmail.com",
        role: "Coach",
        profile_image: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yeG5XNE1OTjBrVzVkSEpGa0ZOVHFEV0pDcjMifQ",
        first_name: "Trần",
        last_name: "Tuấn Anh",
        _id: "68391acde63747ae6f6559b3",
        created_at: "2025-05-30T02:41:17.408Z",
        updated_at: "2025-06-18T08:35:43.307Z",
        created_by: null,
        updated_by: null,
        isActive: true
      },
      classInfo: null,
      slot: {
        name: "slot 2",
        startTime: "09:00",
        endTime: "10:00",
        _id: "6850beebc5731d80e6ed0634",
        created_at: "2025-06-17T01:03:39.661Z",
        updated_at: "2025-06-17T01:03:39.661Z",
        created_by: null,
        updated_by: null,
        isActive: true
      },
      date: "2025-06-19T00:00:00Z",
      _id: "6852a6bd390aa6a0953d262e",
      created_at: "2025-06-18T11:45:01.919Z",
      updated_at: "2025-06-18T11:45:01.919Z",
      created_by: null,
      updated_by: null,
      isActive: true
    },
    status: 0,
    user: {
      email: "leducanhphuongdev@gmail.com",
      role: "Student",
      profile_image: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ5MU9xYnBRaUpXWWJ6ajFDYmNDcUNLT3RvRyJ9",
      first_name: "Phương",
      last_name: "Lê Đức Anh",
      _id: "683848b4ae6fdf6c3e9fee90",
      created_at: "2025-05-29T11:44:52.628Z",
      updated_at: "2025-06-18T11:40:10.599Z",
      created_by: null,
      updated_by: null,
      isActive: true
    },
    scheduleId: null,
    _id: "6852a6bd390aa6a0953d2633",
    created_at: "0001-01-01T00:00:00",
    updated_at: "0001-01-01T00:00:00",
    created_by: null,
    updated_by: null,
    isActive: true
  },
];



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
    date: "2025-06-02T08:00:00Z",
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
    date: "2025-06-02T08:00:00Z",
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
    date: "2025-06-02T08:00:00Z",
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
    date: "2025-06-03T08:00:00Z",
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
    date: "2025-06-03T08:00:00Z",
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
    date: "2025-06-04T08:00:00Z",
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
    date: "2025-06-04T08:00:00Z",
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
    date: "2025-06-05T08:00:00Z",
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
    date: "2025-06-06T08:00:00Z",
    time: "07:30-09:30",
    status: "register",
  },
]

const getDayKey = (date: string): DayKey => {
  const dayOfWeek = new Date(date).getDay()
  const dayKeyMap = {
    0: "cn" as const,
    1: "t2" as const,
    2: "t3" as const,
    3: "t4" as const,
    4: "t5" as const,
    5: "t6" as const,
    6: "t7" as const,
  }
  return dayKeyMap[dayOfWeek as keyof typeof dayKeyMap]
}

const getDayKeyFromDateString = (dateString: string): DayKey => {
  return getDayKey(dateString)
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

export const transformAttendanceData = (data: UserSchedule[]): SlotSchedule[] => {
  const slotMap = new Map<string, SlotSchedule>()

  data.forEach((item) => {
    const slotName = item.schedule.slot?.name || "Unknown Slot"
    const dayKey = getDayKey(item.schedule.date)

    if (!slotMap.has(slotName)) {
      slotMap.set(slotName, {
        slot: slotName,
      })
    }

    const schedule = slotMap.get(slotName)!
    const scheduleCell: ScheduleCell = {
      topic: item.schedule.classInfo?.name,
      instructor: `Coach ${item.schedule.coach.first_name} ${item.schedule.coach.last_name}`,
      location: `Room ${item.schedule.room.name}`,
      time: `${item.schedule.slot.startTime} - ${item.schedule.slot.endTime}`,
      status: getStatus(item.status),
      date: item.schedule.date,
      class_id: item.schedule.classInfo?.name,
      room_id: item.schedule.room?._id,
      coach_id: item.schedule.coach?._id,
    }

    schedule[dayKey] = scheduleCell
  })

  return Array.from(slotMap.values())
}

export const getStatus = (status: number): "not yet" | "present" | "absent" => {
  switch (status) {
    case 0:
      return "not yet"
    case 1:
      return "present"
    case 2:
      return "absent"
    default:
      return "not yet"
  }
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

export const getAttendanceByDate = (data: AttendanceData[], date: string): AttendanceData[] => {
  return data.filter(item => item.schedule.date === date)
}

export const getAttendanceByStatus = (data: AttendanceData[], status: "not yet" | "present" | "absent"): AttendanceData[] => {
  return data.filter(item => getStatus(item.status) === status)
}

export const getAttendanceByUserId = (data: AttendanceData[], userId: string): AttendanceData[] => {
  return data.filter(item => item.user_id === userId)
}

export const getAttendanceStatistics = (data: AttendanceData[]) => {
  const total = data.length
  const present = data.filter(item => getStatus(item.status) === "present").length
  const absent = data.filter(item => getStatus(item.status) === "absent").length
  const notYet = data.filter(item => getStatus(item.status) === "not yet").length

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

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("vi-VN", {
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