"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, TrendingDown, Download, BookOpen, FileText, Video, Gamepad2, Users } from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Sample data for downloads analytics
const dailyDownloadsData = [
  { date: "2024-01-01", downloads: 245, uniqueUsers: 156 },
  { date: "2024-01-02", downloads: 312, uniqueUsers: 198 },
  { date: "2024-01-03", downloads: 189, uniqueUsers: 134 },
  { date: "2024-01-04", downloads: 456, uniqueUsers: 289 },
  { date: "2024-01-05", downloads: 523, uniqueUsers: 334 },
  { date: "2024-01-06", downloads: 398, uniqueUsers: 267 },
  { date: "2024-01-07", downloads: 478, uniqueUsers: 301 },
]

const contentTypeBreakdown = [
  { type: "Worksheets", downloads: 4567, percentage: 35.5, growth: 12.3 },
  { type: "Videos", downloads: 3245, percentage: 25.2, growth: 18.7 },
  { type: "Games", downloads: 2134, percentage: 16.6, growth: 25.4 },
  { type: "Lessons", downloads: 1823, percentage: 14.2, growth: 8.9 },
  { type: "Quizzes", downloads: 1078, percentage: 8.4, growth: 15.6 },
]

const popularContent = [
  { title: "Basic Math Worksheets", downloads: 1234, rating: 4.8, category: "Math" },
  { title: "Science Experiments Video", downloads: 987, rating: 4.9, category: "Science" },
  { title: "Word Puzzle Game", downloads: 876, rating: 4.7, category: "Language" },
  { title: "History Timeline", downloads: 654, rating: 4.6, category: "History" },
  { title: "Geography Quiz", downloads: 543, rating: 4.5, category: "Geography" },
]

const gradeWiseDownloads = [
  { grade: "Grade 1", downloads: 2345, percentage: 18.2 },
  { grade: "Grade 2", downloads: 2876, percentage: 22.4 },
  { grade: "Grade 3", downloads: 2134, percentage: 16.6 },
  { grade: "Grade 4", downloads: 2987, percentage: 23.3 },
  { grade: "Grade 5", downloads: 2505, percentage: 19.5 },
]

const downloadTrends = [
  { month: "Jul", downloads: 8456, target: 8000 },
  { month: "Aug", downloads: 9234, target: 8500 },
  { month: "Sep", downloads: 10567, target: 9000 },
  { month: "Oct", downloads: 11234, target: 9500 },
  { month: "Nov", downloads: 12098, target: 10000 },
  { month: "Dec", downloads: 12847, target: 10500 },
  { month: "Jan", downloads: 13456, target: 11000 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function TotalDownloadsPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("7d")
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
            <h1 className="text-3xl font-bold">Total Downloads Analytics</h1>
            <p className="text-muted-foreground">Comprehensive analysis of content downloads and user engagement</p>
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
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content</SelectItem>
              <SelectItem value="worksheets">Worksheets</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
              <SelectItem value="games">Games</SelectItem>
              <SelectItem value="lessons">Lessons</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,847</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.3% vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">414</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Downloaders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,456</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.7% vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Download Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73.2%</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3.4% vs last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Downloads Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Daily Downloads Trend
          </CardTitle>
          <CardDescription>
            Daily download volume with unique user downloads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyDownloadsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value, name) => [value, name === 'downloads' ? 'Total Downloads' : 'Unique Users']}
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="downloads" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
                name="Total Downloads"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="uniqueUsers" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Unique Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Type Breakdown
            </CardTitle>
            <CardDescription>
              Downloads distribution across different content types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={contentTypeBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: any) => `${name} (${(((value || 0) / contentTypeBreakdown.reduce((sum, item) => sum + item.downloads, 0)) * 100).toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="downloads"
                >
                  {contentTypeBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Downloads']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {contentTypeBreakdown.map((type, index) => (
                <div key={type.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{type.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{type.downloads} downloads</Badge>
                    <Badge variant={type.growth > 15 ? "default" : "outline"}>
                      +{type.growth}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Monthly Download Trends
            </CardTitle>
            <CardDescription>
              Download performance vs targets over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={downloadTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="downloads" fill="#8884d8" name="Actual Downloads" />
                <Bar dataKey="target" fill="#82ca9d" name="Target Downloads" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Popular Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Most Downloaded Content
          </CardTitle>
          <CardDescription>
            Top performing content based on download counts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularContent.map((content, index) => (
              <div key={content.title} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{content.title}</h4>
                    <p className="text-sm text-muted-foreground">{content.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">{content.downloads}</div>
                    <div className="text-xs text-muted-foreground">downloads</div>
                  </div>
                  <Badge variant="outline">★ {content.rating}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grade-wise Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Grade-wise Download Distribution
          </CardTitle>
          <CardDescription>
            How downloads are distributed across different grade levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gradeWiseDownloads.map((grade, index) => (
              <div key={grade.grade} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{grade.grade}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{grade.downloads} downloads</Badge>
                    <span className="text-sm text-muted-foreground">{grade.percentage}%</span>
                  </div>
                </div>
                <Progress value={grade.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}