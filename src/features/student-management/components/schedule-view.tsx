import React from "react";
import { classSlotSampleData, type ClassSlotData } from "../slotInfo";
import { columns, transformClassSlotData } from "../columns/schedule";
import DataTable from "@/components/data-table/data-table";
import TitlePage from "@/components/ui/title-page";
import { MobileScheduleView } from "../columns/schedule-mobile"; // Import component mobile
import { useMediaQuery } from "usehooks-ts"; // Dùng hook để detect responsive

const ScheduleView = () => {
  const scheduleData = transformClassSlotData(classSlotSampleData);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage
        title="Student Schedule"
        href="/student-management"
        contentHref="Student Management"
      />
      {isMobile ? (
        <MobileScheduleView data={scheduleData} />
      ) : (
        <DataTable data={scheduleData} columns={columns} />
      )}
    </div>
  );
};

export default ScheduleView;
