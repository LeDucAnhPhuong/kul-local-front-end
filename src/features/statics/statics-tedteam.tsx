import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Line,
  LineChart,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetStaticsTedTeamDetailQuery, useGetStaticsTedTeamQuery } from './api.statics';
import { formatDate } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const StatisticsTedTeam = ({
  dateRange,
}: {
  dateRange: { startDate: string; endDate: string };
}) => {
  const [selectedTedteamId, setSelectedTedteamId] = React.useState<string>('');

  const { allTedteamsSummaryData, isLoading } = useGetStaticsTedTeamQuery(
    {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    },
    {
      selectFromResult: ({ data, isFetching }) => ({
        allTedteamsSummaryData: data || [],
        isLoading: isFetching,
      }),
    },
  );

  const { currentTedteamDailyData, isLoadingCurrentTedTeam } = useGetStaticsTedTeamDetailQuery(
    {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      id: selectedTedteamId,
    },
    {
      skip: !selectedTedteamId, // Skip if no Tedteam is selected
      selectFromResult: ({ data, isFetching }) => ({
        currentTedteamDailyData: data || [],
        isLoadingCurrentTedTeam: isFetching,
      }),
    },
  );

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-white">Overall Tedteam Statistics</CardTitle>
          <CardDescription className="text-gray-400">
            Summary of total, approved, rejected, and pending tasks per Tedteam member.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer
                  config={{
                    tedteam: {
                      label: 'Tedteam Member',
                      color: 'hsl(var(--chart-1))',
                    },
                  }}
                >
                  <BarChart
                    data={allTedteamsSummaryData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                    <XAxis
                      dataKey="tedteam.firstName" // Use first name for X-axis
                      tickLine={false}
                      axisLine={{ stroke: '#666' }}
                      style={{
                        fontSize: '0.85rem',
                        fill: '#ccc',
                      }}
                    />
                    <YAxis
                      domain={[0, 'auto']} // Auto domain for counts
                      tickLine={false}
                      axisLine={{ stroke: '#666' }}
                      style={{
                        fontSize: '0.85rem',
                        fill: '#ccc',
                      }}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '1rem' }}
                      iconType="circle"
                      formatter={(value) => <span style={{ color: '#ccc' }}>{value}</span>}
                    />
                    <Bar dataKey="total" fill="#8884d8" name="Total Tasks" radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey="approved"
                      fill="#14b8a6"
                      name="Approved Tasks"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="rejected"
                      fill="#ef4444"
                      name="Rejected Tasks"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="pending"
                      fill="#f59e0b"
                      name="Pending Tasks"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="w-full ">
        <CardHeader>
          <CardTitle className="text-white">Tedteam Daily Performance (Line Chart)</CardTitle>
          <CardDescription className="text-gray-400">
            Daily statistics for the selected Tedteam member.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Select value={selectedTedteamId} onValueChange={setSelectedTedteamId}>
              <SelectTrigger className="w-[220px] ">
                <SelectValue placeholder="Select a Tedteam" />
              </SelectTrigger>
              <SelectContent className="">
                {allTedteamsSummaryData.map((team: any) => (
                  <SelectItem key={team.tedteam.id} value={team.tedteam.id}>
                    {team.tedteam.firstName} {team.tedteam.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isLoadingCurrentTedTeam ? (
            <div className="space-y-4">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer
                  config={{
                    tedteam: {
                      label: 'Tedteam Member',
                      color: 'hsl(var(--chart-1))',
                    },
                  }}
                >
                  <LineChart
                    data={currentTedteamDailyData}
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
                      tickFormatter={(value) => formatDate(new Date(value), 'dd/MM')}
                      tickLine={false}
                      axisLine={{ stroke: '#666' }}
                      style={{
                        fontSize: '0.85rem',
                        fill: '#ccc',
                      }}
                    />
                    <YAxis
                      domain={[0, 'auto']} // Auto domain for counts
                      tickLine={false}
                      axisLine={{ stroke: '#666' }}
                      style={{
                        fontSize: '0.85rem',
                        fill: '#ccc',
                      }}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '1rem' }}
                      iconType="circle"
                      formatter={(value) => <span style={{ color: '#ccc' }}>{value}</span>}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 6, fill: '#8884d8', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: '#8884d8', stroke: '#fff', strokeWidth: 2 }}
                      name="Total"
                    />
                    <Line
                      type="monotone"
                      dataKey="approved"
                      stroke="#14b8a6"
                      strokeWidth={2}
                      dot={{ r: 6, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2 }}
                      name="Approved"
                    />
                    <Line
                      type="monotone"
                      dataKey="rejected"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                      name="Rejected"
                    />
                    <Line
                      type="monotone"
                      dataKey="pending"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                      name="Pending"
                    />
                  </LineChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsTedTeam;
