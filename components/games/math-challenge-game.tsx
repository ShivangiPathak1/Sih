"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCw, ArrowLeft, Check, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

type Operator = '+' | '-' | '×' | '÷'

interface MathOption {
  id: string  // Changed to string type
  value: number
  isCorrect: boolean
  position: number  // Added to track position
}

interface MathProblem {
  num1: number
  num2: number
  operator: Operator
  answer: number
  options: MathOption[]
}

const generateProblem = (difficulty: number): MathProblem => {
  let maxNum = 10
  let operators: Operator[] = ['+', '-']
  
  if (difficulty > 1) {
    operators = ['+', '-', '×']
    maxNum = 15
  }
  
  if (difficulty > 2) {
    operators = ['+', '-', '×', '÷']
    maxNum = 20
  }
  
  const operator = operators[Math.floor(Math.random() * operators.length)]
  let num1 = Math.floor(Math.random() * maxNum) + 1
  let num2 = Math.floor(Math.random() * maxNum) + 1
  let answer: number
  
  switch (operator) {
    case '+':
      answer = num1 + num2
      break
    case '-':
      // Ensure we don't get negative numbers for subtraction
      if (num2 > num1) [num1, num2] = [num2, num1]
      answer = num1 - num2
      break
    case '×':
      answer = num1 * num2
      break
    case '÷':
      // For division, make sure it's a whole number
      num1 = num1 * num2
      answer = num1 / num2
      break
  }
  
  // Generate wrong answers with a fixed offset from the correct answer
  const wrongAnswers = new Set<number>();
  const offsets = [-4, -3, -2, -1, 1, 2, 3, 4];
  
  // First try fixed offsets
  for (const offset of offsets) {
    const wrongAnswer = answer + offset;
    if (wrongAnswer > 0 && wrongAnswer !== answer) {
      wrongAnswers.add(wrongAnswer);
      if (wrongAnswers.size >= 3) break;
    }
  }
  
  // If we still don't have enough wrong answers, try random ones
  let attempts = 0;
  const maxAttempts = 100;
  while (wrongAnswers.size < 3 && attempts < maxAttempts) {
    attempts++;
    const wrongAnswer = answer + (Math.floor(Math.random() * 10) - 5);
    if (wrongAnswer > 0 && wrongAnswer !== answer) {
      wrongAnswers.add(wrongAnswer);
    }
  }
  
  // If we still don't have enough, just use some defaults
  if (wrongAnswers.size < 3) {
    [1, 2, 3].forEach(n => {
      if (n !== answer) wrongAnswers.add(n);
    });
  }
  
  const wrongAnswersArray = Array.from(wrongAnswers);
  
  // Create options with stable positions
  const options: MathOption[] = [
    { id: 'a', value: answer, isCorrect: true, position: 0 },
    { id: 'b', value: wrongAnswersArray[0], isCorrect: false, position: 1 },
    { id: 'c', value: wrongAnswersArray[1], isCorrect: false, position: 2 },
    { id: 'd', value: wrongAnswersArray[2], isCorrect: false, position: 3 }
  ];
  
  // Always maintain the same order based on position
  options.sort((a, b) => a.position - b.position);
  
  return { num1, num2, operator, answer, options }
}

interface MathChallengeGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

// Create a default problem to use as initial state
const DEFAULT_PROBLEM: MathProblem = {
  num1: 2,
  num2: 2,
  operator: '+',
  answer: 4,
  options: [
    { id: 'a', value: 4, isCorrect: true, position: 0 },
    { id: 'b', value: 3, isCorrect: false, position: 1 },
    { id: 'c', value: 5, isCorrect: false, position: 2 },
    { id: 'd', value: 6, isCorrect: false, position: 3 }
  ]
};

