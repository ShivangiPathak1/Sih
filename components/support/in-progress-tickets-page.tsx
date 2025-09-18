"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowLeft, Search, Eye, MessageSquare, Edit, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const inProgressTickets = [
  {
    id: "T-002",
    title: "Password reset issue",
    user: "Jane Smith",
    email: "jane@example.com",
    assignedTo: "Sarah Johnson",
    priority: "medium",
    category: "account",
    createdAt: "2024-01-14T15:30:00Z",
    lastUpdate: "2024-01-15T09:00:00Z",
    description: "Password reset email not received"
  },
  {
    id: "T-006",
    title: "Course enrollment problem",
    user: "David Wilson", 
    email: "david@example.com",
    assignedTo: "Mike Chen",
    priority: "high",
    category: "technical",
    createdAt: "2024-01-15T11:15:00Z",
    lastUpdate: "2024-01-16T10:30:00Z",
    description: "Unable to enroll in advanced mathematics course"
  }
]

export function InProgressTicketsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)

  const uniqueAssignees = Array.from(new Set(inProgressTickets.map(t => t.assignedTo)))

  const filteredTickets = inProgressTickets.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAssignee = assigneeFilter === "all" || ticket.assignedTo === assigneeFilter
    return matchesSearch && matchesAssignee
  })

  const handlePreview = (ticket: any) => {
    setSelectedTicket(ticket)
  }

  const handleMessage = (ticketId: string) => {
    router.push(`/support/ticket/${ticketId}/messages`)
  }

  const handleEdit = (ticketId: string) => {
    router.push(`/support/ticket/${ticketId}/edit`)
  }

  const handleContactUser = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTimeSinceUpdate = (lastUpdate: string) => {
    const now = new Date()
    const updated = new Date(lastUpdate)
    const diffHours = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return "Just updated"
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">In Progress Tickets</h1>
          <p className="text-muted-foreground">Tickets currently being worked on</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tickets by title or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Assigned to" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            {uniqueAssignees.map((assignee) => (
              <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>In Progress Tickets ({filteredTickets.length})</CardTitle>
            <CardDescription>Tickets currently being resolved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{ticket.id}</span>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge variant="secondary">
                          <User className="h-3 w-3 mr-1" />
                          {ticket.assignedTo}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{ticket.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        By {ticket.user} ({ticket.email})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last updated: {getTimeSinceUpdate(ticket.lastUpdate)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreview(ticket)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMessage(ticket.id)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(ticket.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
            <CardDescription>View and manage ticket details</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTicket ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-lg">{selectedTicket.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getPriorityColor(selectedTicket.priority)}>
                      {selectedTicket.priority}
                    </Badge>
                    <Badge variant="outline">{selectedTicket.category}</Badge>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2">Assignment</h5>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Assigned to: {selectedTicket.assignedTo}</span>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2">Customer Details</h5>
                  <p className="text-sm">{selectedTicket.user}</p>
                  <p className="text-sm text-muted-foreground">{selectedTicket.email}</p>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2">Description</h5>
                  <p className="text-sm">{selectedTicket.description}</p>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2">Timeline</h5>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(selectedTicket.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(selectedTicket.lastUpdate).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => handleMessage(selectedTicket.id)}>
                    Send Message
                  </Button>
                  <Button variant="outline" onClick={() => handleContactUser(selectedTicket.email)}>
                    Contact User
                  </Button>
                  <Button variant="outline" onClick={() => handleEdit(selectedTicket.id)}>
                    Edit Ticket
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a ticket to view details</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(inProgressTickets.reduce((acc, ticket) => {
                  const hours = Math.floor((new Date().getTime() - new Date(ticket.lastUpdate).getTime()) / (1000 * 60 * 60))
                  return acc + hours
                }, 0) / inProgressTickets.length)}h
              </div>
              <p className="text-sm text-blue-600">Avg Time Since Update</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {uniqueAssignees.length}
              </div>
              <p className="text-sm text-green-600">Active Agents</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(inProgressTickets.length / uniqueAssignees.length)}
              </div>
              <p className="text-sm text-purple-600">Tickets per Agent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}