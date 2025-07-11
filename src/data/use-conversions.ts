import { 
  useMutation, 
  useQuery, 
  useQueryClient,
  UseQueryOptions 
} from '@tanstack/react-query';
import { 
  fetchConversions, 
  fetchConversion, 
  createConversion, 
  updateConversion, 
  deleteConversion
} from './conversions-api';
import { 
  Conversion, 
  ConversionOptions, 
  OutputLanguage
} from '@/types';

// Query keys for caching
const QUERY_KEYS = {
  conversions: 'conversions',
  conversion: (id: string) => ['conversion', id],
};

// Hook to fetch all conversions
export function useConversions(options?: Omit<UseQueryOptions<Conversion[], Error, Conversion[], [string]>, 'queryKey' | 'queryFn'>) {
  return useQuery<Conversion[], Error, Conversion[], [string]>({
    queryKey: [QUERY_KEYS.conversions],
    queryFn: fetchConversions,
    ...options,
  });
}

// Hook to fetch a single conversion
export function useConversion(id: string, options?: UseQueryOptions<Conversion>) {
  return useQuery<Conversion>({
    queryKey: QUERY_KEYS.conversion(id),
    queryFn: () => fetchConversion(id),
    enabled: !!id, // Only run if id is provided
    ...options,
  });
}

// Hook to create a JSON to TypeScript conversion
export function useCreateConversion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      inputJson,
      options,
      language,
      title,
    }: {
      inputJson: string;
      options: ConversionOptions;
      language: OutputLanguage;
      title?: string;
    }) => createConversion(inputJson, options, language, title),
    onSuccess: () => {
      // Invalidate and refetch conversions list when a new conversion is created
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.conversions] });
    },
  });
}

// Hook to update a conversion title
export function useUpdateConversion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      id,
      title,
    }: {
      id: string;
      title: string;
    }) => updateConversion(id, title),
    onSuccess: (data, variables) => {
      // Update both the list and the individual conversion cache
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.conversions] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversion(variables.id) });
    },
  });
}

// Hook to delete a conversion
export function useDeleteConversion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteConversion(id),
    onSuccess: (_, id) => {
      // Remove the conversion from cache and refetch the list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.conversions] });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.conversion(id) });
    },
  });
}