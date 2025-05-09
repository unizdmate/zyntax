import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { z } from "zod";

const prisma = new PrismaClient();

// Input validation schema for updates
const ConversionUpdateSchema = z.object({
  title: z.string().optional(),
});

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

export async function PUT(
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

    // Get current user from session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Find the conversion and check ownership
    const conversion = await prisma.conversion.findUnique({
      where: { id },
    });

    if (!conversion) {
      return NextResponse.json(
        { success: false, error: "Conversion not found" },
        { status: 404 }
      );
    }

    // Check if conversion belongs to the user
    if (conversion.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "You can only edit your own conversions" },
        { status: 403 }
      );
    }

    // Parse and validate the request body
    const body = await request.json();
    const validationResult = ConversionUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Update the conversion
    const updatedConversion = await prisma.conversion.update({
      where: { id },
      data: validationResult.data,
    });

    return NextResponse.json({
      success: true,
      data: updatedConversion,
    });
  } catch (error) {
    console.error("Error updating conversion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update conversion" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Get current user from session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Find the conversion and check ownership
    const conversion = await prisma.conversion.findUnique({
      where: { id },
    });

    if (!conversion) {
      return NextResponse.json(
        { success: false, error: "Conversion not found" },
        { status: 404 }
      );
    }

    // Check if conversion belongs to the user
    if (conversion.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "You can only delete your own conversions" },
        { status: 403 }
      );
    }

    // Delete the conversion
    await prisma.conversion.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Conversion deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting conversion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete conversion" },
      { status: 500 }
    );
  }
}