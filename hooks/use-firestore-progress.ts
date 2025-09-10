"use client"

import { useState, useEffect } from "react"
import {
  getUserProgress,
  subscribeToUserProgress,
  createUserProgress,
  updateUserXP,
  completeLesson,
  completeQuiz,
  updateStreak,
  unlockAchievement,
  type UserProgress,
} from "@/lib/firestore-services"

export const useFirestoreProgress = () => {
  const mockUserId = "demo-student-123"
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeProgress = async () => {
      try {
        let userProgress = await getUserProgress(mockUserId)

        if (!userProgress) {
          // Create initial progress for new user
          userProgress = await createUserProgress(mockUserId, {})
        }

        // Update streak on login
        await updateStreak(mockUserId)

        setProgress(userProgress)
      } catch (error) {
        console.error("Error initializing user progress:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeProgress()

    // Subscribe to real-time updates
    const unsubscribe = subscribeToUserProgress(mockUserId, (updatedProgress) => {
      setProgress(updatedProgress)
      setLoading(false)
    })

    return () => unsubscribe()
  }, []) // Removed user dependency

  const addXP = async (amount: number) => {
    await updateUserXP(mockUserId, amount)
  }

  const finishLesson = async (subject: string, xp: number) => {
    await completeLesson(mockUserId, subject, xp)
  }

  const finishQuiz = async (quizData: any) => {
    await completeQuiz(mockUserId, quizData)
  }

  const earnAchievement = async (achievementId: string) => {
    await unlockAchievement(mockUserId, achievementId)
  }

  return {
    progress,
    loading,
    addXP,
    finishLesson,
    finishQuiz,
    earnAchievement,
  }
}
