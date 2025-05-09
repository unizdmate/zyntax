import apiClient from './api-client';

// Types for API responses
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Type for theme update payload
type ThemeUpdatePayload = {
  colorScheme: string;
};

// Get user's theme preference
export const getUserTheme = async (): Promise<{ colorScheme: string }> => {
  const response = await apiClient.get<ApiResponse<{ colorScheme: string }>>('/user/theme');
  
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch theme preference');
  }
  
  return response.data.data;
};

// Update user's theme preference
export const updateUserTheme = async (colorScheme: string): Promise<{ colorScheme: string }> => {
  const payload: ThemeUpdatePayload = { colorScheme };
  
  const response = await apiClient.post<ApiResponse<{ colorScheme: string }>>(
    '/user/theme',
    payload
  );
  
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to update theme preference');
  }
  
  return response.data.data;
};