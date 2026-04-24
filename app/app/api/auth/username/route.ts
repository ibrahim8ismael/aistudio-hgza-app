import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Validate username (3-20 characters, alphanumeric and underscore)
    if (username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 characters and contain only letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    // For MVP - just return success
    // In production, you'd store this in the database
    return NextResponse.json({
      success: true,
      username: username.toLowerCase(),
    });
  } catch (error) {
    console.error('Error updating username:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}