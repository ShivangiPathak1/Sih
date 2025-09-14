"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useFirestoreProgress } from "@/hooks/use-firestore-progress"
import {
  BookOpen,
  Play,
  Lock,
  CheckCircle,
  Star,
  Target,
  Clock,
  FileText,
  Video,
  Headphones,
  Search,
} from "lucide-react"

interface StudyMaterial {
  id: string
  title: string
  type: "video" | "document" | "audio" | "interactive"
  duration: string
  difficulty: "easy" | "medium" | "hard"
  completed: boolean
  locked: boolean
  description: string
}

interface Subject {
  id: string
  name: string
  emoji: string
  color: string
  progress: number
  totalLessons: number
  completedLessons: number
  xp: number
  materials: StudyMaterial[]
}

const subjects: Subject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    emoji: "🧮",
    color: "bg-blue-500",
    progress: 65,
    totalLessons: 20,
    completedLessons: 13,
    xp: 450,
    materials: [
      {
        id: "math-1",
        title: "Introduction to Algebra",
        type: "video",
        duration: "15 min",
        difficulty: "easy",
        completed: true,
        locked: false,
        description: "Learn the basics of algebraic expressions and equations",
      },
      {
        id: "math-2",
        title: "Linear Equations Practice",
        type: "interactive",
        duration: "20 min",
        difficulty: "medium",
        completed: true,
        locked: false,
        description: "Interactive exercises to master linear equations",
      },
      {
        id: "math-3",
        title: "Quadratic Functions",
        type: "document",
        duration: "25 min",
        difficulty: "hard",
        completed: false,
        locked: false,
        description: "Understanding quadratic functions and their graphs",
      },
      {
        id: "math-4",
        title: "Advanced Problem Solving",
        type: "video",
        duration: "30 min",
        difficulty: "hard",
        completed: false,
        locked: true,
        description: "Complex mathematical problem-solving techniques",
      },
    ],
  },
  {
    id: "science",
    name: "Science",
    emoji: "🔬",
    color: "bg-green-500",
    progress: 80,
    totalLessons: 15,
    completedLessons: 12,
    xp: 380,
    materials: [
      {
        id: "sci-1",
        title: "States of Matter",
        type: "video",
        duration: "18 min",
        difficulty: "easy",
        completed: true,
        locked: false,
        description: "Explore solid, liquid, and gas states",
      },
      {
        id: "sci-2",
        title: "Chemical Reactions Lab",
        type: "interactive",
        duration: "25 min",
        difficulty: "medium",
        completed: true,
        locked: false,
        description: "Virtual chemistry lab experiments",
      },
      {
        id: "sci-3",
        title: "Physics: Motion and Forces",
        type: "document",
        duration: "22 min",
        difficulty: "medium",
        completed: false,
        locked: false,
        description: "Understanding motion, velocity, and forces",
      },
    ],
  },
  {
    id: "english",
    name: "English",
    emoji: "📚",
    color: "bg-purple-500",
    progress: 45,
    totalLessons: 18,
    completedLessons: 8,
    xp: 290,
    materials: [
      {
        id: "eng-1",
        title: "Grammar Fundamentals",
        type: "document",
        duration: "20 min",
        difficulty: "easy",
        completed: true,
        locked: false,
        description: "Master the basics of English grammar",
      },
      {
        id: "eng-2",
        title: "Creative Writing Workshop",
        type: "interactive",
        duration: "30 min",
        difficulty: "medium",
        completed: false,
        locked: false,
        description: "Learn to write engaging stories and essays",
      },
      {
        id: "eng-3",
        title: "Literature Analysis",
        type: "audio",
        duration: "35 min",
        difficulty: "hard",
        completed: false,
        locked: true,
        description: "Analyze classic literature and poetry",
      },
    ],
  },
]

interface SubjectManagerProps {
  onReviewMaterial?: (material: StudyMaterial, subject: Subject) => void;
}

