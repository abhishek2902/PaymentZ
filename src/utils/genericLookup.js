import { useQuery } from '@tanstack/react-query';
import { listGenericLookups } from 'src/api/genericLookup';

// Generic lookup hook
export const useGenericLookup = (lookupType) =>
  useQuery({
    queryKey: ['genericLookup', lookupType],
    queryFn: () => listGenericLookups(lookupType),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
