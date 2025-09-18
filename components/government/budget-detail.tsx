"use client"

import { useState } from "react"
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Filter, Download, Wallet, PieChart as PieChartIcon, Target } from "lucide-react"
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

const budgetTrends = [
  { month: "Jan", allocated: 2800, spent: 2240, remaining: 560 },
  { month: "Feb", allocated: 2850, spent: 2565, remaining: 285 },
  { month: "Mar", allocated: 3100, spent: 2790, remaining: 310 },
  { month: "Apr", allocated: 3200, spent: 2880, remaining: 320 },
  { month: "May", allocated: 3350, spent: 3015, remaining: 335 },
  { month: "Jun", allocated: 3500, spent: 3150, remaining: 350 },
]

const categoryBudget = [
  { category: "Infrastructure", allocated: 1200, spent: 980, utilization: 81.7, priority: "high" },
  { category: "Teacher Training", allocated: 800, spent: 720, utilization: 90.0, priority: "high" },
  { category: "Digital Resources", allocated: 600, spent: 540, utilization: 90.0, priority: "medium" },
  { category: "Student Support", allocated: 400, spent: 350, utilization: 87.5, priority: "medium" },
  { category: "Technology", allocated: 500, spent: 420, utilization: 84.0, priority: "high" },
  { category: "Admin & Operations", allocated: 300, spent: 140, utilization: 46.7, priority: "low" },
]

const stateBudgetAllocation = [
  { state: "Maharashtra", allocated: 450, spent: 387, efficiency: 86.0 },
  { state: "Uttar Pradesh", allocated: 520, spent: 468, efficiency: 90.0 },
  { state: "Tamil Nadu", allocated: 380, spent: 342, efficiency: 90.0 },
  { state: "Karnataka", allocated: 340, spent: 306, efficiency: 90.0 },
  { state: "Gujarat", allocated: 290, spent: 232, efficiency: 80.0 },
  { state: "West Bengal", allocated: 350, spent: 315, efficiency: 90.0 },
]

const quarterlyPerformance = [
  { quarter: "Q1 2024", budgetEfficiency: 85, outcomeIndex: 78, roi: 142 },
  { quarter: "Q2 2024", budgetEfficiency: 87, outcomeIndex: 82, roi: 156 },
  { quarter: "Q3 2024", budgetEfficiency: 89, outcomeIndex: 85, roi: 164 },
  { quarter: "Q4 2024", budgetEfficiency: 92, outcomeIndex: 88, roi: 171 },
]

const fundingSources = [
  { source: "Central Government", amount: 1890, percentage: 54.0 },
  { source: "State Government", amount: 980, percentage: 28.0 },
  { source: "International Aid", amount: 350, percentage: 10.0 },
  { source: "Private Partnership", amount: 210, percentage: 6.0 },
  { source: "Other Sources", amount: 70, percentage: 2.0 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export function BudgetDetail() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("6months")
  const [category, setCategory] = useState("all")
  const [state, setState] = useState("all")

  const handleExport = () => {
    console.log("Exporting budget data...")
  }

  const totalAllocated = categoryBudget.reduce((sum, cat) => sum + cat.allocated, 0)
  const totalSpent = categoryBudget.reduce((sum, cat) => sum + cat.spent, 0)
  const overallUtilization = (totalSpent / totalAllocated) * 100

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budget Overview</h1>
            <p className="text-muted-foreground">Comprehensive education budget allocation and utilization analytics</p>
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
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="training">Teacher Training</SelectItem>
                  <SelectItem value="digital">Digital Resources</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">State</label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="up">Uttar Pradesh</SelectItem>
                  <SelectItem value="tamil">Tamil Nadu</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
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
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">₹3,500 Cr</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +4.5% from last month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Utilized</p>
                <p className="text-2xl font-bold">₹3,150 Cr</p>
                <div className="flex items-center text-xs text-green-600">
                  <Target className="h-3 w-3 mr-1" />
                  90% utilization
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <PieChartIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold">₹350 Cr</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  10% available
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Efficiency Score</p>
                <p className="text-2xl font-bold">92/100</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Excellent performance
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="allocation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="allocation">Budget Allocation</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sources">Funding Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="allocation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Trends</CardTitle>
                <CardDescription>Monthly budget allocation and spending</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={budgetTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value} Cr`, ""]} />
                    <Area type="monotone" dataKey="allocated" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="spent" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category-wise Allocation</CardTitle>
                <CardDescription>Budget distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryBudget}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, allocated }) => `${category} ₹${allocated}Cr`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="allocated"
                    >
                      {categoryBudget.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value} Cr`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="utilization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Utilization by Category</CardTitle>
                <CardDescription>Spending efficiency across different categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryBudget.map((category, index) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                          <span className="text-sm font-medium">{category.category}</span>
                          <Badge variant={category.priority === "high" ? "destructive" : category.priority === "medium" ? "default" : "secondary"}>
                            {category.priority}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{category.utilization}%</span>
                      </div>
                      <Progress value={category.utilization} className="w-full" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Spent: ₹{category.spent} Cr</span>
                        <span>Allocated: ₹{category.allocated} Cr</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>State-wise Budget Efficiency</CardTitle>
                <CardDescription>Budget utilization by state</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stateBudgetAllocation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="state" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="efficiency" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quarterly Performance Metrics</CardTitle>
                <CardDescription>Budget efficiency and outcome correlation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={quarterlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="budgetEfficiency" stroke="#3b82f6" name="Budget Efficiency" />
                    <Line type="monotone" dataKey="outcomeIndex" stroke="#10b981" name="Outcome Index" />
                    <Line type="monotone" dataKey="roi" stroke="#f59e0b" name="ROI Index" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Indicators</CardTitle>
                <CardDescription>Key budget performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Budget Utilization Rate</p>
                      <p className="text-sm text-muted-foreground">Overall spending efficiency</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">90%</p>
                      <Badge variant="default">Excellent</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Cost per Student</p>
                      <p className="text-sm text-muted-foreground">Average spending per student</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">₹2,218</p>
                      <Badge variant="secondary">Optimized</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Infrastructure ROI</p>
                      <p className="text-sm text-muted-foreground">Return on infrastructure investment</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">171%</p>
                      <Badge variant="default">High Impact</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Budget Variance</p>
                      <p className="text-sm text-muted-foreground">Deviation from planned budget</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">±3.2%</p>
                      <Badge variant="secondary">Within Range</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Funding Sources</CardTitle>
                <CardDescription>Budget contribution by funding source</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fundingSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ source, percentage }) => `${source} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {fundingSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value} Cr`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funding Breakdown</CardTitle>
                <CardDescription>Detailed funding source analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fundingSources.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <div>
                          <p className="font-medium">{source.source}</p>
                          <p className="text-sm text-muted-foreground">{source.percentage}% of total budget</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">₹{source.amount} Cr</p>
                        <p className="text-xs text-muted-foreground">contribution</p>
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