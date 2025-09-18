"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft, TrendingUp, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

const fcrData = [
  { day: "Mon", fcr: 68 },
  { day: "Tue", fcr: 72 },
  { day: "Wed", fcr: 75 },
  { day: "Thu", fcr: 71 },
  { day: "Fri", fcr: 74 },
  { day: "Sat", fcr: 69 },
  { day: "Sun", fcr: 76 },
]

const categoryFCR = [
  { name: "Technical", value: 78 },
  { name: "Account", value: 72 },
  { name: "Billing", value: 85 },
  { name: "Content", value: 69 },
]

const resolutionSteps = [
  { steps: "1 Contact", percentage: 73 },
  { steps: "2 Contacts", percentage: 18 },
  { steps: "3 Contacts", percentage: 6 },
  { steps: "4+ Contacts", percentage: 3 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function FirstContactResolutionPage() {
  const router = useRouter()

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
          <h1 className="text-3xl font-bold tracking-tight">First Contact Resolution</h1>
          <p className="text-muted-foreground">Efficiency metrics for single-touch resolution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FCR Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73.2%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +3.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target FCR</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">70%</div>
            <p className="text-xs text-green-600">Target exceeded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best FCR Day</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-muted-foreground">Sunday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Multi-Touch Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26.8%</div>
            <p className="text-xs text-muted-foreground">Requires follow-up</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily FCR Trend</CardTitle>
            <CardDescription>First contact resolution rates over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fcrData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="fcr" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>FCR by Category</CardTitle>
            <CardDescription>First contact resolution rates by ticket category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryFCR}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resolution by Contact Count</CardTitle>
            <CardDescription>Percentage of tickets resolved by number of contacts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resolutionSteps}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: any) => `${name}: ${value || 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {resolutionSteps.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>FCR Impact Metrics</CardTitle>
            <CardDescription>Key benefits of high FCR rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-800">Cost Savings</span>
                  <span className="text-lg font-bold text-green-900">$12,450</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Reduced operational costs</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-800">Customer Satisfaction</span>
                  <span className="text-lg font-bold text-blue-900">+8.5%</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">Improvement due to FCR</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-purple-800">Agent Productivity</span>
                  <span className="text-lg font-bold text-purple-900">+15%</span>
                </div>
                <p className="text-sm text-purple-600 mt-1">More efficient handling</p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-orange-800">Call Volume Reduction</span>
                  <span className="text-lg font-bold text-orange-900">-23%</span>
                </div>
                <p className="text-sm text-orange-600 mt-1">Fewer repeat contacts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FCR Performance by Agent</CardTitle>
          <CardDescription>Top performing agents for first contact resolution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Emma Wilson", fcr: 85, tickets: 89, improvement: "+5%" },
              { name: "David Chen", fcr: 82, tickets: 95, improvement: "+3%" },
              { name: "Sarah Johnson", fcr: 79, tickets: 103, improvement: "+7%" },
              { name: "Michael Brown", fcr: 77, tickets: 87, improvement: "+2%" },
              { name: "Lisa Garcia", fcr: 75, tickets: 91, improvement: "+4%" },
            ].map((agent, index) => (
              <div key={agent.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{agent.name}</div>
                    <div className="text-sm text-muted-foreground">{agent.tickets} tickets handled</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{agent.fcr}%</div>
                  <div className="text-sm text-green-600">{agent.improvement} this month</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FCR Improvement Opportunities</CardTitle>
          <CardDescription>Areas for enhancing first contact resolution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Knowledge Base Updates</h4>
              <p className="text-sm text-muted-foreground">
                Regular updates to agent knowledge base can improve FCR by 12%
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Advanced Training</h4>
              <p className="text-sm text-muted-foreground">
                Specialized training programs for complex issue types
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Tool Integration</h4>
              <p className="text-sm text-muted-foreground">
                Better system integration can reduce resolution time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}