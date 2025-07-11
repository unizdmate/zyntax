import { NextRequest, NextResponse } from "next/server";
import { convertTypeScriptToJsonSchema } from "@/lib/converter/tsToSchema";
import { ConversionType, OutputLanguage, ExportStrategy } from "@/types";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Input validation schema - make language optional since we always use JSON_SCHEMA
const SchemaConversionRequestSchema = z.object({
  inputTypeScript: z.string().min(1, "TypeScript input is required"),
  title: z.string().optional(),
  language: z.nativeEnum(OutputLanguage).optional(), // Make language optional
  options: z.object({
    typeName: z.string().optional(),
    useRefs: z.boolean().optional(),
    required: z.boolean().optional(),
    useTitleAsDescription: z.boolean().optional(),
    exportStrategy: z.enum([
      ExportStrategy.NONE, 
      ExportStrategy.TOP_LEVEL, 
      ExportStrategy.ALL
    ]).optional(),
    additionalProperties: z.boolean().optional(),
    indentationSpaces: z.number().optional(),
  }).optional(),
});

// Array to track compilation warnings
const compilationWarnings: string[] = [];

// Custom console.warn to capture warnings
const originalConsoleWarn = console.warn;
console.warn = function(...args) {
  compilationWarnings.push(args.join(' '));
  originalConsoleWarn.apply(console, args);
};

export async function POST(request: NextRequest) {
  // Clear previous warnings
  compilationWarnings.length = 0;
  
  try {
    // Parse the request body
    const body = await request.json();
    
    // Log the incoming request body for debugging
    console.log('TS to Schema conversion request:', JSON.stringify(body));
    
    // Validate the request data
    const validationResult = SchemaConversionRequestSchema.safeParse(body);
    if (!validationResult.success) {
      // Log validation errors
      console.error('Validation error:', validationResult.error.errors);
      
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid request data", 
          details: validationResult.error.errors 
        }, 
        { status: 400 }
      );
    }
    
    const { inputTypeScript, title, options } = validationResult.data;
    
    // Get current user if authenticated
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // Process the conversion
    const conversionResult = convertTypeScriptToJsonSchema(inputTypeScript, options);
    
    if (conversionResult.error) {
      return NextResponse.json(
        { 
          success: false, 
          error: conversionResult.error,
          warnings: compilationWarnings.length > 0 ? compilationWarnings : undefined 
        }, 
        { status: 400 }
      );
    }
    
    // Use TS_TO_SCHEMA conversion type
    const conversionType = ConversionType.TS_TO_SCHEMA;
    
    // Save to database if user is logged in
    let conversion;
    if (userId) {
      conversion = await prisma.conversion.create({
        data: {
          userId,
          title: title || "Untitled TS to Schema Conversion",
          inputJson: inputTypeScript, // Store TypeScript input in the inputJson field
          outputCode: conversionResult.code!,
          language: OutputLanguage.JSON_SCHEMA,
          conversionType,
        },
      });
    } else {
      // For non-authenticated users, generate an ID but don't save to DB
      conversion = {
        id: crypto.randomUUID(),
        outputCode: conversionResult.code!,
        language: OutputLanguage.JSON_SCHEMA,
      };
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: conversion.id,
        outputCode: conversionResult.code,
        language: OutputLanguage.JSON_SCHEMA,
        warnings: compilationWarnings.length > 0 ? compilationWarnings : undefined
      },
    });
  } catch (error) {
    // Log the error for debugging
    console.error("TS to Schema conversion error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process TypeScript to JSON Schema conversion request",
        warnings: compilationWarnings.length > 0 ? compilationWarnings : undefined
      }, 
      { status: 500 }
    );
  }
}