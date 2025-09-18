"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, TrendingUp, Activity, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const dailyUsersData = [
  { date: "Jan 1", users: 1200, newUsers: 45, returningUsers: 1155 },
  { date: "Jan 2", users: 1350, newUsers: 67, returningUsers: 1283 },
  { date: "Jan 3", users: 1180, newUsers: 32, returningUsers: 1148 },
  { date: "Jan 4", users: 1420, newUsers: 89, returningUsers: 1331 },
  { date: "Jan 5", users: 1380, newUsers: 56, returningUsers: 1324 },
  { date: "Jan 6", users: 1500, newUsers: 78, returningUsers: 1422 },
  { date: "Jan 7", users: 1650, newUsers: 92, returningUsers: 1558 },
]

const hourlyUsersData = [
  { hour: "00", users: 45 },
  { hour: "06", users: 120 },
  { hour: "12", users: 890 },
  { hour: "18", users: 1200 },
  { hour: "24", users: 234 },
]

const userSegmentData = [
  { segment: "Students", count: 1200, percentage: 75 },
  { segment: "Teachers", count: 300, percentage: 19 },
  { segment: "Admins", count: 100, percentage: 6 },
]

export function DailyActiveUsersPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("7d")
  const [userType, setUserType] = useState("all")

  const currentUsers = 1650
  const previousPeriod = 1580
  const growthPercentage = ((currentUsers - previousPeriod) / previousPeriod * 100).toFixed(1)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Active Users</h1>
          <p className="text-muted-foreground">Comprehensive analysis of user activity patterns</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        <Select value={userType} onValueChange={setUserType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="students">Students</SelectItem>
            <SelectItem value="teachers">Teachers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current DAU</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +{growthPercentage}% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hours</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6-8 PM</div>
            <p className="text-xs text-muted-foreground">Highest activity period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.4%</div>
            <p className="text-xs text-muted-foreground">7-day retention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Users Trend</CardTitle>
            <CardDescription>User activity over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyUsersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hourly Distribution</CardTitle>
            <CardDescription>User activity by hour of day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyUsersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>New vs Returning Users</CardTitle>
            <CardDescription>User composition breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyUsersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="newUsers" stroke="#8884d8" strokeWidth={2} name="New Users" />
                <Line type="monotone" dataKey="returningUsers" stroke="#82ca9d" strokeWidth={2} name="Returning Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Segments</CardTitle>
            <CardDescription>Breakdown by user type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userSegmentData.map((segment) => (
                <div key={segment.segment} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="font-medium">{segment.segment}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{segment.count.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{segment.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Insights</CardTitle>
          <CardDescription>Key insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Growth Opportunity</h4>
              <p className="text-sm text-green-600">
                Peak usage during evening hours suggests potential for extended support hours
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">User Engagement</h4>
              <p className="text-sm text-blue-600">
                High returning user ratio indicates strong platform engagement
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">Optimization</h4>
              <p className="text-sm text-orange-600">
                Consider targeted campaigns during low-activity periods
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}