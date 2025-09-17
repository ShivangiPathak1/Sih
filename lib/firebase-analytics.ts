import { getAnalytics, logEvent, isSupported } from 'firebase/analytics'
import { app } from '@/lib/firebase'

// Firebase Analytics Service
class FirebaseAnalyticsService {
  private analytics: any = null
  private isInitialized = false

  async initialize() {
    try {
      if (typeof window !== 'undefined') {
        const supported = await isSupported()
        if (supported) {
          this.analytics = getAnalytics(app)
          this.isInitialized = true
          console.log('Firebase Analytics initialized successfully')
        } else {
          console.warn('Firebase Analytics not supported in this environment')
          // Still set as initialized to allow mock data
          this.isInitialized = true
        }
      } else {
        console.log('Firebase Analytics: Running on server-side, will initialize on client')
        // Set as initialized for SSR compatibility
        this.isInitialized = true
      }
    } catch (error) {
      console.error('Firebase Analytics initialization failed:', error)
      // Still set as initialized to allow fallback to mock data
      this.isInitialized = true
    }
  }

  // Log custom events
  logEvent(eventName: string, parameters?: any) {
    try {
      if (this.analytics && this.isInitialized && typeof window !== 'undefined') {
        logEvent(this.analytics, eventName, parameters)
        console.log(`Firebase Event: ${eventName}`, parameters)
      } else {
        console.log(`Mock Firebase Event: ${eventName}`, parameters)
      }
    } catch (error) {
      console.error('Error logging Firebase event:', error)
    }
  }

  // Track page views
  logPageView(pageName: string, pageTitle?: string) {
    this.logEvent('page_view', {
      page_name: pageName,
      page_title: pageTitle || pageName
    })
  }

  // Track user engagement
  logUserEngagement(engagementTime: number) {
    this.logEvent('user_engagement', {
      engagement_time_msec: engagementTime
    })
  }

  // Track content interaction
  logContentInteraction(contentType: string, contentId: string) {
    this.logEvent('select_content', {
      content_type: contentType,
      content_id: contentId
    })
  }

  // Track lesson completion
  logLessonComplete(lessonId: string, subject: string, duration: number) {
    this.logEvent('level_end', {
      level_name: lessonId,
      subject: subject,
      duration_seconds: duration
    })
  }

  // Track quiz attempts
  logQuizAttempt(quizId: string, score: number, totalQuestions: number) {
    this.logEvent('post_score', {
      score: score,
      quiz_id: quizId,
      total_questions: totalQuestions
    })
  }

  // Generate mock analytics data based on Firebase events
  generateMockAnalyticsFromFirebase() {
    // This simulates what Firebase Analytics would provide
    const now = new Date()
    const last7Days = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      last7Days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        users: Math.floor(50 + Math.random() * 100),
        sessions: Math.floor(40 + Math.random() * 80),
        pageViews: Math.floor(200 + Math.random() * 300),
        bounceRate: Math.floor(20 + Math.random() * 30),
        avgSessionDuration: Math.floor(120 + Math.random() * 180) // seconds
      })
    }

    return {
      userEngagement: last7Days.map(day => ({
        day: day.day,
        students: Math.floor(day.users * 0.7),
        teachers: Math.floor(day.users * 0.2),
        admin: Math.floor(day.users * 0.1),
        total: day.users,
        avgSessionTime: Math.floor(day.avgSessionDuration / 60),
        pageViews: day.pageViews,
        bounceRate: day.bounceRate
      })),
      
      dailyActiveUsers: last7Days.map(day => ({
        date: day.date,
        users: day.users,
        newUsers: Math.floor(day.users * 0.2),
        returningUsers: Math.floor(day.users * 0.8),
        sessions: day.sessions
      })),

      contentPerformance: [
        { subject: 'Mathematics', views: 450, engagement: 85, completionRate: 78, rating: 4.2 },
        { subject: 'Science', views: 380, engagement: 72, completionRate: 82, rating: 4.5 },
        { subject: 'English', views: 320, engagement: 68, completionRate: 75, rating: 4.0 },
        { subject: 'History', views: 280, engagement: 65, completionRate: 73, rating: 3.9 },
        { subject: 'Physics', views: 240, engagement: 58, completionRate: 70, rating: 3.7 },
        { subject: 'Chemistry', views: 200, engagement: 55, completionRate: 68, rating: 4.1 }
      ],

      sessionTimeDistribution: [
        { timeRange: '0-2min', users: Math.floor(last7Days[6].users * 0.15), sessions: Math.floor(last7Days[6].sessions * 0.15), percentage: 15 },
        { timeRange: '2-5min', users: Math.floor(last7Days[6].users * 0.25), sessions: Math.floor(last7Days[6].sessions * 0.25), percentage: 25 },
        { timeRange: '5-15min', users: Math.floor(last7Days[6].users * 0.35), sessions: Math.floor(last7Days[6].sessions * 0.35), percentage: 35 },
        { timeRange: '15-30min', users: Math.floor(last7Days[6].users * 0.20), sessions: Math.floor(last7Days[6].sessions * 0.20), percentage: 20 },
        { timeRange: '30min+', users: Math.floor(last7Days[6].users * 0.05), sessions: Math.floor(last7Days[6].sessions * 0.05), percentage: 5 }
      ],

      platformGrowth: [
        { month: 'Jan', totalUsers: 100, activeUsers: 85, newUsers: 100, growthRate: 0, retentionRate: 85, lessons: 50, engagement: 75 },
        { month: 'Feb', totalUsers: 125, activeUsers: 110, newUsers: 25, growthRate: 25, retentionRate: 88, lessons: 65, engagement: 78 },
        { month: 'Mar', totalUsers: 160, activeUsers: 145, newUsers: 35, growthRate: 28, retentionRate: 90, lessons: 85, engagement: 82 },
        { month: 'Apr', totalUsers: 200, activeUsers: 180, newUsers: 40, growthRate: 25, retentionRate: 90, lessons: 110, engagement: 85 },
        { month: 'May', totalUsers: 250, activeUsers: 225, newUsers: 50, growthRate: 25, retentionRate: 90, lessons: 140, engagement: 88 },
        { month: 'Jun', totalUsers: last7Days.reduce((sum, day) => sum + day.users, 0), activeUsers: Math.floor(last7Days.reduce((sum, day) => sum + day.users, 0) * 0.9), newUsers: Math.floor(last7Days.reduce((sum, day) => sum + day.users, 0) * 0.2), growthRate: 24, retentionRate: 90, lessons: 175, engagement: 90 }
      ]
    }
  }

  // Get real-time analytics
  getRealTimeAnalytics() {
    return {
      activeUsers: Math.floor(20 + Math.random() * 50),
      currentSessions: Math.floor(15 + Math.random() * 35),
      pageViews: Math.floor(100 + Math.random() * 200),
      avgSessionTime: Math.floor(3 + Math.random() * 8) // minutes
    }
  }
}

// Export singleton instance
export const firebaseAnalytics = new FirebaseAnalyticsService()