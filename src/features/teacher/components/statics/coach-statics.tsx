'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Re-import Select
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define interfaces for data structures
interface QuizOverviewItem {
  quizId: {
    title: string;
    date: string;
    due: string;
    isPublic: boolean;
    id: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    createdBy: string;
    updatedBy: string;
    createdByUser: null;
    updatedByUser: null;
  };
  title: string;
  date: string;
  due: string;
  totalSubmissions: number;
  averageScore: number;
}

interface SubmissionItem {
  class: string; // Comma-separated string of class IDs
  quiz: {
    title: string;
    date: string;
    due: string;
    isPublic: boolean;
    id: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    createdBy: string;
    updatedBy: string;
    createdByUser: null;
    updatedByUser: null;
  };
  student: {
    profileImage: string;
    email: string;
    firstName: string;
    lastName: string;
    classId: string; // Single class ID for the student
    role: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    createdBy: null;
    updatedBy: null;
    createdByUser: null;
    updatedByUser: null;
  };
  score: number;
  submittedAt: any; // Simplified for this example
}

interface QuizDashboardProps {
  quizDataByClass: QuizOverviewItem[];
  quizData: QuizOverviewItem[];
  submissionData: SubmissionItem[];
  studentScoresByClassChartData?: any[];
  setSelectedClassIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedClassIds: string[];
  selectedQuizIdForScoreDistribution?: string;
  setSelectedQuizIdForScoreDistribution: React.Dispatch<React.SetStateAction<string | undefined>>;
}

// A simple color palette for the lines
const lineColors = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AF19FF',
  '#DE3163',
];

