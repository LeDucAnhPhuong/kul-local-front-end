import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  BarChart,
  Line,
  LineChart,
} from 'recharts';
import { useGetStaticsCoachQuery, useGetStaticsDetailCoachQuery } from './api.statics';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from 'date-fns';
import { useGetCoachesQuery } from '../account-management/api.user';

const StatisticsCoachModule = ({
  dateRange,
}: {
  dateRange: { startDate: string; endDate: string };
}) => {
  const [selectedClassId, setSelectedClassId] = React.useState<string>('');

  const { coaches, loading, error } = useGetStaticsCoachQuery(
    dateRange, // Use dynamic dateRange
    {
      selectFromResult: ({ data, isFetching, isError }) => ({
        coaches: data?.data || [],
        loading: isFetching,
        error: isError,
      }),
    },
  );

  const { coach } = useGetCoachesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      coach: data?.data || [],
    }),
  });

  const { coachDetail, isLoadingCoachDetail } = useGetStaticsDetailCoachQuery(
    { coachId: selectedClassId, startDate: dateRange.startDate, endDate: dateRange.endDate },
    {
      selectFromResult: ({ data, isFetching }) => ({
        coachDetail: data || [],
        isLoadingCoachDetail: isFetching,
      }),
    },
  );
  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Coach Performance Statistics Chart</CardTitle>
          <CardDescription>
            Visual overview of coach scores across different metrics for the selected period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{'Failed to load coach data.'}</div>
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={coaches}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3 31.8% 91.4%)" />
                  <XAxis
                    dataKey="coachName"
                    angle={-30}
                    textAnchor="end"
                    height={80}
                    tickLine={false}
                    axisLine={false}
                    style={{
                      fontSize: '0.75rem',
                      fill: 'hsl(215.4 16.3% 46.9%)',
                    }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    tickLine={false}
                    axisLine={false}
                    style={{
                      fontSize: '0.75rem',
                      fill: 'hsl(215.4 16.3% 46.9%)',
                    }}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(210 40% 96.1%)', opacity: 0.5 }}
                    contentStyle={{
                      backgroundColor: 'hsl(0 0% 100%)',
                      borderColor: 'hsl(214.3 31.8% 91.4%)',
                      borderRadius: '0.375rem',
                      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    }}
                    labelStyle={{
                      color: 'hsl(222.2 47.4% 11.2%)',
                      fontWeight: 'bold',
                    }}
                    itemStyle={{
                      color: 'hsl(222.2 47.4% 11.2%)',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '1rem' }}
                    iconType="circle"
                    formatter={(value) => (
                      <span style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{value}</span>
                    )}
                  />
                  <Bar
                    dataKey="averageQuizScore"
                    fill="hsl(222.2 47.4% 11.2%)"
                    name="Avg Quiz Score"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="averageNewsScore"
                    fill="hsl(210 40% 96.1%)"
                    name="Avg News Score"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="averageAssignmentScore"
                    fill="hsl(142.1 76.2% 36.3%)"
                    name="Avg Assignment Score"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="finalScore"
                    fill="hsl(20.5 90.2% 48.2%)"
                    name="Final Score"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="w-full ">
        <CardHeader>
          <CardTitle className="text-white">Coach Daily Performance (Line Chart)</CardTitle>
          <CardDescription className="text-gray-400">
            Daily score trends for the selected coach.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCoachDetail ? (
            <div className="space-y-4">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-end">
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Coach" />
                  </SelectTrigger>
                  <SelectContent className="">
                    {coach?.map((cls: any) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls?.email || cls.name || 'Unknown Coach'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer
                    config={{
                      visits: {
                        label: 'class',
                        color: 'hsl(var(--chart-1))',
                      },
                    }}
                  >
                    <LineChart
                      data={coachDetail?.dailySummary} // Use filtered daily data
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => formatDate(new Date(value), 'dd/MM')} // Format date
                        tickLine={false}
                        axisLine={{ stroke: '#666' }}
                        style={{
                          fontSize: '0.85rem',
                          fill: '#ccc',
                        }}
                      />
                      <YAxis
                        domain={[0, 10]} // Scores are typically out of 10
                        tickLine={false}
                        axisLine={{ stroke: '#666' }}
                        style={{
                          fontSize: '0.85rem',
                          fill: '#ccc',
                        }}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />} // Using ChartTooltipContent for a standard tooltip
                        cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: '1rem' }}
                        iconType="circle"
                        formatter={(value) => <span style={{ color: '#ccc' }}>{value}</span>}
                      />
                      {/* Lines for each score type */}
                      <Line
                        type="monotone"
                        dataKey="averageQuizScore"
                        stroke="#8884d8" // Purple
                        strokeWidth={2}
                        dot={{ r: 6, fill: '#8884d8', stroke: '#fff', strokeWidth: 2 }}
                        activeDot={{ r: 8, fill: '#8884d8', stroke: '#fff', strokeWidth: 2 }}
                        name="Avg Quiz Score"
                      />
                      <Line
                        type="monotone"
                        dataKey="averageNewsScore"
                        stroke="#ff9933" // Orange
                        strokeWidth={2}
                        dot={{ r: 6, fill: '#ff9933', stroke: '#fff', strokeWidth: 2 }}
                        activeDot={{ r: 8, fill: '#ff9933', stroke: '#fff', strokeWidth: 2 }}
                        name="Avg News Score"
                      />
                      <Line
                        type="monotone"
                        dataKey="averageAssignmentScore"
                        stroke="#17a2b8" // Teal
                        strokeWidth={2}
                        dot={{ r: 6, fill: '#17a2b8', stroke: '#fff', strokeWidth: 2 }}
                        activeDot={{ r: 8, fill: '#17a2b8', stroke: '#fff', strokeWidth: 2 }}
                        name="Avg Assignment Score"
                      />
                    </LineChart>
                  </ChartContainer>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCoachModule;
