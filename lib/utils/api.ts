import { NextResponse } from 'next/server';

/**
 * Standard API error response
 */
export function createErrorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Standard API success response
 */
export function createSuccessResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown, context: string): NextResponse {
  console.error(`${context}:`, error);

  if (error instanceof Error) {
    return createErrorResponse(error.message, 500);
  }

  return createErrorResponse('An unknown error occurred', 500);
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields<T extends Record<string, unknown>>(
  body: T,
  requiredFields: (keyof T)[]
): string | null {
  for (const field of requiredFields) {
    if (!body[field]) {
      return `${String(field)} is required`;
    }
  }
  return null;
}
