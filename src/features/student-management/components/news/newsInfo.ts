import type { News } from "./news/News";

export const newsSampleData: News[] = [
  {
    id: 1,
    title: "New Academic Year 2025 Opening Ceremony Announcement",
    content: "The school announces that the opening ceremony for the 2025-2026 academic year will take place on September 15, 2025. All students must be present on time...",
    class_id: 101,
    user_id: 1,
    isActive: true,
    created_by: "admin",
    updated_by: "admin",
    created_at: "2025-01-15T08:00:00Z",
    updated_at: "2025-01-15T08:00:00Z"
  },
  {
    id: 2,
    title: "First Semester Exam Schedule 2024-2025",
    content: "The first semester exams will be held from December 20, 2024 to December 30, 2024. Students need to prepare thoroughly for all subjects...",
    class_id: 102,
    user_id: 2,
    isActive: true,
    created_by: "teacher1",
    updated_by: "teacher1",
    created_at: "2024-12-01T09:30:00Z",
    updated_at: "2024-12-05T14:20:00Z"
  },
  {
    id: 3,
    title: "School-Level Mathematics Olympiad Competition",
    content: "The school is organizing a Mathematics Olympiad competition for outstanding students. Registration period is from now until the end of February...",
    class_id: 103,
    user_id: 1,
    isActive: false,
    created_by: "admin",
    updated_by: "teacher2",
    created_at: "2025-01-10T16:45:00Z",
    updated_at: "2025-01-20T10:15:00Z"
  },
  {
    id: 4,
    title: "Scholarship Program for Outstanding Students",
    content: "The school announces a scholarship program for students with excellent academic performance in the 2024-2025 academic year. Applications are now open...",
    class_id: 104,
    user_id: 3,
    isActive: true,
    created_by: "principal",
    updated_by: "principal",
    created_at: "2025-01-05T11:20:00Z",
    updated_at: "2025-01-05T11:20:00Z"
  },
  {
    id: 5,
    title: "Lunar New Year Holiday Schedule 2025",
    content: "Holiday schedule announcement for Lunar New Year 2025 for all students and teachers from January 26 to February 9, 2025. Classes will resume on February 10...",
    class_id: 105,
    user_id: 2,
    isActive: true,
    created_by: "admin",
    updated_by: "admin",
    created_at: "2024-12-20T13:30:00Z",
    updated_at: "2024-12-20T13:30:00Z"
  },
  {
    id: 6,
    title: "Summer Science Fair 2025 Registration Open",
    content: "Registration is now open for the annual Summer Science Fair 2025. Students can participate individually or in teams of up to 4 members. Deadline: March 15, 2025...",
    class_id: 106,
    user_id: 4,
    isActive: true,
    created_by: "science_coordinator",
    updated_by: "science_coordinator",
    created_at: "2025-02-01T10:00:00Z",
    updated_at: "2025-02-01T10:00:00Z"
  },
  {
    id: 7,
    title: "Parent-Teacher Conference March 2025",
    content: "Annual parent-teacher conference scheduled for March 20-22, 2025. Parents are requested to schedule appointments with respective class teachers in advance...",
    class_id: 107,
    user_id: 1,
    isActive: true,
    created_by: "admin",
    updated_by: "admin",
    created_at: "2025-03-01T14:30:00Z",
    updated_at: "2025-03-01T14:30:00Z"
  },
  {
    id: 8,
    title: "New Library Digital System Launch",
    content: "The school library is launching a new digital catalog system. Students can now browse and reserve books online. Training sessions will be held every Tuesday and Thursday...",
    class_id: 108,
    user_id: 5,
    isActive: false,
    created_by: "librarian",
    updated_by: "librarian",
    created_at: "2025-01-25T09:15:00Z",
    updated_at: "2025-01-30T16:45:00Z"
  }
];