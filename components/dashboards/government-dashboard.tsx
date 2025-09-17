"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language/language-provider"
import { FirebaseAnalyticsDashboard } from "@/components/analytics/firebase-analytics-dashboard"
import { RealTimeDashboard } from "@/components/analytics/real-time-dashboard"
import {
  Building2,
  Users,
  MapPin,
  School,
  GraduationCap,
  Download,
  Filter,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Eye,
  Settings,
  LogOut,
  FileSpreadsheet,
  FileText,
  Image,
  Activity,
  BarChart3,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface StateData {
  name: string
  students: number
  teachers: number
  schools: number
  performance: number
  digitalAdoption: number
  budget: number
  region: "north" | "south" | "east" | "west" | "central"
}

const stateData: StateData[] = [
  {
    name: "Maharashtra",
    students: 125000,
    teachers: 8500,
    schools: 1200,
    performance: 87,
    digitalAdoption: 92,
    budget: 450,
    region: "west",
  },
  {
    name: "Uttar Pradesh",
    students: 180000,
    teachers: 12000,
    schools: 1800,
    performance: 78,
    digitalAdoption: 76,
    budget: 520,
    region: "north",
  },
  {
    name: "Tamil Nadu",
    students: 95000,
    teachers: 6800,
    schools: 950,
    performance: 91,
    digitalAdoption: 89,
    budget: 380,
    region: "south",
  },
  {
    name: "Karnataka",
    students: 88000,
    teachers: 6200,
    schools: 850,
    performance: 85,
    digitalAdoption: 88,
    budget: 340,
    region: "south",
  },
  {
    name: "Gujarat",
    students: 72000,
    teachers: 5100,
    schools: 720,
    performance: 83,
    digitalAdoption: 85,
    budget: 290,
    region: "west",
  },
  {
    name: "West Bengal",
    students: 98000,
    teachers: 7200,
    schools: 980,
    performance: 80,
    digitalAdoption: 82,
    budget: 350,
    region: "east",
  },
  {
    name: "Rajasthan",
    students: 85000,
    teachers: 6000,
    schools: 800,
    performance: 76,
    digitalAdoption: 79,
    budget: 320,
    region: "north",
  },
  {
    name: "Madhya Pradesh",
    students: 92000,
    teachers: 6800,
    schools: 900,
    performance: 74,
    digitalAdoption: 77,
    budget: 310,
    region: "central",
  },
]

const performanceData = [
  { month: "Jan", national: 78, target: 85, engagement: 82 },
  { month: "Feb", national: 80, target: 85, engagement: 84 },
  { month: "Mar", national: 82, target: 85, engagement: 86 },
  { month: "Apr", national: 84, target: 85, engagement: 88 },
  { month: "May", national: 86, target: 85, engagement: 90 },
  { month: "Jun", national: 87, target: 85, engagement: 91 },
]

const budgetData = [
  { category: "Infrastructure", allocated: 1200, spent: 980, percentage: 82 },
  { category: "Teacher Training", allocated: 800, spent: 720, percentage: 90 },
  { category: "Digital Resources", allocated: 600, spent: 540, percentage: 90 },
  { category: "Student Support", allocated: 400, spent: 350, percentage: 88 },
  { category: "Technology", allocated: 500, spent: 420, percentage: 84 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function GovernmentDashboard() {
  const [selectedState, setSelectedState] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("6months")
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()

  const filteredStates = stateData.filter((state) => {
    if (selectedState !== "all" && state.name !== selectedState) return false
    if (selectedRegion !== "all" && state.region !== selectedRegion) return false
    return true
  })

  const totalStats = {
    students: filteredStates.reduce((sum, state) => sum + state.students, 0),
    teachers: filteredStates.reduce((sum, state) => sum + state.teachers, 0),
    schools: filteredStates.reduce((sum, state) => sum + state.schools, 0),
    avgPerformance: Math.round(
      filteredStates.reduce((sum, state) => sum + state.performance, 0) / filteredStates.length,
    ),
    avgDigitalAdoption: Math.round(
      filteredStates.reduce((sum, state) => sum + state.digitalAdoption, 0) / filteredStates.length,
    ),
    totalBudget: filteredStates.reduce((sum, state) => sum + state.budget, 0),
  }

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    toast({
      title: "Export Started",
      description: `Generating ${format.toUpperCase()} report...`,
    })
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Government education report exported as ${format.toUpperCase()}`,
      })
      setShowExportDialog(false)
    }, 2000)
  }

  const handleLogout = () => {
    toast({
      title: "Logging out...",
      description: "You have been successfully logged out.",
    })
    // Add actual logout logic here
    router.push('/login')
  }

  const navigateToDetail = (type: string) => {
    router.push(`/government/${type}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Government Education Dashboard</h1>
          <p className="text-muted-foreground">National education platform oversight and policy insights</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Government Report</DialogTitle>
                <DialogDescription>
                  Choose the format to export your government education dashboard report.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-3 pt-4">
                <Button
                  onClick={() => handleExport('csv')}
                  variant="outline"
                  className="justify-start"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <Button
                  onClick={() => handleExport('excel')}
                  variant="outline"
                  className="justify-start"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as Excel
                </Button>
                <Button
                  onClick={() => handleExport('pdf')}
                  variant="outline"
                  className="justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dashboard Configuration</DialogTitle>
                <DialogDescription>
                  Customize your government dashboard settings and preferences.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium">Refresh Interval</label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Default View</label>
                  <Select defaultValue="overview">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">National Overview</SelectItem>
                      <SelectItem value="states">State Analysis</SelectItem>
                      <SelectItem value="performance">Performance Metrics</SelectItem>
                      <SelectItem value="budget">Budget & Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => {
                    toast({
                      title: "Settings Saved",
                      description: "Your dashboard configuration has been updated.",
                    })
                    setShowConfigDialog(false)
                  }}
                  className="w-full"
                >
                  Save Configuration
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">State/UT</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {stateData.map((state) => (
                    <SelectItem key={state.name} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                  <SelectItem value="central">Central</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <div className="flex items-end">
              <Button variant="outline" className="w-full bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigateToDetail('students')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-xl font-bold">{(totalStats.students / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigateToDetail('teachers')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <GraduationCap className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teachers</p>
                <p className="text-xl font-bold">{(totalStats.teachers / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigateToDetail('schools')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-lg">
                <School className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Schools</p>
                <p className="text-xl font-bold">{(totalStats.schools / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-chart-1/10 p-2 rounded-lg">
                <Target className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Performance</p>
                <p className="text-xl font-bold">{totalStats.avgPerformance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigateToDetail('digital-adoption')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-chart-2/10 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Digital Adoption</p>
                <p className="text-xl font-bold">{totalStats.avgDigitalAdoption}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigateToDetail('budget')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-chart-3/10 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget (Cr)</p>
                <p className="text-xl font-bold">₹{totalStats.totalBudget}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">National Overview</TabsTrigger>
          <TabsTrigger value="states">State Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="budget">Budget & Resources</TabsTrigger>
          <TabsTrigger value="policy">Policy Insights</TabsTrigger>
          <TabsTrigger value="analytics">
            <Activity className="h-4 w-4 mr-1" />
            Firebase Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>National Performance Trends</CardTitle>
                <CardDescription>Educational outcomes over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="national" stroke="#3b82f6" name="National Avg" />
                    <Line type="monotone" dataKey="target" stroke="#ef4444" name="Target" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="engagement" stroke="#10b981" name="Engagement" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Students by region</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "North",
                          value: stateData.filter((s) => s.region === "north").reduce((sum, s) => sum + s.students, 0),
                        },
                        {
                          name: "South",
                          value: stateData.filter((s) => s.region === "south").reduce((sum, s) => sum + s.students, 0),
                        },
                        {
                          name: "West",
                          value: stateData.filter((s) => s.region === "west").reduce((sum, s) => sum + s.students, 0),
                        },
                        {
                          name: "East",
                          value: stateData.filter((s) => s.region === "east").reduce((sum, s) => sum + s.students, 0),
                        },
                        {
                          name: "Central",
                          value: stateData
                            .filter((s) => s.region === "central")
                            .reduce((sum, s) => sum + s.students, 0),
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Initiatives */}
          <Card>
            <CardHeader>
              <CardTitle>Key Government Initiatives</CardTitle>
              <CardDescription>Current education policy implementations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Digital India Education",
                    description: "Nationwide digital infrastructure development",
                    progress: 78,
                    status: "on-track",
                    budget: "₹2,500 Cr",
                    timeline: "Dec 2024",
                  },
                  {
                    title: "Teacher Training Program",
                    description: "Comprehensive teacher skill development",
                    progress: 65,
                    status: "on-track",
                    budget: "₹1,800 Cr",
                    timeline: "Mar 2025",
                  },
                  {
                    title: "Rural Education Access",
                    description: "Expanding education to remote areas",
                    progress: 45,
                    status: "delayed",
                    budget: "₹3,200 Cr",
                    timeline: "Jun 2025",
                  },
                ].map((initiative, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{initiative.title}</h4>
                      <Badge variant={initiative.status === "on-track" ? "default" : "secondary"}>
                        {initiative.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{initiative.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{initiative.progress}%</span>
                      </div>
                      <Progress value={initiative.progress} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Budget: {initiative.budget}</span>
                        <span>Target: {initiative.timeline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="states" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>State-wise Performance Analysis</CardTitle>
              <CardDescription>Detailed breakdown by state and union territory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStates.map((state, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{state.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{state.region} Region</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Students</p>
                        <p className="font-bold">{(state.students / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Teachers</p>
                        <p className="font-bold">{(state.teachers / 1000).toFixed(1)}K</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Schools</p>
                        <p className="font-bold">{state.schools}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Performance</p>
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{state.performance}%</p>
                          <Badge
                            variant={
                              state.performance >= 85
                                ? "default"
                                : state.performance >= 75
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {state.performance >= 85
                              ? "Excellent"
                              : state.performance >= 75
                                ? "Good"
                                : "Needs Improvement"}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Digital Adoption</p>
                        <p className="font-bold">{state.digitalAdoption}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="font-bold">₹{state.budget}Cr</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Benchmarks</CardTitle>
                <CardDescription>National vs state performance comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stateData.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#3b82f6" name="Performance %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Digital Adoption Rates</CardTitle>
                <CardDescription>Technology integration across states</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stateData.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="digitalAdoption" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Alerts & Recommendations</CardTitle>
              <CardDescription>AI-powered insights and policy recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  type: "alert",
                  title: "Low Performance Alert",
                  message: "Madhya Pradesh showing 15% decline in mathematics scores",
                  recommendation: "Recommend additional teacher training and resource allocation",
                  priority: "high",
                  states: ["Madhya Pradesh"],
                },
                {
                  type: "opportunity",
                  title: "Digital Adoption Success",
                  message: "Maharashtra achieving 92% digital adoption rate",
                  recommendation: "Replicate successful strategies in other western states",
                  priority: "medium",
                  states: ["Maharashtra"],
                },
                {
                  type: "trend",
                  title: "Regional Disparity",
                  message: "North-South performance gap widening by 8%",
                  recommendation: "Implement targeted intervention programs for northern states",
                  priority: "high",
                  states: ["Uttar Pradesh", "Rajasthan"],
                },
              ].map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.priority === "high"
                        ? "bg-red-500"
                        : alert.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{alert.title}</h4>
                      <Badge variant={alert.priority === "high" ? "destructive" : "secondary"}>{alert.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                    <p className="text-sm font-medium text-blue-600 mb-2">{alert.recommendation}</p>
                    <div className="flex gap-1">
                      {alert.states.map((state) => (
                        <Badge key={state} variant="outline" className="text-xs">
                          {state}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation & Utilization</CardTitle>
                <CardDescription>Financial resource distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetData.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{item.category}</span>
                        <span>
                          ₹{item.spent}Cr / ₹{item.allocated}Cr
                        </span>
                      </div>
                      <Progress value={item.percentage} />
                      <p className="text-xs text-muted-foreground mt-1">{item.percentage}% utilized</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>State-wise Budget Distribution</CardTitle>
                <CardDescription>Per capita education spending</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stateData.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="budget" fill="#f59e0b" name="Budget (Cr)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Budget Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Well Utilized</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Teacher Training Program showing 90% utilization rate</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium">Needs Attention</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Infrastructure budget showing slower than expected spending
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h4 className="font-medium">Action Required</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">3 states require additional budget allocation for Q4</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Impact Analysis</CardTitle>
              <CardDescription>Effectiveness of current education policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    policy: "National Education Policy 2020",
                    implementation: 78,
                    impact: "Positive",
                    keyMetrics: ["Digital literacy up 25%", "Teacher satisfaction +15%", "Student engagement +20%"],
                    challenges: ["Infrastructure gaps in rural areas", "Teacher training capacity"],
                    nextSteps: ["Accelerate rural connectivity", "Expand training programs"],
                  },
                  {
                    policy: "Digital India Education Initiative",
                    implementation: 65,
                    impact: "Positive",
                    keyMetrics: ["Platform adoption 85%", "Content creation +300%", "Cost reduction 40%"],
                    challenges: ["Internet connectivity issues", "Device availability"],
                    nextSteps: ["Improve network infrastructure", "Device distribution program"],
                  },
                  {
                    policy: "Skill Development Integration",
                    implementation: 45,
                    impact: "Mixed",
                    keyMetrics: ["Vocational courses +50%", "Industry partnerships +30%"],
                    challenges: ["Curriculum alignment", "Industry readiness"],
                    nextSteps: ["Revise curriculum standards", "Strengthen industry partnerships"],
                  },
                ].map((policy, index) => (
                  <div key={index} className="p-6 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium">{policy.policy}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={policy.impact === "Positive" ? "default" : "secondary"}>{policy.impact}</Badge>
                        <span className="text-sm text-muted-foreground">{policy.implementation}% implemented</span>
                      </div>
                    </div>

                    <Progress value={policy.implementation} className="mb-4" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-green-600 mb-2">Key Achievements</h5>
                        <ul className="text-sm space-y-1">
                          {policy.keyMetrics.map((metric, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {metric}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-yellow-600 mb-2">Challenges</h5>
                        <ul className="text-sm space-y-1">
                          {policy.challenges.map((challenge, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-yellow-600" />
                              {challenge}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-blue-600 mb-2">Next Steps</h5>
                        <ul className="text-sm space-y-1">
                          {policy.nextSteps.map((step, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Target className="h-3 w-3 text-blue-600" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Policy Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Policy Recommendations</CardTitle>
              <CardDescription>Data-driven suggestions for policy improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Accelerate Rural Digital Infrastructure",
                    priority: "High",
                    impact: "High",
                    timeline: "6 months",
                    description:
                      "Focus on improving internet connectivity in rural schools to bridge the digital divide",
                    expectedOutcome: "25% improvement in rural digital adoption",
                  },
                  {
                    title: "Enhance Teacher Training Programs",
                    priority: "Medium",
                    impact: "High",
                    timeline: "12 months",
                    description: "Expand capacity and modernize teacher training curricula with digital pedagogy",
                    expectedOutcome: "30% improvement in teaching effectiveness",
                  },
                  {
                    title: "Implement Adaptive Learning Systems",
                    priority: "Medium",
                    impact: "Medium",
                    timeline: "18 months",
                    description: "Deploy AI-powered personalized learning platforms across all states",
                    expectedOutcome: "20% improvement in learning outcomes",
                  },
                ].map((recommendation, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{recommendation.title}</h4>
                      <div className="flex gap-2">
                        <Badge variant={recommendation.priority === "High" ? "destructive" : "secondary"}>
                          {recommendation.priority} Priority
                        </Badge>
                        <Badge variant="outline">{recommendation.timeline}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{recommendation.description}</p>
                    <p className="text-sm font-medium text-blue-600">Expected: {recommendation.expectedOutcome}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Government Firebase Analytics</h2>
              <p className="text-muted-foreground">Real-time education platform analytics for policy makers</p>
            </div>
            <Badge variant="outline" className="text-sm">
              🔥 Firebase Powered
            </Badge>
          </div>
          
          <Tabs defaultValue="firebase" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="firebase">
                <BarChart3 className="h-4 w-4 mr-1" />
                Firebase Analytics
              </TabsTrigger>
              <TabsTrigger value="realtime">
                <Activity className="h-4 w-4 mr-1" />
                Real-Time Monitoring
              </TabsTrigger>
            </TabsList>
            <TabsContent value="firebase">
              <FirebaseAnalyticsDashboard />
            </TabsContent>
            <TabsContent value="realtime">
              <RealTimeDashboard />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
