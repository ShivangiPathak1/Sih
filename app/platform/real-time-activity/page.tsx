"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Activity, Users, BookOpen, MessageSquare, AlertTriangle, RefreshCw, Zap, Clock, BarChart3 } from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Sample real-time data
const realTimeMetrics = [
  { metric: "Active Users", value: 1247, change: "+23", trend: "up", color: "text-green-600" },
  { metric: "Lessons in Progress", value: 89, change: "+12", trend: "up", color: "text-blue-600" },
  { metric: "Pending Approvals", value: 23, change: "-5", trend: "down", color: "text-orange-600" },
  { metric: "Active Support Tickets", value: 5, change: "-2", trend: "down", color: "text-red-600" },
]

const liveActivityFeed = [
  { id: 1, user: "Sarah Chen", action: "completed", content: "Advanced Algebra Quiz", time: "2 minutes ago", type: "achievement" },
  { id: 2, user: "Mike Johnson", action: "started", content: "Physics Experiment Simulation", time: "3 minutes ago", type: "activity" },
  { id: 3, user: "Admin", action: "published", content: "New Math Worksheet Collection", time: "5 minutes ago", type: "content" },
  { id: 4, user: "Emma Wilson", action: "submitted", content: "Support Request #1247", time: "7 minutes ago", type: "support" },
  { id: 5, user: "David Lee", action: "downloaded", content: "History Timeline Template", time: "10 minutes ago", type: "activity" },
  { id: 6, user: "Lisa Brown", action: "rated", content: "Science Lab Video (5 stars)", time: "12 minutes ago", type: "feedback" },
  { id: 7, user: "Teacher Kate", action: "created", content: "Weekly Assignment for Grade 4", time: "15 minutes ago", type: "content" },
  { id: 8, user: "John Smith", action: "joined", content: "Interactive Math Game Session", time: "18 minutes ago", type: "activity" },
]

const systemHealthMetrics = [
  { component: "API Server", status: "healthy", uptime: 99.9, responseTime: 125 },
  { component: "Database", status: "healthy", uptime: 99.8, responseTime: 45 },
  { component: "Content Delivery", status: "warning", uptime: 98.2, responseTime: 250 },
  { component: "Authentication", status: "healthy", uptime: 99.9, responseTime: 89 },
  { component: "File Storage", status: "healthy", uptime: 99.7, responseTime: 156 },
]

const currentSessionsData = [
  { time: "00:00", sessions: 890 },
  { time: "00:05", sessions: 925 },
  { time: "00:10", sessions: 1050 },
  { time: "00:15", sessions: 1150 },
  { time: "00:20", sessions: 1200 },
  { time: "00:25", sessions: 1247 },
]

const activeRegions = [
  { region: "North America", users: 487, percentage: 39.1, growth: "+12" },
  { region: "Europe", users: 356, percentage: 28.6, growth: "+8" },
  { region: "Asia Pacific", users: 234, percentage: 18.8, growth: "+15" },
  { region: "Latin America", users: 123, percentage: 9.9, growth: "+5" },
  { region: "Africa", users: 47, percentage: 3.8, growth: "+3" },
]

const contentEngagementRealTime = [
  { content: "Interactive Quiz: Fractions", users: 145, engagement: 94 },
  { content: "Science Video: Photosynthesis", users: 123, engagement: 89 },
  { content: "Math Game: Number Patterns", users: 98, engagement: 96 },
  { content: "History Lesson: Ancient Rome", users: 87, engagement: 82 },
  { content: "Language Arts: Grammar Quiz", users: 76, engagement: 78 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function RealTimePlatformActivityPage() {
  const router = useRouter()
  const [refreshInterval, setRefreshInterval] = useState("30s")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const handleGoBack = () => {
    router.back()
  }

  const handleRefresh = () => {
    setLastUpdated(new Date())
  }

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date())
      }, refreshInterval === "30s" ? 30000 : refreshInterval === "1m" ? 60000 : 300000)
      
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-green-600 bg-green-100"
      case "warning": return "text-orange-600 bg-orange-100"
      case "error": return "text-red-600 bg-red-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "achievement": return "🏆"
      case "activity": return "📚"
      case "content": return "📝"
      case "support": return "❓"
      case "feedback": return "⭐"
      default: return "📋"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Real-time Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Real-time Platform Activity</h1>
            <p className="text-muted-foreground">Live monitoring of platform activity, user engagement, and system health</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Select value={refreshInterval} onValueChange={setRefreshInterval}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30s">30s</SelectItem>
              <SelectItem value="1m">1m</SelectItem>
              <SelectItem value="5m">5m</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </Badge>
        </div>
      </div>

      {/* Real-time Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {realTimeMetrics.map((metric) => (
          <Card key={metric.metric}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {metric.metric}
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metric.color}`}>
                {metric.value.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Zap className="h-3 w-3 mr-1" />
                {metric.change} in last 5 min
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live User Sessions
            <Badge variant="secondary">Last 30 minutes</Badge>
          </CardTitle>
          <CardDescription>
            Real-time active user sessions with 5-minute intervals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={currentSessionsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                labelFormatter={(time) => `Time: ${time}`}
                formatter={(value) => [value, 'Active Sessions']}
              />
              <Area 
                type="monotone" 
                dataKey="sessions" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Peak: 1,247 users</span>
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <span>Trend: +4.2% vs last hour</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>
              Real-time user actions and platform events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {liveActivityFeed.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="text-lg">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-muted-foreground"> {activity.action} </span>
                      <span className="font-medium">{activity.content}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Health Monitor
            </CardTitle>
            <CardDescription>
              Real-time system component status and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealthMetrics.map((component) => (
                <div key={component.component} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${component.status === 'healthy' ? 'bg-green-500' : component.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'}`} />
                    <div>
                      <div className="font-medium">{component.component}</div>
                      <div className="text-sm text-muted-foreground">
                        Uptime: {component.uptime}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(component.status)}
                    >
                      {component.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {component.responseTime}ms
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Activity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Users by Region
            </CardTitle>
            <CardDescription>
              Real-time geographic distribution of active users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRegions.map((region, index) => (
                <div key={region.region} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{region.region}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{region.users} users</Badge>
                      <Badge variant="outline" className="text-green-600">
                        {region.growth}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={region.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">
                    {region.percentage}% of total active users
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Most Engaged Content Right Now */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Most Engaged Content
            </CardTitle>
            <CardDescription>
              Currently most popular content based on active engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentEngagementRealTime.map((content, index) => (
                <div key={content.content} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{content.content}</div>
                      <div className="text-xs text-muted-foreground">
                        {content.users} active users
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={content.engagement > 90 ? "default" : "secondary"}>
                      {content.engagement}%
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      engagement
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Heatmap Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Activity Overview
          </CardTitle>
          <CardDescription>
            Real-time overview of platform utilization and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">89.2%</div>
              <div className="text-sm text-muted-foreground">Server Utilization</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">156ms</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">12.4GB</div>
              <div className="text-sm text-muted-foreground">Bandwidth Usage</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">4,567</div>
              <div className="text-sm text-muted-foreground">API Requests/min</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}