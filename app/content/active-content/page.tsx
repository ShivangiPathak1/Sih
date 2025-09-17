"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, TrendingDown, Activity, BookOpen, Play, Pause, Calendar, Users, BarChart3 } from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Sample data for active content analytics
const contentActivityData = [
  { date: "2024-01-01", activeContent: 1167, newContent: 12, archivedContent: 5 },
  { date: "2024-01-02", activeContent: 1174, newContent: 15, archivedContent: 8 },
  { date: "2024-01-03", activeContent: 1181, newContent: 18, archivedContent: 11 },
  { date: "2024-01-04", activeContent: 1198, newContent: 22, archivedContent: 5 },
  { date: "2024-01-05", activeContent: 1215, newContent: 25, archivedContent: 8 },
  { date: "2024-01-06", activeContent: 1227, newContent: 19, archivedContent: 7 },
  { date: "2024-01-07", activeContent: 1234, newContent: 16, archivedContent: 9 },
]

const contentStatusBreakdown = [
  { status: "Published", count: 1023, percentage: 82.9, growth: 12.3 },
  { status: "Draft", count: 145, percentage: 11.7, growth: 8.7 },
  { status: "Under Review", count: 43, percentage: 3.5, growth: 25.4 },
  { status: "Scheduled", count: 23, percentage: 1.9, growth: 15.6 },
]

const contentTypeActivity = [
  { type: "Lessons", active: 456, total: 520, engagement: 89, lastUpdated: "2 days ago" },
  { type: "Quizzes", active: 298, total: 325, engagement: 94, lastUpdated: "1 day ago" },
  { type: "Games", active: 187, total: 205, engagement: 96, lastUpdated: "3 hours ago" },
  { type: "Videos", active: 234, total: 267, engagement: 87, lastUpdated: "5 days ago" },
  { type: "Worksheets", active: 59, total: 78, engagement: 82, lastUpdated: "1 week ago" },
]

const contentCreationTrends = [
  { month: "Jul", created: 45, published: 42, archived: 3 },
  { month: "Aug", created: 52, published: 48, archived: 4 },
  { month: "Sep", created: 38, published: 35, archived: 3 },
  { month: "Oct", created: 67, published: 63, archived: 4 },
  { month: "Nov", created: 73, published: 68, archived: 5 },
  { month: "Dec", created: 58, published: 55, archived: 3 },
  { month: "Jan", created: 62, published: 59, archived: 3 },
]

const gradeWiseActivity = [
  { grade: "Grade 1", activeContent: 245, totalContent: 267, utilization: 91.8 },
  { grade: "Grade 2", activeContent: 298, totalContent: 324, utilization: 92.0 },
  { grade: "Grade 3", activeContent: 234, totalContent: 267, utilization: 87.6 },
  { grade: "Grade 4", activeContent: 267, totalContent: 298, utilization: 89.6 },
  { grade: "Grade 5", activeContent: 190, totalContent: 234, utilization: 81.2 },
]

const recentlyActiveContent = [
  { title: "Advanced Physics Concepts", type: "Lesson", lastActive: "2 hours ago", views: 156, engagement: 94 },
  { title: "Interactive Chemistry Quiz", type: "Quiz", lastActive: "4 hours ago", views: 234, engagement: 89 },
  { title: "Math Puzzle Adventure", type: "Game", lastActive: "6 hours ago", views: 189, engagement: 96 },
  { title: "History Documentary", type: "Video", lastActive: "8 hours ago", views: 145, engagement: 87 },
  { title: "Grammar Practice Worksheet", type: "Worksheet", lastActive: "12 hours ago", views: 98, engagement: 82 },
]

