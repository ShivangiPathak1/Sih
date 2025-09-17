"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Search, 
  Eye, 
  Clock,
  Activity,
  TrendingUp
} from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts"

export function ActiveUsersDetail() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("30m")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Mock data for active users
  const [activeUsers] = useState([
    {
      id: "U001",
      name: "Rahul Sharma",
      avatar: "/placeholder-user.jpg",
      role: "Student",
      status: "online",
      lastActivity: "2 min ago",
      currentPage: "Mathematics - Algebra",
      sessionTime: "45 min",
      location: "Delhi",
      device: "Desktop"
    },
    {
      id: "U002",
      name: "Priya Patel",
      avatar: "/placeholder-user.jpg",
      role: "Teacher",
      status: "online",
      lastActivity: "1 min ago",
      currentPage: "Grade Reports",
      sessionTime: "1h 20min",
      location: "Mumbai",
      device: "Mobile"
    },
    {
      id: "U003",
      name: "Amit Kumar",
      avatar: "/placeholder-user.jpg",
      role: "Student",
      status: "idle",
      lastActivity: "15 min ago",
      currentPage: "Science Quiz",
      sessionTime: "30 min",
      location: "Bangalore",
      device: "Tablet"
    },
    {
      id: "U004",
      name: "Neha Singh",
      avatar: "/placeholder-user.jpg",
      role: "Admin",
      status: "online",
      lastActivity: "Just now",
      currentPage: "Dashboard",
      sessionTime: "2h 10min",
      location: "Chennai",
      device: "Desktop"
    }
  ])

  // Mock chart data
  const chartData = {
    "30m": Array.from({ length: 30 }, (_, i) => ({
      time: `${30-i}m ago`,
      users: Math.floor(Math.random() * 50) + 200,
      sessions: Math.floor(Math.random() * 30) + 150
    })),
    "1h": Array.from({ length: 24 }, (_, i) => ({
      time: `${60-i*2.5}m ago`,
      users: Math.floor(Math.random() * 80) + 180,
      sessions: Math.floor(Math.random() * 50) + 120
    })),
    "24h": Array.from({ length: 24 }, (_, i) => ({
      time: `${24-i}h ago`,
      users: Math.floor(Math.random() * 150) + 100,
      sessions: Math.floor(Math.random() * 100) + 80
    })),
    "7d": Array.from({ length: 7 }, (_, i) => ({
      time: `${7-i} days ago`,
      users: Math.floor(Math.random() * 300) + 500,
      sessions: Math.floor(Math.random() * 200) + 400
    })),
    "30d": Array.from({ length: 30 }, (_, i) => ({
      time: `${30-i} days ago`,
      users: Math.floor(Math.random() * 400) + 300,
      sessions: Math.floor(Math.random() * 300) + 200
    }))
  }

  const filteredUsers = activeUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Name,Role,Status,Last Activity,Current Page,Session Time,Location,Device\n" +
      activeUsers.map(user =>
        `${user.name},${user.role},${user.status},${user.lastActivity},"${user.currentPage}",${user.sessionTime},${user.location},${user.device}`
      ).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `active_users_${timeRange}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        handleRefresh()
      }, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500"
      case "idle": return "bg-yellow-500"
      case "offline": return "bg-gray-500"
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
              <h1 className="text-3xl font-bold">Active Users</h1>
              <p className="text-muted-foreground">Real-time user activity monitoring</p>
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
                <Users className="h-4 w-4" />
                Total Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers.length}</div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from last hour
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Online Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers.filter(u => u.status === 'online').length}</div>
              <div className="text-sm text-muted-foreground">
                {activeUsers.filter(u => u.status === 'idle').length} idle users
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Avg Session Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45m</div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8% from yesterday
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Page Views/Hour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +23% from last hour
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity Trend - {timeRange}</CardTitle>
            <CardDescription>Real-time user activity and session data</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData[timeRange as keyof typeof chartData]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Area type="monotone" dataKey="sessions" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Active Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Currently Active Users</CardTitle>
            <CardDescription>Real-time list of active users and their activities</CardDescription>
            <div className="flex items-center gap-4 mt-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Auto-refresh: {autoRefresh ? 'On' : 'Off'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}></div>
                    </div>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4">
                        <span>{user.role}</span>
                        <span>•</span>
                        <span>{user.location}</span>
                        <span>•</span>
                        <span>{user.device}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{user.currentPage}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>Session: {user.sessionTime}</span>
                      <span>•</span>
                      <span>Last: {user.lastActivity}</span>
                    </div>
                  </div>
                  <Badge variant={user.status === 'online' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}