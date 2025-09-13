"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { updateProfile } from "firebase/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Flame, Gift, LogOut } from "lucide-react"
import {
  BookOpen,
  Trophy,
  Target,
  Zap,
  Bell,
  Home,
  Gamepad2,
  BarChart3,
  Calendar,
  HelpCircle,
  Brain,
  Timer,
  Settings,
  Volume2,
  Sun,
  Moon,
  Languages,
  User,
  MessageCircle,
} from "lucide-react"

import { useFirestoreProgress } from "@/hooks/use-firestore-progress"
import { getLeaderboard } from "@/lib/firestore-services"
import { RewardStore } from "@/components/gamification/reward-store"
import { PerformanceHeatmap } from "@/components/analytics/performance-heatmap"
import { fcmService } from "@/lib/fcm-service"
import { AIMentorChat } from "@/components/ai-mentor/ai-mentor-chat"
import { StudentProfile } from "@/components/profile/student-profile"
import { StudentSettings } from "@/components/settings/student-settings"
import { SubjectManager } from "@/components/subjects/subject-manager"
import { ComprehensiveGameHub } from "@/components/games/comprehensive-game-hub"

type StudentPage = "home" | "lessons" | "progress" | "schedule" | "support" | "ai-mentor" | "profile" | "settings" | "games"

interface Challenge {
  id: string
  task: string
  xp: number
  completed: boolean
  emoji: string
}

interface Subject {
  id: string
  subject: string
  progress: number
  level: number
  unlocked: boolean
  color: string
  emoji: string
}

interface Quiz {
  id: string
  title: string
  time: string
  questions: number
  difficulty: string
  emoji: string
  completed: boolean
}

export { StudentDashboard }
interface NavItem {
  id: string
  label: string
  icon: any
  href?: string
}

