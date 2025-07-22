import { CardContent } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 p-4 md:p-8">
      <header className="flex flex-col items-center gap-4 mb-8">
        <Skeleton className="h-5 w-32" /> {/* For "Số người chơi" */}
      </header>
      <main className="grid flex-1 items-start gap-6">
        {/* Top Three Cards Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="relative flex flex-col items-center justify-center bg-gray-700 text-white p-6 rounded-lg shadow-lg"
            >
              <div className="absolute top-4 left-4 text-2xl font-bold text-gray-300">
                <Skeleton className="h-6 w-8 bg-gray-600" />
              </div>
              <Skeleton className="w-24 h-24 mb-4 rounded-full bg-gray-600" />
              <Skeleton className="h-6 w-32 mb-1 bg-gray-600" />
              <Skeleton className="h-12 w-16 mb-1 bg-gray-600" />
              <Skeleton className="h-4 w-24 bg-gray-600" />
            </Card>
          ))}
        </div>

        {/* Current User Summary Card Skeleton */}
        <Card className="flex items-center justify-between p-4 rounded-lg shadow-md bg-white">
          <div className="flex items-center gap-4 w-full">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex flex-col gap-2 flex-grow">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
        </Card>

        {/* Leaderboard Table Skeleton */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-6 w-32" /> {/* For "XẾP HẠNG" title */}
            <Skeleton className="h-10 w-[180px]" /> {/* For Select */}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]">
                      <Skeleton className="h-4 w-8" />
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      <Skeleton className="h-4 w-24" />
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle font-medium">
                        <Skeleton className="h-4 w-6" />
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Skeleton className="h-4 w-12 ml-auto" />
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Skeleton className="h-4 w-8 ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
