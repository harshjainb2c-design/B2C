import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface AuthenticatedRequest extends VercelRequest {
  userId?: string;
  userRole?: string;
}

/**
 * Middleware to verify user authentication
 */
export async function verifyAuth(req: AuthenticatedRequest): Promise<{ userId: string; userRole: string } | null> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    // Verify the JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    // Fetch user profile to get role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return {
      userId: user.id,
      userRole: profile.role,
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

/**
 * Middleware to verify admin role
 */
export async function verifyAdmin(req: AuthenticatedRequest, res: VercelResponse): Promise<boolean> {
  const auth = await verifyAuth(req);

  if (!auth) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
      status: 401,
    });
    return false;
  }

  if (auth.userRole !== 'admin') {
    res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Admin access required',
      },
      status: 403,
    });
    return false;
  }

  // Attach user info to request
  req.userId = auth.userId;
  req.userRole = auth.userRole;

  return true;
}
