"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Check, Trash2, Settings, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  category: "system" | "user" | "content" | "security"
  read: boolean
  timestamp: string
  sender?: {
    name: string
    avatar?: string
  }
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New User Registration",
    message: "John Doe has registered as a new student",
    type: "info",
    category: "user",
    read: false,
    timestamp: "2024-01-15T10:30:00Z",
    sender: {
      name: "System",
    },
    actionUrl: "/admin/users/new-registrations"
  },
  {
    id: "2",
    title: "Content Approval Required",
    message: "Mathematics Quiz #45 is awaiting approval",
    type: "warning",
    category: "content",
    read: false,
    timestamp: "2024-01-15T09:15:00Z",
    sender: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    actionUrl: "/admin/content/pending-approvals"
  },
  {
    id: "3",
    title: "Security Alert",
    message: "Multiple failed login attempts detected",
    type: "error",
    category: "security",
    read: true,
    timestamp: "2024-01-14T16:45:00Z",
    sender: {
      name: "Security System",
    },
    actionUrl: "/admin/security/alerts"
  },
  {
    id: "4",
    title: "System Maintenance Complete",
    message: "Scheduled maintenance has been completed successfully",
    type: "success",
    category: "system",
    read: true,
    timestamp: "2024-01-14T14:20:00Z",
    sender: {
      name: "System",
    },
    actionUrl: "/admin/system/maintenance"
  },
  {
    id: "5",
    title: "Support Ticket Created",
    message: "New high priority support ticket requires attention",
    type: "warning",
    category: "user",
    read: false,
    timestamp: "2024-01-15T11:00:00Z",
    sender: {
      name: "Support System",
    },
    actionUrl: "/support/tickets/high-priority"
  },
  {
    id: "6",
    title: "Analytics Report Ready",
    message: "Monthly performance report is now available",
    type: "info", 
    category: "system",
    read: false,
    timestamp: "2024-01-15T08:30:00Z",
    sender: {
      name: "Analytics System",
    },
    actionUrl: "/admin/analytics/monthly-reports"
  }
]

export function Notifications() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [readFilter, setReadFilter] = useState<string>("all")

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesCategory = categoryFilter === "all" || notification.category === categoryFilter
    const matchesRead =
      readFilter === "all" ||
      (readFilter === "read" && notification.read) ||
      (readFilter === "unread" && !notification.read)
    return matchesSearch && matchesType && matchesCategory && matchesRead
  })

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    if (!notification.read) {
      markAsRead([notification.id])
    }
    
    // Navigate to appropriate page based on category or actionUrl
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    } else {
      // Default navigation based on category
      switch (notification.category) {
        case "user":
          router.push("/admin/users")
          break
        case "content":
          router.push("/admin/content")
          break
        case "security":
          router.push("/admin/security")
          break
        case "system":
          router.push("/admin/system")
          break
        default:
          router.push("/admin/dashboard")
      }
    }
  }

  const markAsRead = (notificationIds: string[]) => {
    console.log("[v0] Marking notifications as read:", notificationIds)
    setNotifications((prev) =>
      prev.map((notification) =>
        notificationIds.includes(notification.id) ? { ...notification, read: true } : notification,
      ),
    )
  }

  const markAsUnread = (notificationIds: string[]) => {
    console.log("[v0] Marking notifications as unread:", notificationIds)
    setNotifications((prev) =>
      prev.map((notification) =>
        notificationIds.includes(notification.id) ? { ...notification, read: false } : notification,
      ),
    )
  }

  const deleteNotifications = (notificationIds: string[]) => {
    console.log("[v0] Deleting notifications:", notificationIds)
    setNotifications((prev) => prev.filter((notification) => !notificationIds.includes(notification.id)))
    setSelectedNotifications([])
  }

  const markAllAsRead = () => {
    console.log("[v0] Marking all notifications as read")
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "error":
        return "destructive"
      case "warning":
        return "default"
      case "success":
        return "default"
      default:
        return "secondary"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "security":
        return "🔒"
      case "user":
        return "👤"
      case "content":
        return "📄"
      case "system":
        return "⚙️"
      default:
        return "📢"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">Manage your notifications and alerts ({unreadCount} unread)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
              <Select value={readFilter} onValueChange={setReadFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedNotifications.length} notification(s) selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => markAsRead(selectedNotifications)}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark Read
                </Button>
                <Button size="sm" variant="outline" onClick={() => markAsUnread(selectedNotifications)}>
                  <Bell className="h-4 w-4 mr-2" />
                  Mark Unread
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteNotifications(selectedNotifications)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications ({filteredNotifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                  !notification.read ? "bg-blue-50 border-blue-200 hover:bg-blue-100" : "hover:bg-muted/50"
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedNotifications.includes(notification.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedNotifications((prev) => [...prev, notification.id])
                      } else {
                        setSelectedNotifications((prev) => prev.filter((id) => id !== notification.id))
                      }
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent notification click when clicking checkbox
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getCategoryIcon(notification.category)}</span>
                          <h4 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {notification.sender && (
                            <div className="flex items-center gap-1">
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={notification.sender.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{notification.sender.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{notification.sender.name}</span>
                            </div>
                          )}
                          <span>•</span>
                          <span>{new Date(notification.timestamp).toLocaleString()}</span>
                          {notification.actionUrl && (
                            <>
                              <span>•</span>
                              <span className="text-blue-600">Click to view details</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant={getTypeColor(notification.type) as any}>{notification.type}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => e.stopPropagation()} // Prevent notification click when clicking dropdown
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                notification.read ? markAsUnread([notification.id]) : markAsRead([notification.id])
                              }}
                            >
                              {notification.read ? "Mark as Unread" : "Mark as Read"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotifications([notification.id])
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                            {notification.actionUrl && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleNotificationClick(notification)
                                }}
                              >
                                Go to Details
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No notifications found matching your filters</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
