"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import dynamic from 'next/dynamic'
import { useAuth } from "@/lib/auth-context"
import { UserProgress } from "@/lib/firestore-services"
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
import { Flame, Gift, LogOut, Clock, FileText, Video, Headphones, Target as TargetIcon, Play, Bookmark } from "lucide-react"
import {
  BookOpen,
  Trophy,
  Target,
  Zap,
  Bell,
  Home,
  Gamepad2,
  BarChart3,
  Timer,
  ChevronDown,
  Calendar,
  HelpCircle,
  Brain,
  Settings,
  Volume2,
  Sun,
  Moon,
  Languages,
  User,
  MessageCircle,
} from "lucide-react"

// Define HeatmapData type for the performance heatmap
interface HeatmapData {
  date: string;
  value: number;
  level: 0 | 1 | 2 | 3 | 4;
}

// Extended UserProgress with additional properties used in the dashboard
type ExtendedUserProgress = UserProgress & {
  // Add any additional properties that might be used in the dashboard
  coins?: number;
  recentActivity?: string[];
  totalXP?: number;
  xpToNextLevel?: number;
  streakDays?: number;
};

interface ReviewingMaterial {
  material: {
    id: string;
    title: string;
    type: string;
    duration: string;
    description: string;
  };
  subject: {
    id: string;
    name: string;
  };
}

import { useFirestoreProgress } from "@/hooks/use-firestore-progress"
import { getLeaderboard } from "@/lib/firestore-services"
import { RewardStore } from "@/components/gamification/reward-store"
import { PerformanceHeatmap } from "@/components/analytics/performance-heatmap"
import { fcmService } from "@/lib/fcm-service"
import { StudentProfile } from "@/components/profile/student-profile"
import { StudentSettings } from "@/components/settings/student-settings"
import { SubjectManager } from "@/components/subjects/subject-manager"
import { ComprehensiveGameHub } from "@/components/games/comprehensive-game-hub"

type StudentPage = "home" | "lessons" | "progress" | "games" | "profile" | "settings" | "support" | "pomodoro-timer" | "progress-overview"

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
  icon: React.ComponentType<{ className?: string }>
  href?: string
  children?: NavItem[]
}