const contentPerformanceMetrics = [
  { metric: "Content Utilization Rate", current: 89.2, target: 85.0, trend: "up" },
  { metric: "Average Engagement", current: 91.4, target: 88.0, trend: "up" },
  { metric: "Content Freshness Score", current: 87.8, target: 85.0, trend: "up" },
  { metric: "Active Content Growth", current: 12.5, target: 10.0, trend: "up" },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function ActiveContentPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("30d")
  const [contentType, setContentType] = useState("all")

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
            <h1 className="text-3xl font-bold">Active Content Analytics</h1>
            <p className="text-muted-foreground">Comprehensive analysis of active content performance and engagement</p>
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
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content</SelectItem>
              <SelectItem value="lessons">Lessons</SelectItem>
              <SelectItem value="quizzes">Quizzes</SelectItem>
              <SelectItem value="games">Games</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contentPerformanceMetrics.map((metric) => (
          <Card key={metric.metric}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.current}
                {metric.metric.includes('Rate') || metric.metric.includes('Score') || metric.metric.includes('Engagement') ? '%' : '%'}
              </div>
              <div className={`flex items-center text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {metric.current > metric.target ? '+' : ''}{(metric.current - metric.target).toFixed(1)}% vs target
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Content Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Active Content Growth Trends
          </CardTitle>
          <CardDescription>
            Daily active content volume with creation and archiving patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={contentActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value, name) => {
                  if (name === 'activeContent') return [value, 'Active Content']
                  if (name === 'newContent') return [value, 'New Content']
                  return [value, 'Archived Content']
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="activeContent" 
                stackId="1"
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Active Content"
              />
              <Line 
                type="monotone" 
                dataKey="newContent" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="New Content"
              />
              <Line 
                type="monotone" 
                dataKey="archivedContent" 
                stroke="#ffc658" 
                strokeWidth={2}
                name="Archived Content"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Content Status Distribution
            </CardTitle>
            <CardDescription>
              Current status of all content in the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={contentStatusBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: any) => `${name} (${(((value || 0) / contentStatusBreakdown.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {contentStatusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Items']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {contentStatusBreakdown.map((status, index) => (
                <div key={status.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{status.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{status.count} items</Badge>
                    <Badge variant={status.growth > 15 ? "default" : "outline"}>
                      +{status.growth}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Creation Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Content Creation Trends
            </CardTitle>
            <CardDescription>
              Monthly content creation, publishing, and archiving rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={contentCreationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="created" fill="#8884d8" name="Created" />
                <Bar dataKey="published" fill="#82ca9d" name="Published" />
                <Bar dataKey="archived" fill="#ffc658" name="Archived" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Content Type Activity Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Content Type Activity Analysis
          </CardTitle>
          <CardDescription>
            Activity levels and engagement across different content types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentTypeActivity.map((content) => (
              <div key={content.type} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{content.type}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Last updated: {content.lastUpdated}</Badge>
                    <Badge variant={content.engagement > 90 ? "default" : "secondary"}>
                      {content.engagement}% engagement
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Active Content</div>
                    <div className="text-lg font-semibold">{content.active}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Content</div>
                    <div className="text-lg font-semibold">{content.total}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Activity Rate</div>
                    <div className="text-lg font-semibold">{((content.active / content.total) * 100).toFixed(1)}%</div>
                  </div>
                </div>
                <Progress value={(content.active / content.total) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recently Active Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Recently Active Content
          </CardTitle>
          <CardDescription>
            Most recently accessed and engaging content items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentlyActiveContent.map((content, index) => (
              <div key={content.title} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{content.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="outline">{content.type}</Badge>
                      <span>Last active: {content.lastActive}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{content.views} views</div>
                  <div className="text-sm text-muted-foreground">
                    {content.engagement}% engagement
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grade-wise Content Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Grade-wise Content Utilization
          </CardTitle>
          <CardDescription>
            How actively content is being used across different grade levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeWiseActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'utilization' ? value + '%' : value,
                  name === 'activeContent' ? 'Active Content' : 
                  name === 'totalContent' ? 'Total Content' : 'Utilization'
                ]}
              />
              <Legend />
              <Bar dataKey="activeContent" fill="#8884d8" name="Active Content" />
              <Bar dataKey="totalContent" fill="#82ca9d" name="Total Content" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-5 gap-4">
            {gradeWiseActivity.map((grade) => (
              <div key={grade.grade} className="text-center p-3 border rounded-lg">
                <div className="text-sm font-medium mb-1">{grade.grade}</div>
                <div className="text-lg font-semibold text-primary">
                  {grade.utilization.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {grade.activeContent}/{grade.totalContent} active
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}