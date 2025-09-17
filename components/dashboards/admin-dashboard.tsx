"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { useLanguage } from "@/components/language/language-provider"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
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
import { useAnalyticsData, useRealTimeEngagement, useDashboardData } from "@/hooks/use-api-data"
import { FirebaseAnalyticsDashboard } from "@/components/analytics/firebase-analytics-dashboard"
import { RealTimeDashboard } from "@/components/analytics/real-time-dashboard"
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
  Mail,
  GraduationCap,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Save,
  Lock,
  Key,
  Smartphone,
  Database,
  Cloud,
  Loader2,
  AlertCircle,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { toast } from "@/components/ui/use-toast"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

type AdminPage = "home" | "users" | "content" | "analytics" | "system" | "support" | "notifications" | "profile"

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function AdminDashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<AdminPage>("home")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [gamificationEnabled, setGamificationEnabled] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  // Fetch real-time data from APIs
  const { data: analyticsData, loading: analyticsLoading, error: analyticsError } = useAnalyticsData()
  const realtimeEngagement = useRealTimeEngagement()
  const dashboardData = useDashboardData()

  const handleCardClick = (path: string) => {
    router.push(path)
  }

  const logout = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Logged Out Successfully",
        description: "You have been logged out of the admin panel.",
      })
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  const [selectedContent, setSelectedContent] = useState<{ id: string; title: string; action: string } | null>(null)
  const [approvedContent, setApprovedContent] = useState<any[]>([])
  const [rejectedContent, setRejectedContent] = useState<any[]>([])
  const [pendingContent, setPendingContent] = useState([
    {
      id: "1",
      title: "Advanced Calculus - Chapter 12",
      author: "Dr. Priya Sharma",
      subject: "Mathematics",
      type: "Lesson",
      submitted: "2 days ago",
      priority: "high",
      size: "2.5 MB",
      description: "Comprehensive calculus lesson covering integration techniques",
      downloads: 245,
      views: 1250,
      rating: 4.8,
    },
    {
      id: "2",
      title: "Quantum Physics Quiz Set",
      author: "Prof. Amit Kumar",
      subject: "Physics",
      type: "Quiz",
      submitted: "1 day ago",
      priority: "medium",
      size: "1.2 MB",
      description: "Interactive quiz set on quantum mechanics principles",
      downloads: 189,
      views: 890,
      rating: 4.6,
    },
    {
      id: "3",
      title: "English Literature Assignment",
      author: "Ms. Neha Patel",
      subject: "English",
      type: "Assignment",
      submitted: "3 hours ago",
      priority: "low",
      size: "800 KB",
      description: "Creative writing assignment on modern poetry",
      downloads: 67,
      views: 234,
      rating: 4.2,
    },
  ])
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [adminProfile, setAdminProfile] = useState({
    name: "Dr. Amit Singh",
    email: "admin@edu.gov.in",
    phone: "+91 98765 43210",
    department: "Education Technology",
    avatar: "/dr--amit-singh.jpg",
    bio: "Experienced education administrator with 15+ years in EdTech",
    location: "New Delhi, India",
    organization: "Ministry of Education",
  })

  const [profileChanges, setProfileChanges] = useState<Partial<typeof adminProfile>>({})
  const [isProfileSaving, setIsProfileSaving] = useState(false)

  const [users, setUsers] = useState([
    {
      id: "1",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      role: "Student",
      status: "Active",
      lastLogin: "2 hours ago",
      joinDate: "2024-01-15",
      courses: 5,
      progress: 78,
    },
    {
      id: "2",
      name: "Priya Patel",
      email: "priya@example.com",
      role: "Teacher",
      status: "Active",
      lastLogin: "1 day ago",
      joinDate: "2023-09-10",
      courses: 12,
      progress: 95,
    },
    {
      id: "3",
      name: "Amit Kumar",
      email: "amit@example.com",
      role: "Student",
      status: "Inactive",
      lastLogin: "1 week ago",
      joinDate: "2024-02-20",
      courses: 3,
      progress: 45,
    },
  ])

  const [supportTickets, setSupportTickets] = useState([
    {
      id: "T001",
      title: "Login Issues",
      description: "Unable to access student dashboard",
      user: "Rahul Sharma",
      priority: "High",
      status: "Open",
      created: "2024-01-20",
      category: "Technical",
      assignedTo: "Support Team A",
    },
    {
      id: "T002",
      title: "Course Content Missing",
      description: "Mathematics course videos not loading",
      user: "Priya Patel",
      priority: "Medium",
      status: "In Progress",
      created: "2024-01-19",
      category: "Content",
      assignedTo: "Content Team",
    },
  ])

  const [notifications, setNotifications] = useState([
    {
      id: "N001",
      title: "New Course Submission",
      message: "Dr. Sharma submitted a new Physics course for approval",
      type: "info",
      read: false,
      timestamp: "2 hours ago",
    },
    {
      id: "N002",
      title: "System Maintenance",
      message: "Scheduled maintenance on Sunday 2 AM - 4 AM",
      type: "warning",
      read: true,
      timestamp: "1 day ago",
    },
  ])

  const handleProfileSave = async () => {
    try {
      setIsProfileSaving(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setAdminProfile((prev) => ({ ...prev, ...profileChanges }))
      setProfileChanges({})

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProfileSaving(false)
    }
  }

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newAvatar = e.target?.result as string
      setProfileChanges((prev) => ({ ...prev, avatar: newAvatar }))
      toast({
        title: "Avatar Updated",
        description: "Profile picture has been updated. Don't forget to save changes.",
      })
    }
    reader.readAsDataURL(file)
  }

  const handlePreviewContent = (contentId: string, title: string) => {
    setSelectedContent({ id: contentId, title, action: "preview" })
    toast({
      title: "Content Preview",
      description: `Opening preview for: ${title}`,
    })
  }

  const handleApproveContent = async (contentId: string, title: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const content = pendingContent.find((c) => c.id === contentId)
      if (content) {
        setApprovedContent((prev) => [...prev, { ...content, approvedAt: new Date() }])
        setPendingContent((prev) => prev.filter((c) => c.id !== contentId))
      }

      toast({
        title: "Content Approved",
        description: `Successfully approved: ${title}`,
      })
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "Failed to approve content. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectContent = async (contentId: string, title: string, reason = "Quality standards not met") => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const content = pendingContent.find((c) => c.id === contentId)
      if (content) {
        setRejectedContent((prev) => [...prev, { ...content, rejectedAt: new Date(), reason }])
        setPendingContent((prev) => prev.filter((c) => c.id !== contentId))
      }

      toast({
        title: "Content Rejected",
        description: `Rejected: ${title}. Reason: ${reason}`,
        variant: "destructive",
      })
    } catch (error) {
      toast({
        title: "Rejection Failed",
        description: "Failed to reject content. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBulkApprove = async (selectedIds: string[]) => {
    try {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      selectedIds.forEach((id) => {
        const content = pendingContent.find((c) => c.id === id)
        if (content) {
          setApprovedContent((prev) => [...prev, { ...content, approvedAt: new Date() }])
        }
      })

      setPendingContent((prev) => prev.filter((c) => !selectedIds.includes(c.id)))
      setSelectedContentIds([])

      toast({
        title: "Bulk Approval Complete",
        description: `Successfully approved ${selectedIds.length} content items.`,
      })
    } catch (error) {
      toast({
        title: "Bulk Approval Failed",
        description: "Failed to approve selected content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const navigationItems = [
    { id: "home", label: t("nav.dashboard"), icon: Home },
    { id: "users", label: t("users.title"), icon: Users },
    { id: "content", label: t("content.title"), icon: BookOpen },
    { id: "analytics", label: t("analytics.title"), icon: BarChart3 },
    { id: "system", label: t("settings.system"), icon: Settings },
    { id: "support", label: t("support.title"), icon: HelpCircle },
    { id: "notifications", label: t("nav.notifications"), icon: Bell },
    { id: "profile", label: t("nav.profile"), icon: Users },
  ]

  const HomePage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h2>
          <p className="text-muted-foreground">{t("dashboard.welcome")}, {adminProfile.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button onClick={logout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            {t("nav.logout")}
          </Button>
        </div>
      </div>

      {/* Real-time Platform Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t("dashboard.realTimeActivity")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/platform/active-users')}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">1,247</div>
                  <div className="text-sm text-muted-foreground">{t("dashboard.activeUsers")}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/platform/lessons-in-progress')}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">89</div>
                  <div className="text-sm text-muted-foreground">Lessons in Progress</div>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/platform/pending-approvals')}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">23</div>
                  <div className="text-sm text-muted-foreground">{t("dashboard.pendingApprovals")}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/platform/active-support-tickets')}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">5</div>
                  <div className="text-sm text-muted-foreground">{t("dashboard.supportTickets")}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPage("users")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.totalUsers")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPage("content")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.contentItems")}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8% {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPage("analytics")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.engagementRate")}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.3%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2.1% {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPage("support")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.supportTickets")}</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 inline mr-1" />
              -5% {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recentContentSubmissions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingContent.slice(0, 3).map((content) => (
                <div key={content.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{content.title}</p>
                    <p className="text-sm text-muted-foreground">by {content.author}</p>
                  </div>
                  <Badge
                    variant={
                      content.priority === "high"
                        ? "destructive"
                        : content.priority === "medium"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {content.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.systemStatus")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>{t("dashboard.serverStatus")}</span>
                <Badge variant="default" className="bg-green-500">
                  {t("dashboard.online")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("dashboard.database")}</span>
                <Badge variant="default" className="bg-green-500">
                  {t("dashboard.healthy")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("dashboard.cdn")}</span>
                <Badge variant="default" className="bg-green-500">
                  {t("dashboard.active")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("dashboard.backupStatus")}</span>
                <Badge variant="default" className="bg-green-500">
                  {t("dashboard.upToDate")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const UserManagementPage = () => {
    const [userFilter, setUserFilter] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [showAddUser, setShowAddUser] = useState(false)
    const [newUser, setNewUser] = useState({
      name: "",
      email: "",
      role: "Student",
      password: "",
    })

    const handleAddUser = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const user = {
          id: Date.now().toString(),
          ...newUser,
          status: "Active",
          lastLogin: "Never",
          joinDate: new Date().toISOString().split("T")[0],
          courses: 0,
          progress: 0,
        }

        setUsers((prev) => [...prev, user])
        setNewUser({ name: "", email: "", role: "Student", password: "" })
        setShowAddUser(false)

        toast({
          title: "User Added",
          description: `Successfully added ${user.name} as ${user.role}`,
        })
      } catch (error) {
        toast({
          title: "Failed to Add User",
          description: "Please try again.",
          variant: "destructive",
        })
      }
    }

    const handleBulkAction = async (action: string) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast({
          title: "Bulk Action Complete",
          description: `${action} applied to ${selectedUsers.length} users`,
        })

        setSelectedUsers([])
      } catch (error) {
        toast({
          title: "Bulk Action Failed",
          description: "Please try again.",
          variant: "destructive",
        })
      }
    }

    const exportUsers = () => {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Name,Email,Role,Status,Last Login,Join Date,Courses,Progress\n" +
        users
          .map(
            (user) =>
              `${user.name},${user.email},${user.role},${user.status},${user.lastLogin},${user.joinDate},${user.courses},${user.progress}`,
          )
          .join("\n")

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", "users_export.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export Complete",
        description: "Users data exported successfully",
      })
    }

    const filteredUsers = users.filter((user) => {
      const matchesFilter = userFilter === "all" || user.role.toLowerCase() === userFilter
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            <p className="text-muted-foreground">Manage all platform users</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportUsers} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={() => setShowAddUser(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="teacher">Teachers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{selectedUsers.length} users selected</span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleBulkAction("Activate")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("Deactivate")}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Deactivate
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("Lock")}>
                    <Lock className="h-4 w-4 mr-2" />
                    Lock
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction("Delete")}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">
                      <Checkbox
                        checked={selectedUsers.length === filteredUsers.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers(filteredUsers.map((u) => u.id))
                          } else {
                            setSelectedUsers([])
                          }
                        }}
                      />
                    </th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Last Login</th>
                    <th className="text-left p-2">Progress</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUsers((prev) => [...prev, user.id])
                            } else {
                              setSelectedUsers((prev) => prev.filter((id) => id !== user.id))
                            }
                          }}
                        />
                      </td>
                      <td className="p-2 font-medium">{user.name}</td>
                      <td className="p-2 text-muted-foreground">{user.email}</td>
                      <td className="p-2">
                        <Badge variant="outline">{user.role}</Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                      </td>
                      <td className="p-2 text-muted-foreground">{user.lastLogin}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <Progress value={user.progress} className="w-16" />
                          <span className="text-sm">{user.progress}%</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add User Modal */}
        {showAddUser && (
          <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add New User</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser((prev) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Teacher">Teacher</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleAddUser} className="flex-1">
                  Add User
                </Button>
                <Button variant="outline" onClick={() => setShowAddUser(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    )
  }

  const ContentManagementPage = () => {
    const [contentView, setContentView] = useState("pending")
    const [previewContent, setPreviewContent] = useState<any>(null)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
            <p className="text-muted-foreground">Review and manage educational content</p>
          </div>
          <div className="flex gap-2">
            {selectedContentIds.length > 0 && (
              <Button onClick={() => handleBulkApprove(selectedContentIds)} disabled={isLoading}>
                {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                Bulk Approve ({selectedContentIds.length})
              </Button>
            )}
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Content
            </Button>
          </div>
        </div>

        <Tabs value={contentView} onValueChange={setContentView}>
          <TabsList>
            <TabsTrigger value="pending">Pending Approval ({pendingContent.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedContent.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedContent.length})</TabsTrigger>
            <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Awaiting Approval</CardTitle>
                <CardDescription>Review and approve educational content submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingContent.map((content) => (
                    <div key={content.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedContentIds.includes(content.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedContentIds((prev) => [...prev, content.id])
                              } else {
                                setSelectedContentIds((prev) => prev.filter((id) => id !== content.id))
                              }
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{content.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{content.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>By {content.author}</span>
                              <span>{content.subject}</span>
                              <span>{content.type}</span>
                              <span>{content.size}</span>
                              <Badge
                                variant={
                                  content.priority === "high"
                                    ? "destructive"
                                    : content.priority === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {content.priority} priority
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {content.views} views
                              </span>
                              <span className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {content.downloads} downloads
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {content.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setPreviewContent(content)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" onClick={() => handleApproveContent(content.id, content.title)}>
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectContent(content.id, content.title)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Approved Content</CardTitle>
                <CardDescription>Successfully approved educational content</CardDescription>
              </CardHeader>
              <CardContent>
                {approvedContent.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No approved content yet</p>
                ) : (
                  <div className="space-y-4">
                    {approvedContent.map((content) => (
                      <div key={content.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{content.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              By {content.author} • Approved on {content.approvedAt?.toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="default" className="bg-green-500">
                            Approved
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Content</CardTitle>
                <CardDescription>Content that didn't meet approval criteria</CardDescription>
              </CardHeader>
              <CardContent>
                {rejectedContent.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No rejected content</p>
                ) : (
                  <div className="space-y-4">
                    {rejectedContent.map((content) => (
                      <div key={content.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{content.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              By {content.author} • Rejected on {content.rejectedAt?.toLocaleDateString()}
                            </p>
                            <p className="text-sm text-red-600 mt-1">Reason: {content.reason}</p>
                          </div>
                          <Badge variant="destructive">Rejected</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('/content/total-downloads')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,847</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('/content/content-views')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Content Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45,231</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('/content/average-rating')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.6/5</div>
                  <p className="text-xs text-muted-foreground">+0.2 from last month</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('/content/active-content')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12 new this month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Content Preview Modal */}
        {previewContent && (
          <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Content Preview</h3>
                <Button variant="ghost" onClick={() => setPreviewContent(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">{previewContent.title}</h4>
                  <p className="text-muted-foreground">By {previewContent.author}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Subject:</span> {previewContent.subject}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {previewContent.type}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span> {previewContent.size}
                  </div>
                  <div>
                    <span className="font-medium">Priority:</span> {previewContent.priority}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Description</h5>
                  <p className="text-muted-foreground">{previewContent.description}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => {
                      handleApproveContent(previewContent.id, previewContent.title)
                      setPreviewContent(null)
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleRejectContent(previewContent.id, previewContent.title)
                      setPreviewContent(null)
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button variant="outline" onClick={() => setPreviewContent(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    )
  }

  /*
  // Analytics Page Component - COMMENTED OUT - Using EnhancedAnalyticsDashboard instead
  const AnalyticsPage = () => {
    const [analyticsView, setAnalyticsView] = useState("overview")
    const [dateRange, setDateRange] = useState("30d")
    const [customReportFilters, setCustomReportFilters] = useState({
      startDate: "",
      endDate: "",
      userType: "all",
      subject: "all",
      reportType: "engagement",
    })

    const exportReport = (type: string) => {
      const data = {
        engagement: "User Engagement Report Data",
        performance: "Performance Analytics Data",
        content: "Content Usage Report Data",
        custom: "Custom Report Data",
      }

      const csvContent = `data:text/csv;charset=utf-8,Report Type,${type}\nGenerated,${new Date().toISOString()}\n${data[type as keyof typeof data]}`
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `${type}_report_${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Report Exported",
        description: `${type} report has been downloaded`,
      })
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics & Reports</h2>
            <p className="text-muted-foreground">Comprehensive platform analytics and insights</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
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
            <Button variant="outline" onClick={() => exportReport("overview")}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs value={analyticsView} onValueChange={setAnalyticsView}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Daily Active Users</TabsTrigger>
            <TabsTrigger value="lessons">Lessons Completed</TabsTrigger>
            <TabsTrigger value="session">Session Time</TabsTrigger>
            <TabsTrigger value="growth">Platform Growth</TabsTrigger>
            <TabsTrigger value="custom">Custom Reports</TabsTrigger>
            <TabsTrigger value="predictive">Predictive Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('/analytics/daily-active-users')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +12% from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('/analytics/lessons-completed')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +8% from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('/analytics/session-time')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24m</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +3m from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('/analytics/platform-growth')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Platform Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+15%</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    Monthly growth rate
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Engagement Trends</CardTitle>
                  <CardDescription>Daily user activity patterns and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading engagement data...</span>
                    </div>
                  ) : analyticsError ? (
                    <div className="h-64 flex items-center justify-center text-red-500">
                      <AlertCircle className="h-8 w-8" />
                      <span className="ml-2">Error loading data</span>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={analyticsData?.userEngagement || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="students" stackId="1" stroke="#8884d8" fill="#8884d8" />
                        <Area type="monotone" dataKey="teachers" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                        <Area type="monotone" dataKey="admin" stackId="1" stroke="#ffc658" fill="#ffc658" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Performance</CardTitle>
                  <CardDescription>Subject-wise content usage and engagement rates</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData?.contentPerformance || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ subject, engagement }) => `${subject}: ${engagement}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="engagement"
                        >
                          {(analyticsData?.contentPerformance || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Active Users Analysis</CardTitle>
                <CardDescription>Detailed breakdown of user activity patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {realtimeEngagement.activeUsers || 1247}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Now</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {realtimeEngagement.currentSessions || 892}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {realtimeEngagement.avgSessionTime || 24}m
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Session Time</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Activity Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={analyticsData?.dailyActiveUsers || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                          <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" strokeWidth={2} />
                          <Line type="monotone" dataKey="returningUsers" stroke="#ffc658" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>User Type Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={analyticsData?.dailyActiveUsers?.slice(-7) || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="newUsers" fill="#8884d8" name="New Users" />
                          <Bar dataKey="returningUsers" fill="#82ca9d" name="Returning Users" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lessons Completed Analysis</CardTitle>
                <CardDescription>Track learning progress and completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">89</div>
                    <div className="text-sm text-muted-foreground">Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">567</div>
                    <div className="text-sm text-muted-foreground">This Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">2,341</div>
                    <div className="text-sm text-muted-foreground">This Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">87%</div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart className="h-16 w-16 mb-4" />
                  <div className="text-center">
                    <p>Lesson completion trends</p>
                    <p className="text-sm">Subject-wise completion analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="session" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Average Session Time Analysis</CardTitle>
                <CardDescription>User engagement and session duration metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">24m</div>
                    <div className="text-sm text-muted-foreground">Average Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">21m</div>
                    <div className="text-sm text-muted-foreground">Weekly Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">19m</div>
                    <div className="text-sm text-muted-foreground">Monthly Average</div>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <Clock className="h-16 w-16 mb-4" />
                  <div className="text-center">
                    <p>Session duration trends</p>
                    <p className="text-sm">Time spent by user type and activity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Growth Analysis</CardTitle>
                <CardDescription>User acquisition and platform expansion metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+15%</div>
                    <div className="text-sm text-muted-foreground">Monthly Growth</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">2,847</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">234</div>
                    <div className="text-sm text-muted-foreground">New This Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">92%</div>
                    <div className="text-sm text-muted-foreground">Retention Rate</div>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <TrendingUp className="h-16 w-16 mb-4" />
                  <div className="text-center">
                    <p>Growth trajectory chart</p>
                    <p className="text-sm">User acquisition and retention trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Custom Report Builder</CardTitle>
                <CardDescription>Create customized reports with specific filters and parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={customReportFilters.startDate}
                        onChange={(e) => setCustomReportFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={customReportFilters.endDate}
                        onChange={(e) => setCustomReportFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="userType">User Type</Label>
                      <Select
                        value={customReportFilters.userType}
                        onValueChange={(value) => setCustomReportFilters((prev) => ({ ...prev, userType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="students">Students</SelectItem>
                          <SelectItem value="teachers">Teachers</SelectItem>
                          <SelectItem value="admins">Admins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={customReportFilters.subject}
                        onValueChange={(value) => setCustomReportFilters((prev) => ({ ...prev, subject: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                          <SelectItem value="biology">Biology</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reportType">Report Type</Label>
                      <Select
                        value={customReportFilters.reportType}
                        onValueChange={(value) => setCustomReportFilters((prev) => ({ ...prev, reportType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engagement">User Engagement</SelectItem>
                          <SelectItem value="performance">Performance Analysis</SelectItem>
                          <SelectItem value="content">Content Usage</SelectItem>
                          <SelectItem value="progress">Learning Progress</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={() => exportReport("custom")} className="flex-1">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                      <Button variant="outline" onClick={() => exportReport("custom")} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictive" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Predictive Insights & Alerts</CardTitle>
                <CardDescription>AI-powered predictions and automated alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          Growth Prediction
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">Based on current trends, we predict:</p>
                        <ul className="text-sm space-y-1">
                          <li>• 18% user growth next month</li>
                          <li>• 25% increase in lesson completions</li>
                          <li>• Peak usage on weekday evenings</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          Risk Alerts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">Areas requiring attention:</p>
                        <ul className="text-sm space-y-1">
                          <li>• 15% drop in Physics engagement</li>
                          <li>• Server capacity at 78%</li>
                          <li>• 3 teachers with low activity</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Automated Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Optimize Content Delivery</p>
                            <p className="text-sm text-muted-foreground">
                              Consider adding more interactive elements to Physics courses to improve engagement
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Scale Infrastructure</p>
                            <p className="text-sm text-muted-foreground">
                              Prepare for increased load by upgrading server capacity before peak season
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Teacher Engagement</p>
                            <p className="text-sm text-muted-foreground">
                              Reach out to inactive teachers and provide additional support or training
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }
  */

  const SupportOversightPage = () => {
    const [supportView, setSupportView] = useState("tickets")
    const [selectedTicket, setSelectedTicket] = useState<any>(null)
    const [newTicket, setNewTicket] = useState({
      title: "",
      description: "",
      priority: "Medium",
      category: "Technical",
    })
    const [showCreateTicket, setShowCreateTicket] = useState(false)

    const handleCreateTicket = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const ticket = {
          id: `T${Date.now()}`,
          ...newTicket,
          user: adminProfile.name,
          status: "Open",
          created: new Date().toISOString().split("T")[0],
          assignedTo: "Support Team",
        }

        setSupportTickets((prev) => [...prev, ticket])
        setNewTicket({ title: "", description: "", priority: "Medium", category: "Technical" })
        setShowCreateTicket(false)

        toast({
          title: "Ticket Created",
          description: `Support ticket ${ticket.id} has been created successfully`,
        })
      } catch (error) {
        toast({
          title: "Failed to Create Ticket",
          description: "Please try again.",
          variant: "destructive",
        })
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Support Oversight</h2>
            <p className="text-muted-foreground">Manage support tickets and user assistance</p>
          </div>
          <Button onClick={() => setShowCreateTicket(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
        </div>

        <Tabs value={supportView} onValueChange={setSupportView}>
          <TabsList>
            <TabsTrigger value="tickets">Support Tickets ({supportTickets.length})</TabsTrigger>
            <TabsTrigger value="analytics">Response Analytics</TabsTrigger>
            <TabsTrigger value="resolve">Resolve Today</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {supportTickets.filter((t) => t.status === "Open").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {supportTickets.filter((t) => t.status === "In Progress").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">5</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{ticket.title}</h4>
                            <Badge
                              variant={
                                ticket.priority === "High"
                                  ? "destructive"
                                  : ticket.priority === "Medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {ticket.priority}
                            </Badge>
                            <Badge variant="outline">{ticket.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>#{ticket.id}</span>
                            <span>By {ticket.user}</span>
                            <span>Created {ticket.created}</span>
                            <span>Assigned to {ticket.assignedTo}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedTicket(ticket)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">2.4h</div>
                  <p className="text-xs text-muted-foreground">-0.3h from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">94%</div>
                  <p className="text-xs text-muted-foreground">+2% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">4.8/5</div>
                  <p className="text-xs text-muted-foreground">+0.1 from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">First Contact Resolution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">78%</div>
                  <p className="text-xs text-muted-foreground">+5% from last week</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resolve" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tickets to Resolve Today</CardTitle>
                <CardDescription>Priority tickets requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportTickets
                    .filter((t) => t.priority === "High" || t.status === "Open")
                    .map((ticket) => (
                      <div key={ticket.id} className="border rounded-lg p-4 bg-red-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-red-800">{ticket.title}</h4>
                            <p className="text-sm text-red-600">
                              {ticket.priority} priority • Created {ticket.created}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Contact User
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Ticket Preview Modal */}
        {selectedTicket && (
          <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background p-6 rounded-lg w-full max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Ticket Details</h3>
                <Button variant="ghost" onClick={() => setSelectedTicket(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">{selectedTicket.title}</h4>
                  <p className="text-sm text-muted-foreground">#{selectedTicket.id}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">User:</span> {selectedTicket.user}
                  </div>
                  <div>
                    <span className="font-medium">Priority:</span> {selectedTicket.priority}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {selectedTicket.category}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {selectedTicket.status}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {selectedTicket.created}
                  </div>
                  <div>
                    <span className="font-medium">Assigned to:</span> {selectedTicket.assignedTo}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Description</h5>
                  <p className="text-muted-foreground">{selectedTicket.description}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Ticket
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Create Ticket Modal */}
        {showCreateTicket && (
          <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create Support Ticket</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value) => setNewTicket((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newTicket.category}
                    onValueChange={(value) => setNewTicket((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Content">Content</SelectItem>
                      <SelectItem value="Account">Account</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleCreateTicket} className="flex-1">
                  Create Ticket
                </Button>
                <Button variant="outline" onClick={() => setShowCreateTicket(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    )
  }

  const SystemSettingsPage = () => {
    const [settingsView, setSettingsView] = useState("general")
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [isUploadingLogo, setIsUploadingLogo] = useState(false)

    const handleLogoUpload = async (file: File) => {
      try {
        setIsUploadingLogo(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))

        toast({
          title: "Logo Uploaded",
          description: "Platform logo has been updated successfully",
        })
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to upload logo. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsUploadingLogo(false)
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
            <p className="text-muted-foreground">Configure platform settings and preferences</p>
          </div>
        </div>

        <Tabs value={settingsView} onValueChange={setSettingsView}>
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable maintenance mode to restrict access</p>
                  </div>
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Gamification Features</Label>
                    <p className="text-sm text-muted-foreground">Enable XP, badges, and leaderboards</p>
                  </div>
                  <Switch checked={gamificationEnabled} onCheckedChange={setGamificationEnabled} />
                </div>
                <div>
                  <Label className="text-base font-medium">Platform Logo</Label>
                  <p className="text-sm text-muted-foreground mb-2">Upload a new logo for the platform</p>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setLogoFile(file)
                          handleLogoUpload(file)
                        }
                      }}
                    />
                    <Button
                      disabled={!logoFile || isUploadingLogo}
                      onClick={() => logoFile && handleLogoUpload(logoFile)}
                    >
                      {isUploadingLogo ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark theme for the platform</p>
                  </div>
                  <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                </div>
                <div>
                  <Label className="text-base font-medium">Default Language</Label>
                  <p className="text-sm text-muted-foreground mb-2">Set the default language for new users</p>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                      <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                      <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                      <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                      <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                      <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                      <SelectItem value="or">ଓଡ଼ିଆ (Odia)</SelectItem>
                      <SelectItem value="as">অসমীয়া (Assamese)</SelectItem>
                      <SelectItem value="ur">اردو (Urdu)</SelectItem>
                      <SelectItem value="sa">संस्कृत (Sanskrit)</SelectItem>
                      <SelectItem value="ne">नेपाली (Nepali)</SelectItem>
                      <SelectItem value="si">සිංහල (Sinhala)</SelectItem>
                      <SelectItem value="my">မြန်မာ (Myanmar)</SelectItem>
                      <SelectItem value="th">ไทย (Thai)</SelectItem>
                      <SelectItem value="vi">Tiếng Việt (Vietnamese)</SelectItem>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="ms">Bahasa Melayu</SelectItem>
                      <SelectItem value="zh">中文 (Chinese)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground mb-2">Add an extra layer of security to admin accounts</p>
                  <Button variant="outline">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Setup 2FA
                  </Button>
                </div>
                <div>
                  <Label className="text-base font-medium">Session Timeout</Label>
                  <p className="text-sm text-muted-foreground mb-2">Automatically log out inactive users</p>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-base font-medium">Password Policy</Label>
                  <p className="text-sm text-muted-foreground mb-2">Set minimum password requirements</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Checkbox defaultChecked />
                      <span>Minimum 8 characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox defaultChecked />
                      <span>Require uppercase letters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox defaultChecked />
                      <span>Require numbers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox />
                      <span>Require special characters</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email alerts for important events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">SMS notifications for critical issues</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Third-party Integrations</CardTitle>
                <CardDescription>Manage external service integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Firebase</h4>
                        <p className="text-sm text-muted-foreground">Authentication and database</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Cloud className="h-8 w-8 text-orange-500" />
                      <div>
                        <h4 className="font-medium">AWS S3</h4>
                        <p className="text-sm text-muted-foreground">File storage</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Not Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-8 w-8 text-red-500" />
                      <div>
                        <h4 className="font-medium">SendGrid</h4>
                        <p className="text-sm text-muted-foreground">Email delivery</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Not Connected</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  const NotificationsPage = () => {
    const [notificationFilter, setNotificationFilter] = useState("all")

    const markAsRead = (id: string) => {
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    }

    const markAllAsRead = () => {
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
    }

    const deleteNotification = (id: string) => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id))
    }

    const filteredNotifications = notifications.filter((notif) => {
      if (notificationFilter === "unread") return !notif.read
      if (notificationFilter === "read") return notif.read
      return true
    })

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
            <p className="text-muted-foreground">Manage your notifications and alerts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Select value={notificationFilter} onValueChange={setNotificationFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 ${!notification.read ? "bg-blue-50 border-blue-200" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          notification.type === "info"
                            ? "bg-blue-100"
                            : notification.type === "warning"
                              ? "bg-orange-100"
                              : "bg-green-100"
                        }`}
                      >
                        {notification.type === "info" && <Bell className="h-4 w-4 text-blue-600" />}
                        {notification.type === "warning" && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                        {notification.type === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <Button size="sm" variant="outline" onClick={() => markAsRead(notification.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => deleteNotification(notification.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredNotifications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No notifications found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const ProfilePage = () => {
    const [profileView, setProfileView] = useState("details")
    const [passwordData, setPasswordData] = useState({
      current: "",
      new: "",
      confirm: "",
    })
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    const handlePasswordChangeSubmit = async () => {
      if (passwordData.new !== passwordData.confirm) {
        toast({
          title: "Password Mismatch",
          description: "New password and confirmation don't match",
          variant: "destructive",
        })
        return
      }

      try {
        setIsChangingPassword(true)
        await handlePasswordChange(passwordData.current, passwordData.new)
        setPasswordData({ current: "", new: "", confirm: "" })
      } catch (error) {
        // Error handled in handlePasswordChange
      } finally {
        setIsChangingPassword(false)
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
        </div>

        <Tabs value={profileView} onValueChange={setProfileView}>
          <TabsList>
            <TabsTrigger value="details">Profile Details</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileChanges.avatar || adminProfile.avatar} />
                    <AvatarFallback>
                      {adminProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label className="text-base font-medium">Profile Picture</Label>
                    <p className="text-sm text-muted-foreground mb-2">Upload a new profile picture</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleAvatarUpload(file)
                      }}
                      className="w-64"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileChanges.name || adminProfile.name}
                      onChange={(e) => setProfileChanges((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileChanges.email || adminProfile.email}
                      onChange={(e) => setProfileChanges((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileChanges.phone || adminProfile.phone}
                      onChange={(e) => setProfileChanges((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={profileChanges.department || adminProfile.department}
                      onChange={(e) => setProfileChanges((prev) => ({ ...prev, department: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileChanges.bio || adminProfile.bio}
                    onChange={(e) => setProfileChanges((prev) => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleProfileSave}
                    disabled={isProfileSaving || Object.keys(profileChanges).length === 0}
                  >
                    {isProfileSaving ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setProfileChanges({})}
                    disabled={Object.keys(profileChanges).length === 0}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, current: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, new: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, confirm: e.target.value }))}
                  />
                </div>
                <Button
                  onClick={handlePasswordChangeSubmit}
                  disabled={isChangingPassword || !passwordData.current || !passwordData.new || !passwordData.confirm}
                >
                  {isChangingPassword ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Key className="h-4 w-4 mr-2" />
                  )}
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">2FA Status</p>
                    <p className="text-sm text-muted-foreground">Two-factor authentication is not enabled</p>
                  </div>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Setup 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Language</Label>
                  <p className="text-sm text-muted-foreground mb-2">Choose your preferred language</p>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी</SelectItem>
                      <SelectItem value="bn">বাংলা</SelectItem>
                      <SelectItem value="te">తెలుగు</SelectItem>
                      <SelectItem value="mr">मराठी</SelectItem>
                      <SelectItem value="ta">தமிழ்</SelectItem>
                      <SelectItem value="gu">ગુજરાતી</SelectItem>
                      <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                      <SelectItem value="ml">മലയാളം</SelectItem>
                      <SelectItem value="pa">ਪੰਜਾਬੀ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme</p>
                  </div>
                  <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />
      case "users":
        return <UserManagementPage />
      case "content":
        return <ContentManagementPage />
      case "analytics":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Admin Analytics Dashboard</h2>
              <Badge variant="outline" className="text-sm">
                🔥 Firebase Powered
              </Badge>
            </div>
            <Tabs defaultValue="firebase" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="firebase">Firebase Analytics</TabsTrigger>
                <TabsTrigger value="realtime">Real-Time Monitoring</TabsTrigger>
              </TabsList>
              <TabsContent value="firebase">
                <FirebaseAnalyticsDashboard />
              </TabsContent>
              <TabsContent value="realtime">
                <RealTimeDashboard />
              </TabsContent>
            </Tabs>
          </div>
        )
      case "system":
        return <SystemSettingsPage />
      case "support":
        return <SupportOversightPage />
      case "notifications":
        return <NotificationsPage />
      case "profile":
        return <ProfilePage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">EduGamers {t("nav.admin")}</h1>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as AdminPage)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentPage === item.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{renderPage()}</div>
      </div>
    </div>
  )
}