export default function StudentDashboard() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const { progress, loading } = useFirestoreProgress()
  const [notifications, setNotifications] = useState<Array<{id: string, message: string}>>([])
  
  // Debug user authentication
  useEffect(() => {
    if (user) {
      console.log('User state changed:', {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        isAnonymous: user.isAnonymous,
        photoURL: user.photoURL
      })
    } else {
      console.log('No user logged in')
    }
  }, [user])

  const [currentPage, setCurrentPage] = useState<StudentPage>("home")
  const navRef = useRef<HTMLDivElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [pomodoroTime] = useState(25 * 60)
  const [isTimerRunning] = useState(false)

  const currentStreak = progress?.streak || 0
  const level = progress?.level || 1
  const rewards = Math.floor((progress?.xp || 0) / 100) || 0

  const weeklyProgress = [
    { day: "Mon", xp: 120, activities: 8 },
    { day: "Tue", xp: 85, activities: 6 },
    { day: "Wed", xp: 150, activities: 12 },
    { day: "Thu", xp: 95, activities: 7 },
    { day: "Fri", xp: 180, activities: 15 },
    { day: "Sat", xp: 200, activities: 18 },
    { day: "Sun", xp: 110, activities: 9 },
  ]

  const subjectAnalytics = progress
    ? Object.entries(progress.subjects).map(([key, data]) => ({
        subject: key.charAt(0).toUpperCase() + key.slice(1),
        completed: data.lessonsCompleted,
        total: data.lessonsCompleted + Math.floor(Math.random() * 20) + 10,
        accuracy: Math.min(95, 75 + Math.floor(data.xp / 10)),
        timeSpent: data.lessonsCompleted * 15,
      }))
    : []

  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: "1", task: "Complete 3 Math quizzes", xp: 50, completed: false, emoji: "🧮" },
    { id: "2", task: "Read 2 Science chapters", xp: 30, completed: true, emoji: "🔬" },
    { id: "3", task: "Practice English vocabulary", xp: 25, completed: false, emoji: "📚" },
  ])

  const subjects = progress
    ? Object.entries(progress.subjects).map(([key, data]) => ({
        id: key,
        subject: key.charAt(0).toUpperCase() + key.slice(1),
        progress: data.progress,
        level: Math.floor(data.xp / 100) + 1,
        unlocked: data.progress > 0 || key === "mathematics",
        color: key === "mathematics" ? "primary" : key === "science" ? "secondary" : "accent",
        emoji: key === "mathematics" ? "🧮" : key === "science" ? "🔬" : key === "english" ? "📚" : "🏛️",
      }))
    : []

  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      title: "Algebra Quick Quiz",
      time: "5 min",
      questions: 10,
      difficulty: "Easy",
      emoji: "🔢",
      completed: false,
    },
    {
      id: "2",
      title: "Physics Challenge",
      time: "15 min",
      questions: 20,
      difficulty: "Hard",
      emoji: "⚡",
      completed: false,
    },
    {
      id: "3",
      title: "English Grammar",
      time: "8 min",
      questions: 15,
      difficulty: "Medium",
      emoji: "✍️",
      completed: false,
    },
  ])

  const completeChallenge = async (challengeId: string) => {
    const challenge = challenges.find((c) => c.id === challengeId)
    if (challenge && !challenge.completed) {
      setChallenges((prev) => prev.map((c) => (c.id === challengeId ? { ...c, completed: true } : c)))
      toast({
        title: "🎉 Challenge Complete!",
        description: `Great job completing the challenge! ${challenge.emoji}`,
      })
    }
  }

  const completeQuiz = async (quizId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId)
    if (quiz && !quiz.completed) {
      toast({
        title: "🎉 Quiz Completed!",
        description: `Great job completing the ${quiz.title} quiz!`,
      })
    }
  }

  const completeLesson = async (lessonId: string) => {
    const lesson = subjects.find((l) => l.id === lessonId)
    if (lesson) {
      toast({
        title: "📚 Lesson Completed!",
        description: `Great job completing the ${lesson.subject} lesson!`,
      })
    }
  }

  const startQuiz = (quizId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId)
    if (quiz) {
      toast({
        title: `${quiz.emoji} Starting ${quiz.title}`,
        description: `Get ready for ${quiz.questions} questions in ${quiz.time}!`,
      })
      // Simulate quiz completion after 3 seconds
      setTimeout(() => {
        setQuizzes((prev) => prev.map((q) => (q.id === quizId ? { ...q, completed: true } : q)))
        toast({
          title: `🏆 Quiz Complete!`,
          description: `Excellent work!`,
        })
      }, 3000)
    }
  }

  const navItems: NavItem[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "lessons", label: "Lessons", icon: BookOpen },
    { id: "progress", label: "Progress", icon: BarChart3 },
    { 
      id: "schedule", 
      label: "Schedule", 
      icon: Calendar,
      href: "/schedule"
    },
    { id: "ai-mentor", label: "AI Mentor", icon: Brain },
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "support", label: "Support", icon: HelpCircle },
  ]

  const handleNavigation = (pageId: string) => {
    if (pageId === 'schedule') {
      router.push('/schedule')
    } else {
      setCurrentPage(pageId as StudentPage)
    }
  }

  const renderPage = () => {
    if (typeof window !== 'undefined' && window.location.pathname === '/schedule') {
      return null // Next.js will render the schedule page
    }
    
    switch (currentPage) {
      case "support":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Support Center</h2>
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>We're here to assist you with any questions or issues.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-primary" />
                        <CardTitle>Contact Support</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Send us a message and we'll get back to you as soon as possible.
                      </p>
                      <Button>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Chat with Support
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <CardTitle>Help Center</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Browse our help articles and guides.
                      </p>
                      <Button variant="outline">
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Help Articles
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">How do I reset my password?</h3>
                      <p className="text-sm text-muted-foreground">
                        You can reset your password from the login page by clicking on "Forgot Password".
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">How do I track my progress?</h3>
                      <p className="text-sm text-muted-foreground">
                        Your progress is automatically tracked in the Progress section of your dashboard.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">How can I contact my teacher?</h3>
                      <p className="text-sm text-muted-foreground">
                        You can message your teacher directly through the Messages section.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        )
      case "home":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Welcome back, {user?.displayName || 'Student'}!</h2>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total XP</p>
                        <p className="text-xl font-bold">{progress?.xp?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary/10 p-2 rounded-lg">
                        <Target className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Streak</p>
                        <p className="text-xl font-bold">{progress?.streak || 0} days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-lg dark:bg-amber-900/20">
                        <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Level</p>
                        <p className="text-xl font-bold">{progress?.level || 1}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Jump back into your learning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" onClick={() => handleNavigation('lessons')}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Lessons
                    </Button>
                    <Button variant="outline" onClick={() => handleNavigation('games')}>
                      <Gamepad2 className="mr-2 h-4 w-4" />
                      Games
                    </Button>
                    <Button variant="outline" onClick={() => handleNavigation('progress')}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Progress
                    </Button>
                    <Button variant="outline" onClick={() => handleNavigation('ai-mentor')}>
                      <Brain className="mr-2 h-4 w-4" />
                      AI Mentor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case "profile":
        return <StudentProfile />
      case "settings":
        return <StudentSettings />
      case "lessons":
        return <SubjectManager />
      case "games":
        return <ComprehensiveGameHub />
      case "progress":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your Learning Progress</h2>
            <PerformanceHeatmap 
              data={[
                { date: '2023-04-01', value: 2, level: 1 },
                { date: '2023-04-02', value: 5, level: 3 },
                { date: '2023-04-03', value: 1, level: 0 },
                { date: '2023-04-04', value: 3, level: 2 },
                { date: '2023-04-05', value: 4, level: 2 },
                { date: '2023-04-06', value: 2, level: 1 },
                { date: '2023-04-07', value: 0, level: 0 }
              ]}
            />
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Your study activity over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-end gap-2">
                  {[10, 40, 35, 50, 60, 45, 30].map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-primary rounded-t-sm" 
                        style={{ height: `${value}%` }}
                      />
                      <span className="text-xs text-muted-foreground mt-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "ai-mentor":
        return <AIMentorChat />
      default:
        return <div>Page not found</div>
    }
  }

  const NavItem = ({ item }: { item: NavItem }) => {
    const handleClick = () => {
      if (item.href) {
        router.push(item.href)
      } else {
        setCurrentPage(item.id as StudentPage)
      }
    }
    
    const isActive = item.href 
      ? typeof window !== 'undefined' && window.location.pathname === item.href
      : currentPage === item.id
    
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted/50'
        }`}
      >
        <item.icon className="h-5 w-5" />
        <span className="font-medium">{item.label}</span>
      </button>
    )
  }

  const renderMobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t md:hidden z-50">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">🎓 Student Portal</h1>
              <p className="text-sm text-muted-foreground">Government Education Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                const token = await fcmService.requestPermission()
                toast({
                  title: "🔔 Notifications",
                  description: token ? "Notifications enabled!" : "Permission not granted or unsupported.",
                })
              }}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                {notifications.length > 0 ? notifications.length : null}
              </span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={user?.photoURL || ''} 
                      alt={user?.displayName || 'User'}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=random`;
                      }}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.displayName 
                        ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'No email'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCurrentPage('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentPage('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={async (e) => {
                  e.preventDefault()
                  try {
                    await signOut()
                    router.push('/')
                  } catch (error) {
                    console.error('Error signing out:', error)
                  }
                }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="border-t">
          <div className="container mx-auto px-4">
            <nav className="w-full">
              <div className="flex overflow-x-auto pb-2 hide-scrollbar space-x-1">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(item.id as StudentPage)}
                    className="flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{renderPage()}</main>
    </div>
  )
}
