import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { exampleScheduleData } from '../data.teacher-ui';
import { convertToSlotByDay } from '../columns/convertToSlotByDay';
import { columns as desktopColumns } from '../columns/schedule.columns';
import { columns as mobileColumns } from '../columns/schedule.columnsmobile';
import DataCard from '@/components/ui/data-card';
import { useMemo, useState } from 'react';
// Utility function to get Monday of a given week
const getMondayOfWeek = (date: Date): Date => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

// Utility function to get Sunday of a given week
const getSundayOfWeek = (monday: Date): Date => {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return sunday;
};

// Generate all weeks from 2000 to 2050
const generateWeekOptions = () => {
  const weeks = [];
  const startYear = 2000;
  const endYear = 2050;

  for (let year = startYear; year <= endYear; year++) {
    let currentDate = new Date(year, 0, 1);
    const firstMonday = getMondayOfWeek(new Date(currentDate));

    if (firstMonday.getFullYear() < year) {
      currentDate = new Date(firstMonday);
      currentDate.setDate(firstMonday.getDate() + 7);
    } else {
      currentDate = firstMonday;
    }

    while (currentDate.getFullYear() === year) {
      const monday = new Date(currentDate);
      const sunday = getSundayOfWeek(new Date(monday));

      const mondayStr = monday.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
      });
      const sundayStr = sunday.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      weeks.push({
        value: monday.toISOString().split('T')[0],
        label: `${mondayStr} - ${sundayStr}`,
        monday: monday,
        sunday: sunday,
      });

      currentDate.setDate(currentDate.getDate() + 7);
    }
  }

  return weeks;
};
function TeacherView() {
  const weekOptions = useMemo(() => generateWeekOptions(), []);

  const getCurrentWeek = () => {
    const today = new Date();
    const monday = getMondayOfWeek(new Date(today));
    return monday.toISOString().split('T')[0];
  };

  const [selectedWeek, setSelectedWeek] = useState<string>(getCurrentWeek());
  return (
    <>
      <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
        <TitlePage title="Schedule" />
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 margin-left-5 parding-left-5">
          Select a week.
        </p>
        <select
          name="date"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="px-3 py-2 mb-4 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          {weekOptions.map((week) => (
            <option key={week.value} value={week.value}>
              {week.label}
            </option>
          ))}
        </select>
        <div className="lg:hidden block">
          <DataCard
            isUsePagination={false}
            isUseToolbar={false}
            data={convertToSlotByDay(exampleScheduleData)}
            columns={mobileColumns}
          />
        </div>
        <div className="hidden lg:block">
          <DataTable
            isUsePagination={false}
            isUseToolbar={false}
            data={exampleScheduleData}
            columns={desktopColumns}
          />
        </div>
      </div>
    </>
  );
}

export default TeacherView;