export function MathChallengeGame({ onComplete, onBack }: MathChallengeGameProps) {
  const [problem, setProblem] = useState<MathProblem>(DEFAULT_PROBLEM)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isGameOver, setIsGameOver] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [difficulty, setDifficulty] = useState(1)
  const [problemCount, setProblemCount] = useState(0)
  const router = useRouter()

  // Initialize the first problem when the component mounts
  useEffect(() => {
    const initializeGame = async () => {
      try {
        const newProblem = generateProblem(1);
        setProblem(newProblem);
      } catch (error) {
        console.error('Error generating initial problem:', error);
        setProblem(DEFAULT_PROBLEM);
      }
    };
    
    initializeGame();
  }, []);
  
  const nextProblem = useCallback(() => {
    try {
      const newProblem = generateProblem(difficulty);
      setProblem(newProblem);
      setSelectedAnswer(null);
      setShowResult(false);
      setProblemCount(prev => prev + 1);
    } catch (error) {
      console.error('Error generating problem:', error);
      // Fallback to default problem if generation fails
      setProblem(DEFAULT_PROBLEM);
    }
  }, [difficulty]);
  
  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setIsGameOver(true)
      onComplete(score)
    }
  }, [timeLeft, isGameOver, score, onComplete])
  
  useEffect(() => {
    // Increase difficulty every 5 problems
    if (problemCount > 0 && problemCount % 5 === 0 && difficulty < 3) {
      setDifficulty(prev => Math.min(prev + 1, 3))
    }
  }, [problemCount, difficulty])

  const handleAnswer = useCallback((option: MathOption) => {
    if (showResult) return;
    
    setSelectedAnswer(option.id);
    const isCorrect = option.value === problem.answer;
    
    setScore(prevScore => {
      const newScore = isCorrect ? prevScore + (10 * difficulty) : prevScore;
      return newScore;
    });
    
    setShowResult(true);
    
    const timer = setTimeout(() => {
      if (timeLeft > 10) {
        nextProblem();
      } else {
        const finalScore = score + (isCorrect ? 10 * difficulty : 0);
        setIsGameOver(true);
        onComplete(finalScore);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [showResult, problem.answer, difficulty, timeLeft, nextProblem, score, onComplete]);

  const restartGame = () => {
    try {
      setProblem(generateProblem(1));
      setScore(0);
      setTimeLeft(60);
      setDifficulty(1);
      setProblemCount(0);
      setIsGameOver(false);
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (error) {
      console.error('Error restarting game:', error);
      // Fallback to a simple problem if generation fails
      setProblem({
        num1: 2,
        num2: 2,
        operator: '+',
        answer: 4,
        options: [
          { id: 'a', value: 4, isCorrect: true, position: 0 },
          { id: 'b', value: 3, isCorrect: false, position: 1 },
          { id: 'c', value: 5, isCorrect: false, position: 2 },
          { id: 'd', value: 6, isCorrect: false, position: 3 }
        ]
      });
    }
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
              onClick={restartGame}
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
          <CardTitle>Math Challenge</CardTitle>
          <div className="flex items-center gap-2">
            <div className="font-medium">Score: {score}</div>
            <div className="w-20">
              <Progress value={(timeLeft / 60) * 100} className="h-2" />
              <div className="text-xs text-right">{timeLeft}s</div>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Difficulty: {['Easy', 'Medium', 'Hard'][difficulty - 1]}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-4xl font-bold text-center py-8 bg-muted/50 rounded-lg">
          {problem.num1} {problem.operator} {problem.num2} = ?
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {problem.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrectOption = option.value === problem.answer;
            
            let buttonVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
            
            if (showResult) {
              if (isSelected) {
                buttonVariant = isCorrectOption ? "default" : "destructive";
              } else if (isCorrectOption) {
                buttonVariant = "default";
              }
            }

            return (
              <div key={option.id} className="w-full">
                <Button
                  variant={buttonVariant}
                  className="w-full"
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                >
                  {option.value}
                </Button>
              </div>
            )
          })}
        </div>
        
        <div className="text-sm text-muted-foreground text-center">
          Problem {problemCount + 1}
        </div>
      </CardContent>
    </Card>
  )
}
