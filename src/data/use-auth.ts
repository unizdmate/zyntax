import { 
  useMutation, 
  useQuery, 
  useQueryClient,
  UseQueryOptions 
} from '@tanstack/react-query';
import { getUserTheme, updateUserTheme } from './auth-api';

// Query keys for caching
const QUERY_KEYS = {
  userTheme: 'userTheme',
};

// Hook to fetch user's theme preference
export function useUserTheme(options?: Omit<UseQueryOptions<{ colorScheme: string }, Error, { colorScheme: string }, [string]>, 'queryKey' | 'queryFn'>) {
  return useQuery<{ colorScheme: string }, Error, { colorScheme: string }, [string]>({
    queryKey: [QUERY_KEYS.userTheme],
    queryFn: getUserTheme,
    ...options,
  });
}

// Hook to update user's theme preference
export function useUpdateUserTheme() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (colorScheme: string) => updateUserTheme(colorScheme),
    onSuccess: () => {
      // Invalidate and refetch user theme when it's updated
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userTheme] });
    },
  });
}