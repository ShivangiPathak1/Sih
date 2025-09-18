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
  LifeBuoy, 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Search, 
  Eye,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Star,
  Phone,
  Mail
} from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts"

export function ActiveSupportTicketsDetail() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("30m")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [responseMessage, setResponseMessage] = useState("")

  // Mock data for active support tickets
  const [supportTickets, setSupportTickets] = useState([
    {
      id: "ST001",
      title: "Unable to access course materials",
      description: "Students reporting issues accessing uploaded video content in Physics course",
      user: "Rahul Sharma",
      userType: "Student",
      userAvatar: "/placeholder-user.jpg",
      userEmail: "rahul@example.com",
      userPhone: "+91 98765 43210",
      priority: "High",
      status: "Open",
      category: "Technical",
      createdAt: "2024-01-20T10:30:00Z",
      lastUpdate: "2024-01-20T14:15:00Z",
      assignedTo: "Tech Support Team",
      estimatedResolution: "2-4 hours",
      satisfaction: null,
      responses: 3
    },
    {
      id: "ST002", 
      title: "Grade calculation incorrect",
      description: "Parent reporting that child's mathematics grade doesn't match assignment scores",
      user: "Priya Patel",
      userType: "Parent",
      userAvatar: "/placeholder-user.jpg",
      userEmail: "priya.patel@example.com",
      userPhone: "+91 87654 32109",
      priority: "Medium",
      status: "In Progress",
      category: "Academic",
      createdAt: "2024-01-20T08:45:00Z",
      lastUpdate: "2024-01-20T13:30:00Z",
      assignedTo: "Academic Team",
      estimatedResolution: "1-2 days",
      satisfaction: null,
      responses: 5
    },
    {
      id: "ST003",
      title: "Account suspension appeal",
      description: "Teacher requesting review of account suspension for policy violation",
      user: "Dr. Amit Kumar",
      userType: "Teacher",
      userAvatar: "/placeholder-user.jpg",
      userEmail: "amit.kumar@example.com",
      userPhone: "+91 76543 21098",
      priority: "High",
      status: "Escalated",
      category: "Policy",
      createdAt: "2024-01-19T16:20:00Z",
      lastUpdate: "2024-01-20T09:00:00Z",
      assignedTo: "Management Team",
      estimatedResolution: "3-5 days",
      satisfaction: null,
      responses: 8
    },
    {
      id: "ST004",
      title: "Payment processing failed",
      description: "Unable to complete premium subscription payment, getting error message",
      user: "Neha Singh",
      userType: "Parent",
      userAvatar: "/placeholder-user.jpg",
      userEmail: "neha.singh@example.com",
      userPhone: "+91 65432 10987",
      priority: "Medium",
      status: "Open",
      category: "Payment",
      createdAt: "2024-01-20T12:10:00Z",
      lastUpdate: "2024-01-20T12:45:00Z",
      assignedTo: "Finance Team",
      estimatedResolution: "4-6 hours",
      satisfaction: null,
      responses: 1
    }
  ])

  // Mock chart data for ticket trends
  const chartData = {
    "30m": Array.from({ length: 30 }, (_, i) => ({
      time: `${30-i}m ago`,
      created: Math.floor(Math.random() * 5) + 1,
      resolved: Math.floor(Math.random() * 4) + 0,
      active: Math.floor(Math.random() * 8) + 5
    })),
    "1h": Array.from({ length: 24 }, (_, i) => ({
      time: `${60-i*2.5}m ago`,
      created: Math.floor(Math.random() * 8) + 2,
      resolved: Math.floor(Math.random() * 6) + 1,
      active: Math.floor(Math.random() * 12) + 8
    })),
    "24h": Array.from({ length: 24 }, (_, i) => ({
      time: `${24-i}h ago`,
      created: Math.floor(Math.random() * 15) + 5,
      resolved: Math.floor(Math.random() * 12) + 3,
      active: Math.floor(Math.random() * 20) + 15
    })),
    "7d": Array.from({ length: 7 }, (_, i) => ({
      time: `${7-i} days ago`,
      created: Math.floor(Math.random() * 30) + 20,
      resolved: Math.floor(Math.random() * 25) + 15,
      active: Math.floor(Math.random() * 40) + 30
    })),
    "30d": Array.from({ length: 30 }, (_, i) => ({
      time: `${30-i} days ago`,
      created: Math.floor(Math.random() * 50) + 30,
      resolved: Math.floor(Math.random() * 45) + 25,
      active: Math.floor(Math.random() * 60) + 40
    }))
  }

  const statuses = ["all", "Open", "In Progress", "Escalated", "Resolved"]
  const priorities = ["all", "High", "Medium", "Low"]
  const categories = ["all", "Technical", "Academic", "Policy", "Payment", "General"]
  
  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleStatusUpdate = (ticketId: string, newStatus: string) => {
    setSupportTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus, lastUpdate: new Date().toISOString() } : ticket
      )
    )
  }

  const handleResponse = (ticketId: string, message: string) => {
    setSupportTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId 
          ? { ...ticket, responses: ticket.responses + 1, lastUpdate: new Date().toISOString() }
          : ticket
      )
    )
    setSelectedTicket(null)
    setResponseMessage("")
  }

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "ID,Title,User,User Type,Priority,Status,Category,Created,Last Update,Assigned To,Responses\n" +
      supportTickets.map(ticket =>
        `${ticket.id},"${ticket.title}","${ticket.user}",${ticket.userType},${ticket.priority},${ticket.status},"${ticket.category}",${ticket.createdAt},${ticket.lastUpdate},"${ticket.assignedTo}",${ticket.responses}`
      ).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `support_tickets_${timeRange}_${Date.now()}.csv`)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-blue-500"
      case "In Progress": return "bg-orange-500"
      case "Escalated": return "bg-red-500"
      case "Resolved": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getTimeSince = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
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
              <h1 className="text-3xl font-bold">Active Support Tickets</h1>
              <p className="text-muted-foreground">Monitor and manage active support cases</p>
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
                <LifeBuoy className="h-4 w-4" />
                Active Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{supportTickets.length}</div>
              <div className="text-sm text-orange-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {supportTickets.filter(t => t.priority === 'High').length} high priority
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3 hrs</div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                -15% improvement
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Resolved Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +22% from yesterday
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Satisfaction Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.6/5</div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +0.2 from last week
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Support Ticket Activity - {timeRange}</CardTitle>
            <CardDescription>Created, resolved, and active ticket trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData[timeRange as keyof typeof chartData]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="created" fill="#8884d8" name="Created" />
                <Bar dataKey="active" fill="#82ca9d" name="Active" />
                <Bar dataKey="resolved" fill="#ffc658" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Support Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Support Tickets</CardTitle>
            <CardDescription>All currently active support cases requiring attention</CardDescription>
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Status" : status}
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
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
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
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={ticket.userAvatar} />
                        <AvatarFallback>{ticket.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{ticket.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {ticket.user} ({ticket.userType})
                          </span>
                          <span>•</span>
                          <span>#{ticket.id}</span>
                          <span>•</span>
                          <span>{ticket.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`${getPriorityColor(ticket.priority)} text-white`}
                      >
                        {ticket.priority}
                      </Badge>
                      <Badge 
                        variant="secondary"
                        className={`${getStatusColor(ticket.status)} text-white`}
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{ticket.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Created: {getTimeSince(ticket.createdAt)}
                        </span>
                        <span>Updated: {getTimeSince(ticket.lastUpdate)}</span>
                        <span>{ticket.responses} responses</span>
                        <span>ETA: {ticket.estimatedResolution}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedTicket(ticket)}>
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" variant="default" onClick={() => setSelectedTicket(ticket)}>
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Respond
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

      {/* Ticket Details/Response Modal */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ticket Details: {selectedTicket?.title}</DialogTitle>
            <DialogDescription>
              #{selectedTicket?.id} - {selectedTicket?.category} | {selectedTicket?.priority} Priority
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>User:</strong> {selectedTicket.user} ({selectedTicket.userType})</div>
                <div><strong>Email:</strong> {selectedTicket.userEmail}</div>
                <div><strong>Phone:</strong> {selectedTicket.userPhone}</div>
                <div><strong>Assigned To:</strong> {selectedTicket.assignedTo}</div>
                <div><strong>Created:</strong> {getTimeSince(selectedTicket.createdAt)}</div>
                <div><strong>Last Update:</strong> {getTimeSince(selectedTicket.lastUpdate)}</div>
                <div><strong>Status:</strong> 
                  <Badge className={`ml-2 ${getStatusColor(selectedTicket.status)} text-white`}>
                    {selectedTicket.status}
                  </Badge>
                </div>
                <div><strong>Priority:</strong>
                  <Badge className={`ml-2 ${getPriorityColor(selectedTicket.priority)} text-white`}>
                    {selectedTicket.priority}
                  </Badge>
                </div>
              </div>
              <div>
                <strong>Description:</strong>
                <p className="mt-1 text-sm text-muted-foreground">{selectedTicket.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Response Message:</label>
                <Textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Enter your response to the customer..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Update Status:</label>
                <Select onValueChange={(value) => handleStatusUpdate(selectedTicket.id, value)}>
                  <SelectTrigger className="w-48 mt-1">
                    <SelectValue placeholder={selectedTicket.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Escalated">Escalated</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleResponse(selectedTicket.id, responseMessage)}
                  disabled={!responseMessage.trim()}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Response
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}