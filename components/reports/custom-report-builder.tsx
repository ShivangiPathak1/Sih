"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  FileText,
  Download,
  CalendarIcon,
  Trash2,
  Eye,
  Save,
  BarChart3,
  LineChart,
  Users,
  BookOpen,
  TrendingUp,
} from "lucide-react"
import { format } from "date-fns"

interface ReportConfig {
  name: string
  description: string
  dateRange: { from: Date; to: Date }
  metrics: string[]
  filters: {
    subjects: string[]
    grades: string[]
    userTypes: string[]
  }
  groupBy: string
  chartType: string
  format: string
}

export function CustomReportBuilder() {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: "",
    description: "",
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
    metrics: [],
    filters: {
      subjects: [],
      grades: [],
      userTypes: [],
    },
    groupBy: "daily",
    chartType: "bar",
    format: "pdf",
  })

  const [savedReports, setSavedReports] = useState([
    {
      id: "1",
      name: "Weekly Performance Report",
      description: "Student performance across all subjects",
      lastGenerated: "2024-01-15",
      metrics: ["performance", "engagement", "completion"],
    },
    {
      id: "2",
      name: "Monthly Usage Analytics",
      description: "Platform usage and user engagement metrics",
      lastGenerated: "2024-01-10",
      metrics: ["users", "sessions", "duration"],
    },
  ])

  const availableMetrics = [
    { id: "users", label: "Active Users", icon: Users },
    { id: "lessons", label: "Lessons Completed", icon: BookOpen },
    { id: "performance", label: "Student Performance", icon: TrendingUp },
    { id: "engagement", label: "User Engagement", icon: BarChart3 },
    { id: "completion", label: "Completion Rates", icon: FileText },
    { id: "sessions", label: "Session Data", icon: LineChart },
    { id: "duration", label: "Time Spent", icon: CalendarIcon },
  ]

  const subjects = ["Mathematics", "Science", "English", "History", "Geography"]
  const grades = ["6", "7", "8", "9", "10", "11", "12"]
  const userTypes = ["Students", "Teachers", "Admins"]

  const handleMetricToggle = (metricId: string) => {
    setReportConfig((prev) => ({
      ...prev,
      metrics: prev.metrics.includes(metricId)
        ? prev.metrics.filter((m) => m !== metricId)
        : [...prev.metrics, metricId],
    }))
  }

  const handleFilterToggle = (filterType: keyof typeof reportConfig.filters, value: string) => {
    setReportConfig((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterType]: prev.filters[filterType].includes(value)
          ? prev.filters[filterType].filter((v) => v !== value)
          : [...prev.filters[filterType], value],
      },
    }))
  }

  const generateReport = () => {
    console.log("Generating report with config:", reportConfig)

    // Simulate report generation
    const reportData = {
      ...reportConfig,
      generatedAt: new Date().toISOString(),
      data: {
        // Mock data based on selected metrics
        users: reportConfig.metrics.includes("users") ? [1200, 1350, 1180, 1420] : null,
        lessons: reportConfig.metrics.includes("lessons") ? [450, 520, 480, 580] : null,
        performance: reportConfig.metrics.includes("performance") ? [87, 82, 89, 78] : null,
      },
    }

    // Create download link
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${reportConfig.name || "custom-report"}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const saveReport = () => {
    const newReport = {
      id: Date.now().toString(),
      name: reportConfig.name,
      description: reportConfig.description,
      lastGenerated: new Date().toLocaleDateString(),
      metrics: reportConfig.metrics,
    }

    setSavedReports((prev) => [...prev, newReport])

    // Reset form
    setReportConfig({
      name: "",
      description: "",
      dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
      metrics: [],
      filters: {
        subjects: [],
        grades: [],
        userTypes: [],
      },
      groupBy: "daily",
      chartType: "bar",
      format: "pdf",
    })
  }

  const previewReport = () => {
    console.log("Previewing report:", reportConfig)
    // Here you would show a preview modal or navigate to preview page
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Custom Report Builder</h2>
          <p className="text-muted-foreground">Create customized analytics reports with advanced filtering</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={previewReport} disabled={reportConfig.metrics.length === 0}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={generateReport} disabled={reportConfig.metrics.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
              <CardDescription>Basic details about your custom report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input
                  id="report-name"
                  value={reportConfig.name}
                  onChange={(e) => setReportConfig((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter report name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-description">Description</Label>
                <Textarea
                  id="report-description"
                  value={reportConfig.description}
                  onChange={(e) => setReportConfig((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this report will show"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle>Date Range</CardTitle>
              <CardDescription>Select the time period for your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {reportConfig.dateRange.from && reportConfig.dateRange.to
                        ? `${format(reportConfig.dateRange.from, "MMM dd, yyyy")} - ${format(reportConfig.dateRange.to, "MMM dd, yyyy")}`
                        : "Select date range"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={reportConfig.dateRange}
                      onSelect={(range) => range && setReportConfig((prev) => ({ ...prev, dateRange: range }))}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Metrics</CardTitle>
              <CardDescription>Choose the data points to include in your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={metric.id}
                      checked={reportConfig.metrics.includes(metric.id)}
                      onCheckedChange={() => handleMetricToggle(metric.id)}
                    />
                    <div className="flex items-center gap-2">
                      <metric.icon className="h-4 w-4" />
                      <Label htmlFor={metric.id} className="cursor-pointer">
                        {metric.label}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Narrow down your data with specific filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject Filter */}
              <div className="space-y-3">
                <Label>Subjects</Label>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <Badge
                      key={subject}
                      variant={reportConfig.filters.subjects.includes(subject) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleFilterToggle("subjects", subject)}
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Grade Filter */}
              <div className="space-y-3">
                <Label>Grade Levels</Label>
                <div className="flex flex-wrap gap-2">
                  {grades.map((grade) => (
                    <Badge
                      key={grade}
                      variant={reportConfig.filters.grades.includes(grade) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleFilterToggle("grades", grade)}
                    >
                      Grade {grade}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* User Type Filter */}
              <div className="space-y-3">
                <Label>User Types</Label>
                <div className="flex flex-wrap gap-2">
                  {userTypes.map((userType) => (
                    <Badge
                      key={userType}
                      variant={reportConfig.filters.userTypes.includes(userType) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleFilterToggle("userTypes", userType)}
                    >
                      {userType}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization Options */}
          <Card>
            <CardHeader>
              <CardTitle>Visualization & Format</CardTitle>
              <CardDescription>Choose how to display and export your report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Group By</Label>
                  <Select
                    value={reportConfig.groupBy}
                    onValueChange={(value) => setReportConfig((prev) => ({ ...prev, groupBy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="subject">By Subject</SelectItem>
                      <SelectItem value="grade">By Grade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Chart Type</Label>
                  <Select
                    value={reportConfig.chartType}
                    onValueChange={(value) => setReportConfig((prev) => ({ ...prev, chartType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                      <SelectItem value="table">Data Table</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select
                    value={reportConfig.format}
                    onValueChange={(value) => setReportConfig((prev) => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Report Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Selected Metrics:</span>
                  <Badge variant="outline">{reportConfig.metrics.length}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Filters:</span>
                  <Badge variant="outline">
                    {reportConfig.filters.subjects.length +
                      reportConfig.filters.grades.length +
                      reportConfig.filters.userTypes.length}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Date Range:</span>
                  <span className="text-xs">
                    {Math.ceil(
                      (reportConfig.dateRange.to.getTime() - reportConfig.dateRange.from.getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </span>
                </div>
              </div>

              {reportConfig.name && (
                <Button onClick={saveReport} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Report Template
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Saved Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Report Templates</CardTitle>
              <CardDescription>Previously created report configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {savedReports.map((report) => (
                <div key={report.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{report.name}</h4>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Last: {report.lastGenerated}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
