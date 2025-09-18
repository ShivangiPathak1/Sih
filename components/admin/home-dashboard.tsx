"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, BookOpen, AlertCircle, HelpCircle, TrendingUp, Activity, CheckCircle, Clock } from "lucide-react"

interface DashboardStats {
  activeUsers: number
  lessonsCompleted: number
  pendingApprovals: number
  supportTickets: number
  teacherApplications: number
  courseContent: number
}

interface HomeDashboardProps {
  onNavigateToPage: (page: string) => void
}

export function HomeDashboard({ onNavigateToPage }: HomeDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    activeUsers: 1247,
    lessonsCompleted: 3892,
    pendingApprovals: 23,
    supportTickets: 8,
    teacherApplications: 12,
    courseContent: 456,
  })

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: "approval", message: "New content submitted by Dr. Priya Sharma", time: "2 min ago" },
    { id: 2, type: "user", message: "15 new student registrations", time: "5 min ago" },
    { id: 3, type: "ticket", message: "Support ticket #1234 resolved", time: "10 min ago" },
    { id: 4, type: "content", message: "Mathematics quiz approved", time: "15 min ago" },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5),
        lessonsCompleted: prev.lessonsCompleted + Math.floor(Math.random() * 3),
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const dashboardCards = [
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      description: "Currently online",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      onClick: () => onNavigateToPage("users"),
    },
    {
      title: "Lessons Completed Today",
      value: stats.lessonsCompleted.toLocaleString(),
      description: "Across all subjects",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
      onClick: () => onNavigateToPage("analytics"),
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals.toString(),
      description: "Content awaiting review",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "-3%",
      onClick: () => onNavigateToPage("content"),
    },
    {
      title: "Support Tickets",
      value: stats.supportTickets.toString(),
      description: "Open tickets",
      icon: HelpCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      change: "+2%",
      onClick: () => onNavigateToPage("support"),
    },
  ]

  const quickActions = [
    {
      title: "Teacher Applications",
      count: stats.teacherApplications,
      description: "New applications pending review",
      action: "Review Applications",
      onClick: () => onNavigateToPage("users"),
    },
    {
      title: "Course Content",
      count: stats.courseContent,
      description: "Total approved content items",
      action: "Manage Content",
      onClick: () => onNavigateToPage("content"),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <p className="text-muted-foreground">Real-time platform activity and key metrics</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={card.onClick}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge variant={card.change.startsWith("+") ? "default" : "secondary"} className="text-xs">
                  {card.change} from last week
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Important tasks requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{action.title}</h4>
                    <Badge variant="outline">{action.count}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                <Button size="sm" onClick={action.onClick}>
                  {action.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Real-time Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time Platform Activity
            </CardTitle>
            <CardDescription>Live updates from across the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="mt-1">
                  {activity.type === "approval" && <Clock className="h-4 w-4 text-orange-500" />}
                  {activity.type === "user" && <Users className="h-4 w-4 text-blue-500" />}
                  {activity.type === "ticket" && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {activity.type === "content" && <BookOpen className="h-4 w-4 text-purple-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health & Performance</CardTitle>
          <CardDescription>Current system status and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Server Performance</span>
                <span>98%</span>
              </div>
              <Progress value={98} className="h-2" />
              <p className="text-xs text-muted-foreground">Excellent</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Database Health</span>
                <span>95%</span>
              </div>
              <Progress value={95} className="h-2" />
              <p className="text-xs text-muted-foreground">Very Good</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>User Satisfaction</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground">Excellent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
