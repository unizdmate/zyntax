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
  TS_TO_SCHEMA = "TS_TO_SCHEMA", // New conversion type
}

export enum OutputLanguage {
  TYPESCRIPT = "TypeScript",
  PYTHON = "Python",
  JAVA = "Java",
  JSON_SCHEMA = "JSON Schema", // New output language
}

export enum ExportStrategy {
  NONE = "none",
  TOP_LEVEL = "topLevel",
  ALL = "all"
}

export interface ConversionOptions {
  interfaceName?: string;
  useType?: boolean;
  useInterfaces?: boolean;
  useSemicolons?: boolean;
  exportStrategy?: ExportStrategy;
  indentationSpaces?: number;
  extractNestedTypes?: boolean; // New option to extract nested types into separate interfaces/types
}

export interface SchemaConversionOptions extends Pick<ConversionOptions, 'indentationSpaces' | 'exportStrategy'> {
  typeName?: string;
  useRefs?: boolean;
  required?: boolean;
  useTitleAsDescription?: boolean;
  additionalProperties?: boolean;
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

export interface SchemaConversionRequest {
  inputTypeScript: string;
  options: SchemaConversionOptions;
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