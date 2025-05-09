/**
 * Core type definitions for the Zyntax application
 */

// User-related types
export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

// Conversion types
export enum ConversionType {
  JSON_TO_TS = "JSON_TO_TS",
  JSON_TO_PYTHON = "JSON_TO_PYTHON",
  JSON_TO_JAVA = "JSON_TO_JAVA",
}

export enum OutputLanguage {
  TYPESCRIPT = "TypeScript",
  PYTHON = "Python",
  JAVA = "Java",
}

export interface ConversionOptions {
  interfaceName?: string;
  useType?: boolean;
  useInterfaces?: boolean;
  useSemicolons?: boolean;
  useExport?: boolean;
  indentationSpaces?: number;
}

export interface Conversion {
  id: string;
  userId?: string;
  title?: string;
  inputJson: string;
  outputCode: string;
  language: OutputLanguage;
  conversionType: ConversionType;
  createdAt: Date;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ConversionRequest {
  inputJson: string;
  options: ConversionOptions;
  language: OutputLanguage;
  title?: string;
}

export interface ConversionResponse {
  id: string;
  outputCode: string;
  language: OutputLanguage;
}

// NextAuth types
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}