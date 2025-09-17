"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Home,
  HelpCircle,
  Plus,
  Filter,
  Download,
  Upload,
  Eye,
  Check,
  X,
  MoreHorizontal,
  Bell,
  Shield,
  LogOut,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  MessageSquare,
  FileText,
  PieChart,
  BarChart,
  LineChart,
  Mail,
  GraduationCap,
  Star,
  AlertTriangle,
  CheckCircle,
  Building2,
  MapPin,
  School,
  Target,
  Zap,
} from "lucide-react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"
import { useRouter } from "next/navigation"

interface StateData {
  name: string
  students: number
  teachers: number
  schools: number
  performance: number
  digitalAdoption: number
  budget: number
}

export function UnifiedDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("overview")
  const [selectedState, setSelectedState] = useState("all")
  const [viewMode, setViewMode] = useState<"admin" | "government">("admin")

  // Sample data for government dashboard
  const stateData: StateData[] = [
    { name: "Delhi", students: 2800000, teachers: 140000, schools: 6800, performance: 85, digitalAdoption: 92, budget: 5200 },
    { name: "Maharashtra", students: 12500000, teachers: 625000, schools: 32000, performance: 78, digitalAdoption: 88, budget: 8900 },
    { name: "Tamil Nadu", students: 9200000, teachers: 460000, schools: 28000, performance: 82, digitalAdoption: 90, budget: 7100 },
    { name: "Karnataka", students: 8100000, teachers: 405000, schools: 24000, performance: 79, digitalAdoption: 85, budget: 6300 },
    { name: "Uttar Pradesh", students: 25000000, teachers: 1250000, schools: 75000, performance: 72, digitalAdoption: 75, budget: 12000 },
  ]

  const performanceData = [
    { month: "Jan", score: 78 },
    { month: "Feb", score: 80 },
    { month: "Mar", score: 82 },
    { month: "Apr", score: 79 },
    { month: "May", score: 85 },
    { month: "Jun", score: 88 },
  ]

  const adoptionData = [
    { name: "Digital Textbooks", value: 85 },
    { name: "Online Classes", value: 78 },
    { name: "Assessment Tools", value: 92 },
    { name: "Parent Portal", value: 65 },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  const handleCardClick = (page: string) => {
    router.push(`/dashboard/${page}`)
  }

  if (viewMode === "government") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:border-gray-800 dark:bg-gray-950">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Government Education Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Select value={viewMode} onValueChange={(value: "admin" | "government") => setViewMode(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin View</SelectItem>
                  <SelectItem value="government">Government View</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Overview Cards */}
            <div className="mb-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('total-students')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">57.6M</div>
                    <p className="text-xs text-muted-foreground">+2.5% from last year</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('total-teachers')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2.88M</div>
                    <p className="text-xs text-muted-foreground">+1.8% from last year</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('total-schools')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                    <School className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">166.8K</div>
                    <p className="text-xs text-muted-foreground">+3.2% from last year</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('budget-utilization')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹39.5K Cr</div>
                    <p className="text-xs text-muted-foreground">85% utilized</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>State-wise Performance Trends</CardTitle>
                  <CardDescription>Academic performance across states</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Digital Adoption</CardTitle>
                  <CardDescription>Technology adoption across different areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={adoptionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }: any) => `${name} ${(((value || 0) / adoptionData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {adoptionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* State Data Table */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>State-wise Education Statistics</CardTitle>
                <div className="flex gap-4">
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {stateData.map((state) => (
                        <SelectItem key={state.name} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">State</th>
                        <th className="text-left p-2">Students</th>
                        <th className="text-left p-2">Teachers</th>
                        <th className="text-left p-2">Schools</th>
                        <th className="text-left p-2">Performance</th>
                        <th className="text-left p-2">Digital Adoption</th>
                        <th className="text-left p-2">Budget (Cr)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stateData
                        .filter(state => selectedState === "all" || state.name === selectedState)
                        .map((state) => (
                        <tr key={state.name} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-2 font-medium">{state.name}</td>
                          <td className="p-2">{(state.students / 1000000).toFixed(1)}M</td>
                          <td className="p-2">{(state.teachers / 1000).toFixed(0)}K</td>
                          <td className="p-2">{(state.schools / 1000).toFixed(1)}K</td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <Progress value={state.performance} className="w-16" />
                              <span className="text-sm">{state.performance}%</span>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <Progress value={state.digitalAdoption} className="w-16" />
                              <span className="text-sm">{state.digitalAdoption}%</span>
                            </div>
                          </td>
                          <td className="p-2">₹{state.budget}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Admin Dashboard View (simplified for brevity)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="relative flex flex-1 items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <Select value={viewMode} onValueChange={(value: "admin" | "government") => setViewMode(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin View</SelectItem>
                <SelectItem value="government">Government View</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Admin Overview Cards */}
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('active-users')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,436</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('course-completion')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Course Completion</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85.2%</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('support-tickets')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">-15% from last month</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('system-health')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">99.8%</div>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>User Activity</CardTitle>
                    <CardDescription>Daily active users over the past month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Distribution</CardTitle>
                    <CardDescription>Popular subjects and content types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsBarChart data={adoptionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage platform users and their permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">User management interface will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>Manage courses, lessons, and educational materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Content management interface will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Reports</CardTitle>
                  <CardDescription>Detailed analytics and performance reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Analytics interface will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support">
              <Card>
                <CardHeader>
                  <CardTitle>Support Management</CardTitle>
                  <CardDescription>Handle user support tickets and inquiries</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Support management interface will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure system-wide settings and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Settings interface will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}