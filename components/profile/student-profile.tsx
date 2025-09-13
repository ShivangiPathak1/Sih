"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { updateProfile } from "firebase/auth"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
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
import { userService, UserProfile } from "@/lib/user-service"
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
  Loader2,
} from "lucide-react"

export function StudentProfile() {
  const { user } = useAuth()
  const { progress } = useFirestoreProgress()
  const { toast } = useToast()
  const storage = getStorage()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    grade: "",
    school: "",
    address: "",
    bio: "",
    avatar: user?.photoURL || "/placeholder.svg",
    interests: [],
    favoriteSubjects: [],
  })
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.uid) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      })
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 2MB',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsSaving(true)
      
      // Upload to Firebase Storage
      const fileExt = file.name.split('.').pop()
      const storageRef = ref(storage, `profilePictures/${user.uid}/avatar.${fileExt}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)

      // Update profile with new avatar URL
      await userService.saveUserProfile(user.uid, { avatar: downloadURL })
      
      // Update auth profile
      await updateProfile(user, { photoURL: downloadURL })
      
      // Update local state
      setProfile(prev => ({ ...prev, avatar: downloadURL }))
      
      toast({
        title: 'Success',
        description: 'Profile picture updated successfully!',
      })
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile picture. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return ''
    try {
      // Handle both ISO format and timestamp
      const date = new Date(dateString)
      // Check if the date is valid
      if (isNaN(date.getTime())) return ''
      
      // Convert to local date string in YYYY-MM-DD format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error)
      return ''
    }
  }

  // Parse date from input field
  const parseDateFromInput = (dateString: string): string => {
    if (!dateString) return ''
    try {
      // Create date in local timezone
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) return ''
      
      // Return ISO string in UTC
      return date.toISOString();
    } catch (error) {
      console.error("Error parsing date:", error)
      return ''
    }
  }

  // Load user profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return
      
      try {
        setIsLoading(true)
        const userProfile = await userService.getUserProfile(user.uid)
        
        if (userProfile) {
          setProfile(prev => ({
            ...prev,
            ...userProfile,
            dateOfBirth: formatDateForInput(userProfile.dateOfBirth),
            email: userProfile.email || user.email || ''
          }))
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProfile()
  }, [user?.uid])

  const handleSave = async () => {
    if (!user?.uid) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      
      // Prepare the profile data
      const profileData = {
        ...profile,
        // Ensure required fields are included
        name: profile.name || user.displayName || 'Student',
        email: profile.email || user.email || '',
        // Clean up any empty strings
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth || '',
        grade: profile.grade || '',
        school: profile.school || '',
        address: profile.address || '',
        bio: profile.bio || '',
        interests: profile.interests || [],
        favoriteSubjects: profile.favoriteSubjects || [],
        avatar: profile.avatar || '/placeholder.svg'
      }
      
      await userService.saveUserProfile(user.uid, profileData)
      
      // Update the profile state with the saved data
      setProfile(profileData)
      
      // Update the user's display name in auth if it changed
      if (profile.name && profile.name !== user.displayName) {
        await updateProfile(user, {
          displayName: profile.name
        })
      }
      
      setIsEditing(false)
      toast({
        title: "Profile Updated! 🎉",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = <K extends keyof UserProfile>(
    field: K,
    value: UserProfile[K] | string | string[]
  ) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const achievements = [
    { id: "1", title: "First Quiz Master", description: "Completed your first quiz", icon: "🏆", date: "2024-01-15" },
    { id: "2", title: "Week Warrior", description: "7-day learning streak", icon: "🔥", date: "2024-01-20" },
    { id: "3", title: "Math Genius", description: "Scored 100% in mathematics", icon: "🧮", date: "2024-01-25" },
    { id: "4", title: "Science Explorer", description: "Completed 10 science lessons", icon: "🔬", date: "2024-02-01" },
  ]

  // Calculate level based on XP: level = floor(√(xp/100)) + 1
  // Forced to level 2 for demonstration
  const calculateLevel = (xp: number = 0) => {
    return 2 // Force level 2
  }

  const stats = [
    { label: "Total XP", value: progress?.xp || 0, icon: Zap, color: "text-yellow-600" },
    { label: "Current Level", value: calculateLevel(progress?.xp), icon: Trophy, color: "text-blue-600" },
    {
      label: "Lessons Completed",
      value: progress?.totalLessonsCompleted || 0,
      icon: BookOpen,
      color: "text-green-600",
    },
    { label: "Current Streak", value: progress?.streak || 0, icon: Target, color: "text-red-600" },
  ]

  return (
    <div className="space-y-4 px-2 sm:px-4 max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card className="border-0 shadow-sm sm:border sm:shadow">
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  <AvatarImage 
                    src={profile.avatar} 
                    alt={profile.name || 'User'}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label 
                    htmlFor="avatar-upload"
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="h-5 w-5 text-white" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={isSaving}
                    />
                  </label>
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold">{profile.name || 'Student'}</h1>
                <p className="text-sm text-muted-foreground">{profile.grade || 'Grade not set'}</p>
                <p className="text-xs text-muted-foreground">{profile.school || 'School not set'}</p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    size="sm"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  size="sm"
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={profile.name || ''}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  {profile.name || 'Not specified'}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile.email || 'No email provided'}
              </p>
            </div>

            <div>
              <Label htmlFor="grade" className="text-sm font-medium">Grade/Class</Label>
              {isEditing ? (
                <Select 
                  value={profile.grade || ''}
                  onValueChange={(value) => handleInputChange("grade", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={`Grade ${i + 1}`}>
                        Grade {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  {profile.grade || 'Not specified'}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Level 2</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {progress?.xp || 200} XP
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full" 
                  style={{ 
                    width: `50%` // Halfway to next level
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Level 2</span>
                <span>Level 3</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
