import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreatePollRequest, CreatePollResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreatePollRequest = await request.json();

    // Validate input
    if (!body.title || !body.dateOptions || body.dateOptions.length === 0) {
      return NextResponse.json(
        { error: 'Title and at least one date option are required' },
        { status: 400 }
      );
    }

    // Create poll with date options
    const poll = await prisma.poll.create({
      data: {
        title: body.title,
        description: body.description || null,
        dateOptions: {
          create: body.dateOptions.map((dateString) => ({
            date: new Date(dateString),
          })),
        },
      },
      include: {
        dateOptions: true,
      },
    });

    const response: CreatePollResponse = {
      pollId: poll.id,
      pollUrl: `${request.nextUrl.origin}/poll/${poll.id}`,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    );
  }
}
