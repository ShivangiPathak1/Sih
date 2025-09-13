"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  History, 
  Users, 
  SpellCheck, 
  Theater, 
  PenTool, 
  Briefcase, 
  Puzzle, 
  Presentation, 
  MessageSquare, 
  Brain, 
  Trophy,
  Star,
  Clock,
  Target,
  Gamepad2,
  Crown,
  Sparkles,
  Flame,
  Home,
  Settings,
  Award
} from "lucide-react"
import { GameSwiper } from "./game-swiper"

interface GameCategory {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  games: Game[]
  totalLevels: number
  completedLevels: number
}

export interface Game {
  id: string
  name: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced" | "expert"
  timeLimit?: number
  multiplayer: boolean
  collaborative: boolean
  xpReward: number
  unlocked: boolean
  completed: boolean
  bestScore?: number
  icon: React.ReactNode
  features: string[]
  emoji: string
}

interface Player {
  id: string
  name: string
  avatar: string
  level: number
  xp: number
  streak: number
}

interface GameSession {
  gameId: string
  players: Player[]
  startTime: Date
  isActive: boolean
}

export function ComprehensiveGameHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>("vocabulary")
  const [selectedGame, setSelectedGame] = useState<Game | null>({
    id: 'default-game',
    name: 'Default Game',
    description: 'Select a game to start playing',
    difficulty: 'beginner',
    multiplayer: false,
    collaborative: false,
    xpReward: 0,
    unlocked: true,
    completed: false,
    icon: <Gamepad2 className="h-5 w-5" />,
    features: [],
    emoji: '🎮'
  })
  const [activeSession, setActiveSession] = useState<GameSession | null>(null)
  const [gameScore, setGameScore] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [clickedElements, setClickedElements] = useState<Set<number>>(new Set())
  const [playerStats, setPlayerStats] = useState({
    level: 12,
    xp: 2450,
    streak: 7,
    totalGamesPlayed: 89,
    achievements: 23,
    name: 'Player', // Will be loaded from user profile
    avatar: '/placeholder-user.jpg' // Default avatar
  })
  
  // Load user profile on component mount
  useEffect(() => {
    // In a real app, this would come from your auth context or user profile
    const loadUserProfile = async () => {
      try {
        // Example: const user = await getUserProfile();
        // setPlayerStats(prev => ({
        //   ...prev,
        //   name: user.displayName || 'Player',
        //   avatar: user.photoURL || '/placeholder-user.jpg'
        // }));
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };
    
    loadUserProfile();
  }, []);

  const gameCategories: GameCategory[] = [
    {
      id: "vocabulary",
      name: "Vocabulary Master",
      description: "Word challenges and language games",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-blue-500",
      totalLevels: 25,
      completedLevels: 18,
      games: [
        {
          id: "word-match",
          name: "Word Definition Match",
          description: "Match words to their definitions under time pressure",
          difficulty: "beginner",
          timeLimit: 60,
          multiplayer: true,
          collaborative: false,
          xpReward: 50,
          unlocked: true,
          completed: true,
          bestScore: 95,
          icon: <Target className="h-5 w-5" />,
          features: ["Time Challenge", "Progressive Difficulty", "Hint System"],
          emoji: "🎯"
        },
        {
          id: "spelling-bee",
          name: "Spelling Bee Championship",
          description: "Spell words correctly with hints and power-ups",
          difficulty: "intermediate",
          timeLimit: 90,
          multiplayer: true,
          collaborative: false,
          xpReward: 75,
          unlocked: true,
          completed: false,
          bestScore: 78,
          icon: <SpellCheck className="h-5 w-5" />,
          features: ["Power-ups", "Hint System", "Championship Mode"],
          emoji: "🔤"
        },
        {
          id: "word-chain",
          name: "Word Chain Challenge",
          description: "Create chains of related words and limericks",
          difficulty: "advanced",
          multiplayer: true,
          collaborative: true,
          xpReward: 100,
          unlocked: true,
          completed: false,
          icon: <MessageSquare className="h-5 w-5" />,
          features: ["Creative Writing", "Collaborative", "Poetry Mode"],
          emoji: "📝"
        }
      ]
    },
    {
      id: "mathematics",
      name: "Math Adventure",
      description: "Story-driven math problems and puzzles",
      icon: <Calculator className="h-6 w-6" />,
      color: "bg-green-500",
      totalLevels: 30,
      completedLevels: 22,
      games: [
        {
          id: "math-story",
          name: "Math Quest Adventure",
          description: "Solve math problems to unlock story chapters",
          difficulty: "beginner",
          timeLimit: 120,
          multiplayer: false,
          collaborative: false,
          xpReward: 60,
          unlocked: true,
          completed: true,
          bestScore: 88,
          icon: <Gamepad2 className="h-5 w-5" />,
          features: ["Story Mode", "Progressive Levels", "Achievement System"],
          emoji: "📖"
        },
        {
          id: "budget-simulator",
          name: "Budget Master",
          description: "Learn real-world budgeting and financial skills",
          difficulty: "intermediate",
          timeLimit: 180,
          multiplayer: true,
          collaborative: true,
          xpReward: 80,
          unlocked: true,
          completed: false,
          icon: <Briefcase className="h-5 w-5" />,
          features: ["Real-world Skills", "Collaborative", "Simulation"],
          emoji: "💰"
        }
      ]
    },
    {
      id: "science",
      name: "Science Lab",
      description: "Interactive experiments and simulations",
      icon: <FlaskConical className="h-6 w-6" />,
      color: "bg-purple-500",
      totalLevels: 20,
      completedLevels: 15,
      games: [
        {
          id: "element-combiner",
          name: "Element Combination Lab",
          description: "Combine elements and see chemical reactions",
          difficulty: "intermediate",
          timeLimit: 300,
          multiplayer: true,
          collaborative: true,
          xpReward: 90,
          unlocked: true,
          completed: true,
          bestScore: 92,
          icon: <FlaskConical className="h-5 w-5" />,
          features: ["Interactive Lab", "Real Chemistry", "Collaborative"],
          emoji: "🧪"
        },
        {
          id: "measurement-master",
          name: "Measurement Challenge",
          description: "Practice real-world measurement skills",
          difficulty: "beginner",
          timeLimit: 90,
          multiplayer: false,
          collaborative: false,
          xpReward: 45,
          unlocked: true,
          completed: false,
          icon: <Target className="h-5 w-5" />,
          features: ["Real-world Skills", "Precision Training", "Visual Learning"],
          emoji: "📏"
        }
      ]
    },
    {
      id: "history",
      name: "History Detective",
      description: "Mystery-solving through historical clues",
      icon: <History className="h-6 w-6" />,
      color: "bg-orange-500",
      totalLevels: 18,
      completedLevels: 12,
      games: [
        {
          id: "mystery-solver",
          name: "Historical Mystery",
          description: "Gather clues to solve historical mysteries",
          difficulty: "advanced",
          timeLimit: 240,
          multiplayer: true,
          collaborative: true,
          xpReward: 120,
          unlocked: true,
          completed: true,
          bestScore: 85,
          icon: <History className="h-5 w-5" />,
          features: ["Mystery Solving", "Research Skills", "Collaborative"],
          emoji: "🔍"
        }
      ]
    },
    {
      id: "collaborative",
      name: "Team Challenges",
      description: "Multiplayer and collaborative learning games",
      icon: <Users className="h-6 w-6" />,
      color: "bg-pink-500",
      totalLevels: 15,
      completedLevels: 8,
      games: [
        {
          id: "scavenger-hunt",
          name: "Knowledge Scavenger Hunt",
          description: "Team-based riddles and clue hunting",
          difficulty: "intermediate",
          timeLimit: 600,
          multiplayer: true,
          collaborative: true,
          xpReward: 150,
          unlocked: true,
          completed: false,
          icon: <Users className="h-5 w-5" />,
          features: ["Team Play", "Riddles", "Time Challenge"],
          emoji: "🔎"
        },
        {
          id: "roleplay-scenarios",
          name: "Role-Playing Scenarios",
          description: "Answer questions as different characters",
          difficulty: "advanced",
          timeLimit: 300,
          multiplayer: true,
          collaborative: true,
          xpReward: 100,
          unlocked: true,
          completed: false,
          icon: <Theater className="h-5 w-5" />,
          features: ["Character Play", "Critical Thinking", "Collaborative"],
          emoji: "🎭"
        }
      ]
    },
    {
      id: "creative",
      name: "Creative Corner",
      description: "Storytelling and creative expression games",
      icon: <PenTool className="h-6 w-6" />,
      color: "bg-indigo-500",
      totalLevels: 12,
      completedLevels: 6,
      games: [
        {
          id: "storytelling",
          name: "Creative Storytelling",
          description: "Create stories using prompts, words, or images",
          difficulty: "intermediate",
          timeLimit: 180,
          multiplayer: true,
          collaborative: true,
          xpReward: 80,
          unlocked: true,
          completed: false,
          icon: <PenTool className="h-5 w-5" />,
          features: ["Creative Writing", "Visual Prompts", "Collaborative"],
          emoji: "✏️"
        },
        {
          id: "show-tell",
          name: "Show and Tell Research",
          description: "Research and present facts on various topics",
          difficulty: "advanced",
          timeLimit: 300,
          multiplayer: true,
          collaborative: true,
          xpReward: 100,
          unlocked: true,
          completed: false,
          icon: <Presentation className="h-5 w-5" />,
          features: ["Research Skills", "Presentation", "Knowledge Sharing"],
          emoji: "📚"
        }
      ]
    },
    {
      id: "brain-training",
      name: "Brain Training",
      description: "Logic puzzles and critical thinking challenges",
      icon: <Brain className="h-6 w-6" />,
      color: "bg-teal-500",
      totalLevels: 20,
      completedLevels: 14,
      games: [
        {
          id: "would-you-rather",
          name: "Would You Rather?",
          description: "Critical thinking based on lesson content",
          difficulty: "intermediate",
          timeLimit: 120,
          multiplayer: true,
          collaborative: true,
          xpReward: 70,
          unlocked: true,
          completed: true,
          bestScore: 90,
          icon: <Brain className="h-5 w-5" />,
          features: ["Critical Thinking", "Discussion", "Collaborative"],
          emoji: "🤔"
        },
        {
          id: "puzzle-master",
          name: "Progressive Puzzles",
          description: "Gradually increasing difficulty puzzles",
          difficulty: "expert",
          timeLimit: 300,
          multiplayer: false,
          collaborative: false,
          xpReward: 150,
          unlocked: true,
          completed: false,
          icon: <Puzzle className="h-5 w-5" />,
          features: ["Progressive Difficulty", "Logic Training", "Achievement System"],
          emoji: "🧩"
        }
      ]
    },
    {
      id: "history-detective",
      name: "History Detective",
      description: "Mystery-solving through historical clues",
      icon: <History className="h-6 w-6" />,
      color: "bg-orange-500",
      totalLevels: 18,
      completedLevels: 12,
      games: [
        {
          id: "mystery-solver",
          name: "Historical Mystery",
          description: "Gather clues to solve historical mysteries",
          difficulty: "advanced",
          timeLimit: 240,
          multiplayer: true,
          collaborative: true,
          xpReward: 120,
          unlocked: true,
          completed: true,
          bestScore: 85,
          icon: <History className="h-5 w-5" />,
          features: ["Mystery Solving", "Research Skills", "Collaborative"],
          emoji: "🔍"
        },
        {
          id: "time-travel",
          name: "Time Travel Adventure",
          description: "Navigate through different historical periods",
          difficulty: "intermediate",
          timeLimit: 180,
          multiplayer: false,
          collaborative: false,
          xpReward: 90,
          unlocked: true,
          completed: false,
          icon: <Clock className="h-5 w-5" />,
          features: ["Historical Context", "Timeline Navigation", "Cultural Learning"],
          emoji: "🕰️"
        }
      ]
    },
    {
      id: "spelling-bee",
      name: "Spelling Championship",
      description: "Spelling competitions with hints and power-ups",
      icon: <SpellCheck className="h-6 w-6" />,
      color: "bg-indigo-500",
      totalLevels: 15,
      completedLevels: 8,
      games: [
        {
          id: "spelling-challenge",
          name: "Spelling Bee Challenge",
          description: "Spell words correctly with hints and power-ups",
          difficulty: "intermediate",
          timeLimit: 90,
          multiplayer: true,
          collaborative: false,
          xpReward: 75,
          unlocked: true,
          completed: false,
          bestScore: 78,
          icon: <SpellCheck className="h-5 w-5" />,
          features: ["Power-ups", "Hint System", "Championship Mode"],
          emoji: "🔤"
        },
        {
          id: "word-master",
          name: "Word Master Tournament",
          description: "Advanced spelling with complex words",
          difficulty: "expert",
          timeLimit: 120,
          multiplayer: true,
          collaborative: false,
          xpReward: 100,
          unlocked: false,
          completed: false,
          icon: <Trophy className="h-5 w-5" />,
          features: ["Tournament Mode", "Advanced Words", "Competitive"],
          emoji: "🏆"
        }
      ]
    },
    {
      id: "roleplay",
      name: "Role-Playing Scenarios",
      description: "Answer questions as different characters",
      icon: <Theater className="h-6 w-6" />,
      color: "bg-pink-500",
      totalLevels: 12,
      completedLevels: 5,
      games: [
        {
          id: "ambassador-roleplay",
          name: "Diplomatic Ambassador",
          description: "Solve problems as a diplomatic ambassador",
          difficulty: "advanced",
          timeLimit: 300,
          multiplayer: true,
          collaborative: true,
          xpReward: 100,
          unlocked: true,
          completed: false,
          icon: <Theater className="h-5 w-5" />,
          features: ["Character Play", "Critical Thinking", "Collaborative"],
          emoji: "🎭"
        },
        {
          id: "scientist-roleplay",
          name: "Research Scientist",
          description: "Conduct experiments and solve scientific problems",
          difficulty: "intermediate",
          timeLimit: 240,
          multiplayer: false,
          collaborative: false,
          xpReward: 80,
          unlocked: true,
          completed: false,
          icon: <FlaskConical className="h-5 w-5" />,
          features: ["Scientific Method", "Problem Solving", "Research Skills"],
          emoji: "🔬"
        }
      ]
    },
    {
      id: "real-world-skills",
      name: "Real-World Skills",
      description: "Practical life skills and applications",
      icon: <Briefcase className="h-6 w-6" />,
      color: "bg-emerald-500",
      totalLevels: 10,
      completedLevels: 3,
      games: [
        {
          id: "budget-master",
          name: "Budget Master",
          description: "Learn real-world budgeting and financial skills",
          difficulty: "intermediate",
          timeLimit: 180,
          multiplayer: true,
          collaborative: true,
          xpReward: 80,
          unlocked: true,
          completed: false,
          icon: <Briefcase className="h-5 w-5" />,
          features: ["Real-world Skills", "Collaborative", "Simulation"],
          emoji: "💰"
        },
        {
          id: "measurement-challenge",
          name: "Measurement Challenge",
          description: "Practice real-world measurement skills",
          difficulty: "beginner",
          timeLimit: 90,
          multiplayer: false,
          collaborative: false,
          xpReward: 45,
          unlocked: true,
          completed: false,
          icon: <Target className="h-5 w-5" />,
          features: ["Real-world Skills", "Precision Training", "Visual Learning"],
          emoji: "📏"
        }
      ]
    }
  ]

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get difficulty icon
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🌱';
      case 'intermediate': return '📘';
      case 'advanced': return '🏆';
      case 'expert': return '🔥';
      default: return '❓';
    }
  };

  // Start a new game
  const startGame = (game: Game) => {
    setSelectedGame(game);
    setGameScore(0);
    setGameTime(0);
    setClickedElements(new Set());
    
    const player = {
      id: "player1",
      name: playerStats.name || 'Player',
      avatar: playerStats.avatar || '/placeholder-user.jpg',
      level: playerStats.level,
      xp: playerStats.xp,
      streak: playerStats.streak
    };
    
    if (game.multiplayer) {
      // Handle multiplayer game start
      console.log('Starting multiplayer game:', game.name);
      setActiveSession({
        gameId: game.id,
        players: [player],
        startTime: new Date(),
        isActive: true
      });
    } else {
      // Handle single player game start
      console.log('Starting single player game:', game.name);
      setActiveSession({
        gameId: game.id,
        players: [player],
        startTime: new Date(),
        isActive: true
      });
    }
  };

  // Join a multiplayer game
  const joinMultiplayerGame = (game: Game) => {
    console.log('Joining multiplayer game:', game.name);
    
    const player = {
      id: "player1",
      name: playerStats.name || 'Player',
      avatar: playerStats.avatar || '/placeholder-user.jpg',
      level: playerStats.level,
      xp: playerStats.xp,
      streak: playerStats.streak
    };
    
    // In a real app, this would join an existing multiplayer session
    setActiveSession({
      gameId: game.id,
      players: [
        player,
        // In a real app, this would include other players from the session
        {
          id: "player2",
          name: "Opponent",
          avatar: "/placeholder-opponent.jpg",
          level: Math.floor(Math.random() * 20) + 1,
          xp: Math.floor(Math.random() * 1000),
          streak: Math.floor(Math.random() * 10)
        }
      ],
      startTime: new Date(),
      isActive: true
    });
  };

  // Get all games for the swiper
  const allGames = gameCategories.flatMap(category => 
    category.games.map(game => ({
      ...game,
      emoji: game.emoji || '🎮' // Ensure all games have an emoji
    }))
  )

  const handleGameSelect = (game: Game) => {
    console.log('Selected game:', game.name)
    startGame(game)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Game Swiper */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Games</h2>
          <GameSwiper 
            games={allGames.slice(0, 5)} // Show first 5 games in swiper
            onGameSelect={handleGameSelect}
          />
        </div>
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎮 Comprehensive Game Hub
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore interactive learning games with progressive levels, collaborative challenges, and real-world skill development
          </p>
        </div>

        {/* Player Stats */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-4 border-white">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-lg">👤</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">Amandeep</h3>
                  <p className="text-blue-100">Level {playerStats.level} Explorer</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold">{playerStats.xp.toLocaleString()}</div>
                  <div className="text-sm text-blue-100">Total XP</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{playerStats.streak}</div>
                  <div className="text-sm text-blue-100">Day Streak</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{playerStats.totalGamesPlayed}</div>
                  <div className="text-sm text-blue-100">Games Played</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{playerStats.achievements}</div>
                  <div className="text-sm text-blue-100">Achievements</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="flex w-full mb-6 overflow-x-auto scrollbar-hide">
            {gameCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex flex-col gap-1 h-auto py-3 min-w-[120px] flex-shrink-0">
                <div className={`p-2 rounded-lg ${category.color} text-white`}>
                  {category.icon}
                </div>
                <span className="text-xs font-medium">{category.name}</span>
                <div className="text-xs text-muted-foreground">
                  {category.completedLevels}/{category.totalLevels}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {gameCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color} text-white`}>
                      {category.icon}
                    </div>
                    {category.name}
                  </h2>
                  <p className="text-muted-foreground mt-1">{category.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Progress</div>
                  <Progress 
                    value={(category.completedLevels / category.totalLevels) * 100} 
                    className="w-32 mt-1"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {category.completedLevels}/{category.totalLevels} levels
                  </div>
                </div>
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.games.map((game) => (
                  <Card key={game.id} className={`transition-all hover:shadow-lg ${!game.unlocked ? 'opacity-50' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${category.color} text-white`}>
                            {game.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{game.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getDifficultyColor(game.difficulty)}>
                                {getDifficultyIcon(game.difficulty)} {game.difficulty}
                              </Badge>
                              {game.timeLimit && (
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {game.timeLimit}s
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        {game.completed && (
                          <div className="text-green-500">
                            <Trophy className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription>{game.description}</CardDescription>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-1">
                        {game.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {/* Game Stats */}
                      {game.bestScore && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Best Score:</span>
                          <span className="font-medium">{game.bestScore}%</span>
                        </div>
                      )}

                      {/* XP Reward */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">XP Reward:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{game.xpReward}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {game.unlocked ? (
                          <>
                            <Button 
                              onClick={() => startGame(game)}
                              className="flex-1"
                              size="sm"
                            >
                              {game.completed ? "Play Again" : "Play"}
                            </Button>
                            {game.multiplayer && (
                              <Button 
                                variant="outline"
                                onClick={() => joinMultiplayerGame(game)}
                                size="sm"
                              >
                                <Users className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button disabled className="flex-1" size="sm">
                            <Crown className="h-4 w-4 mr-2" />
                            Locked
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">47</div>
              <div className="text-sm text-muted-foreground">Games Available</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">23</div>
              <div className="text-sm text-muted-foreground">Games Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">15</div>
              <div className="text-sm text-muted-foreground">Multiplayer Games</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">8</div>
              <div className="text-sm text-muted-foreground">Collaborative Games</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Modal */}
        {selectedGame && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${gameCategories.find(c => c.id === selectedCategory)?.color} text-white`}>
                    {selectedGame.icon}
                  </div>
                  <div>
                    <CardTitle>{selectedGame.name}</CardTitle>
                    <CardDescription>{selectedGame.description}</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedGame(null)
                    setActiveSession(null)
                    setGameScore(0)
                    setGameTime(0)
                  }}
                >
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Game Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <Badge className={getDifficultyColor(selectedGame.difficulty)}>
                          {getDifficultyIcon(selectedGame.difficulty)} {selectedGame.difficulty}
                        </Badge>
                      </div>
                      {selectedGame.timeLimit && (
                        <div className="flex justify-between">
                          <span>Time Remaining:</span>
                          <span className={gameTime >= selectedGame.timeLimit * 0.8 ? "text-red-500 font-bold" : ""}>
                            {selectedGame.timeLimit - gameTime}s
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Score:</span>
                        <span className="font-bold text-primary">{gameScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>XP Reward:</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          {selectedGame.xpReward}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedGame.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Game Content */}
                <div className="border rounded-lg p-6 bg-muted/50">
                  <h4 className="font-medium mb-4">Game Preview</h4>
                  {selectedGame.id === "word-match" && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Match the words with their definitions:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="font-medium">Words:</h5>
                          {["Ephemeral", "Ubiquitous", "Serendipity", "Mellifluous"].map((word, i) => (
                            <div 
                              key={i} 
                              className={`p-2 border rounded cursor-pointer hover:bg-primary/10 transition-colors ${
                                clickedElements.has(i) ? 'bg-green-100 border-green-500' : ''
                              }`}
                              onClick={() => {
                                if (!clickedElements.has(i)) {
                                  setGameScore(prev => prev + 10)
                                  setClickedElements(prev => new Set([...prev, i]))
                                }
                              }}
                            >
                              {word}
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium">Definitions:</h5>
                          {["Lasting for a very short time", "Present everywhere", "Pleasant surprise", "Sweet-sounding"].map((def, i) => (
                            <div 
                              key={i + 4} 
                              className={`p-2 border rounded cursor-pointer hover:bg-primary/10 transition-colors ${
                                clickedElements.has(i + 4) ? 'bg-green-100 border-green-500' : ''
                              }`}
                              onClick={() => {
                                if (!clickedElements.has(i + 4)) {
                                  setGameScore(prev => prev + 10)
                                  setClickedElements(prev => new Set([...prev, i + 4]))
                                }
                              }}
                            >
                              {def}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Click on words and definitions to match them!</p>
                      </div>
                    </div>
                  )}
                  {selectedGame.id === "spelling-bee" && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Spell the word correctly:</p>
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-4">C-O-N-S-T-I-T-U-T-I-O-N</div>
                        <div className="text-sm text-muted-foreground mb-4">Definition: The basic principles and laws of a nation</div>
                        <div className="flex justify-center gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => {
                              if (!clickedElements.has(10)) {
                                setGameScore(prev => prev + 20)
                                setClickedElements(prev => new Set([...prev, 10]))
                              }
                            }}
                            disabled={clickedElements.has(10)}
                          >
                            {clickedElements.has(10) ? 'Answered!' : 'Correct! (+20 points)'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              if (!clickedElements.has(11)) {
                                setGameScore(prev => Math.max(0, prev - 5))
                                setClickedElements(prev => new Set([...prev, 11]))
                              }
                            }}
                            disabled={clickedElements.has(11)}
                          >
                            {clickedElements.has(11) ? 'Answered!' : 'Wrong (-5 points)'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedGame.id === "word-chain" && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Create a chain of related words:</p>
                      <div className="space-y-2">
                        <div className="p-2 border rounded">Ocean → Wave → Surf → Beach → Sand → Castle</div>
                        <div className="text-sm text-muted-foreground">Your turn! Add the next word in the chain...</div>
                      </div>
                    </div>
                  )}
                  {!["word-match", "spelling-bee", "word-chain"].includes(selectedGame.id) && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">🎮</div>
                      <p className="text-muted-foreground">Game content will be loaded here...</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      // Simulate game completion
                      const finalScore = gameScore
                      const xpEarned = selectedGame.xpReward + Math.floor(finalScore / 10)
                      setPlayerStats(prev => ({
                        ...prev,
                        xp: prev.xp + xpEarned,
                        totalGamesPlayed: prev.totalGamesPlayed + 1
                      }))
                      setSelectedGame(null)
                      setActiveSession(null)
                      setGameScore(0)
                      setGameTime(0)
                      setClickedElements(new Set())
                    }}
                  >
                    Complete Game (Score: {gameScore}, +{selectedGame.xpReward + Math.floor(gameScore / 10)} XP)
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedGame(null)
                      setActiveSession(null)
                      setGameScore(0)
                      setGameTime(0)
                      setClickedElements(new Set())
                    }}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
