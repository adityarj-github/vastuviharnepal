import { NextResponse } from 'next/server';
import { getAuthenticatedUser, canAccessPriceLists } from '@/lib/auth';

export type AuthResult =
  | { admin: { id: string; email: string; name: string; role: string }; response: null }
  | { admin: null; response: NextResponse };

export async function requirePermission(
  _request: Request,
  _permission = 'pricelists:manage'
): Promise<AuthResult> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        admin: null,
        response: NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 }),
      };
    }

    // Only ROOT and PRICE_LIST roles have access to price lists
    const allowed = canAccessPriceLists(user.role);
    if (!allowed) {
      return {
        admin: null,
        response: NextResponse.json(
          { error: 'Forbidden: Insufficient privileges. Only Price List Managers or Root can access.' },
          { status: 403 }
        ),
      };
    }

    return { admin: user, response: null };
  } catch (err) {
    console.error('requirePermission error:', err);
    return {
      admin: null,
      response: NextResponse.json({ error: 'Authentication error occurred.' }, { status: 500 }),
    };
  }
}
