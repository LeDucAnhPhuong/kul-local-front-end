"use client";

import { useMemo, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import TitlePage from "@/components/ui/title-page";
import { useMediaQuery } from "usehooks-ts";
import { MobileScheduleView } from "../columns/schedule-mobile";
import DataTable from "@/components/data-table/data-table";
import { columns, transformAttendanceData, type APIAttendanceData } from "../columns/schedule";
import { useGetScheduleByWeekQuery } from "../api.student";

// === Utils ===
const getMonday = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getSunday = (monday: Date) => {
  const d = new Date(monday);
  d.setDate(d.getDate() + 6);
  return d;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const generateWeekOptions = () => {
  const weeks = [];
  const start = getMonday(new Date(2000, 0, 1));
  const end = new Date(2050, 11, 31);
  let current = new Date(start);

  while (current <= end) {
    const monday = getMonday(current);
    const sunday = getSunday(monday);
    weeks.push({
      value: monday.toISOString().split("T")[0],
      label: `${formatDate(monday)} - ${formatDate(sunday)}`,
    });
    current.setDate(current.getDate() + 7);
  }

  return weeks;
};

const ScheduleUI = () => {
  const weekOptions = useMemo(() => generateWeekOptions(), []);
  const todayMonday = getMonday(new Date()).toISOString().split("T")[0];

  const [selectedWeek, setSelectedWeek] = useState(() => {
    const match = weekOptions.find((w) => w.value === todayMonday);
    return match ? match.value : weekOptions[0]?.value || "";
  });

  // API call with proper typing
  const { week, isFetching, error } = useGetScheduleByWeekQuery(
    { 
      startDate: new Date(selectedWeek).toISOString(), 
      endDate: getSunday(new Date(selectedWeek)).toISOString() 
    },
    {
      selectFromResult: ({ data, isFetching, error }) => ({
        week: (data?.data as APIAttendanceData[]) || [],
        isFetching,
        error,
      }),
    }
  );

  // Transform API data with proper error handling
  const scheduleData = useMemo(() => {
    if (week && Array.isArray(week) && week.length > 0) {
      try {
        return transformAttendanceData(week);
      } catch (err) {
        console.error("Error transforming attendance data:", err);
        return transformAttendanceData([]); // Return empty slots structure
      }
    }
    return transformAttendanceData([]); // Return empty slots structure when no data
  }, [week]);

  const isMobile = useMediaQuery("(max-width: 1440px)");

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border border-stone-200 dark:border-stone-800">
      <TitlePage title="Student Schedule" />
      <p className="mb-2 text-sm text-gray-500">Select a week:</p>

      <div className="w-[250px] mb-4">
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger className="w-full px-3 py-2 text-sm flex justify-between items-center">
            <SelectValue
              placeholder="Select week"
              className="flex-1 text-center"
            />
          </SelectTrigger>
          <SelectContent>
            {weekOptions.map((week) => (
              <SelectItem
                key={week.value}
                value={week.value}
                className="text-center justify-center"
              >
                {week.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">Error loading schedule. Please try selecting a different week.</p>
        </div>
      )}

      {/* Always show the table structure, with loading state only affecting the data */}
      {isMobile ? (
        <MobileScheduleView data={scheduleData} />
      ) : (
        <div className="relative">
          {/* Loading overlay */}
          {isFetching && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-md">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mb-2"></div>
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            </div>
          )}
          <DataTable
            data={scheduleData}
            columns={columns}
            isLoading={false} // Don't use table's loading state to prevent structure changes
            isUsePagination={false}
            isUseToolbar={false}
          />
        </div>
      )}
    </div>
  );
};

export default ScheduleUI;