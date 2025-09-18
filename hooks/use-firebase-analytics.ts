import { useState, useEffect } from 'react'
import { firebaseAnalytics } from '@/lib/firebase-analytics'

interface FirebaseAnalyticsData {
  userEngagement: any[]
  dailyActiveUsers: any[]
  contentPerformance: any[]
  sessionTimeDistribution: any[]
  platformGrowth: any[]
}

// Hook for Firebase Analytics data
export function useFirebaseAnalytics() {
  const [data, setData] = useState<FirebaseAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeAndFetchData = async () => {
      try {
        // Initialize Firebase Analytics
        await firebaseAnalytics.initialize()
        
        // Log that dashboard was viewed
        firebaseAnalytics.logPageView('analytics_dashboard', 'Analytics Dashboard')
        
        // Generate analytics data (in real app, this would come from Firebase)
        const analyticsData = firebaseAnalytics.generateMockAnalyticsFromFirebase()
        
        setData(analyticsData)
        setLoading(false)
      } catch (err) {
        console.error('Firebase Analytics error:', err)
        setError('Failed to load analytics data')
        setLoading(false)
      }
    }

    initializeAndFetchData()

    // Set up data refresh every 30 seconds
    const interval = setInterval(() => {
      if (!loading) {
        const refreshedData = firebaseAnalytics.generateMockAnalyticsFromFirebase()
        setData(refreshedData)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [loading])

  const refetch = async () => {
    setLoading(true)
    setError(null)
    const refreshedData = firebaseAnalytics.generateMockAnalyticsFromFirebase()
    setData(refreshedData)
    setLoading(false)
  }

  return { data, loading, error, refetch }
}

// Hook for real-time Firebase Analytics
export function useFirebaseRealTime() {
  const [realtimeData, setRealtimeData] = useState({
    activeUsers: 0,
    currentSessions: 0,
    pageViews: 0,
    avgSessionTime: 0
  })

  useEffect(() => {
    // Initialize Firebase Analytics
    firebaseAnalytics.initialize()

    const updateRealTimeData = () => {
      const data = firebaseAnalytics.getRealTimeAnalytics()
      setRealtimeData(data)
    }

    // Initial data
    updateRealTimeData()

    // Update every 5 seconds for real-time feel
    const interval = setInterval(updateRealTimeData, 5000)

    return () => clearInterval(interval)
  }, [])

  return realtimeData
}

// Hook for tracking user actions
export function useFirebaseTracking() {
  useEffect(() => {
    firebaseAnalytics.initialize()
  }, [])

  const trackLessonComplete = (lessonId: string, subject: string, duration: number) => {
    firebaseAnalytics.logLessonComplete(lessonId, subject, duration)
  }

  const trackQuizAttempt = (quizId: string, score: number, totalQuestions: number) => {
    firebaseAnalytics.logQuizAttempt(quizId, score, totalQuestions)
  }

  const trackContentView = (contentType: string, contentId: string) => {
    firebaseAnalytics.logContentInteraction(contentType, contentId)
  }

  const trackPageView = (pageName: string, pageTitle?: string) => {
    firebaseAnalytics.logPageView(pageName, pageTitle)
  }

  return {
    trackLessonComplete,
    trackQuizAttempt,
    trackContentView,
    trackPageView
  }
}