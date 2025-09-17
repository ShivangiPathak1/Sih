"use client"

import { useState } from "react"
import { ArrowLeft, Smartphone, TrendingUp, TrendingDown, Filter, Download, Laptop, Tablet, Monitor } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { useRouter } from "next/navigation"

const adoptionTrends = [
  { month: "Jan", overall: 76, students: 82, teachers: 71, schools: 65 },
  { month: "Feb", overall: 78, students: 84, teachers: 73, schools: 68 },
  { month: "Mar", overall: 81, students: 86, teachers: 76, schools: 72 },
  { month: "Apr", overall: 83, students: 88, teachers: 78, schools: 75 },
  { month: "May", overall: 85, students: 90, teachers: 81, schools: 78 },
  { month: "Jun", overall: 87, students: 92, teachers: 83, schools: 81 },
]

const deviceUsage = [
  { device: "Smartphones", users: 128500, percentage: 68.2 },
  { device: "Tablets", users: 45200, percentage: 24.0 },
  { device: "Laptops/PCs", users: 32800, percentage: 17.4 },
  { device: "Smart TVs", users: 18600, percentage: 9.9 },
]

const platformUsage = [
  { platform: "Mobile Apps", usage: 89, growth: 12.5 },
  { platform: "Web Portal", usage: 76, growth: 8.2 },
  { platform: "Desktop Software", usage: 45, growth: -3.1 },
  { platform: "Smart TV Apps", usage: 23, growth: 18.7 },
]

const digitalSkills = [
  { skill: "Basic Navigation", level: 92, target: 95 },
  { skill: "Content Creation", level: 67, target: 75 },
  { skill: "Online Communication", level: 84, target: 85 },
  { skill: "Digital Assessment", level: 71, target: 80 },
  { skill: "Data Privacy Awareness", level: 58, target: 70 },
]

const ageGroupAdoption = [
  { ageGroup: "6-10 years", adoption: 85, engagement: 4.2 },
  { ageGroup: "11-15 years", adoption: 94, engagement: 5.8 },
  { ageGroup: "16-18 years", adoption: 96, engagement: 6.5 },
  { ageGroup: "Teachers <30", adoption: 91, engagement: 5.1 },
  { ageGroup: "Teachers 30-45", adoption: 78, engagement: 3.9 },
  { ageGroup: "Teachers >45", adoption: 62, engagement: 2.8 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function DigitalAdoptionDetail() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("6months")
  const [userType, setUserType] = useState("all")
  const [region, setRegion] = useState("all")

  const handleExport = () => {
    console.log("Exporting digital adoption data...")
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Digital Adoption Overview</h1>
            <p className="text-muted-foreground">Comprehensive digital technology adoption and usage analytics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Data Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">User Type</label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="teachers">Teachers</SelectItem>
                  <SelectItem value="schools">Schools</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Region</label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="urban">Urban</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                  <SelectItem value="semi-urban">Semi-Urban</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Adoption</p>
                <p className="text-2xl font-bold">87%</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2% from last month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Monitor className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">188.3K</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Daily active users
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Tablet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Digital Content Usage</p>
                <p className="text-2xl font-bold">94%</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Content engagement
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Laptop className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Digital Skills Score</p>
                <p className="text-2xl font-bold">74/100</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +6 points improvement
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Adoption Trends</TabsTrigger>
          <TabsTrigger value="devices">Device Usage</TabsTrigger>
          <TabsTrigger value="skills">Digital Skills</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Digital Adoption Trends</CardTitle>
                <CardDescription>Monthly adoption rates by user type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={adoptionTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="overall" stroke="#3b82f6" name="Overall" strokeWidth={2} />
                    <Line type="monotone" dataKey="students" stroke="#10b981" name="Students" />
                    <Line type="monotone" dataKey="teachers" stroke="#f59e0b" name="Teachers" />
                    <Line type="monotone" dataKey="schools" stroke="#ef4444" name="Schools" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Usage Growth</CardTitle>
                <CardDescription>Usage and growth rates by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformUsage.map((platform, index) => (
                    <div key={platform.platform} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{platform.platform}</p>
                        <p className="text-sm text-muted-foreground">{platform.usage}% adoption rate</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={platform.growth > 0 ? "default" : "secondary"}>
                          {platform.growth > 0 ? "+" : ""}{platform.growth}%
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">growth</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Usage Distribution</CardTitle>
                <CardDescription>Primary devices used for digital learning</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceUsage}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="users"
                    >
                      {deviceUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Usage Statistics</CardTitle>
                <CardDescription>Detailed breakdown by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceUsage.map((device, index) => (
                    <div key={device.device} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <div>
                          <p className="font-medium">{device.device}</p>
                          <p className="text-sm text-muted-foreground">{device.percentage}% usage rate</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{device.users.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">active users</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Digital Skills Assessment</CardTitle>
                <CardDescription>Current proficiency levels vs targets</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={digitalSkills}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="level" fill="#3b82f6" name="Current Level" />
                    <Bar dataKey="target" fill="#10b981" opacity={0.7} name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills Gap Analysis</CardTitle>
                <CardDescription>Progress towards digital literacy targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {digitalSkills.map((skill) => (
                    <div key={skill.skill} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{skill.skill}</span>
                        <Badge variant={skill.level >= skill.target ? "default" : "secondary"}>
                          {skill.level}% / {skill.target}%
                        </Badge>
                      </div>
                      <Progress value={(skill.level / skill.target) * 100} className="w-full" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Gap: {skill.target - skill.level} points</span>
                        <span>{skill.level >= skill.target ? "Target Met" : "Needs Improvement"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Adoption by Age Group</CardTitle>
                <CardDescription>Digital adoption rates across different age groups</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ageGroupAdoption}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageGroup" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="adoption" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Daily usage hours by age group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ageGroupAdoption.map((group, index) => (
                    <div key={group.ageGroup} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-blue-500" />
                        <div>
                          <p className="font-medium">{group.ageGroup}</p>
                          <p className="text-sm text-muted-foreground">{group.adoption}% adoption</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{group.engagement}h</p>
                        <p className="text-xs text-muted-foreground">daily usage</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}