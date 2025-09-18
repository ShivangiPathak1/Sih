"use client"

import { useState } from "react"
import { ArrowLeft, School, TrendingUp, TrendingDown, Filter, Download, Building, MapPin, Wifi } from "lucide-react"
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

const infrastructureData = [
  { month: "Jan", newSchools: 15, renovated: 45, totalActive: 8950 },
  { month: "Feb", newSchools: 18, renovated: 52, totalActive: 8968 },
  { month: "Mar", newSchools: 22, renovated: 38, totalActive: 8990 },
  { month: "Apr", newSchools: 12, renovated: 61, totalActive: 9002 },
  { month: "May", newSchools: 25, renovated: 48, totalActive: 9027 },
  { month: "Jun", newSchools: 19, renovated: 55, totalActive: 9046 },
]

const schoolTypes = [
  { type: "Primary Schools", count: 4520, percentage: 50.0 },
  { type: "Secondary Schools", count: 2260, percentage: 25.0 },
  { type: "Higher Secondary", count: 1356, percentage: 15.0 },
  { type: "Combined Schools", count: 678, percentage: 7.5 },
  { type: "Special Schools", count: 226, percentage: 2.5 },
]

const infrastructureMetrics = [
  { metric: "Electricity Access", value: 94, target: 100, status: "below" },
  { metric: "Internet Connectivity", value: 78, target: 85, status: "below" },
  { metric: "Safe Water Supply", value: 92, target: 95, status: "below" },
  { metric: "Proper Sanitation", value: 88, target: 90, status: "below" },
]

const facilityData = [
  { facility: "Library", available: 7200, percentage: 79.6 },
  { facility: "Computer Lab", available: 6500, percentage: 71.9 },
  { facility: "Science Lab", available: 5800, percentage: 64.1 },
  { facility: "Sports Ground", available: 7800, percentage: 86.2 },
  { facility: "Auditorium", available: 3200, percentage: 35.4 },
  { facility: "Medical Room", available: 4100, percentage: 45.3 },
]

const locationDistribution = [
  { name: "Urban", schools: 3600, percentage: 39.8 },
  { name: "Semi-Urban", schools: 2700, percentage: 29.8 },
  { name: "Rural", schools: 2746, percentage: 30.4 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function SchoolsDetail() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("6months")
  const [schoolType, setSchoolType] = useState("all")
  const [location, setLocation] = useState("all")

  const handleExport = () => {
    console.log("Exporting schools data...")
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
            <h1 className="text-3xl font-bold tracking-tight">Schools Overview</h1>
            <p className="text-muted-foreground">Comprehensive school infrastructure and facility analytics</p>
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
              <label className="text-sm font-medium mb-2 block">School Type</label>
              <Select value={schoolType} onValueChange={setSchoolType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="higher">Higher Secondary</SelectItem>
                  <SelectItem value="combined">Combined</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="urban">Urban</SelectItem>
                  <SelectItem value="semi-urban">Semi-Urban</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
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
                <School className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Schools</p>
                <p className="text-2xl font-bold">9,046</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +1.1% from last month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Building className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Schools</p>
                <p className="text-2xl font-bold">19</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  This month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Renovated</p>
                <p className="text-2xl font-bold">55</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Infrastructure improved
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Wifi className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Digital Ready</p>
                <p className="text-2xl font-bold">78%</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% improvement
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="infrastructure" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="types">School Types</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="infrastructure" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>School Development Trends</CardTitle>
                <CardDescription>Monthly new schools and renovation data</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={infrastructureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="totalActive" stroke="#3b82f6" name="Total Active" />
                    <Line type="monotone" dataKey="newSchools" stroke="#10b981" name="New Schools" />
                    <Line type="monotone" dataKey="renovated" stroke="#f59e0b" name="Renovated" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Quality Metrics</CardTitle>
                <CardDescription>Basic infrastructure availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {infrastructureMetrics.map((metric) => (
                    <div key={metric.metric} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <Badge variant={metric.status === "above" ? "default" : "secondary"}>
                          {metric.value}%
                        </Badge>
                      </div>
                      <Progress value={metric.value} className="w-full" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current: {metric.value}%</span>
                        <span>Target: {metric.target}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Schools by Type</CardTitle>
                <CardDescription>Distribution by educational level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={schoolTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {schoolTypes.map((entry, index) => (
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
                <CardTitle>School Type Breakdown</CardTitle>
                <CardDescription>Detailed statistics by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schoolTypes.map((type, index) => (
                    <div key={type.type} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <div>
                          <p className="font-medium">{type.type}</p>
                          <p className="text-sm text-muted-foreground">{type.percentage}% of total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{type.count.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">schools</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Facility Availability</CardTitle>
                <CardDescription>Essential facilities across schools</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={facilityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="facility" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="available" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Facility Coverage</CardTitle>
                <CardDescription>Percentage coverage by facility type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {facilityData.map((facility, index) => (
                    <div key={facility.facility} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{facility.facility}</span>
                        <span className="text-sm text-muted-foreground">{facility.percentage}%</span>
                      </div>
                      <Progress value={facility.percentage} className="w-full" />
                      <div className="text-xs text-muted-foreground">
                        {facility.available.toLocaleString()} out of 9,046 schools
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Schools by Location</CardTitle>
                <CardDescription>Geographic distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={locationDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="schools"
                    >
                      {locationDistribution.map((entry, index) => (
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
                <CardTitle>Location-wise Distribution</CardTitle>
                <CardDescription>Schools by geographic area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locationDistribution.map((location, index) => (
                    <div key={location.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <div>
                          <p className="font-medium">{location.name} Areas</p>
                          <p className="text-sm text-muted-foreground">{location.percentage}% of total schools</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{location.schools.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">schools</p>
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