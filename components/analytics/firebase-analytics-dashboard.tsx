"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, Download, TrendingUp, Activity, Users, BarChart3 } from "lucide-react"
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
import { useFirebaseAnalytics, useFirebaseRealTime, useFirebaseTracking } from "@/hooks/use-firebase-analytics"

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function FirebaseAnalyticsDashboard() {
  const [selectedTab, setSelectedTab] = useState("engagement")
  
  // Firebase Analytics hooks
  const { data: analyticsData, loading, error, refetch } = useFirebaseAnalytics()
  const realtimeData = useFirebaseRealTime()
  const { trackPageView, trackContentView } = useFirebaseTracking()

  // Track page view on component mount
  useEffect(() => {
    trackPageView('firebase_analytics_dashboard', 'Firebase Analytics Dashboard')
  }, [trackPageView])

  const handleExport = (type: string) => {
    trackContentView('export', type)
    
    const data = JSON.stringify(analyticsData, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `firebase-analytics-${type}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Initializing Firebase Analytics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <div className="ml-2">
            <p>{error}</p>
            <Button variant="outline" onClick={refetch} className="mt-2">
              Retry Connection
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-8 w-8 text-orange-500" />
            Firebase Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">Real-time analytics powered by Firebase</p>
          <Badge variant="outline" className="mt-2">
            🔥 Live Firebase Data
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('complete')}>
            <Download className="h-4 w-4 mr-2" />
            Export Firebase Data
          </Button>
        </div>
      </div>

      {/* Real-time Firebase Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{realtimeData.activeUsers}</p>
                <Badge variant="secondary" className="text-xs">Real-time</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Sessions</p>
                <p className="text-2xl font-bold">{realtimeData.currentSessions}</p>
                <Badge variant="secondary" className="text-xs">Live</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Page Views</p>
                <p className="text-2xl font-bold">{realtimeData.pageViews}</p>
                <Badge variant="secondary" className="text-xs">Today</Badge>
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
                <p className="text-2xl font-bold">{realtimeData.avgSessionTime}m</p>
                <Badge variant="secondary" className="text-xs">Firebase</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Firebase Analytics Tabs */}
      <Tabs value={selectedTab} onValueChange={(value) => {
        setSelectedTab(value)
        trackContentView('tab_change', value)
      }}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="users">Daily Active Users</TabsTrigger>
          <TabsTrigger value="lessons">Lessons Analytics</TabsTrigger>
          <TabsTrigger value="session">Session Analysis</TabsTrigger>
          <TabsTrigger value="growth">Platform Growth</TabsTrigger>
        </TabsList>

        {/* User Engagement from Firebase */}
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                User Engagement Trends (Firebase)
              </CardTitle>
              <CardDescription>Real user activity tracked via Firebase Analytics</CardDescription>
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
              <CardTitle>Content Performance (Firebase Events)</CardTitle>
              <CardDescription>Content interaction data from Firebase Analytics</CardDescription>
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
                    <Bar dataKey="views" fill="#8884d8" name="Views" />
                    <Bar dataKey="completionRate" fill="#82ca9d" name="Completion Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Active Users from Firebase */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Active Users (Firebase Analytics)</CardTitle>
              <CardDescription>User activity patterns tracked by Firebase</CardDescription>
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
                    <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} name="Total Users" />
                    <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" strokeWidth={2} name="New Users" />
                    <Line type="monotone" dataKey="sessions" stroke="#ffc658" strokeWidth={2} name="Sessions" />
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

        {/* Session Analysis */}
        <TabsContent value="session" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Time Distribution (Firebase)</CardTitle>
              <CardDescription>Session duration patterns from Firebase Analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData?.sessionTimeDistribution || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timeRange" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#8884d8" name="Sessions" />
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData?.sessionTimeDistribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.timeRange}: ${entry.percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {(analyticsData?.sessionTimeDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
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
              <CardTitle>Platform Growth Analysis (Firebase)</CardTitle>
              <CardDescription>Growth metrics powered by Firebase Analytics</CardDescription>
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