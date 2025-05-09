import { NextRequest, NextResponse } from "next/server";
import { convertJsonToTypeScript } from "@/lib/converter/jsonToTs";
import { ConversionType, OutputLanguage } from "@/types";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Input validation schema
const ConversionRequestSchema = z.object({
  inputJson: z.string().min(1, "JSON input is required"),
  title: z.string().optional(),
  language: z.nativeEnum(OutputLanguage),
  options: z.object({
    interfaceName: z.string().optional(),
    useType: z.boolean().optional(),
    useInterfaces: z.boolean().optional(),
    useSemicolons: z.boolean().optional(),
    exportStrategy: z.string().optional(),  // Changed from useExport to exportStrategy
    indentationSpaces: z.number().optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the request data
    const validationResult = ConversionRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid request data", 
          details: validationResult.error.errors 
        }, 
        { status: 400 }
      );
    }
    
    const { inputJson, title, language, options } = validationResult.data;
    
    // Get current user if authenticated
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // Process the conversion
    const conversionResult = convertJsonToTypeScript(inputJson, options);
    
    if (conversionResult.error) {
      return NextResponse.json(
        { success: false, error: conversionResult.error }, 
        { status: 400 }
      );
    }
    
    // Determine conversion type based on language
    const conversionType = ConversionType.JSON_TO_TS;
    
    // Save to database if user is logged in
    let conversion;
    if (userId) {
      conversion = await prisma.conversion.create({
        data: {
          userId,
          title: title || "Untitled Conversion",
          inputJson,
          outputCode: conversionResult.code!,
          language,
          conversionType,
        },
      });
    } else {
      // For non-authenticated users, generate an ID but don't save to DB
      conversion = {
        id: crypto.randomUUID(),
        outputCode: conversionResult.code!,
        language,
      };
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: conversion.id,
        outputCode: conversionResult.code,
        language,
      },
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process conversion request" 
      }, 
      { status: 500 }
    );
  }
}