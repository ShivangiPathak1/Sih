import { useState, useEffect, useCallback } from 'react'
import { apiService, User, Post, Comment, AnalyticsData } from '@/lib/api-service'

interface UseApiDataState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

// Generic hook for API data fetching
export function useApiData<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = [],
  refreshInterval?: number
): UseApiDataState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFunction()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Set up auto-refresh if interval is provided
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return { data, loading, error, refetch }
}

// Hook for fetching users data
export function useUsers(refreshInterval?: number) {
  return useApiData(() => apiService.getUsers(), [], refreshInterval)
}

// Hook for fetching posts data
export function usePosts(refreshInterval?: number) {
  return useApiData(() => apiService.getPosts(), [], refreshInterval)
}

// Hook for fetching comments data
export function useComments(refreshInterval?: number) {
  return useApiData(() => apiService.getComments(), [], refreshInterval)
}

// Hook for fetching analytics data
export function useAnalyticsData(refreshInterval: number = 30000) { // Default 30 seconds
  return useApiData(() => apiService.getAnalyticsData(), [], refreshInterval)
}

// Hook for fetching government data
export function useGovernmentData(refreshInterval: number = 60000) { // Default 1 minute
  return useApiData(() => apiService.getGovernmentData(), [], refreshInterval)
}

// Combined hook for dashboard data
export function useDashboardData() {
  const users = useUsers(60000) // Refresh every minute
  const posts = usePosts(120000) // Refresh every 2 minutes
  const comments = useComments(120000) // Refresh every 2 minutes
  const analytics = useAnalyticsData(30000) // Refresh every 30 seconds
  const government = useGovernmentData(60000) // Refresh every minute

  return {
    users,
    posts,
    comments,
    analytics,
    government,
    isLoading: users.loading || posts.loading || comments.loading || analytics.loading || government.loading,
    hasError: !!(users.error || posts.error || comments.error || analytics.error || government.error),
    refetchAll: () => {
      users.refetch()
      posts.refetch()
      comments.refetch()
      analytics.refetch()
      government.refetch()
    }
  }
}

// Hook for real-time user engagement (simulates real-time updates)
export function useRealTimeEngagement() {
  const [engagementData, setEngagementData] = useState({
    activeUsers: 0,
    currentSessions: 0,
    pageViews: 0,
    avgSessionTime: 0
  })

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(async () => {
      try {
        const users = await apiService.getUsers()
        const posts = await apiService.getPosts()
        
        // Generate real-time-like data based on API responses
        setEngagementData({
          activeUsers: Math.floor(users.length * (0.6 + Math.random() * 0.4)),
          currentSessions: Math.floor(users.length * (0.4 + Math.random() * 0.3)),
          pageViews: Math.floor(posts.length * (8 + Math.random() * 4)),
          avgSessionTime: Math.floor(18 + Math.random() * 15) // 18-33 minutes
        })
      } catch (error) {
        console.error('Real-time data update failed:', error)
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return engagementData
}

// Hook for monitoring API health
export function useApiHealth() {
  const [apiHealth, setApiHealth] = useState({
    status: 'unknown',
    lastCheck: null as Date | null,
    responseTime: 0,
    uptime: 100
  })

  useEffect(() => {
    const checkApiHealth = async () => {
      const startTime = Date.now()
      try {
        await apiService.getUsers()
        const endTime = Date.now()
        
        setApiHealth({
          status: 'healthy',
          lastCheck: new Date(),
          responseTime: endTime - startTime,
          uptime: 100
        })
      } catch (error) {
        setApiHealth(prev => ({
          status: 'unhealthy',
          lastCheck: new Date(),
          responseTime: 0,
          uptime: Math.max(0, prev.uptime - 5)
        }))
      }
    }

    // Initial check
    checkApiHealth()

    // Check every 2 minutes
    const interval = setInterval(checkApiHealth, 120000)
    return () => clearInterval(interval)
  }, [])

  return apiHealth
}

// Export types for TypeScript
export type { UseApiDataState }