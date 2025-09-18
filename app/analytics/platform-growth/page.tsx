"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, TrendingDown, Users, BookOpen, BarChart3, Calendar, Target, Globe, Zap } from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Sample data for platform growth analytics
const monthlyGrowthData = [
  { month: "Jul 2023", users: 1245, content: 156, engagement: 78, retention: 65 },
  { month: "Aug 2023", users: 1456, content: 189, engagement: 82, retention: 68 },
  { month: "Sep 2023", users: 1723, content: 234, engagement: 85, retention: 72 },
  { month: "Oct 2023", users: 2012, content: 289, engagement: 88, retention: 75 },
  { month: "Nov 2023", users: 2345, content: 345, engagement: 90, retention: 78 },
  { month: "Dec 2023", users: 2698, content: 412, engagement: 92, retention: 81 },
  { month: "Jan 2024", users: 3124, content: 489, engagement: 94, retention: 84 },
]

const userAcquisitionChannels = [
  { channel: "Organic Search", users: 1456, percentage: 42, growth: 15.2 },
  { channel: "Social Media", users: 987, percentage: 28, growth: 23.5 },
  { channel: "Referrals", users: 654, percentage: 19, growth: 8.7 },
  { channel: "Direct", users: 289, percentage: 8, growth: 5.3 },
  { channel: "Paid Ads", users: 134, percentage: 4, growth: 45.6 },
]

const retentionCohorts = [
  { cohort: "Jan 2024", week1: 100, week2: 78, week3: 65, week4: 58, week8: 45, week12: 38 },
  { cohort: "Dec 2023", week1: 100, week2: 82, week3: 69, week4: 62, week8: 48, week12: 41 },
  { cohort: "Nov 2023", week1: 100, week2: 75, week3: 62, week4: 55, week8: 42, week12: 35 },
  { cohort: "Oct 2023", week1: 100, week2: 73, week3: 59, week4: 52, week8: 39, week12: 32 },
]

const geographicDistribution = [
  { region: "North America", users: 1245, percentage: 35, growth: 12.3 },
  { region: "Europe", users: 1098, percentage: 31, growth: 18.7 },
  { region: "Asia Pacific", users: 789, percentage: 22, growth: 25.4 },
  { region: "Latin America", users: 287, percentage: 8, growth: 32.1 },
  { region: "Africa", users: 145, percentage: 4, growth: 45.8 },
]

const contentGrowthMetrics = [
  { type: "Lessons", current: 1456, target: 1500, growth: 23.5 },
  { type: "Quizzes", current: 789, target: 800, growth: 18.2 },
  { type: "Games", current: 234, target: 300, growth: 45.6 },
  { type: "Videos", current: 567, target: 600, growth: 12.8 },
  { type: "Worksheets", current: 890, target: 950, growth: 15.4 },
]

const kpiMetrics = [
  { 
    name: "User Growth Rate",
    current: 15.8,
    target: 12.0,
    unit: "%",
    trend: "up",
    description: "Monthly user acquisition rate"
  },
  { 
    name: "Content Creation Rate",
    current: 45,
    target: 40,
    unit: "items/month",
    trend: "up",
    description: "New content items added monthly"
  },
  { 
    name: "Engagement Score",
    current: 94.2,
    target: 90.0,
    unit: "%",
    trend: "up",
    description: "Overall user engagement rating"
  },
  { 
    name: "Retention Rate",
    current: 84.3,
    target: 80.0,
    unit: "%",
    trend: "up",
    description: "30-day user retention rate"
  },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function PlatformGrowthPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("6m")
  const [metricType, setMetricType] = useState("users")

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
            <h1 className="text-3xl font-bold">Platform Growth Analytics</h1>
            <p className="text-muted-foreground">Comprehensive analysis of platform expansion, user acquisition, and content growth</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="2y">Last 2 years</SelectItem>
            </SelectContent>
          </Select>
          <Select value={metricType} onValueChange={setMetricType}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="retention">Retention</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((kpi) => (
          <Card key={kpi.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpi.current}
                <span className="text-lg text-muted-foreground ml-1">{kpi.unit}</span>
              </div>
              <div className={`flex items-center text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {kpi.current > kpi.target ? '+' : ''}{(kpi.current - kpi.target).toFixed(1)}{kpi.unit} vs target
              </div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Growth Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Monthly Growth Trends
          </CardTitle>
          <CardDescription>
            Platform expansion across users, content, engagement, and retention metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="users" 
                stroke="#8884d8" 
                strokeWidth={3}
                name="Total Users"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="content" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Content Items"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="engagement" 
                stroke="#ffc658" 
                strokeWidth={2}
                name="Engagement Score"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="retention" 
                stroke="#ff7300" 
                strokeWidth={2}
                name="Retention Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Acquisition Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Acquisition Channels
            </CardTitle>
            <CardDescription>
              How new users are discovering and joining the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userAcquisitionChannels}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: any) => `${name} (${(((value || 0) / userAcquisitionChannels.reduce((sum, item) => sum + item.users, 0)) * 100).toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="users"
                >
                  {userAcquisitionChannels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Users']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {userAcquisitionChannels.map((channel, index) => (
                <div key={channel.channel} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{channel.channel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{channel.users} users</Badge>
                    <Badge variant={channel.growth > 15 ? "default" : "outline"}>
                      +{channel.growth}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Geographic User Distribution
            </CardTitle>
            <CardDescription>
              Platform reach across different global regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geographicDistribution.map((region, index) => (
                <div key={region.region} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{region.region}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{region.users} users</Badge>
                      <Badge variant={region.growth > 20 ? "default" : "secondary"}>
                        +{region.growth}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={region.percentage} className="h-2" />
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Growth Insights</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Fastest growing regions: Africa (+45.8%), Latin America (+32.1%), and Asia Pacific (+25.4%)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Growth Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Content Growth Progress
          </CardTitle>
          <CardDescription>
            Progress towards content creation targets across different content types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentGrowthMetrics.map((content) => (
              <div key={content.type} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{content.type}</h4>
                  <Badge variant={content.current >= content.target ? "default" : "outline"}>
                    {((content.current / content.target) * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Current: {content.current}</span>
                    <span>Target: {content.target}</span>
                  </div>
                  <Progress value={(content.current / content.target) * 100} className="h-2" />
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    +{content.growth}% growth
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Retention Cohort Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            User Retention Cohort Analysis
          </CardTitle>
          <CardDescription>
            How user retention changes over time for different user cohorts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={retentionCohorts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cohort" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [value + '%', 'Retention']} />
              <Legend />
              <Line type="monotone" dataKey="week1" stroke="#8884d8" name="Week 1" />
              <Line type="monotone" dataKey="week2" stroke="#82ca9d" name="Week 2" />
              <Line type="monotone" dataKey="week4" stroke="#ffc658" name="Week 4" />
              <Line type="monotone" dataKey="week8" stroke="#ff7300" name="Week 8" />
              <Line type="monotone" dataKey="week12" stroke="#8dd1e1" name="Week 12" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold">100%</div>
              <div className="text-xs text-muted-foreground">Week 1</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">78%</div>
              <div className="text-xs text-muted-foreground">Week 2</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">58%</div>
              <div className="text-xs text-muted-foreground">Week 4</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">45%</div>
              <div className="text-xs text-muted-foreground">Week 8</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">38%</div>
              <div className="text-xs text-muted-foreground">Week 12</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}