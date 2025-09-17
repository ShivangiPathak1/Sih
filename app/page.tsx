"use client"

import { useState } from "react"
import { StudentDashboard } from "@/components/dashboards/student-dashboard"
import { TeacherDashboard } from "@/components/dashboards/teacher-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { GovernmentDashboard } from "@/components/dashboards/government-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  GraduationCap,
  Users,
  Building2,
  Gamepad2,
  BarChart3,
  Trophy,
  UserCheck,
  FileText,
  PieChart,
  School,
  Settings,
} from "lucide-react"

function RoleSelectionPage({ onRoleSelect }: { onRoleSelect: (role: string) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">EduGamers</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            Solar Powered - Active
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
          <Button variant="outline" size="sm">
            English
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Welcome to EduGamers</h2>
          <p className="text-lg text-muted-foreground">Choose your role to access the platform</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Student Card */}
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onRoleSelect("student")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <GraduationCap className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Student</CardTitle>
              <CardDescription className="text-base">Play games, track progress, submit assignments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Gamepad2 className="h-4 w-4 text-primary" />
                <span>Interactive Games</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span>Progress Tracking</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Trophy className="h-4 w-4 text-primary" />
                <span>Achievements</span>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Card */}
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onRoleSelect("teacher")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-secondary/10 rounded-full w-fit">
                <Users className="h-12 w-12 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Teacher</CardTitle>
              <CardDescription className="text-base">
                Manage students, create assignments, view analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <UserCheck className="h-4 w-4 text-secondary" />
                <span>Student Management</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FileText className="h-4 w-4 text-secondary" />
                <span>Assignment Creation</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <PieChart className="h-4 w-4 text-secondary" />
                <span>Analytics</span>
              </div>
            </CardContent>
          </Card>

          {/* Admin Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onRoleSelect("admin")}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
                <Settings className="h-12 w-12 text-accent" />
              </div>
              <CardTitle className="text-2xl">Admin</CardTitle>
              <CardDescription className="text-base">Manage platform, approve content, system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-accent" />
                <span>User Management</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FileText className="h-4 w-4 text-accent" />
                <span>Content Approval</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Settings className="h-4 w-4 text-accent" />
                <span>System Settings</span>
              </div>
            </CardContent>
          </Card>

          {/* Government Card */}
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onRoleSelect("government")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-chart-1/10 rounded-full w-fit">
                <Building2 className="h-12 w-12 text-chart-1" />
              </div>
              <CardTitle className="text-2xl">Government</CardTitle>
              <CardDescription className="text-base">
                View regional data, track implementation, manage policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <BarChart3 className="h-4 w-4 text-chart-1" />
                <span>Regional Analytics</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <School className="h-4 w-4 text-chart-1" />
                <span>School Monitoring</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 text-chart-1" />
                <span>Policy Management</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  if (!selectedRole) {
    return <RoleSelectionPage onRoleSelect={setSelectedRole} />
  }

  switch (selectedRole) {
    case "student":
      return <StudentDashboard />
    case "teacher":
      return <TeacherDashboard />
    case "admin":
      return <AdminDashboard />
    case "government":
      return <GovernmentDashboard />
    default:
      return <RoleSelectionPage onRoleSelect={setSelectedRole} />
  }
}
