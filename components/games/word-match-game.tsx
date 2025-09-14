"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, RotateCw, ArrowLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

const WORDS = [
  { word: "Ephemeral", meaning: "Lasting for a very short time" },
  { word: "Ubiquitous", meaning: "Present everywhere" },
  { word: "Eloquent", meaning: "Fluent or persuasive in speaking or writing" },
  { word: "Meticulous", meaning: "Showing great attention to detail" },
  { word: "Resilient", meaning: "Able to recover quickly from difficulties" },
]

const OPTIONS = [
  "Present everywhere",
  "Lasting for a very short time",
  "Fluent or persuasive in speaking or writing",
  "Able to recover quickly from difficulties",
  "Showing great attention to detail",
  "Extremely happy",
  "Very large in size",
  "Moving quickly"
]

interface WordMatchGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

export function WordMatchGame({ onComplete, onBack }: WordMatchGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isGameOver, setIsGameOver] = useState(false)
  const router = useRouter()
  
  const currentWord = WORDS[currentIndex]
  const shuffledOptions = [...new Set([...OPTIONS].sort(() => Math.random() - 0.5))].slice(0, 4)
  
  if (!shuffledOptions.includes(currentWord.meaning)) {
    shuffledOptions[3] = currentWord.meaning
    // Shuffle again to randomize position
    shuffledOptions.sort(() => Math.random() - 0.5)
  }

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setIsGameOver(true)
      onComplete(score)
    }
  }, [timeLeft, isGameOver, score, onComplete])

  const handleAnswer = (option: string) => {
    if (selectedOption) return // Prevent multiple selections
    
    setSelectedOption(option)
    
    if (option === currentWord.meaning) {
      setScore(score + 10)
    }
    
    setTimeout(() => {
      if (currentIndex < WORDS.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setSelectedOption(null)
      } else {
        setIsGameOver(true)
        onComplete(option === currentWord.meaning ? score + 10 : score)
      }
    }, 1000)
  }

  const restartGame = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setScore(0)
    setTimeLeft(60)
    setIsGameOver(false)
  }

  if (isGameOver) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-4 top-4"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-2xl font-bold text-center">Game Over!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">{score}</p>
            <p className="text-muted-foreground">Your Score, User</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
            <Button 
              onClick={() => onComplete(score)}
              className="w-full"
            >
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Word Match</CardTitle>
          <div className="flex items-center gap-2">
            <div className="font-medium">Score: {score}</div>
            <div className="w-20">
              <Progress value={(timeLeft / 60) * 100} className="h-2" />
              <div className="text-xs text-right">{timeLeft}s</div>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Match the word with its correct meaning
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-2xl font-bold text-center py-8 bg-muted/50 rounded-lg">
          {currentWord.word}
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {shuffledOptions.map((option) => {
            const isSelected = selectedOption === option
            const isCorrect = option === currentWord.meaning
            const showResult = selectedOption !== null
            
            let buttonVariant: "default" | "secondary" | "destructive" | "outline" = "outline"
            
            if (showResult) {
              if (isSelected) {
                buttonVariant = isCorrect ? "default" : "destructive"
              } else if (isCorrect) {
                buttonVariant = "default"
              }
            }
            
            return (
              <Button
                key={option}
                variant={buttonVariant}
                className={`h-auto min-h-[60px] py-3 px-4 justify-start text-left whitespace-normal ${showResult ? 'cursor-default' : 'hover:bg-secondary/50'}`}
                onClick={() => handleAnswer(option)}
                disabled={selectedOption !== null}
              >
                <div className="flex items-center w-full">
                  {showResult && (
                    <div className="mr-3">
                      {isSelected ? (
                        isCorrect ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )
                      ) : isCorrect ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : null}
                    </div>
                  )}
                  <span>{option}</span>
                </div>
              </Button>
            )
          })}
        </div>
        
        <div className="text-sm text-muted-foreground text-center">
          Question {currentIndex + 1} of {WORDS.length}
        </div>
      </CardContent>
    </Card>
  )
}
