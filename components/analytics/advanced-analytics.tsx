"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  Download,
  Filter,
  CalendarIcon,
  Eye,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
} from "lucide-react"
import { format } from "date-fns"

interface AnalyticsData {
  dailyActiveUsers: number[]
  lessonsCompleted: number[]
  averageSessionTime: number[]
  platformGrowth: number
  subjectPerformance: {
    subject: string
    performance: number
    students: number
    trend: string
  }[]
  userEngagement: {
    date: string
    users: number
    sessions: number
    duration: number
  }[]
}

export function AdvancedAnalytics() {
  const [selectedDateRange, setSelectedDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  })
  const [selectedMetric, setSelectedMetric] = useState("users")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedGrade, setSelectedGrade] = useState("all")

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    dailyActiveUsers: [1200, 1350, 1180, 1420, 1380, 1500, 1650, 1580, 1720, 1690, 1800, 1750, 1900, 1850, 2000],
    lessonsCompleted: [450, 520, 480, 580, 620, 700, 750, 680, 800, 820, 900, 850, 950, 920, 1000],
    averageSessionTime: [35, 38, 32, 42, 45, 48, 52, 46, 55, 58, 62, 59, 65, 63, 68],
    platformGrowth: 15.2,
    subjectPerformance: [
      { subject: "Mathematics", performance: 87, students: 1250, trend: "+3.2%" },
      { subject: "Science", performance: 82, students: 1100, trend: "+1.8%" },
      { subject: "English", performance: 89, students: 1350, trend: "+4.1%" },
      { subject: "History", performance: 78, students: 950, trend: "-0.5%" },
      { subject: "Geography", performance: 84, students: 800, trend: "+2.3%" },
    ],
    userEngagement: [
      { date: "2024-01-01", users: 1200, sessions: 2400, duration: 35 },
      { date: "2024-01-02", users: 1350, sessions: 2700, duration: 38 },
      { date: "2024-01-03", users: 1180, sessions: 2360, duration: 32 },
      { date: "2024-01-04", users: 1420, sessions: 2840, duration: 42 },
      { date: "2024-01-05", users: 1380, sessions: 2760, duration: 45 },
    ],
  }

  const exportReport = (format: "csv" | "pdf" | "xlsx") => {
    const data = {
      dateRange: `${selectedDateRange.from.toLocaleDateString()} - ${selectedDateRange.to.toLocaleDateString()}`,
      dailyActiveUsers: analyticsData.dailyActiveUsers[analyticsData.dailyActiveUsers.length - 1],
      totalLessonsCompleted: analyticsData.lessonsCompleted.reduce((sum, val) => sum + val, 0),
      averageSessionTime: analyticsData.averageSessionTime[analyticsData.averageSessionTime.length - 1],
      platformGrowth: analyticsData.platformGrowth,
      subjectPerformance: analyticsData.subjectPerformance,
    }

    if (format === "csv") {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Metric,Value,Period\n" +
        `Daily Active Users,${data.dailyActiveUsers},${data.dateRange}\n` +
        `Total Lessons Completed,${data.totalLessonsCompleted},${data.dateRange}\n` +
        `Average Session Time,${data.averageSessionTime} min,${data.dateRange}\n` +
        `Platform Growth,${data.platformGrowth}%,Monthly\n` +
        data.subjectPerformance
          .map((s) => `${s.subject} Performance,${s.performance}%,${s.students} students`)
          .join("\n")

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `analytics_report_${format}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const generateCustomReport = () => {
    const reportData = {
      metric: selectedMetric,
      subject: selectedSubject,
      grade: selectedGrade,
      dateRange: selectedDateRange,
      data: analyticsData,
    }

    console.log("Generating custom report with filters:", reportData)
    // Here you would typically send this to your backend for processing
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive insights with filtering and custom reporting</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => exportReport("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport("xlsx")}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Analytics Filters
          </CardTitle>
          <CardDescription>Customize your analytics view with filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDateRange.from && selectedDateRange.to
                      ? `${format(selectedDateRange.from, "MMM dd")} - ${format(selectedDateRange.to, "MMM dd")}`
                      : "Select date range"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={selectedDateRange}
                    onSelect={(range) => range && setSelectedDateRange(range)}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Primary Metric</Label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="users">Active Users</SelectItem>
                  <SelectItem value="lessons">Lessons Completed</SelectItem>
                  <SelectItem value="session-time">Session Time</SelectItem>
                  <SelectItem value="engagement">User Engagement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject Filter</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="geography">Geography</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Grade Level</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="6">Grade 6</SelectItem>
                  <SelectItem value="7">Grade 7</SelectItem>
                  <SelectItem value="8">Grade 8</SelectItem>
                  <SelectItem value="9">Grade 9</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                  <SelectItem value="12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={generateCustomReport}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Custom Report
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily Active Users</p>
                <p className="text-xl font-bold">
                  {analyticsData.dailyActiveUsers[analyticsData.dailyActiveUsers.length - 1].toLocaleString()}
                </p>
                <p className="text-xs text-green-600">+8.2% vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
                <p className="text-xl font-bold">
                  {analyticsData.lessonsCompleted[analyticsData.lessonsCompleted.length - 1].toLocaleString()}
                </p>
                <p className="text-xs text-green-600">+15.3% vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Session Time</p>
                <p className="text-xl font-bold">
                  {analyticsData.averageSessionTime[analyticsData.averageSessionTime.length - 1]} min
                </p>
                <p className="text-xs text-green-600">+5.1% vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-chart-3/10 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Platform Growth</p>
                <p className="text-xl font-bold">+{analyticsData.platformGrowth}%</p>
                <p className="text-xs text-green-600">Monthly growth rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Usage Trends</TabsTrigger>
          <TabsTrigger value="performance">Subject Performance</TabsTrigger>
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="insights">Predictive Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Active Users Trend</CardTitle>
                <CardDescription>User activity over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {analyticsData.dailyActiveUsers.slice(-15).map((users, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="bg-primary rounded-t-lg w-8 flex items-end justify-center text-white text-xs font-bold"
                        style={{ height: `${(users / Math.max(...analyticsData.dailyActiveUsers)) * 200}px` }}
                      >
                        {users > 1500 ? users : ""}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{index + 1}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">Last 15 days</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lessons Completed Trend</CardTitle>
                <CardDescription>Learning activity progression</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {analyticsData.lessonsCompleted.slice(-15).map((lessons, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="bg-secondary rounded-t-lg w-8 flex items-end justify-center text-white text-xs font-bold"
                        style={{ height: `${(lessons / Math.max(...analyticsData.lessonsCompleted)) * 200}px` }}
                      >
                        {lessons > 700 ? lessons : ""}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{index + 1}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">Last 15 days</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance Analysis</CardTitle>
              <CardDescription>Detailed breakdown of student performance by subject</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analyticsData.subjectPerformance.map((subject, index) => (
                <div key={subject.subject} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-chart-${(index % 5) + 1}`}></div>
                      <span className="font-medium">{subject.subject}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">{subject.students} students</span>
                      <Badge variant={subject.trend.startsWith("+") ? "default" : "secondary"}>{subject.trend}</Badge>
                      <span className="font-bold">{subject.performance}%</span>
                    </div>
                  </div>
                  <Progress value={subject.performance} className="h-3" />
                  <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                    <span>Completion Rate: {subject.performance}%</span>
                    <span>Avg Score: {Math.floor(subject.performance * 0.9)}%</span>
                    <span>Engagement: {Math.floor(subject.performance * 0.95)}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement Metrics</CardTitle>
                <CardDescription>How users interact with the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Session Duration</p>
                    <p className="text-2xl font-bold">42 min</p>
                    <p className="text-xs text-green-600">+12% this week</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Pages per Session</p>
                    <p className="text-2xl font-bold">8.5</p>
                    <p className="text-xs text-green-600">+5% this week</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Return Rate</p>
                    <p className="text-2xl font-bold">78%</p>
                    <p className="text-xs text-green-600">+3% this week</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">85%</p>
                    <p className="text-xs text-green-600">+7% this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Usage Hours</CardTitle>
                <CardDescription>When users are most active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { hour: "9:00 AM", usage: 85, label: "Morning Peak" },
                    { hour: "2:00 PM", usage: 92, label: "Afternoon Peak" },
                    { hour: "7:00 PM", usage: 78, label: "Evening Study" },
                    { hour: "10:00 PM", usage: 45, label: "Late Night" },
                  ].map((time) => (
                    <div key={time.hour} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          {time.hour} - {time.label}
                        </span>
                        <span>{time.usage}%</span>
                      </div>
                      <Progress value={time.usage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>Automated analysis and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    type: "prediction",
                    title: "Enrollment Growth Forecast",
                    message: "Based on current trends, expect 18% growth in student enrollment next quarter",
                    confidence: 87,
                    priority: "info",
                  },
                  {
                    type: "alert",
                    title: "Subject Performance Alert",
                    message: "History subject showing declining engagement - recommend content review",
                    confidence: 92,
                    priority: "warning",
                  },
                  {
                    type: "recommendation",
                    title: "Optimization Opportunity",
                    message: "Peak usage at 2 PM suggests optimal time for live sessions",
                    confidence: 78,
                    priority: "info",
                  },
                ].map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge variant={insight.priority === "warning" ? "secondary" : "outline"}>
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.message}</p>
                    <div className="flex items-center gap-2">
                      {insight.type === "prediction" && <Target className="h-4 w-4 text-blue-500" />}
                      {insight.type === "alert" && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                      {insight.type === "recommendation" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      <span className="text-xs text-muted-foreground capitalize">{insight.type}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automated Alerts</CardTitle>
                <CardDescription>System-generated notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    title: "Low Engagement Detected",
                    message: "Grade 8 Mathematics class engagement dropped 15%",
                    time: "2 hours ago",
                    severity: "medium",
                  },
                  {
                    title: "Performance Milestone",
                    message: "Overall platform performance exceeded 95% uptime",
                    time: "1 day ago",
                    severity: "low",
                  },
                  {
                    title: "Content Usage Spike",
                    message: "Science content views increased 40% this week",
                    time: "3 days ago",
                    severity: "low",
                  },
                ].map((alert, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        alert.severity === "high"
                          ? "bg-red-500"
                          : alert.severity === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