export function SubjectManager({ onReviewMaterial }: SubjectManagerProps) {
  const { progress, finishLesson, addXP } = useFirestoreProgress()
  const { toast } = useToast()
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [reviewingMaterial, setReviewingMaterial] = useState<StudyMaterial | null>(null)

  const handleStartMaterial = async (material: StudyMaterial, subject: Subject) => {
    if (material.locked) {
      toast({
        title: "Material Locked 🔒",
        description: "Complete previous lessons to unlock this material.",
        variant: "destructive",
      })
      return
    }

    if (material.completed) {
      // Call the parent component's onReviewMaterial handler if provided
      if (onReviewMaterial) {
        onReviewMaterial(material, subject);
      } else {
        // Fallback to local state if no handler provided
        setSelectedSubject(subject);
        setReviewingMaterial({...material});
      }
      return;
    }

    // Simulate starting the material
    toast({
      title: `Starting: ${material.title} 🚀`,
      description: `Opening ${material.type} content...`,
    })

    // Simulate completion after a short delay
    setTimeout(async () => {
      const xpGained = material.difficulty === "easy" ? 15 : material.difficulty === "medium" ? 25 : 35

      await finishLesson(subject.id, xpGained)
      await addXP(xpGained)

      toast({
        title: "Material Completed! 🎉",
        description: `You earned ${xpGained} XP! Keep up the great work!`,
      })
    }, 2000)
  }

  const closeReview = () => {
    setReviewingMaterial(null)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      case "audio":
        return <Headphones className="h-4 w-4" />
      case "interactive":
        return <Target className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.materials.some((material) => material.title.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (selectedSubject) {
    return (
      <div className="space-y-6">
        {/* Subject Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full ${selectedSubject.color} flex items-center justify-center text-2xl`}
                >
                  {selectedSubject.emoji}
                </div>
                <div>
                  <CardTitle className="text-2xl">{selectedSubject.name}</CardTitle>
                  <p className="text-muted-foreground">
                    {selectedSubject.completedLessons} of {selectedSubject.totalLessons} lessons completed
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {selectedSubject.xp} XP
                    </Badge>
                    <Badge variant="outline">{selectedSubject.progress}% Complete</Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedSubject(null)}>
                Back to Subjects
              </Button>
            </div>
            <Progress value={selectedSubject.progress} className="mt-4" />
          </CardHeader>
        </Card>

        {/* Study Materials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Study Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSubject.materials.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Study Materials Available</h3>
                <p className="text-sm text-muted-foreground">
                  Study materials for this subject are being prepared. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {selectedSubject.materials.map((material, index) => (
                <Card
                  key={material.id}
                  className={`transition-all hover:shadow-md ${material.locked ? "opacity-60" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg ${selectedSubject.color} flex items-center justify-center text-white`}
                        >
                          {material.completed ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : material.locked ? (
                            <Lock className="h-6 w-6" />
                          ) : (
                            getTypeIcon(material.type)
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{material.title}</h4>
                            <Badge className={getDifficultyColor(material.difficulty)}>{material.difficulty}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{material.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {material.duration}
                            </span>
                            <span className="capitalize">{material.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {material.completed && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                        <Button
                          onClick={() => handleStartMaterial(material, selectedSubject)}
                          disabled={material.locked}
                          variant={material.completed ? "outline" : "default"}
                          className={material.completed ? "bg-transparent" : ""}
                        >
                          {material.locked ? (
                            <Lock className="h-4 w-4 mr-2" />
                          ) : material.completed ? (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          ) : (
                            <Play className="h-4 w-4 mr-2" />
                          )}
                          {material.locked ? "Locked" : material.completed ? "Review" : "Start"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render review section if we have a material to review
  if (reviewingMaterial && selectedSubject) {
    console.log('Rendering review section for:', reviewingMaterial.title);
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Review: {reviewingMaterial.title}</h2>
          <Button 
            variant="outline" 
            onClick={closeReview}
            className="flex items-center gap-2"
          >
            <span>←</span> Back to Materials
          </Button>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                {getTypeIcon(reviewingMaterial.type)}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{reviewingMaterial.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="capitalize">{reviewingMaterial.type}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {reviewingMaterial.duration}
                  </span>
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="prose max-w-none">
                <h4 className="font-medium mb-2">About This Material</h4>
                <p className="text-muted-foreground">
                  {reviewingMaterial.description}
                </p>
              </div>
              
              <div className="p-6 bg-muted/30 rounded-lg border">
                <div className="text-center space-y-2">
                  <h4 className="font-medium">Review Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    You're reviewing previously completed material. Take your time to go through the content again.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={closeReview}
                  className="ml-auto"
                >
                  Close Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subjects & Study Materials
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects or materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No Subjects Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm ? `No subjects match "${searchTerm}". Try a different search term.` : "No subjects are currently available."}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
          <Card
            key={subject.id}
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
            onClick={() => setSelectedSubject(subject)}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full ${subject.color} flex items-center justify-center text-2xl`}>
                  {subject.emoji}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{subject.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {subject.completedLessons}/{subject.totalLessons} lessons
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={subject.progress} />
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {subject.xp} XP
                  </Badge>
                  <Badge variant="outline">{subject.progress}% Complete</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    {subject.materials.filter((m) => m.type === "video").length} Videos
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {subject.materials.filter((m) => m.type === "document").length} Docs
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {subject.materials.filter((m) => m.type === "interactive").length} Interactive
                  </div>
                  <div className="flex items-center gap-1">
                    <Headphones className="h-3 w-3" />
                    {subject.materials.filter((m) => m.type === "audio").length} Audio
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}
    </div>
  )
}
