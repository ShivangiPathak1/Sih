"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Send, Lightbulb, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  mood?: string
}

interface LearningTip {
  id: string
  title: string
  content: string
  subject: string
  difficulty: "beginner" | "intermediate" | "advanced"
  emoji: string
}

const learningTips: LearningTip[] = [
  {
    id: "1",
    title: "Math Made Easy",
    content: "Break complex problems into smaller steps. Start with what you know and build from there! 🧮",
    subject: "Mathematics",
    difficulty: "beginner",
    emoji: "🧮",
  },
  {
    id: "2",
    title: "Science Discovery",
    content: "Ask 'why' and 'how' questions about everything around you. Curiosity is your best learning tool! 🔬",
    subject: "Science",
    difficulty: "beginner",
    emoji: "🔬",
  },
  {
    id: "3",
    title: "Reading Comprehension",
    content: "Summarize each paragraph in your own words. This helps you understand and remember better! 📚",
    subject: "English",
    difficulty: "intermediate",
    emoji: "📚",
  },
]

const aiResponses = {
  greeting: [
    "Hello! I'm Vidya, your AI learning companion! How are you feeling about your studies today? 😊",
    "Hi there! Ready to learn something amazing today? I'm here to help you succeed! 🌟",
    "Welcome back! I'm excited to continue our learning journey together! 🚀",
  ],
  encouragement: [
    "You're doing great! Every question you ask makes you smarter! 💪",
    "I believe in you! Learning takes time, and you're making excellent progress! ⭐",
    "That's a wonderful question! Curiosity is the key to learning! 🔑",
  ],
  help: [
    "I'm here to help! What subject would you like to explore today? 🎯",
    "Let's break this down together. What specific topic are you working on? 📖",
    "No worries! We'll figure this out step by step. What's challenging you? 🤔",
  ],
}

export function AIMentorChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentMood, setCurrentMood] = useState<string>("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Initialize with greeting
    const greeting: Message = {
      id: "1",
      content: aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)],
      sender: "ai",
      timestamp: new Date(),
    }
    setMessages([greeting])
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("help") || lowerMessage.includes("stuck") || lowerMessage.includes("difficult")) {
      return aiResponses.help[Math.floor(Math.random() * aiResponses.help.length)]
    }

    if (lowerMessage.includes("math") || lowerMessage.includes("mathematics")) {
      return "Math can be fun! Let's start with the basics and build up. What specific math topic are you working on? I can suggest some practice problems! 🧮✨"
    }

    if (lowerMessage.includes("science")) {
      return "Science is all around us! What aspect of science interests you most? Physics, chemistry, biology, or earth science? Let's explore together! 🔬🌟"
    }

    if (lowerMessage.includes("english") || lowerMessage.includes("reading")) {
      return "Reading opens up whole new worlds! Are you working on comprehension, writing, or grammar? I have some great tips to share! 📚💡"
    }

    if (lowerMessage.includes("tired") || lowerMessage.includes("stressed")) {
      return "It's okay to feel that way sometimes! Let's take a short break. Try some deep breathing or a quick walk. Learning is a marathon, not a sprint! 🌸💆‍♀️"
    }

    if (lowerMessage.includes("good") || lowerMessage.includes("great") || lowerMessage.includes("awesome")) {
      return aiResponses.encouragement[Math.floor(Math.random() * aiResponses.encouragement.length)]
    }

    // Default responses
    const defaultResponses = [
      "That's interesting! Tell me more about what you're thinking. 🤔",
      "I love your curiosity! How can I help you learn more about this? 📖",
      "Great question! Let's explore this together. What would you like to know? 🔍",
      "You're on the right track! What specific help do you need? 🎯",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)

      toast({
        title: "AI Mentor Response",
        description: "Vidya has responded to your message!",
      })
    }, 1500)
  }

  const selectMood = (mood: string) => {
    setCurrentMood(mood)
    const moodMessage: Message = {
      id: Date.now().toString(),
      content: `I'm feeling ${mood} today`,
      sender: "user",
      timestamp: new Date(),
      mood,
    }

    setMessages((prev) => [...prev, moodMessage])

    // AI responds to mood
    setTimeout(() => {
      let response = ""
      switch (mood) {
        case "excited":
          response =
            "That's wonderful! Your excitement will help you learn faster. What would you like to explore today? 🚀"
          break
        case "confused":
          response = "It's perfectly normal to feel confused sometimes. Let's work through it together step by step! 🤝"
          break
        case "tired":
          response =
            "When we're tired, it's harder to focus. Maybe we should start with something fun and easy today? 😴"
          break
        case "motivated":
          response =
            "I love your motivation! Let's channel that energy into some challenging but rewarding learning! 💪"
          break
        default:
          response = "Thank you for sharing how you feel. I'm here to support you no matter what! 💙"
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* AI Mentor Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/friendly-ai-mentor-avatar.jpg" alt="Vidya AI Mentor" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">V</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Vidya - Your AI Learning Companion
              </CardTitle>
              <p className="text-muted-foreground">Always here to help you learn and grow! 🌟</p>
              <Badge variant="secondary" className="mt-2">
                Online & Ready to Help
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Mood Check */}
      {!currentMood && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              How are you feeling today?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { mood: "excited", emoji: "😄", color: "bg-yellow-100 hover:bg-yellow-200" },
                { mood: "confused", emoji: "😕", color: "bg-blue-100 hover:bg-blue-200" },
                { mood: "tired", emoji: "😴", color: "bg-purple-100 hover:bg-purple-200" },
                { mood: "motivated", emoji: "💪", color: "bg-green-100 hover:bg-green-200" },
              ].map(({ mood, emoji, color }) => (
                <Button
                  key={mood}
                  variant="outline"
                  className={`h-20 flex-col gap-2 ${color}`}
                  onClick={() => selectMood(mood)}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="capitalize">{mood}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Chat with Vidya
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-64 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm">Vidya is typing...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask Vidya anything about your studies..."
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!inputValue.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Today's Learning Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {learningTips.map((tip) => (
              <div key={tip.id} className="p-4 bg-muted rounded-lg border">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tip.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{tip.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {tip.subject}
                      </Badge>
                      <Badge
                        variant={
                          tip.difficulty === "beginner"
                            ? "secondary"
                            : tip.difficulty === "intermediate"
                              ? "default"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {tip.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tip.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
