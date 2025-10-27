import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { get } from '@vercel/edge-config';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

export async function middleware(_request: NextRequest) {
  try {
    // Example: Get feature flags from Edge Config
    const featureFlags = await get('featureFlags');
    
    // Add feature flags to response headers for use in pages
    const response = NextResponse.next();
    response.headers.set('x-feature-flags', JSON.stringify(featureFlags || {}));
    
    return response;
  } catch {
    // Edge Config not available - continue without it
    console.log('Edge Config unavailable, continuing without feature flags');
    return NextResponse.next();
  }
}
