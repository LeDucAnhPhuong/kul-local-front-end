'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatisticsCoachModule from './statics-coach-module';
import StatisticsClassModule from './statics-class-module';
import StatisticsTedTeam from './statics-tedteam';

// Hardcoded class data as no API hook was provided for it

export default function CoachStatisticsChart() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-06-01T00:00:00Z', // Initial default from user's code
    endDate: '2025-08-30T23:59:59Z', // Initial default from user's code
  });

  useEffect(() => {
    const calculateDateRange = (selectedPeriod: typeof period) => {
      const now = new Date();
      let start: Date;
      let end: Date;

      if (selectedPeriod === 'week') {
        const dayOfWeek = now.getDay(); // 0 for Sunday, 1 for Monday
        // Adjust to Monday of the current week
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        start = new Date(now.getFullYear(), now.getMonth(), diff);
        end = new Date(now.getFullYear(), now.getMonth(), diff + 6);
      } else if (selectedPeriod === 'month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month
      } else {
        // 'year'
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
      }

      // Set time to start/end of day for accurate range
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      return {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      };
    };

    setDateRange(calculateDateRange(period));
  }, [period]);

  return (
    <div className="flex flex-col bg-white rounded-xl items-center space-y-8 p-4">
      <div className="w-full flex flex-col justify-start">
        <h1 className="font-bold text-2xl">Statics Overview</h1>
        <p className="text-muted-foreground text-xl">
          Overview of coach and class statistics for the selected period.
        </p>
      </div>
      <Tabs defaultValue="coach" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="coach">Coach</TabsTrigger>
          <TabsTrigger value="class">Class</TabsTrigger>
          <TabsTrigger value="tedteam">Ted Team</TabsTrigger>
        </TabsList>
        <div className="flex mt-4 justify-end space-x-2">
          <Button
            variant={period === 'week' ? 'default' : 'outline'}
            onClick={() => setPeriod('week')}
          >
            Week
          </Button>
          <Button
            variant={period === 'month' ? 'default' : 'outline'}
            onClick={() => setPeriod('month')}
          >
            Month
          </Button>
          <Button
            variant={period === 'year' ? 'default' : 'outline'}
            onClick={() => setPeriod('year')}
          >
            Year
          </Button>
        </div>
        <TabsContent value="coach" className="w-full">
          <div className="w-full">
            <StatisticsCoachModule dateRange={dateRange} />
          </div>
        </TabsContent>
        <TabsContent value="class">
          <StatisticsClassModule dateRange={dateRange} />
        </TabsContent>
        <TabsContent value="tedteam">
          <StatisticsTedTeam dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
