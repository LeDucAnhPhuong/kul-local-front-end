import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SlotSampleData } from '../data.slot';

const SlotExample = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
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
        events={[
          {
            title: 'Sample Slot 1',
            start: '2025-06-18T10:00:00',
            end: '2025-06-18T12:00:00',
          },
          {
            title: 'Sample Slot 2',
            start: '2025-06-18T11:00:00',
            end: '2025-06-18T13:00:00',
          },
          {
            title: 'Sample Slot 3',
            start: '2025-06-18T10:00:00',
            end: '2025-06-18T12:00:00',
          },
          {
            title: 'Sample Slot 4',
            start: '2025-06-18T14:00:00',
            end: '2025-06-18T16:00:00',
          },
        ]}
      />
    </div>
  );
};

export default SlotExample;
