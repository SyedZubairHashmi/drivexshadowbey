import { MainLayout } from "@/components/layout/main-layout"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Analytics Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Monthly Revenue"
            value="$245,000"
            icon={TrendingUp}
            trend={{ value: "+15% from last month", isPositive: true }}
          />
          <StatCard
            title="Cars Sold This Month"
            value="18"
            icon={BarChart3}
            trend={{ value: "+22% from last month", isPositive: true }}
          />
          <StatCard
            title="Average Sale Price"
            value="$28,500"
            icon={PieChart}
            trend={{ value: "+5% from last month", isPositive: true }}
          />
          <StatCard
            title="Conversion Rate"
            value="68%"
            icon={Activity}
            trend={{ value: "+3% from last month", isPositive: true }}
          />
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                  <p>Sales trend chart will be displayed here</p>
                  <p className="text-sm">Integration with charting library needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Company</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <PieChart className="h-12 w-12 mx-auto mb-2" />
                  <p>Revenue breakdown chart will be displayed here</p>
                  <p className="text-sm">Integration with charting library needed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-2" />
                  <p>Batch performance chart will be displayed here</p>
                  <p className="text-sm">Integration with charting library needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                  <p>Inventory status chart will be displayed here</p>
                  <p className="text-sm">Integration with charting library needed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
