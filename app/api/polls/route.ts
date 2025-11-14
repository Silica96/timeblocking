import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreatePollRequest, CreatePollResponse } from '@/lib/types';
import { generateDateRange } from '@/lib/utils/date';
import { createErrorResponse, createSuccessResponse, validateRequiredFields, handleApiError } from '@/lib/utils/api';

export async function POST(request: NextRequest) {
  try {
    const body: CreatePollRequest = await request.json();

    // Validate required fields
    const validationError = validateRequiredFields(body, ['title', 'startDate', 'endDate']);
    if (validationError) {
      return createErrorResponse(validationError, 400);
    }

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    // Validate date range
    if (startDate > endDate) {
      return createErrorResponse('Start date must be before or equal to end date', 400);
    }

    // Generate all dates in the range
    const dates = generateDateRange(startDate, endDate);

    // Create poll with all date options
    const poll = await prisma.poll.create({
      data: {
        title: body.title,
        description: body.description || null,
        startDate,
        endDate,
        dateOptions: {
          create: dates.map((date) => ({ date })),
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

    return createSuccessResponse(response, 201);
  } catch (error) {
    return handleApiError(error, 'Error creating poll');
  }
}