export default function QuizDashboard({
  quizData,
  submissionData,
  quizDataByClass,
  setSelectedClassIds,
  selectedClassIds,
  selectedQuizIdForScoreDistribution,
  setSelectedQuizIdForScoreDistribution,
  studentScoresByClassChartData,
}: QuizDashboardProps) {
  const [classSelectOpen, setClassSelectOpen] = useState(false);

  // Prepare data for the Quiz Overview Chart (LineChart)
  const quizOverviewChartData = useMemo(() => {
    return quizData?.map((q) => ({
      name: q.title,
      averageScore: q.averageScore,
      totalSubmissions: q.totalSubmissions,
      id: q.quizId.id,
    }));
  }, [quizData]);
  const quizOverviewChartDataByClass = useMemo(() => {
    return quizDataByClass?.map((q) => ({
      name: q.title,
      averageScore: q.averageScore,
      totalSubmissions: q.totalSubmissions,
      id: q.quizId.id,
    }));
  }, [quizData]);

  // Extract unique class IDs from submission data for the multi-select filter
  const uniqueClassOptions = useMemo(() => {
    const classIds = new Set<string>();
    submissionData.forEach((sub) => {
      classIds.add(sub.student.classId);
    });
    return Array.from(classIds).map((id) => ({
      value: id,
      label: `Class ${id.substring(0, 4)}...`, // Shorten ID for display
    }));
  }, [submissionData]);

  // Extract unique quizzes from submission data for the new quiz score distribution chart
  const uniqueQuizOptionsForScoreDistribution = useMemo(() => {
    const quizzes = new Map<string, string>(); // Map<quizId, quizTitle>
    submissionData.forEach((sub) => {
      quizzes.set(sub.quiz.id, sub.quiz.title);
    });
    return Array.from(quizzes.entries()).map(([id, title]) => ({
      value: id,
      label: title,
    }));
  }, [submissionData]);

  // Prepare data for the new Quiz Score Distribution Chart

  // const quizScoreDistributionChartData = useMemo(() => {
  //   if (!selectedQuizIdForScoreDistribution) {
  //     return [];
  //   }

  //   const scoreBins = Array.from({ length: 11 }, (_, i) => i); // [0, 1, 2, ..., 10]
  //   const scoreCounts: { [score: number]: number } = {};

  //   // Initialize counts to 0
  //   scoreBins.forEach((score) => {
  //     scoreCounts[score] = 0;
  //   });

  //   // Filter submissions for the selected quiz and count scores
  //   submissionData.forEach((sub) => {
  //     if (sub.quiz.id === selectedQuizIdForScoreDistribution) {
  //       const roundedScore = Math.round(sub.score);
  //       if (roundedScore >= 0 && roundedScore <= 10) {
  //         scoreCounts[roundedScore]++;
  //       }
  //     }
  //   });

  //   // Transform into chart data format: [{ score: 0, count: 5 }, ...]
  //   return scoreBins.map((score) => ({
  //     score,
  //     count: scoreCounts[score],
  //   }));
  // }, [selectedQuizIdForScoreDistribution, submissionData]);

  // Helper to get selected class options for display
  const selectedClassOptions = useMemo(() => {
    return uniqueClassOptions.filter((option) => selectedClassIds.includes(option.value));
  }, [selectedClassIds, uniqueClassOptions]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Quiz Performance Dashboard</h1>

      {/* Quiz Overview Chart (LineChart) */}
      <Card>
        <CardHeader>
          <CardTitle>Average Score per Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={quizOverviewChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="averageScore"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Average Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* New: Quiz Score Distribution Chart (Bar Chart) */}
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution for Selected Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex-1">
            <Select
              onValueChange={setSelectedQuizIdForScoreDistribution}
              value={selectedQuizIdForScoreDistribution || ''}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Quiz to view score distribution" />
              </SelectTrigger>
              <SelectContent>
                {uniqueQuizOptionsForScoreDistribution.map((quiz) => (
                  <SelectItem key={quiz.value} value={quiz.value}>
                    {quiz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!selectedQuizIdForScoreDistribution && (
            <p className="text-center text-muted-foreground">
              Please select a quiz to view its score distribution.
            </p>
          )}

          {quizOverviewChartDataByClass && quizOverviewChartDataByClass.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={quizOverviewChartDataByClass}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="score"
                  label={{ value: 'Score', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }}
                  allowDecimals={false}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name="Number of Students" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Student Scores Chart with Class Filter (LineChart - Phổ điểm với chấm vuông) */}
      <Card>
        <CardHeader>
          <CardTitle>Student Score Distribution by Class</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Class Multi-Select Filter */}
            <div className="flex-1">
              <Popover open={classSelectOpen} onOpenChange={setClassSelectOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={classSelectOpen}
                    className="w-full justify-between bg-transparent"
                  >
                    {selectedClassIds.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedClassOptions.map((classOption) => (
                          <Badge
                            key={classOption.value}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {classOption.label}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent popover from closing
                                setSelectedClassIds((prev: string[]) =>
                                  prev.filter((id) => id !== classOption.value),
                                );
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      'Select Classes...'
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput placeholder="Search classes..." />
                    <CommandList>
                      <CommandEmpty>No classes found.</CommandEmpty>
                      <CommandGroup>
                        {uniqueClassOptions.map((classOption) => (
                          <CommandItem
                            key={classOption.value}
                            value={classOption.label}
                            onSelect={() => {
                              setSelectedClassIds((prev) =>
                                prev.includes(classOption.value)
                                  ? prev.filter((id) => id !== classOption.value)
                                  : [...prev, classOption.value],
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedClassIds.includes(classOption.value)
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {classOption.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {selectedClassIds.length === 0 && (
            <p className="text-center text-muted-foreground">
              Please select one or more classes to view score distribution.
            </p>
          )}

          {selectedClassIds.length > 0 && studentScoresByClassChartData?.length === 0 && (
            <p className="text-center text-muted-foreground">
              No score data found for the selected classes.
            </p>
          )}

          {selectedClassIds.length > 0 &&
            studentScoresByClassChartData &&
            studentScoresByClassChartData?.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={studentScoresByClassChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="score"
                    label={{ value: 'Score', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }}
                    allowDecimals={false}
                  />
                  <Tooltip />
                  <Legend />
                  {studentScoresByClassChartData.map((classLabel, index) => {
                    const classId =
                      uniqueClassOptions.find((opt) => opt.label === classLabel)?.value ||
                      `unknown-class-${index}`;
                    return (
                      <Line
                        key={classId}
                        type="monotone"
                        dataKey={classId} // Use the actual classId as dataKey
                        stroke={lineColors[index % lineColors.length]}
                        activeDot={{ r: 8 }}
                        name={classLabel?.name} // Display the friendly label in the legend
                        dot={{ strokeWidth: 2 }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
