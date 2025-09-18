"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Users, BookOpen, TrendingUp, Server, Database, CheckCircle, RefreshCw } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

interface RealTimeMetrics {
  activeUsers: number
  lessonsCompleted: number
  serverLoad: number
  databaseResponseTime: number
  networkLatency: number
  errorRate: number
  timestamp: string
}

const generateMockData = (): RealTimeMetrics[] => {
  const data = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60000) // Every minute
    data.push({
      activeUsers: Math.floor(Math.random() * 200) + 1000,
      lessonsCompleted: Math.floor(Math.random() * 50) + 20,
      serverLoad: Math.floor(Math.random() * 30) + 60,
      databaseResponseTime: Math.floor(Math.random() * 20) + 30,
      networkLatency: Math.floor(Math.random() * 10) + 15,
      errorRate: Math.random() * 2,
      timestamp: timestamp.toLocaleTimeString(),
    })
  }
  return data
}

export function RealTimeDashboard() {
  const [metrics, setMetrics] = useState<RealTimeMetrics[]>(generateMockData())
  const [isLive, setIsLive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      const newMetric: RealTimeMetrics = {
        activeUsers: Math.floor(Math.random() * 200) + 1000,
        lessonsCompleted: Math.floor(Math.random() * 50) + 20,
        serverLoad: Math.floor(Math.random() * 30) + 60,
        databaseResponseTime: Math.floor(Math.random() * 20) + 30,
        networkLatency: Math.floor(Math.random() * 10) + 15,
        errorRate: Math.random() * 2,
        timestamp: new Date().toLocaleTimeString(),
      }

      setMetrics((prev) => [...prev.slice(1), newMetric])
      setLastUpdate(new Date())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isLive])

  const currentMetrics = metrics[metrics.length - 1]
  const previousMetrics = metrics[metrics.length - 2]

  const getChangePercentage = (current: number, previous: number) => {
    if (!previous) return 0
    return (((current - previous) / previous) * 100).toFixed(1)
  }

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return "text-green-600"
    if (value <= thresholds.warning) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Real-Time Platform Activity</h2>
          <p className="text-muted-foreground">
            Live system metrics and user engagement • Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isLive ? "default" : "outline"}
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2"
          >
            {isLive ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Paused
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics?.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {previousMetrics && (
                <span
                  className={
                    getChangePercentage(currentMetrics.activeUsers, previousMetrics.activeUsers).startsWith("-")
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  {getChangePercentage(currentMetrics.activeUsers, previousMetrics.activeUsers).startsWith("-")
                    ? ""
                    : "+"}
                  {getChangePercentage(currentMetrics.activeUsers, previousMetrics.activeUsers)}% from last update
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics?.lessonsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              {previousMetrics && (
                <span
                  className={
                    getChangePercentage(currentMetrics.lessonsCompleted, previousMetrics.lessonsCompleted).startsWith(
                      "-",
                    )
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  {getChangePercentage(currentMetrics.lessonsCompleted, previousMetrics.lessonsCompleted).startsWith(
                    "-",
                  )
                    ? ""
                    : "+"}
                  {getChangePercentage(currentMetrics.lessonsCompleted, previousMetrics.lessonsCompleted)}% from last
                  update
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server Load</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics?.serverLoad}%</div>
            <Progress value={currentMetrics?.serverLoad} className="mt-2" />
            <p className={`text-xs mt-1 ${getStatusColor(currentMetrics?.serverLoad || 0, { good: 70, warning: 85 })}`}>
              {currentMetrics?.serverLoad <= 70 ? "Optimal" : currentMetrics?.serverLoad <= 85 ? "Moderate" : "High"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DB Response</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics?.databaseResponseTime}ms</div>
            <p
              className={`text-xs ${getStatusColor(currentMetrics?.databaseResponseTime || 0, { good: 40, warning: 60 })}`}
            >
              {currentMetrics?.databaseResponseTime <= 40
                ? "Excellent"
                : currentMetrics?.databaseResponseTime <= 60
                  ? "Good"
                  : "Slow"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Users (Last 30 minutes)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="activeUsers" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="serverLoad" stroke="#ef4444" name="Server Load (%)" />
                <Line type="monotone" dataKey="databaseResponseTime" stroke="#10b981" name="DB Response (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">API Services</span>
                <Badge variant="default" className="bg-green-600">
                  Online
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Database</span>
                <Badge variant="default" className="bg-green-600">
                  Healthy
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">File Storage</span>
                <Badge variant="default" className="bg-green-600">
                  Available
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">CDN</span>
                <Badge variant="default" className="bg-green-600">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Current Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Students Online</span>
                <span className="font-bold">{Math.floor((currentMetrics?.activeUsers || 0) * 0.7)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Teachers Online</span>
                <span className="font-bold">{Math.floor((currentMetrics?.activeUsers || 0) * 0.2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Admins Online</span>
                <span className="font-bold">{Math.floor((currentMetrics?.activeUsers || 0) * 0.1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Sessions</span>
                <span className="font-bold">{currentMetrics?.activeUsers}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Session Duration</span>
                <span className="font-bold">24m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Page Load Time</span>
                <span className="font-bold">1.2s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Error Rate</span>
                <span className="font-bold">{currentMetrics?.errorRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Uptime</span>
                <span className="font-bold text-green-600">99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Live Activity Feed</CardTitle>
          <CardDescription>Real-time platform events and user activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {[
              { event: "New user registration", user: "Priya Sharma", time: "2 seconds ago", type: "user" },
              {
                event: "Lesson completed",
                user: "Rahul Kumar",
                details: "Mathematics - Algebra",
                time: "15 seconds ago",
                type: "lesson",
              },
              {
                event: "Quiz submitted",
                user: "Anita Singh",
                details: "Science Quiz #45",
                time: "32 seconds ago",
                type: "quiz",
              },
              {
                event: "Content uploaded",
                user: "Dr. Patel",
                details: "Physics Chapter 12",
                time: "1 minute ago",
                type: "content",
              },
              { event: "User logged in", user: "Vikram Gupta", time: "1 minute ago", type: "login" },
              {
                event: "Assignment submitted",
                user: "Meera Joshi",
                details: "English Essay",
                time: "2 minutes ago",
                type: "assignment",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "user"
                      ? "bg-blue-500"
                      : activity.type === "lesson"
                        ? "bg-green-500"
                        : activity.type === "quiz"
                          ? "bg-purple-500"
                          : activity.type === "content"
                            ? "bg-orange-500"
                            : activity.type === "login"
                              ? "bg-gray-500"
                              : "bg-pink-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.event.toLowerCase()}
                    {activity.details && <span className="text-muted-foreground"> • {activity.details}</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
