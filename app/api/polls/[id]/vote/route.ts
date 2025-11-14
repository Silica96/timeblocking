import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SubmitVoteRequest, SubmitVoteResponse } from '@/lib/types';
import { randomUUID } from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pollId = params.id;
    const body: SubmitVoteRequest = await request.json();

    // Validate input
    if (!body.selectedDateIds || body.selectedDateIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one date must be selected' },
        { status: 400 }
      );
    }

    // Check if poll exists
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        dateOptions: true,
      },
    });

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    // Validate all selected dates belong to this poll
    const validDateIds = poll.dateOptions.map((d) => d.id);
    const invalidDates = body.selectedDateIds.filter(
      (id) => !validDateIds.includes(id)
    );

    if (invalidDates.length > 0) {
      return NextResponse.json(
        { error: 'Invalid date options selected' },
        { status: 400 }
      );
    }

    // Generate or get participant ID from cookie
    const cookieName = `participant_${pollId}`;
    let participantId = request.cookies.get(cookieName)?.value;

    if (!participantId) {
      participantId = randomUUID();
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findFirst({
      where: {
        pollId,
        participantId,
      },
    });

    let vote;

    if (existingVote) {
      // Update existing vote
      // Delete old vote-date associations
      await prisma.voteOnDate.deleteMany({
        where: {
          voteId: existingVote.id,
        },
      });

      // Update vote
      vote = await prisma.vote.update({
        where: { id: existingVote.id },
        data: {
          participantName: body.participantName || null,
          selectedDates: {
            create: body.selectedDateIds.map((dateOptionId) => ({
              dateOptionId,
            })),
          },
        },
      });
    } else {
      // Create new vote
      vote = await prisma.vote.create({
        data: {
          pollId,
          participantId,
          participantName: body.participantName || null,
          selectedDates: {
            create: body.selectedDateIds.map((dateOptionId) => ({
              dateOptionId,
            })),
          },
        },
      });
    }

    const response: SubmitVoteResponse = {
      success: true,
      voteId: vote.id,
    };

    // Set cookie with participant ID
    const headers = new Headers();
    headers.set(
      'Set-Cookie',
      `${cookieName}=${participantId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}` // 1 year
    );

    return NextResponse.json(response, { status: 200, headers });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    );
  }
}
