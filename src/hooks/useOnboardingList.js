// src/hooks/useOnboardingList.js
import { useQuery } from "@tanstack/react-query";
import apiClient from "src/utils/apiClient";

export default function useOnboardingList() {
  return useQuery({
    queryKey: ["subscriptionList"],
    queryFn: async () => {
      const res = await apiClient.get("/superadmin/onboarding/list");
      return res.data || [];
    },
    staleTime: 1000 * 60 * 2, // 🕒 keep cache "fresh" for 2 minutes
    refetchOnWindowFocus: false,
  });
}
