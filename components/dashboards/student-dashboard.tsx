"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  BookOpen,
  Trophy,
  Target,
  Zap,
  Bell,
  Gift,
  Home,
  Gamepad2,
  BarChart3,
  Calendar,
  HelpCircle,
  Brain,
  Heart,
  Timer,
  Settings,
  Volume2,
  Sun,
  Moon,
  Languages,
  Flame,
  User,
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

type StudentPage =
  | "home"
  | "lessons"
  | "progress"
  | "schedule"
  | "support"
  | "ai-mentor"
  | "profile"
  | "settings"
  | "games"

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
export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const { progress, loading, addXP, finishLesson, finishQuiz, earnAchievement } = useFirestoreProgress()

  const [currentPage, setCurrentPage] = useState<StudentPage>("home")
  const [mood, setMood] = useState<string>("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  const [ownedItems, setOwnedItems] = useState<string[]>([])

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

  const [totalXPValue, setTotalXP] = useState(progress?.xp || 0)
  const [subjectsData, setSubjects] = useState(subjects)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => time - 1)
      }, 1000)
    } else if (pomodoroTime === 0) {
      setIsTimerRunning(false)
      toast({
        title: "🎉 Focus Session Complete!",
        description: "Great job! You earned 10 XP for completing your focus session.",
      })
      setTotalXP((prev) => prev + 10)
      setPomodoroTime(25 * 60)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, pomodoroTime, toast, setTotalXP])

  useEffect(() => {
    const unsubscribe = getLeaderboard((users) => {
      setLeaderboardData(users)
    })
    return () => unsubscribe()
  }, [])

  const completeChallenge = async (challengeId: string) => {
    const challenge = challenges.find((c) => c.id === challengeId)
    if (challenge && !challenge.completed) {
      setChallenges((prev) => prev.map((c) => (c.id === challengeId ? { ...c, completed: true } : c)))
      await addXP(challenge.xp)
      toast({
        title: "🎉 Challenge Complete!",
        description: `You earned ${challenge.xp} XP! ${challenge.emoji}`,
      })
    }
  }

  const completeQuiz = async (quizId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId)
    if (quiz && !quiz.completed) {
      const xpEarned = quiz.difficulty === "Easy" ? 25 : quiz.difficulty === "Medium" ? 50 : 75

      await finishQuiz({
        quizId: quiz.id,
        subject: "general",
        score: Math.floor(Math.random() * 3) + 8, // 8-10 score
        totalQuestions: quiz.questions,
        timeSpent: Number.parseInt(quiz.time) * 60,
        xpEarned,
      })

      setQuizzes((prev) => prev.map((q) => (q.id === quizId ? { ...q, completed: true } : q)))

      toast({
        title: "🎯 Quiz Completed!",
        description: `Great job! You earned ${xpEarned} XP!`,
      })
    }
  }

  const completeLesson = async (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId)
    if (subject) {
      const xpEarned = 30
      await finishLesson(subjectId, xpEarned)
      toast({
        title: "📚 Lesson Complete!",
        description: `You completed a ${subject.subject} lesson and earned ${xpEarned} XP!`,
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
        const xpEarned = quiz.difficulty === "Easy" ? 20 : quiz.difficulty === "Medium" ? 35 : 50
        setTotalXP((prev) => prev + xpEarned)
        toast({
          title: `🏆 Quiz Complete!`,
          description: `Excellent work! You earned ${xpEarned} XP!`,
        })
      }, 3000)
    }
  }

  const continueSubject = async (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId)
    if (subject && subject.unlocked) {
      toast({
        title: `${subject.emoji} Continuing ${subject.subject}`,
        description: `Let's pick up where you left off!`,
      })

      // Simulate progress increase and update Firestore
      setTimeout(async () => {
        try {
          const xpGained = 15
          await finishLesson(subjectId, xpGained)
          await addXP(xpGained)

          setSubjects((prev) =>
            prev.map((s) => (s.id === subjectId ? { ...s, progress: Math.min(100, s.progress + 5) } : s)),
          )
          setTotalXP((prev) => prev + xpGained)

          toast({
            title: "📈 Progress Updated!",
            description: `You earned ${xpGained} XP for studying ${subject.subject}!`,
          })
        } catch (error) {
          console.error("Error updating progress:", error)
          toast({
            title: "Error",
            description: "Failed to update progress. Please try again.",
            variant: "destructive",
          })
        }
      }, 2000)
    } else {
      toast({
        title: "Subject Locked 🔒",
        description: "Complete previous lessons to unlock this subject.",
        variant: "destructive",
      })
    }
  }

  const handlePurchase = async (item: { id: string; cost: number; discount?: number }) => {
    const effectiveCost = item.discount ? Math.floor(item.cost * (1 - item.discount / 100)) : item.cost
    const currentXP = progress?.xp || 0
    if (currentXP < effectiveCost) {
      toast({ title: "Not enough XP", description: "Keep learning to earn more XP and try again!" })
      return
    }
    await addXP(-effectiveCost)
    setOwnedItems((prev) => Array.from(new Set([...prev, item.id])))
    toast({ title: "🎁 Purchased!", description: "Your reward has been unlocked." })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "lessons", label: "Lessons", icon: BookOpen },
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "progress", label: "Progress", icon: BarChart3 },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "support", label: "Support", icon: HelpCircle },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <div className="space-y-6">
            {/* AI Mentor & Mood Check */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    🤖 AI Mentor - Vidya
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/friendly-ai-mentor-avatar.jpg" />
                      <AvatarFallback>🤖</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Great job on your {currentStreak}-day streak, {user?.name}! 🔥
                      </p>
                      <p className="text-xs text-muted-foreground">
                        You're doing amazing in Mathematics. Ready for today's challenge? ⭐
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() =>
                      toast({
                        title: "💡 Learning Tip",
                        description:
                          "Try the Pomodoro technique: 25 minutes of focused study, then a 5-minute break! 🍅",
                      })
                    }
                  >
                    Get Today's Learning Tip 💡
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-secondary" />
                    How are you feeling today? 😊
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { emoji: "😊", label: "Happy", value: "happy" },
                      { emoji: "😐", label: "Okay", value: "okay" },
                      { emoji: "😔", label: "Sad", value: "sad" },
                      { emoji: "😴", label: "Tired", value: "tired" },
                    ].map((moodOption) => (
                      <Button
                        key={moodOption.value}
                        variant={mood === moodOption.value ? "default" : "outline"}
                        className="h-16 flex-col gap-1"
                        onClick={() => {
                          setMood(moodOption.value)
                          toast({
                            title: `${moodOption.emoji} Mood Updated`,
                            description: "Thanks for sharing! I'll personalize your experience.",
                          })
                        }}
                      >
                        <span className="text-lg">{moodOption.emoji}</span>
                        <span className="text-xs">{moodOption.label}</span>
                      </Button>
                    ))}
                  </div>
                  {mood && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">
                        {mood === "happy" && "🎉 Fantastic! Let's channel that energy into learning!"}
                        {mood === "okay" && "👍 That's perfectly fine. Let's start with something fun!"}
                        {mood === "sad" && "🤗 I understand. How about we try some relaxing activities first?"}
                        {mood === "tired" && "😌 Let's take it easy today with some light revision."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total XP ⚡</p>
                      <p className="text-xl font-bold">{totalXPValue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary/10 p-2 rounded-lg">
                      <Flame className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Streak 🔥</p>
                      <p className="text-xl font-bold">{currentStreak} days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent/10 p-2 rounded-lg">
                      <Trophy className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Level 🏆</p>
                      <p className="text-xl font-bold">Level {level}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-chart-3/10 p-2 rounded-lg">
                      <Gift className="h-5 w-5 text-chart-3" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rewards 🎁</p>
                      <p className="text-xl font-bold">{rewards}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Challenges & Continue Learning */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />🎯 Today's Challenges
                  </CardTitle>
                  <CardDescription>Complete these tasks to earn bonus XP</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{challenge.emoji}</span>
                        <span className={challenge.completed ? "line-through text-muted-foreground" : ""}>
                          {challenge.task}
                        </span>
                      </div>
                      {challenge.completed ? (
                        <Badge variant="secondary">✅ Done</Badge>
                      ) : (
                        <Button size="sm" onClick={() => completeChallenge(challenge.id)}>
                          +{challenge.xp} XP
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />📚 Continue Learning
                  </CardTitle>
                  <CardDescription>Pick up where you left off</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <span className="text-lg">🧮</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Algebra Fundamentals</h4>
                        <p className="text-sm text-muted-foreground">Mathematics • Chapter 5</p>
                        <Progress value={75} className="w-32 mt-2" />
                      </div>
                    </div>
                    <Button onClick={() => continueSubject("math")}>Continue 📖</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Leaderboard */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />🏆 Class Leaderboard
                  </CardTitle>
                  <CardDescription>Your current rank vs classmates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {leaderboardData.slice(0, 5).map((entry: any, index: number) => (
                    <div key={entry.id || index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-3">
                        <Badge variant={index < 3 ? "default" : "secondary"}>{index + 1}</Badge>
                        <span className="text-sm font-medium">{entry.name || entry.id?.slice(0, 6)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{entry.xp?.toLocaleString?.() || 0} XP</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Reward Store */}
              <div className="lg:col-span-1">
                <RewardStore userXP={progress?.xp || 0} ownedItems={ownedItems} onPurchase={handlePurchase} />
              </div>
            </div>
          </div>
        )
      case "lessons":
        return <SubjectManager />
      case "games":
        return <ComprehensiveGameHub />
      case "progress":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">📊 Progress & Analytics Dashboard</h2>
              <p className="text-muted-foreground">
                Comprehensive insights into your learning journey with visual analytics 📈
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                {/* Weekly Progress Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">📈 Weekly Learning Analytics</CardTitle>
                    <CardDescription>Your XP and activity trends over the past week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-7 gap-2">
                        {weeklyProgress.map((day, index) => (
                          <div key={day.day} className="text-center">
                            <div className="text-xs text-muted-foreground mb-2">{day.day}</div>
                            <div
                              className="bg-primary rounded-lg flex flex-col items-center justify-end p-2 text-white text-xs font-bold"
                              style={{ height: `${Math.max(40, (day.xp / 200) * 100)}px` }}
                            >
                              {day.xp}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{day.activities} activities</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Total Week XP:{" "}
                          <strong className="text-primary">
                            {weeklyProgress.reduce((sum, day) => sum + day.xp, 0)}
                          </strong>
                        </span>
                        <span className="text-muted-foreground">
                          Avg Daily:{" "}
                          <strong className="text-secondary">
                            {Math.round(weeklyProgress.reduce((sum, day) => sum + day.xp, 0) / 7)}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subject Performance Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">🎯 Subject Performance Matrix</CardTitle>
                    <CardDescription>Detailed breakdown of your performance across subjects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {subjectAnalytics.map((subject, index) => (
                        <div key={subject.subject} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{subject.subject}</span>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-muted-foreground">
                                {subject.completed}/{subject.total} completed
                              </span>
                              <Badge variant="secondary">{subject.accuracy}% accuracy</Badge>
                              <span className="text-muted-foreground">{subject.timeSpent}min</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Completion</div>
                              <Progress value={(subject.completed / subject.total) * 100} className="h-2" />
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
                              <Progress value={subject.accuracy} className="h-2" />
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Time Investment</div>
                              <Progress value={(subject.timeSpent / 200) * 100} className="h-2" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">🔥 Performance Heatmap</CardTitle>
                    <CardDescription>Your learning activity intensity over the past months 📅</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PerformanceHeatmap data={[]} metric="activity" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">📈 Skill Growth Tracker</CardTitle>
                    <CardDescription>Your improvement in different cognitive skill areas 🧠</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { skill: "Problem Solving", level: 85, growth: "+12%", emoji: "🧩", color: "bg-blue-500" },
                      { skill: "Memory & Recall", level: 78, growth: "+8%", emoji: "🧠", color: "bg-purple-500" },
                      { skill: "Logic & Reasoning", level: 92, growth: "+15%", emoji: "🤔", color: "bg-green-500" },
                      { skill: "Language Skills", level: 88, growth: "+10%", emoji: "📝", color: "bg-orange-500" },
                      { skill: "Mathematical Thinking", level: 82, growth: "+18%", emoji: "🧮", color: "bg-red-500" },
                      { skill: "Creative Thinking", level: 75, growth: "+6%", emoji: "🎨", color: "bg-pink-500" },
                    ].map((skill) => (
                      <div key={skill.skill} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <span className="text-lg">{skill.emoji}</span>
                            <span className="font-medium">{skill.skill}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              {skill.growth}
                            </Badge>
                            <span className="text-sm font-bold">{skill.level}%</span>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress value={skill.level} className="h-3" />
                          <div
                            className={`absolute top-0 left-0 h-3 rounded-full ${skill.color} transition-all duration-500`}
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">🏆 Certificates & Badges</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Math Master 🧮", date: "Dec 2024", color: "bg-yellow-500", emoji: "🧮" },
                      { name: "Science Explorer 🔬", date: "Nov 2024", color: "bg-blue-500", emoji: "🔬" },
                      { name: "Reading Champion 📚", date: "Oct 2024", color: "bg-green-500", emoji: "📚" },
                    ].map((cert) => (
                      <div key={cert.name} className="flex items-center gap-3 p-2 border rounded-lg">
                        <div className={`w-8 h-8 ${cert.color} rounded-full flex items-center justify-center`}>
                          <span className="text-white text-sm">{cert.emoji}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{cert.name}</p>
                          <p className="text-xs text-muted-foreground">{cert.date}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">🔮 Predictive Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm font-medium">🧮 Mathematics</p>
                        <p className="text-xs text-muted-foreground">
                          At this pace, you'll complete Grade 10 Math in 15 days! 🚀
                        </p>
                      </div>
                      <div className="p-3 bg-secondary/5 rounded-lg">
                        <p className="text-sm font-medium">🔬 Science</p>
                        <p className="text-xs text-muted-foreground">
                          Focus on Physics to improve overall score by 12% ⚡
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )
      case "schedule":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">📅 Smart Schedule</h2>
              <p className="text-muted-foreground">Manage your time and build healthy study habits</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">📅 Study Calendar</CardTitle>
                    <CardDescription>Your personalized learning schedule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center text-sm font-medium p-2">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 35 }, (_, i) => (
                        <div
                          key={i}
                          className={`h-12 border rounded flex items-center justify-center text-sm ${
                            i % 7 === 0 || i % 7 === 6 ? "bg-muted/50" : "hover:bg-muted/50 cursor-pointer"
                          }`}
                          onClick={() => {
                            if (i + 1 <= 31) {
                              toast({
                                title: `📅 Day ${i + 1} Selected`,
                                description: "Click to add study sessions or view your schedule!",
                              })
                            }
                          }}
                        >
                          {i + 1 <= 31 ? i + 1 : ""}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Timer className="h-5 w-5" />🍅 Pomodoro Timer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-4xl font-bold mb-4">{formatTime(pomodoroTime)}</div>
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        onClick={() => {
                          setIsTimerRunning(!isTimerRunning)
                          toast({
                            title: isTimerRunning ? "⏸️ Timer Paused" : "▶️ Timer Started",
                            description: isTimerRunning ? "Take a break!" : "Focus time! You got this! 💪",
                          })
                        }}
                      >
                        {isTimerRunning ? "⏸️ Pause" : "▶️ Start"} Focus Session
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => {
                            setPomodoroTime(25 * 60)
                            setIsTimerRunning(false)
                          }}
                        >
                          25 min 🍅
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => {
                            setPomodoroTime(15 * 60)
                            setIsTimerRunning(false)
                          }}
                        >
                          15 min ⏰
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => {
                            setPomodoroTime(5 * 60)
                            setIsTimerRunning(false)
                          }}
                        >
                          5 min ☕
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">📝 Today's Tasks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { id: "1", task: "Math homework 🧮", time: "2:00 PM", completed: false },
                      { id: "2", task: "Science reading 🔬", time: "4:00 PM", completed: true },
                      { id: "3", task: "English essay ✍️", time: "6:00 PM", completed: false },
                    ].map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          toast({
                            title: task.completed ? "✅ Task Complete!" : "📝 Task Selected",
                            description: task.completed ? "Great job!" : `Working on: ${task.task}`,
                          })
                        }}
                      >
                        <div className={`w-2 h-2 rounded-full ${task.completed ? "bg-green-500" : "bg-primary"}`}></div>
                        <div className="flex-1">
                          <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                            {task.task}
                          </p>
                          <p className="text-xs text-muted-foreground">{task.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      case "support":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">🛠️ Support & Accessibility</h2>
              <p className="text-muted-foreground">Get help and customize your learning experience</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">⚙️ Accessibility Settings</CardTitle>
                  <CardDescription>Customize the platform for your needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      <span>{isDarkMode ? "🌙" : "☀️"} Dark Mode</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsDarkMode(!isDarkMode)
                        toast({
                          title: isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode",
                          description: "Theme updated successfully!",
                        })
                      }}
                    >
                      {isDarkMode ? "☀️ Light" : "🌙 Dark"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <span>🔊 Audio Instructions</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({ title: "🔊 Audio Enabled", description: "Audio instructions are now active!" })
                      }
                    >
                      Enable 🔊
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      <span>🌐 Language</span>
                    </div>
                    <Select defaultValue="english">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">🇺🇸 English</SelectItem>
                        <SelectItem value="hindi">🇮🇳 हिंदी</SelectItem>
                        <SelectItem value="odia">🇮🇳 ଓଡ଼ିଆ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">🆘 Get Help</CardTitle>
                  <CardDescription>We're here to support your learning journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() =>
                      toast({ title: "🤖 AI Tutor", description: "Hi! I'm here to help with any questions you have!" })
                    }
                  >
                    <Brain className="h-4 w-4 mr-2" />🤖 Ask AI Tutor
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() =>
                      toast({ title: "❓ FAQ", description: "Here are answers to frequently asked questions!" })
                    }
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />❓ FAQ & Guides
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() =>
                      toast({
                        title: "📞 Support",
                        description: "Your support ticket has been created. We'll get back to you soon!",
                      })
                    }
                  >
                    <Settings className="h-4 w-4 mr-2" />📞 Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case "ai-mentor":
        return <AIMentorChat />
      case "profile":
        return <StudentProfile />
      case "settings":
        return <StudentSettings />
      default:
        return null
    }
  }

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
      {/* Header */}
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
            >
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>👤</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user?.name} 😊</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-1">
              {[
                { id: "home", label: "Home", icon: Home },
                { id: "lessons", label: "Lessons", icon: BookOpen },
                { id: "games", label: "Games", icon: Gamepad2 },
                { id: "progress", label: "Progress", icon: BarChart3 },
                { id: "schedule", label: "Schedule", icon: Calendar },
                { id: "ai-mentor", label: "AI Mentor", icon: Brain },
                { id: "profile", label: "Profile", icon: User },
                { id: "settings", label: "Settings", icon: Settings },
                { id: "support", label: "Support", icon: HelpCircle },
              ].map((item) => (
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
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{renderPage()}</main>
    </div>
  )
}