export default function StudentDashboard() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { toast } = useToast();
  const { progress, loading } = useFirestoreProgress();
  const [notifications, setNotifications] = useState<Array<{id: string, message: string}>>([])
  
  const [currentPage, setCurrentPage] = useState<StudentPage>("home");
  
  // Debug user authentication
  useEffect(() => {
    if (user) {
      console.log('User state changed:', {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        isAnonymous: user.isAnonymous,
        photoURL: user.photoURL
      });
    }
  }, [user]);
  const [showNotifications, setShowNotifications] = useState(false)
  const [leaderboard, setLeaderboard] = useState<Array<{id: string; name: string; xp: number}>>([]);
  
  // Review state
  const [reviewingMaterial, setReviewingMaterial] = useState<ReviewingMaterial | null>(null);
  const [isTimerRunning] = useState(false)

  // Transform progress to include additional properties
  const extendedProgress = progress ? {
    ...progress,
    totalXP: progress.xp, // Map xp to totalXP for compatibility
    xpToNextLevel: progress.level * 100 - progress.xp, // Calculate xpToNextLevel
    coins: Math.floor(progress.xp / 10), // Calculate coins based on xp
    recentActivity: [], // Initialize empty recent activity
    streakDays: progress.streak, // Alias streak to streakDays
  } : null;
  
  const currentStreak = extendedProgress?.streak ?? 0;
  const level = extendedProgress?.level || 1;
  const rewards = Math.floor((extendedProgress?.xp || 0) / 100) || 0;
  
  // Helper function to safely access UserProgress properties
  const getProgressValue = <T extends keyof ExtendedUserProgress>(
    key: T,
    defaultValue: ExtendedUserProgress[T] = 0 as ExtendedUserProgress[T]
  ): ExtendedUserProgress[T] => {
    return extendedProgress?.[key] ?? defaultValue;
  };
  
  // Helper function to transform subject data for the UI
  const transformSubjectData = (subjects: UserProgress['subjects'] = {}) => {
    return Object.entries(subjects).map(([id, data]) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      progress: data.progress,
      level: Math.floor(data.xp / 100) + 1,
      completedLessons: data.lessonsCompleted || 0,
      totalLessons: (data.lessonsCompleted || 0) + 5, // Assuming 5 more lessons to complete
    }));
  };

  // Generate weekly progress data based on user activity
  const weeklyProgress: HeatmapData[] = [
    { date: '2023-01-01', value: 120, level: 2 },
    { date: '2023-01-02', value: 85, level: 1 },
    { date: '2023-01-03', value: 150, level: 3 },
    { date: '2023-01-04', value: 95, level: 2 },
    { date: '2023-01-05', value: 180, level: 3 },
    { date: '2023-01-06', value: 200, level: 4 },
    { date: '2023-01-07', value: 110, level: 2 },
  ]

  interface SubjectAnalytics {
    subject: string;
    completed: number;
    total: number;
    accuracy: number;
    timeSpent: number;
  }

  const subjectAnalytics: SubjectAnalytics[] = extendedProgress?.subjects
    ? Object.entries(extendedProgress.subjects).map(([key, data]) => ({
        subject: key.charAt(0).toUpperCase() + key.slice(1),
        completed: data.lessonsCompleted || 0,
        total: (data.lessonsCompleted || 0) + Math.floor(Math.random() * 20) + 10,
        accuracy: Math.min(95, 75 + Math.floor((data.xp || 0) / 10)),
        timeSpent: (data.lessonsCompleted || 0) * 15,
      }))
    : [];

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
    { 
      id: "progress", 
      label: "Progress", 
      icon: BarChart3,
      children: [
        { id: "progress-overview", label: "Overview", icon: BarChart3 },
        { id: "pomodoro-timer", label: "Pomodoro Timer", icon: Timer }
      ]
    },
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "support", label: "Support", icon: HelpCircle },
  ]

  const handleNavigation = (pageId: string) => {
    console.log('Navigating to:', pageId); // Debug log
    // Ensure the page ID is valid before updating state
    if (['home', 'lessons', 'progress', 'games', 'profile', 'settings', 'support', 'pomodoro-timer', 'progress-overview'].includes(pageId)) {
      setCurrentPage(pageId as StudentPage);
      // Close any open dropdown menus
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    } else {
      console.warn('Invalid page ID:', pageId);
    }
  }

  // Move the dynamic import to the top of the file with other imports
  const PomodoroTimer = dynamic(
    () => import('@/components/study/pomodoro-timer'),
    { 
      ssr: false,
      loading: () => (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ),
    }
  );

  const renderPage = (): React.ReactNode => {
    console.log('Current page:', currentPage); // Debug log
    if (reviewingMaterial) {
      return renderReviewSection();
    }

    switch (currentPage) {
      case "pomodoro-timer":
        return <PomodoroTimer />;
      case "home":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total XP</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{extendedProgress?.totalXP || 0}</div>
                  <p className="text-xs text-muted-foreground">+20% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Level</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{extendedProgress?.level || 1}</div>
                  <p className="text-xs text-muted-foreground">
                    {extendedProgress?.xpToNextLevel ? `${extendedProgress.xpToNextLevel} XP to next level` : 'Max level reached'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Streak</CardTitle>
                  <Flame className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{extendedProgress?.streakDays || 0} days</div>
                  <p className="text-xs text-muted-foreground">Keep it up!</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Coins</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{extendedProgress?.coins || 0}</div>
                  <p className="text-xs text-muted-foreground">Earn more by completing lessons</p>
                </CardContent>
              </Card>
            </div>
            
            <PerformanceHeatmap data={weeklyProgress} title="Weekly Activity" metric="XP" />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="space-y-4">
                    {extendedProgress?.recentActivity?.length ? (
                      extendedProgress.recentActivity.map((activity: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{activity}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Button variant="outline" className="justify-start" onClick={() => setCurrentPage('lessons')}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Continue Learning
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Target className="mr-2 h-4 w-4" />
                      Set Daily Goal
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "lessons":
        return <SubjectManager onReviewMaterial={handleReviewMaterial} />;
      case "progress":
        return <PerformanceHeatmap data={weeklyProgress} title="Performance Overview" metric="XP" />;
      case "profile":
        return <StudentProfile />;
      case "settings":
        return <StudentSettings />;
      case "support":
        return <div>Support Page</div>;
      case "games":
        return <ComprehensiveGameHub />;
      case "pomodoro-timer":
        return (
          <div className="flex justify-center items-center h-full">
            <PomodoroTimer />
          </div>
        );
      case "progress-overview":
        return <div>Progress Overview</div>;
      default:
        return null;
    }
  };

  interface StudyMaterial {
    id: string;
    title: string;
    type: string;
    duration: string;
    description: string;
    completed?: boolean;
    locked?: boolean;
  }

  interface Subject {
    id: string;
    name: string;
  }

  const handleReviewMaterial = (material: StudyMaterial, subject: Subject) => {
    setReviewingMaterial({ material, subject });
  };

  const renderReviewSection = () => {
    if (!reviewingMaterial || !reviewingMaterial.material || !reviewingMaterial.subject) {
      return null;
    }
    
    const { material, subject } = reviewingMaterial;
    
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Review: {material.title}</h2>
          <Button 
            variant="outline" 
            onClick={() => setReviewingMaterial(null)}
            className="flex items-center gap-2"
          >
            <span>←</span> Back to Lessons
          </Button>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                {material.type === 'video' ? (
                  <Video className="h-6 w-6" />
                ) : material.type === 'document' ? (
                  <FileText className="h-6 w-6" />
                ) : material.type === 'audio' ? (
                  <Headphones className="h-6 w-6" />
                ) : (
                  <Target className="h-6 w-6" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{material.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="capitalize">{material.type}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {material.duration}
                  </span>
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-lg">{material.description}</p>
              <div className="flex items-center gap-4">
                <Button variant="default" className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Play className="h-4 w-4" />
                  Start Review
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Bookmark
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };


  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6" />
            <span className="text-lg font-semibold">EduNova</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              item.children ? (
                <DropdownMenu key={item.id}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                      <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {item.children.map((child) => (
                      <DropdownMenuItem 
                        key={child.id}
                        onSelect={(e) => {
                          e.preventDefault();
                          handleNavigation(child.id);
                        }}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <child.icon className="h-4 w-4" />
                        {child.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => setCurrentPage(item.id as StudentPage)}
                  className="flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              )
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                    <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
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
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {currentPage === 'pomodoro-timer' ? (
          <div className="container mx-auto max-w-4xl">
            <PomodoroTimer />
          </div>
        ) : (
          renderPage()
        )}
      </main>
    </div>
  );
}
