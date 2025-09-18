"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, TrendingDown, BookOpen, Clock, Users, BarChart3, Calendar } from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Sample data for lessons completed analytics
const dailyLessonsData = [
  { date: "2024-01-01", lessons: 45, students: 12 },
  { date: "2024-01-02", lessons: 52, students: 15 },
  { date: "2024-01-03", lessons: 38, students: 10 },
  { date: "2024-01-04", lessons: 67, students: 18 },
  { date: "2024-01-05", lessons: 73, students: 21 },
  { date: "2024-01-06", lessons: 89, students: 25 },
  { date: "2024-01-07", lessons: 94, students: 28 },
]

const subjectBreakdown = [
  { subject: "Mathematics", lessons: 156, percentage: 35 },
  { subject: "Science", lessons: 134, percentage: 30 },
  { subject: "English", lessons: 89, percentage: 20 },
  { subject: "History", lessons: 45, percentage: 10 },
  { subject: "Geography", lessons: 22, percentage: 5 },
]

const completionTrends = [
  { month: "Jul", completed: 234, target: 250 },
  { month: "Aug", completed: 267, target: 280 },
  { month: "Sep", completed: 312, target: 320 },
  { month: "Oct", completed: 345, target: 350 },
  { month: "Nov", completed: 389, target: 400 },
  { month: "Dec", completed: 423, target: 450 },
  { month: "Jan", completed: 456, target: 480 },
]

const performanceMetrics = [
  { grade: "Grade 1", avgTime: 12, completion: 95, students: 45 },
  { grade: "Grade 2", avgTime: 15, completion: 92, students: 52 },
  { grade: "Grade 3", avgTime: 18, completion: 88, students: 38 },
  { grade: "Grade 4", avgTime: 22, completion: 85, students: 43 },
  { grade: "Grade 5", avgTime: 25, completion: 82, students: 36 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function LessonsCompletedPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedSubject, setSelectedSubject] = useState("all")

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
            <h1 className="text-3xl font-bold">Lessons Completed Analytics</h1>
            <p className="text-muted-foreground">Detailed analysis of lesson completion patterns and performance</p>
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
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="history">History</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,456</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Completion Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5 min</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.3 min vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.2%</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3.1% vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">214</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8 new students
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Lessons Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Daily Lessons Completion Trend
          </CardTitle>
          <CardDescription>
            Number of lessons completed per day with student participation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyLessonsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value, name) => [value, name === 'lessons' ? 'Lessons' : 'Students']}
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="lessons" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
                name="Lessons Completed"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="students" 
                stroke="#82ca9d" 
                name="Active Students"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subject-wise Completion
            </CardTitle>
            <CardDescription>
              Distribution of completed lessons across subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: any) => `${name} (${(((value || 0) / subjectBreakdown.reduce((sum, item) => sum + item.lessons, 0)) * 100).toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="lessons"
                >
                  {subjectBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Lessons']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {subjectBreakdown.map((subject, index) => (
                <div key={subject.subject} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{subject.subject}</span>
                  </div>
                  <Badge variant="secondary">{subject.lessons} lessons</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Progress vs Targets
            </CardTitle>
            <CardDescription>
              Lesson completion progress against monthly targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={completionTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#8884d8" name="Completed" />
                <Bar dataKey="target" fill="#82ca9d" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Grade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Performance Metrics by Grade
          </CardTitle>
          <CardDescription>
            Average completion time and rates across different grade levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceMetrics.map((grade) => (
              <div key={grade.grade} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{grade.grade}</h4>
                  <Badge variant="outline">{grade.students} students</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Avg Time
                    </div>
                    <div className="text-lg font-semibold">{grade.avgTime} min</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BarChart3 className="h-4 w-4" />
                      Completion Rate
                    </div>
                    <div className="text-lg font-semibold">{grade.completion}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}