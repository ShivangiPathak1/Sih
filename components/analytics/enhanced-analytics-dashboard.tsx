"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, Download, TrendingUp } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useAnalyticsData, useRealTimeEngagement } from "@/hooks/use-api-data"

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function EnhancedAnalyticsDashboard() {
  const [selectedTab, setSelectedTab] = useState("engagement")
  
  // Fetch real-time data from APIs
  const { data: analyticsData, loading: analyticsLoading, error: analyticsError, refetch } = useAnalyticsData()
  const realtimeEngagement = useRealTimeEngagement()

  // Fallback data to show immediately
  const fallbackData = {
    userEngagement: [
      { day: 'Mon', students: 120, teachers: 45, admin: 12, total: 177, avgSessionTime: 28, pageViews: 890, bounceRate: 25 },
      { day: 'Tue', students: 135, teachers: 52, admin: 15, total: 202, avgSessionTime: 32, pageViews: 1020, bounceRate: 22 },
      { day: 'Wed', students: 128, teachers: 48, admin: 14, total: 190, avgSessionTime: 30, pageViews: 950, bounceRate: 28 },
      { day: 'Thu', students: 142, teachers: 55, admin: 16, total: 213, avgSessionTime: 35, pageViews: 1180, bounceRate: 20 },
      { day: 'Fri', students: 156, teachers: 58, admin: 18, total: 232, avgSessionTime: 38, pageViews: 1340, bounceRate: 18 },
      { day: 'Sat', students: 89, teachers: 32, admin: 8, total: 129, avgSessionTime: 25, pageViews: 650, bounceRate: 35 },
      { day: 'Sun', students: 76, teachers: 28, admin: 6, total: 110, avgSessionTime: 22, pageViews: 480, bounceRate: 40 }
    ],
    contentPerformance: [
      { subject: 'Mathematics', views: 450, engagement: 85, completionRate: 78, rating: 4.2 },
      { subject: 'Science', views: 380, engagement: 72, completionRate: 82, rating: 4.5 },
      { subject: 'English', views: 320, engagement: 68, completionRate: 75, rating: 4.0 },
      { subject: 'History', views: 280, engagement: 65, completionRate: 73, rating: 3.9 },
      { subject: 'Geography', views: 240, engagement: 58, completionRate: 70, rating: 3.7 },
      { subject: 'Physics', views: 200, engagement: 55, completionRate: 68, rating: 4.1 }
    ],
    dailyActiveUsers: [
      { date: '2025-09-01', users: 150, newUsers: 25, returningUsers: 125 },
      { date: '2025-09-02', users: 165, newUsers: 30, returningUsers: 135 },
      { date: '2025-09-03', users: 158, newUsers: 28, returningUsers: 130 },
      { date: '2025-09-04', users: 172, newUsers: 35, returningUsers: 137 },
      { date: '2025-09-05', users: 180, newUsers: 40, returningUsers: 140 },
      { date: '2025-09-06', users: 195, newUsers: 45, returningUsers: 150 },
      { date: '2025-09-07', users: 188, newUsers: 38, returningUsers: 150 }
    ],
    sessionTimeDistribution: [
      { timeRange: '0-5min', users: 45, sessions: 54, percentage: 15 },
      { timeRange: '5-15min', users: 75, sessions: 90, percentage: 25 },
      { timeRange: '15-30min', users: 105, sessions: 126, percentage: 35 },
      { timeRange: '30-60min', users: 60, sessions: 72, percentage: 20 },
      { timeRange: '60min+', users: 15, sessions: 18, percentage: 5 }
    ],
    platformGrowth: [
      { month: 'Jan', totalUsers: 100, activeUsers: 85, newUsers: 100, growthRate: 0, retentionRate: 85, lessons: 50, engagement: 75 },
      { month: 'Feb', totalUsers: 125, activeUsers: 110, newUsers: 25, growthRate: 25, retentionRate: 88, lessons: 65, engagement: 78 },
      { month: 'Mar', totalUsers: 160, activeUsers: 145, newUsers: 35, growthRate: 28, retentionRate: 90, lessons: 85, engagement: 82 },
      { month: 'Apr', totalUsers: 200, activeUsers: 180, newUsers: 40, growthRate: 25, retentionRate: 90, lessons: 110, engagement: 85 },
      { month: 'May', totalUsers: 250, activeUsers: 225, newUsers: 50, growthRate: 25, retentionRate: 90, lessons: 140, engagement: 88 },
      { month: 'Jun', totalUsers: 310, activeUsers: 280, newUsers: 60, growthRate: 24, retentionRate: 90, lessons: 175, engagement: 90 }
    ]
  }

  // Use real data if available, otherwise use fallback
  const displayData = analyticsData || fallbackData
  const currentEngagement = {
    activeUsers: realtimeEngagement.activeUsers || 247,
    currentSessions: realtimeEngagement.currentSessions || 189,
    pageViews: realtimeEngagement.pageViews || 1840,
    avgSessionTime: realtimeEngagement.avgSessionTime || 24
  }

  const handleExport = (type: string) => {
    // Export functionality
    const data = JSON.stringify(displayData, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}-analytics-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Real-time platform analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('complete')}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{currentEngagement.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessions</p>
                <p className="text-2xl font-bold">{currentEngagement.currentSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Page Views</p>
                <p className="text-2xl font-bold">{realtimeEngagement.pageViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Session</p>
                <p className="text-2xl font-bold">{realtimeEngagement.avgSessionTime}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="users">Daily Active Users</TabsTrigger>
          <TabsTrigger value="lessons">Lessons Completed</TabsTrigger>
          <TabsTrigger value="session">Session Time</TabsTrigger>
          <TabsTrigger value="growth">Platform Growth</TabsTrigger>
        </TabsList>

        {/* User Engagement Trends */}
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Trends</CardTitle>
              <CardDescription>Daily user activity patterns and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analyticsData?.userEngagement || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="students" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="teachers" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="admin" stackId="1" stroke="#ffc658" fill="#ffc658" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Performance */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>Subject-wise content usage and engagement rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData?.contentPerformance || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.subject}: ${entry.engagement}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="engagement"
                    >
                      {(analyticsData?.contentPerformance || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData?.contentPerformance || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#8884d8" />
                    <Bar dataKey="completionRate" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Active Users */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Active Users Analysis</CardTitle>
              <CardDescription>User activity patterns and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData?.dailyActiveUsers || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData?.dailyActiveUsers?.slice(-7) || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="newUsers" fill="#8884d8" name="New Users" />
                    <Bar dataKey="returningUsers" fill="#82ca9d" name="Returning Users" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Session Time Analysis */}
        <TabsContent value="session" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Time Analysis</CardTitle>
              <CardDescription>Session duration patterns and histogram</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Histogram */}
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData?.sessionTimeDistribution || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timeRange" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#8884d8" name="Number of Sessions" />
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Students', value: 22, color: '#8884d8' },
                        { name: 'Teachers', value: 35, color: '#82ca9d' },
                        { name: 'Admins', value: 18, color: '#ffc658' },
                        { name: 'Parents', value: 12, color: '#ff7300' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}min`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#8884d8" />
                      <Cell fill="#82ca9d" />
                      <Cell fill="#ffc658" />
                      <Cell fill="#ff7300" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Growth */}
        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Growth Analysis</CardTitle>
              <CardDescription>User acquisition and platform expansion trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData?.platformGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="totalUsers" stackId="1" stroke="#8884d8" fill="#8884d8" name="Total Users" />
                    <Area type="monotone" dataKey="activeUsers" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Active Users" />
                  </AreaChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData?.platformGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="newUsers" stroke="#8884d8" strokeWidth={2} name="New Users" />
                    <Line type="monotone" dataKey="retentionRate" stroke="#82ca9d" strokeWidth={2} name="Retention Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}