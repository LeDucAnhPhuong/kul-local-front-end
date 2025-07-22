import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AcademicProgressSkeleton() {
  return (
    <Card className="w-full mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          <Skeleton className="h-8 w-3/4 mx-auto" />
        </CardTitle>
        <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
      </CardHeader>
      <CardContent className="grid gap-8">
        {/* Scores Section Skeleton */}
        <div className="grid gap-4">
          <h3 className="text-xl font-semibold">
            <Skeleton className="h-6 w-32" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Summary Section Skeleton */}
        <div className="grid gap-4">
          <h3 className="text-xl font-semibold">
            <Skeleton className="h-6 w-48" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4 text-center">
                <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/6" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3 mt-1" />
          </div>
        </div>

        {/* Detailed Attendance Records Skeleton */}
        <div className="grid gap-4">
          <h3 className="text-xl font-semibold">
            <Skeleton className="h-6 w-64" />
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-2">
                    <Skeleton className="h-4 w-24" />
                  </th>
                  <th className="py-2">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  <th className="py-2">
                    <Skeleton className="h-4 w-28" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-2">
                      <Skeleton className="h-4 w-full" />
                    </td>
                    <td className="py-2">
                      <Skeleton className="h-4 w-full" />
                    </td>
                    <td className="py-2">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
