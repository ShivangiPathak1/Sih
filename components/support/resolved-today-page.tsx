"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowLeft, Search, Eye, MessageSquare, Mail, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const resolvedTodayTickets = [
  {
    id: "T-003",
    title: "Billing discrepancy",
    user: "Emma Davis",
    email: "emma@example.com",
    resolvedBy: "Alex Kumar",
    priority: "high",
    category: "billing",
    createdAt: "2024-01-16T09:00:00Z",
    resolvedAt: "2024-01-16T14:30:00Z",
    resolutionTime: "5.5h",
    description: "Incorrect charges on monthly subscription"
  },
  {
    id: "T-007",
    title: "Mobile app crash",
    user: "Carlos Rodriguez",
    email: "carlos@example.com", 
    resolvedBy: "Sarah Johnson",
    priority: "medium",
    category: "technical",
    createdAt: "2024-01-16T10:45:00Z",
    resolvedAt: "2024-01-16T15:15:00Z",
    resolutionTime: "4.5h",
    description: "App crashes when accessing quiz section"
  },
  {
    id: "T-009",
    title: "Profile update issue",
    user: "Lisa Wang",
    email: "lisa@example.com",
    resolvedBy: "Mike Chen", 
    priority: "low",
    category: "account",
    createdAt: "2024-01-16T13:20:00Z",
    resolvedAt: "2024-01-16T16:00:00Z",
    resolutionTime: "2.7h",
    description: "Unable to update profile information"
  }
]

export function ResolvedTodayPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)

  const uniqueCategories = Array.from(new Set(resolvedTodayTickets.map(t => t.category)))

  const filteredTickets = resolvedTodayTickets.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handlePreview = (ticket: any) => {
    setSelectedTicket(ticket)
  }

  const handleContactUser = (email: string) => {
    window.location.href = `mailto:${email}?subject=Follow-up on resolved ticket&body=Hi,\n\nWe wanted to follow up on your recently resolved support ticket to ensure everything is working well for you.\n\nBest regards,\nSupport Team`
  }

  const handleResolve = (ticketId: string) => {
    // This would typically update the ticket status
    alert(`Ticket ${ticketId} confirmed as resolved`)
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical": return "bg-blue-100 text-blue-800"
      case "account": return "bg-purple-100 text-purple-800"
      case "billing": return "bg-green-100 text-green-800"
      case "content": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getResolutionTimeColor = (time: string) => {
    const hours = parseFloat(time)
    if (hours <= 2) return "text-green-600"
    if (hours <= 4) return "text-yellow-600"
    return "text-red-600"
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
          <h1 className="text-3xl font-bold tracking-tight">Resolved Today</h1>
          <p className="text-muted-foreground">Tickets resolved in the last 24 hours</p>
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
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {uniqueCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resolved Tickets ({filteredTickets.length})</CardTitle>
            <CardDescription>Successfully resolved tickets today</CardDescription>
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
                        <Badge className={getCategoryColor(ticket.category)}>
                          {ticket.category}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolved
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{ticket.title}</h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        By {ticket.user} ({ticket.email})
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        Resolved by: {ticket.resolvedBy}
                      </p>
                      <p className={`text-xs font-medium ${getResolutionTimeColor(ticket.resolutionTime)}`}>
                        Resolution time: {ticket.resolutionTime}
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
                        onClick={() => handleContactUser(ticket.email)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolve(ticket.id)}
                      >
                        <Check className="h-4 w-4" />
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
            <CardTitle>Resolution Details</CardTitle>
            <CardDescription>View resolved ticket details</CardDescription>
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
                    <Badge className={getCategoryColor(selectedTicket.category)}>
                      {selectedTicket.category}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2">Resolution Summary</h5>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Successfully Resolved</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Resolved by {selectedTicket.resolvedBy} in {selectedTicket.resolutionTime}
                    </p>
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
                    Resolved: {new Date(selectedTicket.resolvedAt).toLocaleString()}
                  </p>
                  <p className={`text-sm font-medium ${getResolutionTimeColor(selectedTicket.resolutionTime)}`}>
                    Total time: {selectedTicket.resolutionTime}
                  </p>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => handleContactUser(selectedTicket.email)}>
                    Follow Up
                  </Button>
                  <Button variant="outline" onClick={() => handleResolve(selectedTicket.id)}>
                    Confirm Resolution
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
          <CardTitle>Today's Resolution Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredTickets.length}
              </div>
              <p className="text-sm text-green-600">Total Resolved</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(filteredTickets.reduce((acc, ticket) => acc + parseFloat(ticket.resolutionTime), 0) / filteredTickets.length * 10) / 10}h
              </div>
              <p className="text-sm text-blue-600">Avg Resolution Time</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {filteredTickets.filter(t => parseFloat(t.resolutionTime) <= 4).length}
              </div>
              <p className="text-sm text-purple-600">Quick Resolutions</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round((filteredTickets.length / (filteredTickets.length + 2)) * 100)}%
              </div>
              <p className="text-sm text-orange-600">Resolution Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from(new Set(filteredTickets.map(t => t.resolvedBy))).map((agent, index) => {
              const agentTickets = filteredTickets.filter(t => t.resolvedBy === agent)
              const avgTime = agentTickets.reduce((acc, t) => acc + parseFloat(t.resolutionTime), 0) / agentTickets.length
              return (
                <div key={agent} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{agent}</div>
                      <div className="text-sm text-muted-foreground">{agentTickets.length} tickets resolved</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{Math.round(avgTime * 10) / 10}h</div>
                    <div className="text-sm text-muted-foreground">Avg time</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}