"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Settings, Bell, Volume2, Shield, Palette, Zap, Moon, Sun, Smartphone } from "lucide-react"

interface SettingsState {
  // Notifications
  pushNotifications: boolean
  emailNotifications: boolean
  achievementAlerts: boolean
  dailyReminders: boolean

  // Appearance
  theme: "light" | "dark" | "system"
  fontSize: number
  dyslexiaFont: boolean
  highContrast: boolean

  // Audio
  soundEffects: boolean
  backgroundMusic: boolean
  volume: number

  // Learning
  language: string
  difficultyLevel: "easy" | "medium" | "hard"
  studyReminders: boolean
  pomodoroLength: number

  // Privacy
  profileVisibility: "public" | "friends" | "private"
  shareProgress: boolean
  dataCollection: boolean
}

export function StudentSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SettingsState>({
    // Notifications
    pushNotifications: true,
    emailNotifications: false,
    achievementAlerts: true,
    dailyReminders: true,

    // Appearance
    theme: "system",
    fontSize: 16,
    dyslexiaFont: false,
    highContrast: false,

    // Audio
    soundEffects: true,
    backgroundMusic: false,
    volume: 70,

    // Learning
    language: "english",
    difficultyLevel: "medium",
    studyReminders: true,
    pomodoroLength: 25,

    // Privacy
    profileVisibility: "friends",
    shareProgress: true,
    dataCollection: true,
  })

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    try {
      // Here you would save to Firestore
      // await updateUserSettings(userId, settings)

      toast({
        title: "Settings Saved! ✅",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetToDefaults = () => {
    setSettings({
      pushNotifications: true,
      emailNotifications: false,
      achievementAlerts: true,
      dailyReminders: true,
      theme: "system",
      fontSize: 16,
      dyslexiaFont: false,
      highContrast: false,
      soundEffects: true,
      backgroundMusic: false,
      volume: 70,
      language: "english",
      difficultyLevel: "medium",
      studyReminders: true,
      pomodoroLength: 25,
      profileVisibility: "friends",
      shareProgress: true,
      dataCollection: true,
    })

    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings & Preferences
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="achievement-alerts">Achievement Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when you earn badges</p>
                </div>
                <Switch
                  id="achievement-alerts"
                  checked={settings.achievementAlerts}
                  onCheckedChange={(checked) => updateSetting("achievementAlerts", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-reminders">Daily Study Reminders</Label>
                  <p className="text-sm text-muted-foreground">Remind me to study every day</p>
                </div>
                <Switch
                  id="daily-reminders"
                  checked={settings.dailyReminders}
                  onCheckedChange={(checked) => updateSetting("dailyReminders", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={settings.theme} onValueChange={(value: any) => updateSetting("theme", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="font-size">Font Size: {settings.fontSize}px</Label>
                <Slider
                  id="font-size"
                  min={12}
                  max={24}
                  step={1}
                  value={[settings.fontSize]}
                  onValueChange={(value) => updateSetting("fontSize", value[0])}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dyslexia-font">Dyslexia-Friendly Font</Label>
                  <p className="text-sm text-muted-foreground">Use OpenDyslexic font for better readability</p>
                </div>
                <Switch
                  id="dyslexia-font"
                  checked={settings.dyslexiaFont}
                  onCheckedChange={(checked) => updateSetting("dyslexiaFont", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-contrast">High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Audio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="volume">Volume: {settings.volume}%</Label>
                <Slider
                  id="volume"
                  min={0}
                  max={100}
                  step={5}
                  value={[settings.volume]}
                  onValueChange={(value) => updateSetting("volume", value[0])}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound-effects">Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">Play sounds for interactions and achievements</p>
                </div>
                <Switch
                  id="sound-effects"
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => updateSetting("soundEffects", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="background-music">Background Music</Label>
                  <p className="text-sm text-muted-foreground">Play ambient music while studying</p>
                </div>
                <Switch
                  id="background-music"
                  checked={settings.backgroundMusic}
                  onCheckedChange={(checked) => updateSetting("backgroundMusic", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Learning Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="odia">ଓଡ଼ିଆ (Odia)</SelectItem>
                    <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty">Default Difficulty Level</Label>
                <Select
                  value={settings.difficultyLevel}
                  onValueChange={(value: any) => updateSetting("difficultyLevel", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pomodoro">Pomodoro Timer Length: {settings.pomodoroLength} minutes</Label>
                <Slider
                  id="pomodoro"
                  min={15}
                  max={60}
                  step={5}
                  value={[settings.pomodoroLength]}
                  onValueChange={(value) => updateSetting("pomodoroLength", value[0])}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="study-reminders">Study Reminders</Label>
                  <p className="text-sm text-muted-foreground">Remind me to take breaks and study</p>
                </div>
                <Switch
                  id="study-reminders"
                  checked={settings.studyReminders}
                  onCheckedChange={(checked) => updateSetting("studyReminders", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <Select
                  value={settings.profileVisibility}
                  onValueChange={(value: any) => updateSetting("profileVisibility", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Everyone can see</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private - Only me</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="share-progress">Share Progress</Label>
                  <p className="text-sm text-muted-foreground">Allow others to see my learning progress</p>
                </div>
                <Switch
                  id="share-progress"
                  checked={settings.shareProgress}
                  onCheckedChange={(checked) => updateSetting("shareProgress", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-collection">Analytics Data Collection</Label>
                  <p className="text-sm text-muted-foreground">Help improve the platform by sharing usage data</p>
                </div>
                <Switch
                  id="data-collection"
                  checked={settings.dataCollection}
                  onCheckedChange={(checked) => updateSetting("dataCollection", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={saveSettings} className="flex-1">
          Save All Settings
        </Button>
        <Button variant="outline" onClick={resetToDefaults} className="flex-1 bg-transparent">
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}
