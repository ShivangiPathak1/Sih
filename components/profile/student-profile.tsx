"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useFirestoreProgress } from "@/hooks/use-firestore-progress"
import {
  User,
  Edit,
  Save,
  Trophy,
  Target,
  BookOpen,
  Calendar,
  MapPin,
  Phone,
  Mail,
  School,
  Award,
  Zap,
  Camera,
} from "lucide-react"

interface StudentProfile {
  name: string
  email: string
  phone: string
  dateOfBirth: string
  grade: string
  school: string
  address: string
  bio: string
  avatar: string
  interests: string[]
  favoriteSubjects: string[]
}

export function StudentProfile() {
  const { progress } = useFirestoreProgress()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<StudentProfile>({
    name: "Alex Student",
    email: "alex.student@school.edu",
    phone: "+91 98765 43210",
    dateOfBirth: "2010-05-15",
    grade: "Class 8",
    school: "Government High School",
    address: "123 Education Street, Learning City, State 123456",
    bio: "I love learning new things, especially science and mathematics. My goal is to become an engineer and help build a better future!",
    avatar: "/placeholder.svg",
    interests: ["Science", "Mathematics", "Technology", "Reading"],
    favoriteSubjects: ["Physics", "Computer Science", "Mathematics"],
  })

  const handleSave = async () => {
    try {
      // Simulate saving to Firestore
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Here you would save to Firestore
      // await updateUserProfile(userId, profile)
      
      // For now, we'll just update the local state
      console.log("Profile saved:", profile)

      setIsEditing(false)
      toast({
        title: "Profile Updated! 🎉",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: keyof StudentProfile, value: string | string[]) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const achievements = [
    { id: "1", title: "First Quiz Master", description: "Completed your first quiz", icon: "🏆", date: "2024-01-15" },
    { id: "2", title: "Week Warrior", description: "7-day learning streak", icon: "🔥", date: "2024-01-20" },
    { id: "3", title: "Math Genius", description: "Scored 100% in mathematics", icon: "🧮", date: "2024-01-25" },
    { id: "4", title: "Science Explorer", description: "Completed 10 science lessons", icon: "🔬", date: "2024-02-01" },
  ]

  const stats = [
    { label: "Total XP", value: progress?.xp || 0, icon: Zap, color: "text-yellow-600" },
    { label: "Current Level", value: progress?.level || 1, icon: Trophy, color: "text-blue-600" },
    {
      label: "Lessons Completed",
      value: progress?.totalLessonsCompleted || 0,
      icon: BookOpen,
      color: "text-green-600",
    },
    { label: "Current Streak", value: progress?.streak || 0, icon: Target, color: "text-red-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Profile
            </CardTitle>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="sm" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0">
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="text-muted-foreground">{profile.grade}</p>
                <Badge variant="secondary" className="mt-2">
                  Level {progress?.level || 1} Student
                </Badge>
              </div>
            </div>

            {/* Profile Information */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input id="name" value={profile.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                  ) : (
                    <p className="mt-1 text-sm">{profile.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  ) : (
                    <p className="mt-1 text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  ) : (
                    <p className="mt-1 text-sm flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {profile.phone}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      id="dob"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    />
                  ) : (
                    <p className="mt-1 text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(profile.dateOfBirth).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="grade">Grade/Class</Label>
                  {isEditing ? (
                    <Select value={profile.grade} onValueChange={(value) => handleInputChange("grade", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={`Class ${i + 1}`}>
                            Class {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-1 text-sm">{profile.grade}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="school">School</Label>
                  {isEditing ? (
                    <Input
                      id="school"
                      value={profile.school}
                      onChange={(e) => handleInputChange("school", e.target.value)}
                    />
                  ) : (
                    <p className="mt-1 text-sm flex items-center gap-2">
                      <School className="h-4 w-4" />
                      {profile.school}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    rows={2}
                  />
                ) : (
                  <p className="mt-1 text-sm flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    {profile.address}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="bio">About Me</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={3}
                  />
                ) : (
                  <p className="mt-1 text-sm">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats and Achievements */}
      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="subjects">Subject Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Earned on {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      <Award className="h-3 w-3 mr-1" />
                      Achievement
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subjects">
          <div className="space-y-4">
            {Object.entries(progress?.subjects || {}).map(([subject, data]) => (
              <Card key={subject}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold capitalize">{subject}</h4>
                    <Badge variant="outline">{data.xp} XP</Badge>
                  </div>
                  <Progress value={data.progress} className="mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{data.progress}% Complete</span>
                    <span>{data.lessonsCompleted} lessons completed</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
