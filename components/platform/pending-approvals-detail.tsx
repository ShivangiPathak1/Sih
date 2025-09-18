"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { 
  Clock, 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Search, 
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Users,
  TrendingUp,
  Calendar
} from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts"

export function PendingApprovalsDetail() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("30m")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedApproval, setSelectedApproval] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  // Mock data for pending approvals
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: "A001",
      type: "Course Content",
      title: "Advanced Machine Learning - Neural Networks",
      submittedBy: "Dr. Rajesh Kumar",
      submitterAvatar: "/placeholder-user.jpg",
      submittedOn: "2024-01-20T10:30:00Z",
      priority: "High",
      category: "Computer Science",
      description: "Comprehensive course on deep learning and neural network architectures",
      status: "pending",
      estimatedReviewTime: "2-3 days",
      fileSize: "45 MB",
      attachments: 12
    },
    {
      id: "A002",
      type: "User Registration",
      title: "Teacher Account - Priya Sharma",
      submittedBy: "Priya Sharma",
      submitterAvatar: "/placeholder-user.jpg",
      submittedOn: "2024-01-20T14:15:00Z",
      priority: "Medium",
      category: "Account Management",
      description: "New teacher registration from Mumbai Central School",
      status: "pending",
      estimatedReviewTime: "1-2 days",
      fileSize: "2 MB",
      attachments: 3
    },
    {
      id: "A003",
      type: "Content Update",
      title: "Chemistry Lab Experiment - Organic Synthesis",
      submittedBy: "Prof. Anita Patel",
      submitterAvatar: "/placeholder-user.jpg",
      submittedOn: "2024-01-20T09:45:00Z",
      priority: "Low",
      category: "Chemistry",
      description: "Updated virtual chemistry lab with new organic synthesis experiments",
      status: "pending",
      estimatedReviewTime: "3-5 days",
      fileSize: "78 MB",
      attachments: 25
    },
    {
      id: "A004",
      type: "Quiz Content",
      title: "Physics - Quantum Mechanics Assessment",
      submittedBy: "Dr. Vikram Singh",
      submitterAvatar: "/placeholder-user.jpg",
      submittedOn: "2024-01-20T16:20:00Z",
      priority: "High",
      category: "Physics",
      description: "Advanced quantum mechanics quiz with 50 questions",
      status: "pending",
      estimatedReviewTime: "1-2 days",
      fileSize: "5 MB",
      attachments: 8
    }
  ])

  // Mock chart data for approval trends
  const chartData = {
    "30m": Array.from({ length: 30 }, (_, i) => ({
      time: `${30-i}m ago`,
      submitted: Math.floor(Math.random() * 10) + 2,
      approved: Math.floor(Math.random() * 8) + 1,
      rejected: Math.floor(Math.random() * 3) + 0
    })),
    "1h": Array.from({ length: 24 }, (_, i) => ({
      time: `${60-i*2.5}m ago`,
      submitted: Math.floor(Math.random() * 15) + 5,
      approved: Math.floor(Math.random() * 12) + 3,
      rejected: Math.floor(Math.random() * 5) + 1
    })),
    "24h": Array.from({ length: 24 }, (_, i) => ({
      time: `${24-i}h ago`,
      submitted: Math.floor(Math.random() * 25) + 10,
      approved: Math.floor(Math.random() * 20) + 5,
      rejected: Math.floor(Math.random() * 8) + 2
    })),
    "7d": Array.from({ length: 7 }, (_, i) => ({
      time: `${7-i} days ago`,
      submitted: Math.floor(Math.random() * 50) + 30,
      approved: Math.floor(Math.random() * 40) + 20,
      rejected: Math.floor(Math.random() * 15) + 5
    })),
    "30d": Array.from({ length: 30 }, (_, i) => ({
      time: `${30-i} days ago`,
      submitted: Math.floor(Math.random() * 80) + 40,
      approved: Math.floor(Math.random() * 60) + 30,
      rejected: Math.floor(Math.random() * 20) + 8
    }))
  }

  const pieData = [
    { name: 'Pending', value: pendingApprovals.length, color: '#fbbf24' },
    { name: 'Approved Today', value: 12, color: '#10b981' },
    { name: 'Rejected Today', value: 3, color: '#ef4444' }
  ]

  const types = ["all", "Course Content", "User Registration", "Content Update", "Quiz Content"]
  const priorities = ["all", "High", "Medium", "Low"]
  
  const filteredApprovals = pendingApprovals.filter(approval => {
    const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || approval.type === typeFilter
    const matchesPriority = priorityFilter === "all" || approval.priority === priorityFilter
    return matchesSearch && matchesType && matchesPriority
  })

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleApprove = (id: string) => {
    setPendingApprovals(prev => prev.filter(approval => approval.id !== id))
    // In real app, would make API call here
  }

  const handleReject = (id: string, reason: string) => {
    setPendingApprovals(prev => prev.filter(approval => approval.id !== id))
    setSelectedApproval(null)
    setRejectionReason("")
    // In real app, would make API call here
  }

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Type,Title,Submitted By,Submitted On,Priority,Category,Status,File Size,Attachments\n" +
      pendingApprovals.map(approval =>
        `"${approval.type}","${approval.title}","${approval.submittedBy}",${approval.submittedOn},${approval.priority},"${approval.category}",${approval.status},"${approval.fileSize}",${approval.attachments}`
      ).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `pending_approvals_${timeRange}_${Date.now()}.csv`)
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500"
      case "Medium": return "bg-yellow-500"
      case "Low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getTimeSinceSubmission = (submittedOn: string) => {
    const now = new Date()
    const submitted = new Date(submittedOn)
    const diffInHours = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Less than 1 hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const days = Math.floor(diffInHours / 24)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
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
              <h1 className="text-3xl font-bold">Pending Approvals</h1>
              <p className="text-muted-foreground">Review and manage pending content approvals</p>
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
                <Clock className="h-4 w-4" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApprovals.length}</div>
              <div className="text-sm text-orange-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {pendingApprovals.filter(a => a.priority === 'High').length} high priority
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Approved Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +25% from yesterday
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Rejected Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">
                Quality issues
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Avg Review Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3 days</div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                -15% improvement
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Approval Activity Trends - {timeRange}</CardTitle>
              <CardDescription>Submitted, approved, and rejected content over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData[timeRange as keyof typeof chartData]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="submitted" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="approved" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Today's Status</CardTitle>
              <CardDescription>Current approval status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals Queue</CardTitle>
            <CardDescription>Items awaiting review and approval</CardDescription>
            <div className="flex items-center gap-4 mt-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search approvals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority === "all" ? "All Priorities" : priority}
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
              {filteredApprovals.map((approval) => (
                <div key={approval.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={approval.submitterAvatar} />
                        <AvatarFallback>{approval.submittedBy.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{approval.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {approval.type}
                          </span>
                          <span>•</span>
                          <span>By: {approval.submittedBy}</span>
                          <span>•</span>
                          <span>Category: {approval.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`${getPriorityColor(approval.priority)} text-white`}
                      >
                        {approval.priority}
                      </Badge>
                      <Badge variant="outline">{approval.estimatedReviewTime}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{approval.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Submitted: {getTimeSinceSubmission(approval.submittedOn)}
                        </span>
                        <span>Size: {approval.fileSize}</span>
                        <span>{approval.attachments} attachments</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedApproval(approval)}>
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                        <Button size="sm" variant="default" onClick={() => handleApprove(approval.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setSelectedApproval(approval)}>
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
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

      {/* Review/Reject Modal */}
      <Dialog open={!!selectedApproval} onOpenChange={() => setSelectedApproval(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Approval: {selectedApproval?.title}</DialogTitle>
            <DialogDescription>
              Review the details and approve or reject this submission
            </DialogDescription>
          </DialogHeader>
          {selectedApproval && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Type:</strong> {selectedApproval.type}</div>
                <div><strong>Category:</strong> {selectedApproval.category}</div>
                <div><strong>Submitted By:</strong> {selectedApproval.submittedBy}</div>
                <div><strong>Priority:</strong> {selectedApproval.priority}</div>
                <div><strong>File Size:</strong> {selectedApproval.fileSize}</div>
                <div><strong>Attachments:</strong> {selectedApproval.attachments}</div>
              </div>
              <div>
                <strong>Description:</strong>
                <p className="mt-1 text-sm text-muted-foreground">{selectedApproval.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Rejection Reason (if rejecting):</label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedApproval(null)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleReject(selectedApproval.id, rejectionReason)}
                  disabled={!rejectionReason.trim()}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => handleApprove(selectedApproval.id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}