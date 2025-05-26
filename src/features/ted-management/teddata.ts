import type { WorkSlot, PersonalWorkSlot } from "./slotInfo"

export const tedWorkScheduleData: WorkSlot[] = [
  {
    slot: "Slot 1",
    t2: {
      shiftCode: "WS101",
      location: "Room A",
      time: "7:00 AM - 9:30 AM",
      status: "register",
      description: "Morning shift",
    },
    t3: {
      shiftCode: "WS102",
      location: "Room B",
      time: "7:00 AM - 9:30 AM",
      status: "unregister",
      description: "Morning shift",
    },
    t4: {
      shiftCode: "WS103",
      location: "Room C",
      time: "7:00 AM - 9:30 AM",
      status: "not-yet",
      description: "Morning shift",
    },
    t5: {
      shiftCode: "WS104",
      location: "Room D",
      time: "7:00 AM - 9:30 AM",
      status: "register",
      description: "Morning shift",
    },
    t6: {
      shiftCode: "WS105",
      location: "Room B",
      time: "7:00 AM - 9:30 AM",
      status: "unregister",
      description: "Morning shift",
    },
  },
  {
    slot: "Slot 2",
    t2: {
      shiftCode: "WS201",
      location: "Room B",
      time: "10:00 AM - 12:30 PM",
      status: "register",
      description: "Morning shift",
    },
    t3: {
      shiftCode: "WS202",
      location: "Room B",
      time: "10:00 AM - 12:30 PM",
      status: "not-yet",
      description: "Morning shift",
    },
    t4: {
      shiftCode: "WS203",
      location: "Room A",
      time: "10:00 AM - 12:30 PM",
      status: "register",
      description: "Morning shift",
    },
    t5: {
      shiftCode: "WS204",
      location: "Room C",
      time: "10:00 AM - 12:30 PM",
      status: "unregister",
      description: "Morning shift",
    },
    t6: {
      shiftCode: "WS205",
      location: "Room D",
      time: "10:00 AM - 12:30 PM",
      status: "not-yet",
      description: "Morning shift",
    },
  },
  {
    slot: "Slot 3",
    t2: {
      shiftCode: "WS301",
      location: "Room A",
      time: "12:30 PM - 15:00 PM",
      status: "not-yet",
      description: "Afternoon shift",
    },
    t3: {
      shiftCode: "WS302",
      location: "Room B",
      time: "12:30 PM - 15:00 PM",
      status: "not-yet",
      description: "Afternoon shift",
    },
    t4: {
      shiftCode: "WS303",
      location: "Room D",
      time: "12:30 PM - 15:00 PM",
      status: "register",
      description: "Afternoon shift",
    },
    t5: {
      shiftCode: "WS304",
      location: "Room C",
      time: "12:30 PM - 15:00 PM",
      status: "register",
      description: "Afternoon shift",
    },
    t6: {
      shiftCode: "WS305",
      location: "Room A",
      time: "12:30 PM - 15:00 PM",
      status: "unregister",
      description: "Afternoon shift",
    },
  },
]

export const personalWorkScheduleData: PersonalWorkSlot[] = [
  {
    slot: "Slot 1",
    t2: {
      shiftCode: "WS101",
      location: "Room A",
      time: "7:00 AM - 9:30 AM",
      status: "present",
      description: "Morning shift",
    },
    t5: {
      shiftCode: "WS104",
      location: "Room D",
      time: "7:00 AM - 9:30 AM",
      status: "not-yet",
      description: "Morning shift",
    },
  },
  {
    slot: "Slot 2",
    t2: {
      shiftCode: "WS201",
      location: "Room B",
      time: "10:00 AM - 12:30 PM",
      status: "present",
      description: "Morning shift",
    },
    t4: {
      shiftCode: "WS203",
      location: "Room A",
      time: "10:00 AM - 12:30 PM",
      status: "absent",
      description: "Morning shift",
    },
  },
  {
    slot: "Slot 3",
    t4: {
      shiftCode: "WS303",
      location: "Room D",
      time: "12:30 PM - 15:00 PM",
      status: "present",
      description: "Afternoon shift",
    },
    t5: {
      shiftCode: "WS304",
      location: "Room C",
      time: "12:30 PM - 15:00 PM",
      status: "not-yet",
      description: "Afternoon shift",
    },
  },
]