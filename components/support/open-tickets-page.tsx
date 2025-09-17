"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowLeft, Search, Eye, MessageSquare, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const openTickets = [
  {
    id: "T-001",
    title: "Cannot access course materials",
    user: "John Doe",
    email: "john@example.com",
    priority: "high",
    category: "technical",
    createdAt: "2024-01-15T10:00:00Z",
    description: "Unable to access Mathematics Grade 10 course materials"
  },
  {
    id: "T-005",
    title: "Login authentication failed",
    user: "Alice Johnson",
    email: "alice@example.com", 
    priority: "urgent",
    category: "account",
    createdAt: "2024-01-16T08:30:00Z",
    description: "User cannot log in despite correct credentials"
  },
  {
    id: "T-008",
    title: "Video playback issues",
    user: "Bob Smith",
    email: "bob@example.com",
    priority: "medium",
    category: "technical",
    createdAt: "2024-01-16T14:20:00Z",
    description: "Videos are not loading properly in Safari browser"
  }
]

export function OpenTicketsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)

  const filteredTickets = openTickets.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    return matchesSearch && matchesPriority
  })

  const handlePreview = (ticket: any) => {
    setSelectedTicket(ticket)
  }

  const handleMessage = (ticketId: string) => {
    // Navigate to messaging interface
    router.push(`/support/ticket/${ticketId}/messages`)
  }

  const handleEdit = (ticketId: string) => {
    // Navigate to edit interface  
    router.push(`/support/ticket/${ticketId}/edit`)
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
          <h1 className="text-3xl font-bold tracking-tight">Open Tickets</h1>
          <p className="text-muted-foreground">Manage and resolve open support tickets</p>
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
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Open Tickets ({filteredTickets.length})</CardTitle>
            <CardDescription>Tickets requiring immediate attention</CardDescription>
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
                      </div>
                      <h4 className="font-medium mb-1">{ticket.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        By {ticket.user} ({ticket.email})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(ticket.createdAt).toLocaleString()}
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
            <CardTitle>Ticket Preview</CardTitle>
            <CardDescription>View ticket details</CardDescription>
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
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => handleMessage(selectedTicket.id)}>
                    Send Message
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
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {openTickets.filter(t => t.priority === 'urgent').length}
              </div>
              <p className="text-sm text-red-600">Urgent</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {openTickets.filter(t => t.priority === 'high').length}
              </div>
              <p className="text-sm text-orange-600">High Priority</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {openTickets.filter(t => t.priority === 'medium').length}
              </div>
              <p className="text-sm text-yellow-600">Medium Priority</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {openTickets.filter(t => t.priority === 'low').length}
              </div>
              <p className="text-sm text-green-600">Low Priority</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}