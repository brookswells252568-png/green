import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) => {
    return NextResponse.redirect(new URL('/live', request.url));
};
