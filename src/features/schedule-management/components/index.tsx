import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import TitlePage from '@/components/ui/title-page';

const ScheduleManagement = () => {
  function parseTime(timeStr: string): string {
    const date = new Date(`2025-06-19T${timeStr}`);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    });
  }

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage
        title="Manage Schedule"
        contentHref="Add schedule"
        href="/schedule-management/add"
      />
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        initialView="dayGridMonth"
        slotDuration="00:15:00" // Mỗi slot là 15 phút
        slotLabelInterval="00:15:00" // Nhãn thời gian cách nhau 15 phút
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
        editable={true}
        selectable={false}
        firstDay={1}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        locale="en"
        allDaySlot={false}
        initialDate={new Date().toISOString().split('T')[0]} // Set initial date to today
      />
    </div>
  );
};

export default ScheduleManagement;
