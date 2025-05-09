import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get current user from session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Get color scheme preference from request body
    const data = await request.json();
    
    if (!data.colorScheme || !['light', 'dark', 'auto'].includes(data.colorScheme)) {
      return NextResponse.json(
        { success: false, error: "Invalid color scheme" },
        { status: 400 }
      );
    }
    
    // Update user preference in database
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { colorScheme: data.colorScheme }
    });
    
    return NextResponse.json({
      success: true,
      data: { colorScheme: user.colorScheme }
    });
  } catch (error) {
    console.error("Error updating theme preference:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update theme preference" },
      { status: 500 }
    );
  }
}

// Get theme preference for currently logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { colorScheme: true }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: { colorScheme: user.colorScheme || 'light' }
    });
    
  } catch (error) {
    console.error("Error fetching theme preference:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch theme preference" },
      { status: 500 }
    );
  }
}