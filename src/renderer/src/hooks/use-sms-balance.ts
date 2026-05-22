import { useQuery } from '@tanstack/react-query'
import { smsBalanceManager } from '@renderer/lib/utils'

export function useSmsBalance(userId: string | undefined) {
  return useQuery({
    queryKey: ['smsBalance', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')
      return smsBalanceManager(userId, 'show')
    },
    enabled: !!userId,
    // Refetch when the component mounts (which happens on route changes)
    refetchOnMount: true,
    // Optional: Keep data for a while but consider it stale immediately to ensure refresh
    staleTime: 0
  })
}
