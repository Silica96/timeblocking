import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreatePollRequest, CreatePollResponse } from '@/lib/types';

// Helper function to generate all dates between start and end
function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePollRequest = await request.json();

    // Validate input
    if (!body.title || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Title, start date, and end date are required' },
        { status: 400 }
      );
    }

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    // Validate date range
    if (startDate > endDate) {
      return NextResponse.json(
        { error: 'Start date must be before or equal to end date' },
        { status: 400 }
      );
    }

    // Generate all dates in the range
    const dates = generateDateRange(startDate, endDate);

    // Create poll with all date options
    const poll = await prisma.poll.create({
      data: {
        title: body.title,
        description: body.description || null,
        startDate: startDate,
        endDate: endDate,
        dateOptions: {
          create: dates.map((date) => ({
            date: date,
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
