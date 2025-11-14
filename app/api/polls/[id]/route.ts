import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PollWithResults, DateOptionResult } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pollId = params.id;

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        dateOptions: {
          include: {
            votes: {
              include: {
                vote: true,
              },
            },
          },
          orderBy: {
            date: 'asc',
          },
        },
        votes: {
          include: {
            selectedDates: true,
          },
        },
      },
    });

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    // Calculate results
    const results: DateOptionResult[] = poll.dateOptions.map((dateOption) => {
      const participants = dateOption.votes
        .map((v) => v.vote.participantName || 'Anonymous')
        .filter((name, index, self) => self.indexOf(name) === index); // Unique names

      return {
        dateOptionId: dateOption.id,
        date: dateOption.date,
        voteCount: dateOption.votes.length,
        participants,
      };
    });

    const response: PollWithResults = {
      ...poll,
      results,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching poll:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poll' },
      { status: 500 }
    );
  }
}
