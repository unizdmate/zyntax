import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Conversion ID is required" },
        { status: 400 }
      );
    }

    // Find the conversion
    const conversion = await prisma.conversion.findUnique({
      where: { id },
    });

    if (!conversion) {
      return NextResponse.json(
        { success: false, error: "Conversion not found" },
        { status: 404 }
      );
    }

    // Get current user from session
    const session = await getServerSession(authOptions);
    
    // Check if conversion belongs to the user (if it has a userId)
    if (
      conversion.userId && 
      session?.user?.id !== conversion.userId
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access to conversion" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: conversion,
    });
  } catch (error) {
    console.error("Error fetching conversion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch conversion" },
      { status: 500 }
    );
  }
}