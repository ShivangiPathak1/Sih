"use client"

import { useState } from "react"
import { ArrowLeft, GraduationCap, TrendingUp, TrendingDown, Filter, Download, Award, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useRouter } from "next/navigation"

const recruitmentData = [
  { month: "Jan", hired: 450, resigned: 32, active: 8468 },
  { month: "Feb", hired: 380, resigned: 28, active: 8820 },
  { month: "Mar", hired: 520, resigned: 35, active: 9305 },
  { month: "Apr", hired: 340, resigned: 22, active: 9623 },
  { month: "May", hired: 280, resigned: 18, active: 9885 },
  { month: "Jun", hired: 420, resigned: 25, active: 10280 },
]

const qualificationData = [
  { qualification: "B.Ed", teachers: 4200, percentage: 40.8 },
  { qualification: "M.Ed", teachers: 2800, percentage: 27.2 },
  { qualification: "B.A/B.Sc + D.Ed", teachers: 2100, percentage: 20.4 },
  { qualification: "M.A/M.Sc", teachers: 800, percentage: 7.8 },
  { qualification: "Ph.D", teachers: 380, percentage: 3.7 },
]

const performanceMetrics = [
  { metric: "Training Completion", value: 89, target: 85, status: "above" },
  { metric: "Student Satisfaction", value: 91, target: 88, status: "above" },
  { metric: "Digital Adoption", value: 76, target: 80, status: "below" },
  { metric: "Professional Development", value: 84, target: 75, status: "above" },
]

const subjectDistribution = [
  { subject: "Mathematics", teachers: 1850, ratio: "1:22" },
  { subject: "Science", teachers: 1650, ratio: "1:24" },
  { subject: "English", teachers: 1450, ratio: "1:26" },
  { subject: "Social Studies", teachers: 1200, ratio: "1:28" },
  { subject: "Regional Language", teachers: 980, ratio: "1:30" },
  { subject: "Physical Education", teachers: 680, ratio: "1:35" },
  { subject: "Arts & Crafts", teachers: 520, ratio: "1:40" },
  { subject: "Computer Science", teachers: 450, ratio: "1:45" },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function TeachersDetail() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedQualification, setSelectedQualification] = useState("all")

  const handleExport = () => {
    console.log("Exporting teachers data...")
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teachers Overview</h1>
            <p className="text-muted-foreground">Comprehensive teacher workforce and performance analytics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Data Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subject Area</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="social">Social Studies</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Qualification</label>
              <Select value={selectedQualification} onValueChange={setSelectedQualification}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Qualifications</SelectItem>
                  <SelectItem value="bed">B.Ed</SelectItem>
                  <SelectItem value="med">M.Ed</SelectItem>
                  <SelectItem value="bachelor">Bachelor + D.Ed</SelectItem>
                  <SelectItem value="master">Master's</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Teachers</p>
                <p className="text-2xl font-bold">10,280</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3.9% from last month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Qualified Teachers</p>
                <p className="text-2xl font-bold">9,485</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  92.3% qualification rate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Hires</p>
                <p className="text-2xl font-bold">420</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18% this month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <GraduationCap className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teacher-Student Ratio</p>
                <p className="text-2xl font-bold">1:27</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Improved by 2 points
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workforce" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workforce">Workforce Trends</TabsTrigger>
          <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="subjects">Subject Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="workforce" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Workforce Trends</CardTitle>
              <CardDescription>Monthly hiring, resignation, and active teacher data</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={recruitmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="active" stroke="#3b82f6" name="Active Teachers" />
                  <Line type="monotone" dataKey="hired" stroke="#10b981" name="New Hires" />
                  <Line type="monotone" dataKey="resigned" stroke="#ef4444" name="Resignations" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qualifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Teachers by Qualification</CardTitle>
                <CardDescription>Distribution by educational qualification</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={qualificationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="teachers"
                    >
                      {qualificationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Qualification Breakdown</CardTitle>
                <CardDescription>Detailed breakdown by qualification type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qualificationData.map((qual, index) => (
                    <div key={qual.qualification} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <span className="text-sm font-medium">{qual.qualification}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{qual.teachers.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{qual.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {performanceMetrics.map((metric) => (
              <Card key={metric.metric}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{metric.metric}</h3>
                    <Badge variant={metric.status === "above" ? "default" : "secondary"}>
                      {metric.status === "above" ? "Above Target" : "Below Target"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {metric.value}%</span>
                      <span>Target: {metric.target}%</span>
                    </div>
                    <Progress value={(metric.value / metric.target) * 100} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Teachers by Subject</CardTitle>
                <CardDescription>Distribution across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectDistribution.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="teachers" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teacher-Student Ratios</CardTitle>
                <CardDescription>By subject area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subjectDistribution.map((subject, index) => (
                    <div key={subject.subject} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-blue-500" />
                        <div>
                          <p className="font-medium">{subject.subject}</p>
                          <p className="text-sm text-muted-foreground">{subject.teachers} teachers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{subject.ratio}</p>
                        <p className="text-xs text-muted-foreground">teacher:student</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}