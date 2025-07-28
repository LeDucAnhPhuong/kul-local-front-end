import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function QuizDashboardSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Quiz Performance Dashboard</h1>

      {/* Skeleton for Average Score per Quiz Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-64" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>

      {/* Skeleton for Score Distribution for Selected Quiz Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-72" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" /> {/* For the Select dropdown */}
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>

      {/* Skeleton for Student Score Distribution by Class Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-80" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" /> {/* For the Multi-select filter */}
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
