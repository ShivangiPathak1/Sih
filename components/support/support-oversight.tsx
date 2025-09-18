"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Clock, CheckCircle, AlertCircle, Send, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Ticket {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: "technical" | "account" | "content" | "billing"
  user: {
    name: string
    email: string
    avatar?: string
  }
  assignedTo?: string
  createdAt: string
  updatedAt: string
  responseTime?: number
  messages: Array<{
    id: string
    sender: string
    message: string
    timestamp: string
    isAdmin: boolean
  }>
}

const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Cannot access course materials",
    description: "I am unable to access the course materials for Mathematics Grade 10",
    status: "open",
    priority: "high",
    category: "technical",
    user: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    messages: [
      {
        id: "1",
        sender: "John Doe",
        message: "I am unable to access the course materials for Mathematics Grade 10",
        timestamp: "2024-01-15T10:00:00Z",
        isAdmin: false,
      },
    ],
  },
  {
    id: "2",
    title: "Password reset issue",
    description: "Password reset email not received",
    status: "in-progress",
    priority: "medium",
    category: "account",
    user: {
      name: "Jane Smith",
      email: "jane@example.com",
    },
    assignedTo: "Admin User",
    createdAt: "2024-01-14T15:30:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
    responseTime: 18,
    messages: [
      {
        id: "1",
        sender: "Jane Smith",
        message: "Password reset email not received",
        timestamp: "2024-01-14T15:30:00Z",
        isAdmin: false,
      },
      {
        id: "2",
        sender: "Admin User",
        message: "We are looking into this issue. Please check your spam folder.",
        timestamp: "2024-01-15T09:00:00Z",
        isAdmin: true,
      },
    ],
  },
]

export function SupportOversight() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [showCreateTicket, setShowCreateTicket] = useState(false)
  const [newMessage, setNewMessage] = useState("")

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const supportMetrics = {
    totalTickets: tickets.length,
    openTickets: tickets.filter((t) => t.status === "open").length,
    inProgressTickets: tickets.filter((t) => t.status === "in-progress").length,
    resolvedToday: tickets.filter((t) => {
      const today = new Date().toDateString()
      return t.status === "resolved" && new Date(t.updatedAt).toDateString() === today
    }).length,
    averageResponseTime:
      tickets.filter((t) => t.responseTime).reduce((acc, t) => acc + (t.responseTime || 0), 0) /
        tickets.filter((t) => t.responseTime).length || 0,
  }

  const handleSendMessage = (ticketId: string) => {
    if (!newMessage.trim()) return

    console.log("[v0] Sending message to ticket:", ticketId)
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            messages: [
              ...ticket.messages,
              {
                id: Date.now().toString(),
                sender: "Admin User",
                message: newMessage,
                timestamp: new Date().toISOString(),
                isAdmin: true,
              },
            ],
            updatedAt: new Date().toISOString(),
            status: "in-progress",
          }
        }
        return ticket
      }),
    )
    setNewMessage("")
  }

  const handleCreateTicket = (ticketData: any) => {
    console.log("[v0] Creating new ticket:", ticketData)
    const newTicket: Ticket = {
      id: Date.now().toString(),
      title: ticketData.title,
      description: ticketData.description,
      status: "open",
      priority: ticketData.priority,
      category: ticketData.category,
      user: {
        name: "Admin User",
        email: "admin@example.com",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: "1",
          sender: "Admin User",
          message: ticketData.description,
          timestamp: new Date().toISOString(),
          isAdmin: true,
        },
      ],
    }
    setTickets((prev) => [newTicket, ...prev])
    setShowCreateTicket(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Support Oversight</h2>
          <p className="text-muted-foreground">Manage support tickets and customer inquiries</p>
        </div>
        <Dialog open={showCreateTicket} onOpenChange={setShowCreateTicket}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
              <DialogDescription>Create a new support ticket</DialogDescription>
            </DialogHeader>
            <CreateTicketForm onSubmit={handleCreateTicket} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Support Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.open('/support/average-response-time', '_blank')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(supportMetrics.averageResponseTime)}h</div>
            <p className="text-xs text-muted-foreground">Click for details</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.open('/support/resolution-rate', '_blank')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.5%</div>
            <p className="text-xs text-muted-foreground">Click for details</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.open('/support/customer-satisfaction', '_blank')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.4/5</div>
            <p className="text-xs text-muted-foreground">Click for details</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.open('/support/first-contact-resolution', '_blank')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">First Contact Resolution</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73.2%</div>
            <p className="text-xs text-muted-foreground">Click for details</p>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.open('/support/open-tickets', '_blank')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportMetrics.openTickets}</div>
            <p className="text-xs text-muted-foreground">Click for details</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.open('/support/in-progress-tickets', '_blank')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportMetrics.inProgressTickets}</div>
            <p className="text-xs text-muted-foreground">Click for details</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.open('/support/resolved-today', '_blank')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportMetrics.resolvedToday}</div>
            <p className="text-xs text-muted-foreground">Click for details</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedTicket?.id === ticket.id ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{ticket.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {ticket.user.name} • {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          ticket.status === "open"
                            ? "destructive"
                            : ticket.status === "in-progress"
                              ? "default"
                              : ticket.status === "resolved"
                                ? "default"
                                : "secondary"
                        }
                      >
                        {ticket.status}
                      </Badge>
                      <Badge
                        variant={
                          ticket.priority === "urgent"
                            ? "destructive"
                            : ticket.priority === "high"
                              ? "destructive"
                              : ticket.priority === "medium"
                                ? "default"
                                : "secondary"
                        }
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ticket Details */}
        <Card>
          <CardHeader>
            <CardTitle>{selectedTicket ? "Ticket Details" : "Select a Ticket"}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTicket ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{selectedTicket.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created by {selectedTicket.user.name} on {new Date(selectedTicket.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-3">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${message.isAdmin ? "bg-blue-50 ml-4" : "bg-gray-50 mr-4"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{message.sender}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your response..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={() => handleSendMessage(selectedTicket.id)} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">Select a ticket to view details and respond</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CreateTicketForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "technical",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={formData.priority}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="account">Account</SelectItem>
            <SelectItem value="content">Content</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        Create Ticket
      </Button>
    </form>
  )
}
