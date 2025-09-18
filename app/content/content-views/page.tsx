"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, TrendingDown, Eye, Clock, Users, BarChart3, Calendar, Video } from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Sample data for content views analytics
const dailyViewsData = [
  { date: "2024-01-01", views: 2345, uniqueViews: 1678, avgDuration: 18 },
  { date: "2024-01-02", views: 2876, uniqueViews: 1987, avgDuration: 22 },
  { date: "2024-01-03", views: 2134, uniqueViews: 1534, avgDuration: 16 },
  { date: "2024-01-04", views: 3456, uniqueViews: 2234, avgDuration: 25 },
  { date: "2024-01-05", views: 3987, uniqueViews: 2567, avgDuration: 28 },
  { date: "2024-01-06", views: 3234, uniqueViews: 2123, avgDuration: 24 },
  { date: "2024-01-07", views: 3567, uniqueViews: 2345, avgDuration: 26 },
]

const contentCategoryViews = [
  { category: "Mathematics", views: 12456, uniqueViews: 8765, engagement: 85 },
  { category: "Science", views: 10234, uniqueViews: 7456, engagement: 88 },
  { category: "English", views: 8765, uniqueViews: 6234, engagement: 82 },
  { category: "History", views: 6543, uniqueViews: 4567, engagement: 78 },
  { category: "Geography", views: 4321, uniqueViews: 3234, engagement: 75 },
  { category: "Art", views: 3456, uniqueViews: 2456, engagement: 80 },
]

const viewsSourceBreakdown = [
  { source: "Direct Access", views: 18456, percentage: 40.8, growth: 12.3 },
  { source: "Search Results", views: 13234, percentage: 29.3, growth: 18.7 },
  { source: "Recommendations", views: 8765, percentage: 19.4, growth: 25.4 },
  { source: "Social Sharing", views: 3234, percentage: 7.2, growth: 32.1 },
  { source: "External Links", views: 1542, percentage: 3.4, growth: 15.8 },
]

const popularContent = [
  { title: "Introduction to Algebra", views: 5678, uniqueViews: 3456, duration: "12 min", bounce: 15 },
  { title: "Water Cycle Explained", views: 4567, uniqueViews: 2987, duration: "8 min", bounce: 12 },
  { title: "World War II Timeline", views: 3987, uniqueViews: 2456, duration: "15 min", bounce: 18 },
  { title: "Photosynthesis Process", views: 3456, uniqueViews: 2234, duration: "10 min", bounce: 14 },
  { title: "Shakespeare's Plays", views: 2987, uniqueViews: 1876, duration: "20 min", bounce: 22 },
]

const hourlyViewsPattern = [
  { hour: "6", views: 234, engagement: 65 },
  { hour: "7", views: 456, engagement: 72 },
  { hour: "8", views: 789, engagement: 78 },
  { hour: "9", views: 1234, engagement: 85 },
  { hour: "10", views: 1567, engagement: 88 },
  { hour: "11", views: 1789, engagement: 90 },
  { hour: "12", views: 1456, engagement: 87 },
  { hour: "13", views: 1234, engagement: 82 },
  { hour: "14", views: 1567, engagement: 85 },
  { hour: "15", views: 1890, engagement: 92 },
  { hour: "16", views: 2123, engagement: 94 },
  { hour: "17", views: 1987, engagement: 91 },
  { hour: "18", views: 1567, engagement: 88 },
  { hour: "19", views: 1234, engagement: 82 },
  { hour: "20", views: 987, engagement: 78 },
  { hour: "21", views: 567, engagement: 72 },
  { hour: "22", views: 345, engagement: 68 },
  { hour: "23", views: 234, engagement: 64 },
]

const deviceBreakdown = [
  { device: "Desktop", views: 18567, percentage: 41.1, avgDuration: 25 },
  { device: "Mobile", views: 16234, percentage: 35.9, avgDuration: 18 },
  { device: "Tablet", views: 8765, percentage: 19.4, avgDuration: 22 },
  { device: "Other", views: 1665, percentage: 3.7, avgDuration: 15 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function ContentViewsPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("7d")
  const [viewType, setViewType] = useState("all")

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Content Views Analytics</h1>
            <p className="text-muted-foreground">Detailed analysis of content engagement and viewing patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
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
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Views</SelectItem>
              <SelectItem value="unique">Unique Views</SelectItem>
              <SelectItem value="repeat">Repeat Views</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32,567</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.4% vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg View Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22.4 min</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3.1 min vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16.8%</div>
            <div className="flex items-center text-sm text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.3% vs last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Views Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Daily Views Trend
          </CardTitle>
          <CardDescription>
            Daily content views with engagement metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyViewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value, name) => {
                  if (name === 'views') return [value, 'Total Views']
                  if (name === 'uniqueViews') return [value, 'Unique Views']
                  return [value + ' min', 'Avg Duration']
                }}
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="views" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
                name="Total Views"
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="uniqueViews" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.4}
                name="Unique Views"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="avgDuration" 
                stroke="#ffc658" 
                strokeWidth={2}
                name="Avg Duration (min)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Category Performance
            </CardTitle>
            <CardDescription>
              Views and engagement by content category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentCategoryViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="views" fill="#8884d8" name="Total Views" />
                <Bar yAxisId="right" dataKey="engagement" fill="#82ca9d" name="Engagement %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Views Source Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Traffic Sources
            </CardTitle>
            <CardDescription>
              How users are discovering your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={viewsSourceBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: any) => `${name} (${(((value || 0) / viewsSourceBreakdown.reduce((sum, item) => sum + item.views, 0)) * 100).toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="views"
                >
                  {viewsSourceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Views']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {viewsSourceBreakdown.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{source.source}</span>
                  </div>
                  <Badge variant={source.growth > 20 ? "default" : "secondary"}>
                    +{source.growth}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Most Viewed Content
          </CardTitle>
          <CardDescription>
            Top performing content based on view counts and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularContent.map((content, index) => (
              <div key={content.title} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{content.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Duration: {content.duration}</span>
                      <span>Bounce: {content.bounce}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{content.views}</div>
                  <div className="text-xs text-muted-foreground">
                    {content.uniqueViews} unique views
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity Pattern */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Hourly Activity Pattern
            </CardTitle>
            <CardDescription>
              Content viewing patterns throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={hourlyViewsPattern}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  labelFormatter={(hour) => `${hour}:00`}
                  formatter={(value, name) => [
                    name === 'views' ? value : value + '%', 
                    name === 'views' ? 'Views' : 'Engagement'
                  ]}
                />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="views" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                  name="Views"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Engagement %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Device Usage Analytics
            </CardTitle>
            <CardDescription>
              Content views across different device types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceBreakdown.map((device) => (
                <div key={device.device} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{device.device}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{device.views} views</Badge>
                      <span className="text-sm text-muted-foreground">{device.avgDuration} min avg</span>
                    </div>
                  </div>
                  <Progress value={device.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">
                    {device.percentage}% of total views
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}