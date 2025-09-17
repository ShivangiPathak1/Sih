"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Users, BarChart3, Calendar, Activity } from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Sample data for session time analytics
const dailySessionData = [
  { date: "2024-01-01", avgSession: 22, totalSessions: 145, users: 45 },
  { date: "2024-01-02", avgSession: 25, totalSessions: 156, users: 52 },
  { date: "2024-01-03", avgSession: 19, totalSessions: 134, users: 38 },
  { date: "2024-01-04", avgSession: 28, totalSessions: 178, users: 67 },
  { date: "2024-01-05", avgSession: 31, totalSessions: 203, users: 73 },
  { date: "2024-01-06", avgSession: 24, totalSessions: 189, users: 89 },
  { date: "2024-01-07", avgSession: 26, totalSessions: 221, users: 94 },
]

const sessionDistribution = [
  { range: "0-10 min", sessions: 45, percentage: 15 },
  { range: "10-20 min", sessions: 89, percentage: 30 },
  { range: "20-30 min", sessions: 112, percentage: 37 },
  { range: "30-45 min", sessions: 43, percentage: 14 },
  { range: "45+ min", sessions: 12, percentage: 4 },
]

const hourlyActivity = [
  { hour: "6", sessions: 12, avgTime: 15 },
  { hour: "7", sessions: 28, avgTime: 18 },
  { hour: "8", sessions: 45, avgTime: 22 },
  { hour: "9", sessions: 67, avgTime: 25 },
  { hour: "10", sessions: 89, avgTime: 28 },
  { hour: "11", sessions: 98, avgTime: 30 },
  { hour: "12", sessions: 76, avgTime: 26 },
  { hour: "13", sessions: 82, avgTime: 24 },
  { hour: "14", sessions: 94, avgTime: 27 },
  { hour: "15", sessions: 108, avgTime: 32 },
  { hour: "16", sessions: 134, avgTime: 35 },
  { hour: "17", sessions: 145, avgTime: 38 },
  { hour: "18", sessions: 123, avgTime: 33 },
  { hour: "19", sessions: 89, avgTime: 29 },
  { hour: "20", sessions: 56, avgTime: 25 },
  { hour: "21", sessions: 34, avgTime: 20 },
  { hour: "22", sessions: 23, avgTime: 18 },
  { hour: "23", sessions: 15, avgTime: 16 },
]

const deviceBreakdown = [
  { device: "Desktop", avgTime: 32, sessions: 456, percentage: 45 },
  { device: "Mobile", avgTime: 18, sessions: 389, percentage: 38 },
  { device: "Tablet", avgTime: 25, sessions: 123, percentage: 12 },
  { device: "Other", avgTime: 15, sessions: 52, percentage: 5 },
]

const gradeComparison = [
  { grade: "Grade 1", avgSession: 15, medianSession: 12, maxSession: 45 },
  { grade: "Grade 2", avgSession: 18, medianSession: 15, maxSession: 52 },
  { grade: "Grade 3", avgSession: 22, medianSession: 19, maxSession: 65 },
  { grade: "Grade 4", avgSession: 26, medianSession: 23, maxSession: 78 },
  { grade: "Grade 5", avgSession: 30, medianSession: 27, maxSession: 89 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function SessionTimePage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("7d")
  const [deviceFilter, setDeviceFilter] = useState("all")

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Session Time Analytics</h1>
            <p className="text-muted-foreground">Comprehensive analysis of user session duration and engagement patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={deviceFilter} onValueChange={setDeviceFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Devices</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Session Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3 min</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1 min vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Median Session Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">19.5 min</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +1.8 min vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,326</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +147 vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Session Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4%</div>
            <div className="flex items-center text-sm text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.1% vs last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Session Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Daily Session Time Trends
          </CardTitle>
          <CardDescription>
            Average session duration with total session count and user engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailySessionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value, name) => {
                  if (name === 'avgSession') return [value + ' min', 'Avg Session Time']
                  if (name === 'totalSessions') return [value, 'Total Sessions']
                  return [value, 'Active Users']
                }}
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="avgSession" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
                name="Avg Session Time (min)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="totalSessions" 
                stroke="#82ca9d" 
                name="Total Sessions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Duration Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Session Duration Distribution
            </CardTitle>
            <CardDescription>
              How session lengths are distributed across time ranges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sessionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: any) => `${name} (${(((value || 0) / sessionDistribution.reduce((sum, item) => sum + item.sessions, 0)) * 100).toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sessions"
                >
                  {sessionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Sessions']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {sessionDistribution.map((range, index) => (
                <div key={range.range} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{range.range}</span>
                  </div>
                  <Badge variant="secondary">{range.sessions} sessions</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Activity Pattern */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Hourly Activity Patterns
            </CardTitle>
            <CardDescription>
              Session count and average duration throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  labelFormatter={(hour) => `${hour}:00`}
                  formatter={(value, name) => [
                    name === 'sessions' ? value : value + ' min', 
                    name === 'sessions' ? 'Sessions' : 'Avg Time'
                  ]}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="sessions" fill="#8884d8" name="Sessions" />
                <Bar yAxisId="right" dataKey="avgTime" fill="#82ca9d" name="Avg Time (min)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Device-wise Session Analysis
          </CardTitle>
          <CardDescription>
            Session duration patterns across different device types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deviceBreakdown.map((device) => (
              <div key={device.device} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{device.device}</h4>
                  <Badge variant="outline">{device.percentage}% of total</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Avg Session Time
                    </div>
                    <div className="text-lg font-semibold">{device.avgTime} min</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BarChart3 className="h-4 w-4" />
                      Total Sessions
                    </div>
                    <div className="text-lg font-semibold">{device.sessions}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grade Level Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Grade Level Session Comparison
          </CardTitle>
          <CardDescription>
            How session times vary across different grade levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip formatter={(value) => [value + ' min', 'Duration']} />
              <Legend />
              <Bar dataKey="avgSession" fill="#8884d8" name="Average" />
              <Bar dataKey="medianSession" fill="#82ca9d" name="Median" />
              <Bar dataKey="maxSession" fill="#ffc658" name="Maximum" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}