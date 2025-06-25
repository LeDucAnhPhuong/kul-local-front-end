'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  CalendarDays,
  Calendar,
  Grid3X3,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
} from 'lucide-react';

export default function ImprovedCalendar() {
  // Mock functions for demonstration
  const selectedDate = new Date().toISOString().split('T')[0];
  const handleChangeView = (view: string) => console.log('View changed to:', view);
  const calendarRef = { current: null };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Schedule</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add schedule
        </Button>
      </div>

      {/* Navigation Controls */}
      <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Today Button */}
          <Button
            variant="outline"
            disabled={selectedDate === new Date().toISOString().split('T')[0]}
            onClick={() => (calendarRef.current as any)?.getApi().today()}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Today
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => (calendarRef.current as any)?.getApi().prev()}
              className="px-3"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (calendarRef.current as any)?.getApi().next()}
              className="px-3"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* View Toggle Buttons */}
          <div className="flex items-center bg-gray-100 rounded-md p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleChangeView('timeGridDay')}
              className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <CalendarDays className="h-4 w-4" />
              Day
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleChangeView('timeGridWeek')}
              className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Calendar className="h-4 w-4" />
              Week
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleChangeView('dayGridMonth')}
              className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Grid3X3 className="h-4 w-4" />
              Month
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        {/* Your FullCalendar component would go here */}
        <div className="h-96 bg-gray-50 rounded-md flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>FullCalendar component will be rendered here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
