import apiClient from './api-client';
import { Conversion, ConversionOptions, ConversionRequest, OutputLanguage } from '@/types';

// Types for API responses
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Type for conversion update payload
type ConversionUpdatePayload = {
  title: string;
};

// Fetch all conversions for the authenticated user
export const fetchConversions = async (): Promise<Conversion[]> => {
  const response = await apiClient.get<ApiResponse<Conversion[]>>('/conversions');
  
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch conversions');
  }
  
  return response.data.data;
};

// Fetch a single conversion by ID
export const fetchConversion = async (id: string): Promise<Conversion> => {
  const response = await apiClient.get<ApiResponse<Conversion>>(`/conversions/${id}`);
  
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch conversion');
  }
  
  return response.data.data;
};

// Create a new conversion
export const createConversion = async (
  inputJson: string,
  options: ConversionOptions,
  language: OutputLanguage,
  title?: string
): Promise<{ id: string; outputCode: string }> => {
  const payload: ConversionRequest = {
    inputJson,
    options,
    language,
    title,
  };
  
  const response = await apiClient.post<ApiResponse<{ id: string; outputCode: string }>>(
    '/convert',
    payload
  );
  
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create conversion');
  }
  
  return response.data.data;
};

// Update a conversion title
export const updateConversion = async (id: string, title: string): Promise<Conversion> => {
  const payload: ConversionUpdatePayload = { title };
  
  const response = await apiClient.put<ApiResponse<Conversion>>(
    `/conversions/${id}`,
    payload
  );
  
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to update conversion');
  }
  
  return response.data.data;
};

// Delete a conversion
export const deleteConversion = async (id: string): Promise<void> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/conversions/${id}`);
  
  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to delete conversion');
  }
};