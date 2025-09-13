"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  BarChart3,
  LogOut,
  Bell,
  Plus,
  Filter,
  Upload,
  Download,
  Send,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Settings,
  Home,
  UserCheck,
  PenTool,
  Mail,
  HelpCircle,
} from "lucide-react"

type TeacherPage = "home" | "classes" | "content" | "analytics" | "schedule" | "support"

export function TeacherDashboard() {
  const { user, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState<TeacherPage>("home")
  const [selectedClass, setSelectedClass] = useState("math-10")

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "classes", label: "Class Management", icon: Users },
    { id: "content", label: "Content & Assignments", icon: BookOpen },
    { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
    { id: "schedule", label: "Schedule & Communication", icon: Calendar },
    { id: "support", label: "Support & Settings", icon: Settings },
  ]

  const classes = [
    { id: "math-10", name: "Mathematics - Grade 10", students: 32, subject: "Mathematics" },
    { id: "physics-11", name: "Physics - Grade 11", students: 28, subject: "Physics" },
    { id: "math-9", name: "Mathematics - Grade 9", students: 35, subject: "Mathematics" },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />
      case "classes":
        return <ClassManagementPage />
      case "content":
        return <ContentManagementPage />
      case "analytics":
        return <AnalyticsPage />
      case "schedule":
        return <SchedulePage />
      case "support":
        return <SupportPage />
      default:
        return <HomePage />
    }
  }

  const HomePage = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h2>
        <p className="text-muted-foreground">Here's what's happening in your classes today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-xl font-bold">95</p>
                <p className="text-xs text-green-600">+3 this week</p>
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
                <p className="text-sm text-muted-foreground">Active Classes</p>
                <p className="text-xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Across 2 subjects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-xl font-bold">12</p>
                <p className="text-xs text-red-600">Needs attention</p>
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
                <p className="text-sm text-muted-foreground">Avg. Performance</p>
                <p className="text-xl font-bold">87%</p>
                <p className="text-xs text-green-600">+5% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your classes and activities for today</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { time: "09:00 AM", class: "Mathematics - Grade 10", room: "Room 201", status: "upcoming" },
                { time: "11:00 AM", class: "Physics - Grade 11", room: "Lab 1", status: "current" },
                { time: "02:00 PM", class: "Mathematics - Grade 9", room: "Room 203", status: "upcoming" },
              ].map((schedule, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    schedule.status === "current" ? "bg-primary/5 border-primary" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        schedule.status === "current"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {schedule.time}
                    </div>
                    <div>
                      <h4 className="font-medium">{schedule.class}</h4>
                      <p className="text-sm text-muted-foreground">{schedule.room}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {schedule.status === "current" ? "Join Now" : "Prepare"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your classes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  type: "submission",
                  message: "Quiz submitted by Rahul Kumar",
                  class: "Mathematics - Grade 10",
                  time: "2 hours ago",
                },
                {
                  type: "deadline",
                  message: "Assignment deadline approaching",
                  class: "Physics Lab Report",
                  time: "Due in 2 days",
                },
                {
                  type: "message",
                  message: "New message from Priya Singh",
                  class: "Mathematics - Grade 9",
                  time: "4 hours ago",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "submission"
                        ? "bg-primary"
                        : activity.type === "deadline"
                          ? "bg-red-500"
                          : "bg-secondary"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.class} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <UserCheck className="h-4 w-4 mr-2" />
                Take Attendance
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Announcement
              </Button>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Ankit Kumar", class: "Math 10", score: "98%", avatar: "AK" },
                { name: "Priya Singh", class: "Physics 11", score: "95%", avatar: "PS" },
                { name: "Rohit Sharma", class: "Math 9", score: "92%", avatar: "RS" },
              ].map((student, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Badge className="bg-yellow-500 text-gray-900">{index + 1}</Badge>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{student.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.class}</p>
                  </div>
                  <Badge variant="secondary">{student.score}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const ClassManagementPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Class & Student Management</h2>
          <p className="text-muted-foreground">Manage your classes, students, and attendance</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Class Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} ({cls.students} students)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Student Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Student Roster</CardTitle>
            <CardDescription>
              {classes.find((c) => c.id === selectedClass)?.name} -{" "}
              {classes.find((c) => c.id === selectedClass)?.students} students
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Create and download CSV file
                const csvContent = "data:text/csv;charset=utf-8," + 
                  "Name,ID,XP,Attendance,Performance,Status\n" +
                  "Rahul Kumar,STU001,1250,95,88,Active\n" +
                  "Priya Singh,STU002,1180,98,92,Active\n" +
                  "Ankit Sharma,STU003,980,85,78,Needs Attention\n" +
                  "Neha Patel,STU004,1350,100,95,Active"
                const encodedUri = encodeURI(csvContent)
                const link = document.createElement("a")
                link.setAttribute("href", encodedUri)
                link.setAttribute("download", "student_roster.csv")
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <UserCheck className="h-4 w-4 mr-2" />
              Attendance
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input placeholder="Search students..." className="w-full" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Student List */}
          <div className="space-y-4">
            {[
              { name: "Rahul Kumar", id: "STU001", xp: 1250, attendance: 95, performance: 88, status: "active" },
              { name: "Priya Singh", id: "STU002", xp: 1180, attendance: 98, performance: 92, status: "active" },
              { name: "Ankit Sharma", id: "STU003", xp: 980, attendance: 85, performance: 78, status: "attention" },
              { name: "Neha Patel", id: "STU004", xp: 1350, attendance: 100, performance: 95, status: "active" },
            ].map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{student.xp} XP</p>
                    <p className="text-xs text-muted-foreground">Total Points</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{student.attendance}%</p>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{student.performance}%</p>
                    <p className="text-xs text-muted-foreground">Performance</p>
                  </div>
                  <Badge variant={student.status === "active" ? "default" : "destructive"}>
                    {student.status === "active" ? "Active" : "Needs Attention"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const ContentManagementPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content & Assignment Management</h2>
          <p className="text-muted-foreground">Create and manage learning materials and assignments</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </div>

      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Assignment</CardTitle>
              <CardDescription>Design engaging assignments for your students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input id="title" placeholder="Enter assignment title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Select Class</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Assignment description and instructions" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input id="due-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input id="points" type="number" placeholder="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = '.pdf,.doc,.docx,.ppt,.pptx,.txt'
                    input.multiple = true
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files
                      if (files && files.length > 0) {
                        alert(`Uploaded ${files.length} file(s): ${Array.from(files).map(f => f.name).join(', ')}`)
                      }
                    }
                    input.click()
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
                <Button variant="outline">Save Draft</Button>
                <Button>Publish Assignment</Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Algebra Problem Set 5",
                  class: "Mathematics - Grade 10",
                  due: "Dec 15, 2024",
                  submissions: 28,
                  total: 32,
                  status: "active",
                },
                {
                  title: "Physics Lab Report",
                  class: "Physics - Grade 11",
                  due: "Dec 20, 2024",
                  submissions: 15,
                  total: 28,
                  status: "active",
                },
              ].map((assignment, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {assignment.class} • Due: {assignment.due}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={(assignment.submissions / assignment.total) * 100} className="w-32" />
                      <span className="text-xs text-muted-foreground">
                        {assignment.submissions}/{assignment.total} submitted
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Submissions
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Builder</CardTitle>
              <CardDescription>Create interactive quizzes with automatic grading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <PenTool className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Quiz Builder Coming Soon</h3>
                <p className="text-muted-foreground mb-4">Create engaging quizzes with multiple question types</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Library</CardTitle>
              <CardDescription>Upload and organize your teaching materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Introduction to Algebra", type: "PDF", size: "2.5 MB", downloads: 45 },
                  { title: "Physics Lab Safety", type: "Video", size: "15.2 MB", downloads: 32 },
                  { title: "Math Formula Sheet", type: "PDF", size: "1.8 MB", downloads: 67 },
                ].map((lesson, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{lesson.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {lesson.type} • {lesson.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{lesson.downloads} downloads</span>
                        <Button variant="outline" size="sm">
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reviews</CardTitle>
              <CardDescription>Assignments waiting for your review and grading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  student: "Rahul Kumar",
                  assignment: "Algebra Problem Set 5",
                  submitted: "2 hours ago",
                  status: "pending",
                },
                {
                  student: "Priya Singh",
                  assignment: "Physics Lab Report",
                  submitted: "1 day ago",
                  status: "pending",
                },
              ].map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{submission.student.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{submission.student}</h4>
                      <p className="text-sm text-muted-foreground">{submission.assignment}</p>
                      <p className="text-xs text-muted-foreground">Submitted {submission.submitted}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Pending Review</Badge>
                    <Button size="sm">Review & Grade</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  const AnalyticsPage = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics & Reports</h2>
        <p className="text-muted-foreground">Comprehensive insights into class and student performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Class Score</p>
                <p className="text-xl font-bold">87.5%</p>
                <p className="text-xs text-green-600">+5.2% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-xl font-bold">94.2%</p>
                <p className="text-xs text-green-600">+2.1% this week</p>
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
                <p className="text-sm text-muted-foreground">Avg. Study Time</p>
                <p className="text-xl font-bold">2.5h</p>
                <p className="text-xs text-muted-foreground">Per student/day</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-chart-3/10 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-xl font-bold">89.3%</p>
                <p className="text-xs text-green-600">Above target</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Class Performance Trends</CardTitle>
            <CardDescription>Performance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Performance chart visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Progress Distribution</CardTitle>
            <CardDescription>How students are performing across different topics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { topic: "Algebra", average: 92, students: 32 },
              { topic: "Geometry", average: 85, students: 32 },
              { topic: "Statistics", average: 78, students: 32 },
              { topic: "Trigonometry", average: 88, students: 32 },
            ].map((topic) => (
              <div key={topic.topic}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{topic.topic}</span>
                  <span>{topic.average}% avg</span>
                </div>
                <Progress value={topic.average} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Detailed Student Analytics</CardTitle>
            <CardDescription>Individual student performance breakdown</CardDescription>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Rahul Kumar", attendance: 95, assignments: 18, quizzes: 12, average: 88 },
              { name: "Priya Singh", attendance: 98, assignments: 20, quizzes: 14, average: 92 },
              { name: "Ankit Sharma", attendance: 85, assignments: 15, quizzes: 10, average: 78 },
            ].map((student) => (
              <div key={student.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {student.assignments} assignments • {student.quizzes} quizzes completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{student.attendance}%</p>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{student.average}%</p>
                    <p className="text-xs text-muted-foreground">Average</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const SchedulePage = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Schedule & Communication</h2>
        <p className="text-muted-foreground">Manage your teaching schedule and communicate with students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Your teaching calendar and upcoming events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium p-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-16 border rounded flex flex-col items-center justify-center text-sm ${
                      i % 7 === 0 || i % 7 === 6 ? "bg-muted/50" : "hover:bg-muted/50 cursor-pointer"
                    }`}
                  >
                    <span className="font-medium">{i + 1 <= 31 ? i + 1 : ""}</span>
                    {i === 10 && <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>}
                    {i === 15 && <div className="w-2 h-2 bg-secondary rounded-full mt-1"></div>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Communication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="announcement">Send Announcement</Label>
                <Textarea id="announcement" placeholder="Type your message to all students..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-select">Select Class</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Announcement
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { from: "Priya Singh", message: "Question about homework", time: "2h ago" },
                { from: "Rahul Kumar", message: "Request for extra help", time: "4h ago" },
                { from: "Ankit Sharma", message: "Absence notification", time: "1d ago" },
              ].map((msg, index) => (
                <div key={index} className="flex items-start gap-3 p-2 border rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{msg.from.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{msg.from}</p>
                    <p className="text-xs text-muted-foreground">{msg.message}</p>
                    <p className="text-xs text-muted-foreground">{msg.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const SupportPage = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Support & Settings</h2>
        <p className="text-muted-foreground">Customize your dashboard and get help when needed</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Settings</CardTitle>
            <CardDescription>Personalize your teaching experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Switch to dark theme</p>
              </div>
              <Button variant="outline" size="sm">
                Toggle
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Get notified about student activities</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-muted-foreground">Choose your preferred language</p>
              </div>
              <Select defaultValue="english">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">हिंदी</SelectItem>
                  <SelectItem value="odia">ଓଡ଼ିଆ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Get Support</CardTitle>
            <CardDescription>Need help? We're here to assist you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help Center & FAQ
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Technical Support
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Teaching Resources
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Teacher Community
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Raise Support Ticket</CardTitle>
          <CardDescription>Report issues or request assistance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue-type">Issue Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="account">Account Problem</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Brief description of the issue" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Detailed description of the issue or request" />
          </div>
          <Button>Submit Ticket</Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-secondary/10 p-2 rounded-lg">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Teacher Portal</h1>
              <p className="text-sm text-muted-foreground">Government Education Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id as TeacherPage)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                      currentPage === item.id
                        ? "border-secondary text-secondary"
                        : "border-transparent text-foreground hover:text-secondary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{renderPage()}</main>
    </div>
  )
}
