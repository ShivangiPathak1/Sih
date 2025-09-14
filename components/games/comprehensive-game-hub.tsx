"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  BookOpen, 
  Calculator, 
  Clock, 
  Search, 
  Star, 
  TrendingUp,
  Activity,
  Award,
  HelpCircle,
  SpellCheck,
  Play
} from "lucide-react";
import { WordMatchGame } from "./word-match-game";
import { SynonymShowdownGame } from "./synonym-showdown-game";
import { MathChallengeGame } from "./math-challenge-game";

// Types
type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface GameCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  games: Game[];
  totalLevels: number;
  completedLevels: number;
}

interface Game {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  timeLimit?: number;
  multiplayer?: boolean;
  collaborative?: boolean;
  xpReward: number;
  unlocked?: boolean;
  completed?: boolean;
  bestScore?: number;
  icon: React.ReactNode;
  features: string[];
  emoji: string;
  category: string;
  playable?: boolean;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  bestScores?: Record<string, number>;
  completedGames?: string[];
}

interface GameSession {
  gameId: string;
  players: Player[];
  startTime: Date;
  isActive: boolean;
}

interface GameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
  startTime: Date;
  isActive: boolean;
}

// Helper function to get difficulty color
const getDifficultyColor = (difficulty: Difficulty): string => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800';
    case 'advanced':
      return 'bg-purple-100 text-purple-800';
    case 'expert':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function ComprehensiveGameHub() {
  // Game state
  const [selectedCategory, setSelectedCategory] = useState<string>("vocabulary");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeGameSession, setActiveGameSession] = useState<GameSession | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameTime, setGameTime] = useState<number>(0);
  
  // Mock player data - in a real app, this would come from your auth/user context
  const [player, setPlayer] = useState<Player>({
    id: 'player-1',
    name: 'Student',
    avatar: '/default-avatar.png',
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    bestScores: {},
    completedGames: []
  });

  // Handle game completion and back button click
  const handleGameComplete = (score: number) => {
    if (!selectedGame) return;
    
    // Update player's best score if current score is higher
    const currentBest = player.bestScores?.[selectedGame.id] || 0;
    const newBestScore = Math.max(score, currentBest);
    
    // Update player state
    setPlayer(prev => ({
      ...prev,
      xp: prev.xp + selectedGame.xpReward,
      bestScores: {
        ...(prev.bestScores || {}),
        [selectedGame.id]: newBestScore
      },
      completedGames: [
        ...(prev.completedGames || []),
        ...((prev.completedGames || []).includes(selectedGame.id) ? [] : [selectedGame.id])
      ]
    }));
    
    setGameScore(score);
    setSelectedGame(null);
    setActiveGameSession(null);
  };

  const handleBack = () => {
    setSelectedGame(null);
    setActiveGameSession(null);
    setGameScore(0);
    setGameTime(0);
  };

  // Start a new game session
  const startGame = (game: Game) => {
    setSelectedGame(game);
    setActiveGameSession({
      gameId: game.id,
      players: [{
        id: 'player1',
        name: player.name,
        avatar: player.avatar,
        level: player.level,
        xp: player.xp,
        xpToNextLevel: player.xpToNextLevel
      }],
      startTime: new Date(),
      isActive: true
    });
    setGameScore(0);
    setGameTime(0);
  };

  // Render the appropriate game component based on selection
  const renderGame = () => {
    if (!selectedGame) return null;

    const gameProps: GameProps = {
      onComplete: handleGameComplete,
      onBack: handleBack,
      startTime: activeGameSession?.startTime || new Date(),
      isActive: activeGameSession?.isActive || false
    };

    switch (selectedGame.id) {
      case 'word-match':
        return <WordMatchGame {...gameProps} />;
      case 'synonym-showdown':
        return <SynonymShowdownGame {...gameProps} />;
      case 'math-challenge':
        return <MathChallengeGame {...gameProps} />;
      default:
        return (
          <div className="text-center p-8">
            <div className="text-4xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold mb-2">Game Coming Soon!</h2>
            <p className="text-muted-foreground mb-6">
              This game is still in development. Check back later!
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </div>
        );
    }
  };

  // Render game grid for category view
  const renderGameGrid = () => {
    const category = gameCategories.find(cat => cat.id === selectedCategory);
    if (!category) return null;

    // Filter games based on search query
    const filteredGames = category.games.filter(game => 
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredGames.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No games found matching your search.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map((game) => (
          <Card 
            key={game.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => startGame(game)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">{game.emoji}</div>
                <CardTitle className="text-lg">{game.name}</CardTitle>
              </div>
              <Badge 
                variant="outline" 
                className={getDifficultyColor(game.difficulty as Difficulty)}
              >
                {game.difficulty}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{game.description}</p>
              <div className="mt-3 flex items-center text-sm text-muted-foreground">
                <div className="flex items-center mr-4">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>XP: {game.xpReward}</span>
                </div>
                {game.timeLimit && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{game.timeLimit}s</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Game categories data
  const gameCategories: GameCategory[] = [
    {
      id: 'vocabulary',
      name: 'Vocabulary',
      description: 'Enhance your word power and language skills',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'bg-blue-500',
      totalLevels: 15,
      completedLevels: 3,
      games: [
        {
          id: 'word-match',
          name: 'Word Match',
          description: 'Match words with their meanings',
          difficulty: 'beginner',
          timeLimit: 60,
          multiplayer: false,
          collaborative: false,
          xpReward: 50,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <SpellCheck className="h-5 w-5" />,
          features: ['Timed challenge', 'Multiple difficulty levels', 'Educational'],
          emoji: '📝',
          category: 'vocabulary',
          playable: true
        },
        {
          id: 'synonym-showdown',
          name: 'Synonym Showdown',
          description: 'Find synonyms and expand your vocabulary',
          difficulty: 'intermediate',
          timeLimit: 90,
          multiplayer: true,
          collaborative: false,
          xpReward: 150,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <BookOpen className="h-5 w-5" />,
          features: ['Multiplayer', 'Timed challenge', 'Vocabulary building'],
          emoji: '📚',
          category: 'vocabulary',
          playable: true
        }
      ]
    },
    {
      id: 'math',
      name: 'Mathematics',
      description: 'Sharpen your math skills',
      icon: <Calculator className="h-6 w-6" />,
      color: 'bg-green-500',
      totalLevels: 20,
      completedLevels: 5,
      games: [
        {
          id: 'math-challenge',
          name: 'Math Challenge',
          description: 'Solve arithmetic problems with increasing difficulty',
          difficulty: 'beginner',
          timeLimit: 60,
          multiplayer: false,
          collaborative: false,
          xpReward: 100,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Calculator className="h-5 w-5" />,
          features: ['Progressive difficulty', 'Timed challenge', 'Multiple operations'],
          emoji: '➕',
          category: 'mathematics',
          playable: true
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-4">
      {selectedGame ? (
        // Game view
        <div className="game-container">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Games
            </Button>
            {activeGameSession?.isActive && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Time: {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Score: {gameScore}</span>
                </div>
              </div>
            )}
          </div>
          {renderGame()}
        </div>
      ) : (
        // Game library view
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Game Library</h1>
              <p className="text-muted-foreground">
                Select a game to start playing and learning!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search games..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Tabs 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              {gameCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  {category.icon}
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {gameCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                  {renderGameGrid()}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ComprehensiveGameHub;
