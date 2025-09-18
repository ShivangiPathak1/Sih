"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, TrendingDown, Star, ThumbsUp, MessageSquare, Users, BookOpen, BarChart3 } from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Sample data for rating analytics
const ratingTrendsData = [
  { date: "2024-01-01", avgRating: 4.3, totalRatings: 156, reviews: 45 },
  { date: "2024-01-02", avgRating: 4.4, totalRatings: 189, reviews: 52 },
  { date: "2024-01-03", avgRating: 4.2, totalRatings: 134, reviews: 38 },
  { date: "2024-01-04", avgRating: 4.5, totalRatings: 234, reviews: 67 },
  { date: "2024-01-05", avgRating: 4.6, totalRatings: 267, reviews: 73 },
  { date: "2024-01-06", avgRating: 4.5, totalRatings: 245, reviews: 68 },
  { date: "2024-01-07", avgRating: 4.6, totalRatings: 289, reviews: 78 },
]

const ratingDistribution = [
  { stars: 5, count: 1456, percentage: 58.2 },
  { stars: 4, count: 678, percentage: 27.1 },
  { stars: 3, count: 234, percentage: 9.4 },
  { stars: 2, count: 89, percentage: 3.6 },
  { stars: 1, count: 43, percentage: 1.7 },
]

const categoryRatings = [
  { category: "Mathematics", rating: 4.7, reviews: 456, improvement: 0.2 },
  { category: "Science", rating: 4.8, reviews: 389, improvement: 0.3 },
  { category: "English", rating: 4.5, reviews: 321, improvement: 0.1 },
  { category: "History", rating: 4.4, reviews: 234, improvement: -0.1 },
  { category: "Geography", rating: 4.3, reviews: 189, improvement: 0.0 },
  { category: "Art", rating: 4.6, reviews: 167, improvement: 0.4 },
]

const topRatedContent = [
  { title: "Advanced Algebra Concepts", rating: 4.9, reviews: 234, category: "Math", engagement: 94 },
  { title: "Interactive Chemistry Lab", rating: 4.9, reviews: 198, category: "Science", engagement: 96 },
  { title: "Shakespeare Analysis", rating: 4.8, reviews: 156, category: "English", engagement: 89 },
  { title: "World Geography Quiz", rating: 4.8, reviews: 145, category: "Geography", engagement: 87 },
  { title: "Digital Art Basics", rating: 4.7, reviews: 134, category: "Art", engagement: 92 },
]

const lowRatedContent = [
  { title: "Basic Fractions", rating: 3.2, reviews: 89, category: "Math", issues: ["Too Easy", "Outdated"] },
  { title: "Ancient History Timeline", rating: 3.4, reviews: 67, category: "History", issues: ["Confusing", "Too Long"] },
  { title: "Grammar Basics", rating: 3.6, reviews: 78, category: "English", issues: ["Boring", "Repetitive"] },
]

const reviewSentiment = [
  { sentiment: "Positive", count: 1876, percentage: 75.0 },
  { sentiment: "Neutral", count: 438, percentage: 17.5 },
  { sentiment: "Negative", count: 186, percentage: 7.5 },
]

const ratingMetrics = [
  { metric: "Overall Satisfaction", current: 4.6, target: 4.5, trend: "up" },
  { metric: "Content Quality", current: 4.7, target: 4.6, trend: "up" },
  { metric: "User Experience", current: 4.4, target: 4.3, trend: "up" },
  { metric: "Educational Value", current: 4.8, target: 4.7, trend: "up" },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AverageRatingPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("30d")
  const [category, setCategory] = useState("all")

  const handleGoBack = () => {
    router.back()
  }

  const getStarDisplay = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50" />)
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />)
      }
    }
    return stars
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
            <h1 className="text-3xl font-bold">Average Rating Analytics</h1>
            <p className="text-muted-foreground">Comprehensive analysis of content ratings, reviews, and user satisfaction</p>
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
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="history">History</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ratingMetrics.map((metric) => (
          <Card key={metric.metric}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl font-bold">{metric.current}</div>
                <div className="flex">{getStarDisplay(metric.current)}</div>
              </div>
              <div className={`flex items-center text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {metric.current > metric.target ? '+' : ''}{(metric.current - metric.target).toFixed(1)} vs target
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rating Trends Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Rating Trends Over Time
          </CardTitle>
          <CardDescription>
            Average rating progression with review volume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ratingTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis yAxisId="left" domain={[3.5, 5]} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value, name) => {
                  if (name === 'avgRating') return [value, 'Average Rating']
                  if (name === 'totalRatings') return [value, 'Total Ratings']
                  return [value, 'Reviews']
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="avgRating" 
                stroke="#8884d8" 
                strokeWidth={3}
                name="Average Rating"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="totalRatings" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Total Ratings"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="reviews" 
                stroke="#ffc658" 
                strokeWidth={2}
                name="Reviews"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Rating Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of ratings across all star levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: rating.stars }, (_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{rating.stars} Stars</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{rating.count} ratings</Badge>
                      <span className="text-sm text-muted-foreground">{rating.percentage}%</span>
                    </div>
                  </div>
                  <Progress value={rating.percentage} className="h-2" />
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">4.6</div>
                <div className="flex justify-center mb-2">
                  {getStarDisplay(4.6)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on {ratingDistribution.reduce((sum, item) => sum + item.count, 0)} ratings
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Sentiment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Review Sentiment Analysis
            </CardTitle>
            <CardDescription>
              Sentiment distribution of written reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={reviewSentiment}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: any) => `${name} (${(((value || 0) / reviewSentiment.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {reviewSentiment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Reviews']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {reviewSentiment.map((sentiment, index) => (
                <div key={sentiment.sentiment} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{sentiment.sentiment}</span>
                  </div>
                  <Badge variant="secondary">{sentiment.count} reviews</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Category Rating Performance
          </CardTitle>
          <CardDescription>
            Average ratings and improvement trends by content category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryRatings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 5]} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'rating' ? value : value + ' reviews',
                  name === 'rating' ? 'Rating' : 'Reviews'
                ]}
              />
              <Legend />
              <Bar dataKey="rating" fill="#8884d8" name="Average Rating" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {categoryRatings.map((category) => (
              <div key={category.category} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">{category.category}</h4>
                  <Badge variant={category.improvement >= 0 ? "default" : "secondary"}>
                    {category.improvement >= 0 ? '+' : ''}{category.improvement}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold">{category.rating}</div>
                  <div className="flex">{getStarDisplay(category.rating)}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {category.reviews} reviews
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Rated Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5" />
              Top Rated Content
            </CardTitle>
            <CardDescription>
              Highest rated content based on user feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRatedContent.map((content, index) => (
                <div key={content.title} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-semibold text-green-700">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{content.title}</h4>
                      <p className="text-xs text-muted-foreground">{content.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{content.rating}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {content.reviews} reviews
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Needing Attention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Content Needing Attention
            </CardTitle>
            <CardDescription>
              Lower rated content that may need improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowRatedContent.map((content, index) => (
                <div key={content.title} className="p-3 border rounded-lg border-orange-200 bg-orange-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{content.title}</h4>
                      <p className="text-xs text-muted-foreground">{content.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{content.rating}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {content.reviews} reviews
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {content.issues.map((issue, issueIndex) => (
                      <Badge key={issueIndex} variant="outline" className="text-xs">
                        {issue}
                      </Badge>
                    ))}
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