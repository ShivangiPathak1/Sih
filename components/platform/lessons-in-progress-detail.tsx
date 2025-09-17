"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Search, 
  Clock,
  Play,
  Pause,
  Users,
  TrendingUp,
  GraduationCap
} from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts"

export function LessonsInProgressDetail() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("30m")
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Mock data for lessons in progress
  const [lessonsInProgress] = useState([
    {
      id: "L001",
      title: "Advanced Calculus - Integration Techniques",
      subject: "Mathematics",
      student: "Rahul Sharma",
      studentAvatar: "/placeholder-user.jpg",
      teacher: "Dr. Priya Singh",
      progress: 65,
      timeSpent: "45 min",
      totalDuration: "90 min",
      startTime: "2 hours ago",
      currentTopic: "Substitution Method",
      difficulty: "Advanced",
      type: "Video Lesson"
    },
    {
      id: "L002",
      title: "Quantum Physics - Wave Particle Duality",
      subject: "Physics",
      student: "Anita Patel",
      studentAvatar: "/placeholder-user.jpg",
      teacher: "Prof. Amit Kumar",
      progress: 80,
      timeSpent: "120 min",
      totalDuration: "150 min",
      startTime: "1 hour ago",
      currentTopic: "Double Slit Experiment",
      difficulty: "Expert",
      type: "Interactive Simulation"
    },
    {
      id: "L003",
      title: "English Literature - Shakespeare's Hamlet",
      subject: "English",
      student: "Vikram Singh",
      studentAvatar: "/placeholder-user.jpg",
      teacher: "Ms. Neha Sharma",
      progress: 40,
      timeSpent: "30 min",
      totalDuration: "60 min",
      startTime: "30 min ago",
      currentTopic: "Act 2 Analysis",
      difficulty: "Intermediate",
      type: "Reading Assignment"
    },
    {
      id: "L004",
      title: "Organic Chemistry - Reaction Mechanisms",
      subject: "Chemistry",
      student: "Pooja Gupta",
      studentAvatar: "/placeholder-user.jpg",
      teacher: "Dr. Rajesh Patel",
      progress: 25,
      timeSpent: "20 min",
      totalDuration: "75 min",
      startTime: "15 min ago",
      currentTopic: "SN1 vs SN2 Reactions",
      difficulty: "Advanced",
      type: "Laboratory Simulation"
    }
  ])

  // Mock chart data for lesson completion trends
  const chartData = {
    "30m": Array.from({ length: 30 }, (_, i) => ({
      time: `${30-i}m ago`,
      started: Math.floor(Math.random() * 20) + 10,
      completed: Math.floor(Math.random() * 15) + 5,
      inProgress: Math.floor(Math.random() * 30) + 20
    })),
    "1h": Array.from({ length: 24 }, (_, i) => ({
      time: `${60-i*2.5}m ago`,
      started: Math.floor(Math.random() * 30) + 15,
      completed: Math.floor(Math.random() * 25) + 10,
      inProgress: Math.floor(Math.random() * 40) + 25
    })),
    "24h": Array.from({ length: 24 }, (_, i) => ({
      time: `${24-i}h ago`,
      started: Math.floor(Math.random() * 50) + 30,
      completed: Math.floor(Math.random() * 40) + 20,
      inProgress: Math.floor(Math.random() * 60) + 40
    })),
    "7d": Array.from({ length: 7 }, (_, i) => ({
      time: `${7-i} days ago`,
      started: Math.floor(Math.random() * 100) + 80,
      completed: Math.floor(Math.random() * 80) + 50,
      inProgress: Math.floor(Math.random() * 120) + 90
    })),
    "30d": Array.from({ length: 30 }, (_, i) => ({
      time: `${30-i} days ago`,
      started: Math.floor(Math.random() * 150) + 100,
      completed: Math.floor(Math.random() * 120) + 70,
      inProgress: Math.floor(Math.random() * 180) + 120
    }))
  }

  const subjects = ["all", "Mathematics", "Physics", "Chemistry", "English", "Biology", "History"]
  
  const filteredLessons = lessonsInProgress.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = subjectFilter === "all" || lesson.subject === subjectFilter
    return matchesSearch && matchesSubject
  })

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Title,Subject,Student,Teacher,Progress,Time Spent,Total Duration,Current Topic,Difficulty,Type\n" +
      lessonsInProgress.map(lesson =>
        `"${lesson.title}",${lesson.subject},"${lesson.student}","${lesson.teacher}",${lesson.progress}%,"${lesson.timeSpent}","${lesson.totalDuration}","${lesson.currentTopic}",${lesson.difficulty},"${lesson.type}"`
      ).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `lessons_in_progress_${timeRange}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        handleRefresh()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500"
      case "Intermediate": return "bg-yellow-500"
      case "Advanced": return "bg-orange-500"
      case "Expert": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Lessons in Progress</h1>
              <p className="text-muted-foreground">Monitor ongoing learning activities</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30m">Last 30 min</SelectItem>
                <SelectItem value="1h">Last 1 hour</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Play className="h-4 w-4" />
                Active Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lessonsInProgress.length}</div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +15% from last hour
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Learners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(lessonsInProgress.map(l => l.student)).size}</div>
              <div className="text-sm text-muted-foreground">
                Unique students learning
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Avg Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(lessonsInProgress.reduce((acc, l) => acc + l.progress, 0) / lessonsInProgress.length)}%
              </div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +5% from yesterday
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from last week
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Lesson Activity Trends - {timeRange}</CardTitle>
            <CardDescription>Started, completed, and in-progress lesson statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData[timeRange as keyof typeof chartData]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="started" fill="#8884d8" name="Started" />
                <Bar dataKey="inProgress" fill="#82ca9d" name="In Progress" />
                <Bar dataKey="completed" fill="#ffc658" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lessons List */}
        <Card>
          <CardHeader>
            <CardTitle>Currently Active Lessons</CardTitle>
            <CardDescription>Real-time view of lessons currently being taken by students</CardDescription>
            <div className="flex items-center gap-4 mt-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search lessons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject === "all" ? "All Subjects" : subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Auto-refresh: {autoRefresh ? 'On' : 'Off'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLessons.map((lesson) => (
                <div key={lesson.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={lesson.studentAvatar} />
                        <AvatarFallback>{lesson.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{lesson.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {lesson.subject}
                          </span>
                          <span>•</span>
                          <span>Student: {lesson.student}</span>
                          <span>•</span>
                          <span>Teacher: {lesson.teacher}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`${getDifficultyColor(lesson.difficulty)} text-white`}
                      >
                        {lesson.difficulty}
                      </Badge>
                      <Badge variant="outline">{lesson.type}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Current Topic: {lesson.currentTopic}</span>
                        <span>{lesson.progress}% Complete</span>
                      </div>
                      <Progress value={lesson.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Time Spent: {lesson.timeSpent}
                        </span>
                        <span>Total: {lesson.totalDuration}</span>
                        <span>Started: {lesson.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3 mr-1" />
                          Monitor
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}