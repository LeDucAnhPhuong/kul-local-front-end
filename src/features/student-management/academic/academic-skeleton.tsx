import { Card, CardContent, CardHeader, CardTitle }  from '@/components/ui/card';
import { Skeleton }  from '@/components/ui/skeleton';

export  function AcademicProgressSkeleton() {
return (
  <Card className="w-full mx-auto shadow-lg">
    <CardHeader>
      <CardTitle className="text-3xl font-bold text-center">
        <Skeleton className="w-3/4 h-8 mx-auto" />
      </CardTitle>
      <Skeleton className="w-1/2 h-4 mx-auto mt-2" />
    </CardHeader>
    <CardContent className="grid gap-8">
      
      <div className="grid gap-4">
        <h3 className="text-xl font-semibold">
          <Skeleton className="w-32 h-6" />
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
              
                <Skeleton className="w-2/3 h-4" />
                <Skeleton className="w-1/4 h-4" />
              </div>
              {/* Progress bar cho điểm số */}
              <Skeleton className="w-full h-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Summary Section Skeleton */}
      <div className="grid gap-4">
        <h3 className="text-xl font-semibold">
          <Skeleton className="w-48 h-6" />
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4 text-center">
              <Skeleton className="w-1/2 h-6 mx-auto mb-2" />
              <Skeleton className="w-3/4 h-4 mx-auto" />
            </Card>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="w-1/3 h-4" />
            <Skeleton className="w-1/6 h-4" />
          </div>
          {/* 2 thanh progress bar chồng lên nhau */}
          <Skeleton className="w-full h-3" />
          <Skeleton className="w-2/3 h-3 mt-1" />
        </div>
      </div>

      {/* Detailed Attendance Records Skeleton */}
      <div className="grid gap-4">
        <h3 className="text-xl font-semibold">
          <Skeleton className="w-64 h-6" />
        </h3>
        {/* overflow-x-auto cho table responsive trên mobile */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-2">
                  <Skeleton className="w-24 h-4" />
                </th>
                <th className="py-2">
                  <Skeleton className="w-16 h-4" />
                </th>
                <th className="py-2">
                  <Skeleton className="h-4 w-28" />
                </th>
              </tr>
            </thead>
            <tbody>
              {/* 5 hàng dữ liệu attendance */}
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="py-2">
                    <Skeleton className="w-full h-4" />
                  </td>
                  <td className="py-2">
                    <Skeleton className="w-full h-4" />
                  </td>
                  <td className="py-2">
                    <Skeleton className="w-full h-4" />
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