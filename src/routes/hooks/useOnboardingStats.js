// src/hooks/useOnboardingStats.js
import { useQuery } from '@tanstack/react-query';
import {
  onboardingDashboardNew,
  onboardingDashboardKycInProgress,
  onboardingDashboardApprovalPending,
  onboardingDashboardApprovedToday,
  onboardingDashboardApprovedrejected,
} from 'src/api/onboarding'

export default function useOnboardingStats() {
  return useQuery({
    queryKey: ['onboarding-stats'],
    queryFn: async () => {
      const [
        newApps,
        kycInProgress,
        approvalPending,
        approvedToday,
        rejected,
      ] = await Promise.all([
        onboardingDashboardNew(),
        onboardingDashboardKycInProgress(),
        onboardingDashboardApprovalPending(),
        onboardingDashboardApprovedToday(),
        onboardingDashboardApprovedrejected(),
      ]);

      return {
        newApps,
        kycInProgress,
        approvalPending,
        approvedToday,
        rejected,
      };
    },
    staleTime: 60_000, // 1 min cache
  });
}
